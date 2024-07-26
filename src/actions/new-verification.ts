"use server";

import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist!" };
  }

  const hasExpired = new Date(existingToken.expiresAt) < new Date();
  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const exisitingUser = await getUserByEmail(existingToken.email);
  if (!exisitingUser) {
    return { error: "User does not exist!" };
  }

  await db.user.update({
    where: { id: exisitingUser.id },
    data: {
      email: existingToken.email,
      emailVerified: new Date(),
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });
  return { success: "Email verified!" };
};
