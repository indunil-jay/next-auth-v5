"use server";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/email";
import { generatePasswordResetoken } from "@/lib/generate-password-reset-token";
import { ResetSchema } from "@/schemas";
import * as z from "zod";

export const resetPassword = async (values: z.infer<typeof ResetSchema>) => {
  const validatedField = ResetSchema.safeParse(values);

  if (!validatedField.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedField.data;

  const exisitingUser = await getUserByEmail(email);

  if (!exisitingUser) {
    return { error: "No user found with this email." };
  }

  const passwordResetToken = await generatePasswordResetoken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent!" };
};
