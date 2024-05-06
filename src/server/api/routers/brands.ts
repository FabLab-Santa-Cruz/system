import { z } from "zod";

import {
	createTRPCRouter,
	protectedProcedure,
	//publicProcedure,
} from "~/server/api/trpc";

export const brandRouter = createTRPCRouter({
	upsert: protectedProcedure
		.input(
			z.object({
				id: z.string().optional(),
				name: z.string(),
				image: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (ctx.session.user.userType !== "ADMIN") {
				throw new Error("Unauthorized");
			}
			return ctx.db.brand.upsert({
				where: {
					id: input.id ?? "X",
				},
				create: {
					name: input.name,
					image: input.image,
				},
				update: {
					name: input.name,
					image: input.image,
				},
			});
		}),
	list: protectedProcedure.query(({ ctx }) => {
		if (ctx.session.user.userType !== "ADMIN") {
			throw new Error("Unauthorized");
		}
		return ctx.db.brand.findMany();
	}),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			if (ctx.session.user.userType !== "ADMIN") {
				throw new Error("Unauthorized");
			}
			return ctx.db.brand.delete({
				where: { id: input.id },
			});
		}),
});
