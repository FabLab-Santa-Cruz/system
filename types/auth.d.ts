import "next-auth";
import { type DefaultSession } from "next-auth";
import type * as Prisma from "@prisma/client";
declare module 'next-auth' {
   interface Session {
    user: Prisma.User & DefaultSession['user']  
  }
}