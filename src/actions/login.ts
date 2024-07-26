"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { send2FAEmail, sendVerficationEmail } from "@/lib/email";
import { generateVerificationToken } from "@/lib/generate-verification-token";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { error } from "console";
import { AuthError } from "next-auth";
import * as z from "zod";
import { generateTwoFactorToken } from "../lib/generate-two-factor-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  //server-side validation
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

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

  //check 2FA
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Invalid code!" };
      }

      if (twoFactorToken.token !== code) {
        return { error: "Invalid code!" };
      }

      const hasExpired = new Date(twoFactorToken.expiresAt) < new Date();
      if (hasExpired) {
        return { error: "Expired code!" };
      }

      await db.twoFactorToken.delete({
        where: { id: twoFactorToken.id },
      });

      const exisitingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (exisitingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: { id: exisitingConfirmation.id },
        });
      }

      await db.twoFactorConfirmation.create({
        data: { userId: existingUser.id },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await send2FAEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
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
