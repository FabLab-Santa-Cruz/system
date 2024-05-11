import type { NextRequest } from "next/server";
import { decode } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import type * as Prisma from "@prisma/client";
import { env } from "./env";
type extendedUser = Prisma.User & JWT;

export async function middleware(request: NextRequest) {
	const cookieprefix = env.NODE_ENV === "production" ? "__Secure-" : "";
	const token = request.cookies.get(
		`${cookieprefix}next-auth.session-token`,
	)?.value;
	let currentUser: null | extendedUser = null;
	if (token) {
		try {
			currentUser = (await decode({
				token,
				secret: process.env.NEXTAUTH_SECRET ?? "",
			})) as extendedUser;
		} catch (error) {
			return Response.redirect(new URL("/login", request.url));
		}
	}
	/**
	 * If logged in but it's not an admin
	 */
	// if (currentUser && request.nextUrl.pathname.startsWith("/dashboard") && currentUser.userType !== "ADMIN") {
	//   console.log(currentUser.userType);
	//   return Response.redirect(new URL("/", request.url));
	// }
	/**
	 * If is not even logged in...
	 *
	 */
	if (!currentUser && request.nextUrl.pathname.startsWith("/dashboard")) {
		return Response.redirect(new URL("/api/auth/signin", request.url));
	}
	// if (request.nextUrl.pathname === "/" && currentUser) {
	// 	return Response.redirect(new URL("/dashboard", request.url));
	// }
	// if (request.nextUrl.pathname === "/" && !currentUser) {
	// 	return Response.redirect(new URL("/api/auth/signin", request.url));
	// }
}
export const config = {
	//matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)', '/dashboard/:path*'],
};
