"use server";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/generate-verification-token";
import { sendVerficationEmail } from "@/lib/email";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  //server-side validation
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password, email, name } = validatedFields.data;

  //1.check email already exists
  // const existingUser = await db.user.findUnique({
  //   where: { email },
  // });
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already in use" };
  }

  //2.hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  //3 create user
  await db.user.create({
    data: { email, password: hashedPassword, name },
  });

  //4  send verification token
  const verificationToken = await generateVerificationToken(email);
  await sendVerficationEmail(verificationToken.email, verificationToken.token);

  return {
    success: "Confirmation email sent your email verifiy your account!",
  };
};
