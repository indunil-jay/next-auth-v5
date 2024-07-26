import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        //1. Validate credentials against your database or API
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          //2. If valid, search for user in your database or API by email
          const user = await getUserByEmail(email);

          //check if there is no user or there is user with that email but no password.(provider logins)
          if (!user || !user.password) return null;

          //3. If there is user and password match, return user object
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) return user;
          //4. If there is user but password does not match, throw an error
        }

        return null;
      },
    }),

    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
