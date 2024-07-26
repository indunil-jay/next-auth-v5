"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendVerficationEmail } from "@/lib/email";
import { generateVerificationToken } from "@/lib/generate-verification-token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { error } from "console";
import { AuthError } from "next-auth";
import * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  //server-side validation
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  //check if user in db
  const existingUser = await getUserByEmail(email);

  //if not
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Invalid email address or password" };
  }

  //check existing user's email verification
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerficationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "confiration email sent!." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "something went wrong!" };
      }
    }
    throw error;
  }
};
