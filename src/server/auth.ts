import { PrismaAdapter } from "@auth/prisma-adapter";
import type * as Prisma from "@prisma/client";
import { getServerSession, type NextAuthOptions } from "next-auth";
import { type Adapter } from "next-auth/adapters";

import DiscordProvider from "next-auth/providers/discord";
//const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
import {
	uniqueNamesGenerator,
	adjectives,
	colors,
	animals,
} from "unique-names-generator";
import { db } from "~/server/db";
import { env } from "~/env";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	// interface Session extends DefaultSession {
	//   user: {
	//     id: string;
	//     // ...other properties
	//     // role: UserRole;
	//   } & DefaultSession["user"];
	// }
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface User extends Partial<Prisma.User> {}
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface User extends Partial<Prisma.User> {}
	//interface JWT extends Prisma.User {}
	interface JWT {
		user: Prisma.User;
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}

/**
 * Custom adapter extension to create the user
 * Just extend the adapter to a new one and override the create
 */
type AdapterNew = Omit<Adapter, "createUser"> & {
	createUser: (data: Prisma.User) => Promise<Prisma.User>;
};
const adapter = PrismaAdapter(db) as AdapterNew;
adapter.createUser = async ({ id: _id, ...data }) => {
	const person = await db.persons.create({
		data: {
			name:
				data.name ??
				uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }),
			emails: {
				...(data.email
					? { create: { mail: data.email, deleteable: false } }
					: {}),
			},
		},
	});
	return await db.user.create({
		data: {
			...data,

			person_id: person.id,
			last_login: new Date(),
			userType: "GUEST",
		},
	});
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60, // 30 days
		updateAge: 24 * 60 * 60, // 24 hours
	},

	callbacks: {
		async signIn(props) {
			// console.log(props, "props")
			const banned = await db.bannedEmails.findFirst({
				where: {
					email: props.user.email ?? undefined,
				},
			});
			if (banned) {
				return false;
			}
			//Check if its first login
			return true;
		},
		jwt: async (props) => {
			if (props.user?.id || props.token?.id) {
				await db.user.update({
					where: {
						id: props.user?.id ?? props.token?.id,
					},
					data: {
						last_login: new Date(),
					},
				});

				if (props.user) {
					props.token = { ...props.user, ...props.token, password: undefined };
				}
			}
			return props.token;
		},
		session: (props) => {
			return {
				...props.session,
				user: {
					...props.session.user,
					...props.token,
				},
			};
		},
	},
	adapter: adapter as unknown as Adapter,
	providers: [
		DiscordProvider({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}),

		/**
		 * ...add more providers here.
		 *
		 * Most other providers require a bit more work than the Discord provider. For example, the
		 * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
		 * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
		 *
		 * @see https://next-auth.js.org/providers/github
		 */
	],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
