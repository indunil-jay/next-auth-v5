import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "@/lib/db";
import { getUserById } from "./data/user";

import { type DefaultSession } from "next-auth";

//need for defines types (4)
// enum UserRole {
//   ADMIN = "ADMIN",
//   USER = "USER",
// }
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      role: UserRole;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule
import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: UserRole;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  //use for extends the existing session object
  callbacks: {
    async jwt({ token }) {
      //make role based authentication
      //1.token.sub reffers the db id of a user
      if (!token.sub) {
        return token;
      }

      //2.get user by db id from db
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      //3.set the role to the token
      token.role = existingUser.role;

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        //put db id to the session object
        session.user.id = token.sub;
      }

      //4. set user role to the session object
      if (session.user && token.role) {
        session.user.role = token.role;
      }

      return session;
    },

    // async signIn({ user }) {
    //   const existingUser = await getUserById(user.id!);

    //   if (!existingUser || !existingUser.emailVerified) return false;

    //   return true;
    // },
  },

  //handle side effects regarding to authentication
  events: {
    // here what does is that, we automatically populate the some db properties
    // because we can completely trust that provider no need further verification
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },

  //use for change default ui which provides bu next auth
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
