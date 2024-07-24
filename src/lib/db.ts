import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

//use form prevent creating too many  instace becaue in development nextjs does hot reload
//in production we use like this,  export const db =  new PrismaClient();
export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
