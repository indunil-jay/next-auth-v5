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
      role: UserRole;
      isTwoFactorEnabled: boolean;
      isOAuth: boolean;
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
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
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

      //4 check for account is provder account
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;

      //3.set the role to the token
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      //<<to automatically update session when there is updates>>
      token.email = existingUser.email;
      token.name = existingUser.name;

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

      if (session.user && token.isTwoFactorEnabled) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
      }

      //<<to automatically update session when there is updates>>
      if (session.user) {
        session.user.email = token.email!;
        session.user.name = token.name;

        //
        session.user.isOAuth = token.isOAuth;
      }

      return session;
    },

    async signIn({ user, account }) {
      //1 allow OAuth without email verification
      if (account?.provider !== "creadentials") {
        return true;
      }

      const existingUser = await getUserById(user.id!);

      //prevent signin without email verification
      if (!existingUser || !existingUser.emailVerified) return false;

      //TODO: 2FA
      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        //delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });

        return true;
      }

      return true;
    },
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
