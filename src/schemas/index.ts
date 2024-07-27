import { newPassword } from "@/actions/new-password";
import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "email is required." })
    .email({ message: "invalid email address." }),
  password: z.string().min(1, { message: "password is required." }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z
    .string()
    .min(1, { message: "email is required." })
    .email({ message: "invalid email address." }),
  password: z
    .string()
    .min(1, { message: "password is required." })
    .min(6, { message: "password must contains atleast 6 characters." }),
  name: z.string().min(1, { message: "name is required." }),
});

export const ResetSchema = z.object({
  email: z
    .string()
    .min(1, { message: "email is required." })
    .email({ message: "invalid email address." }),
});

export const NewPasswordSchema = z.object({
  password: z
    .string()
    .min(1, { message: "password is required." })
    .min(6, { message: "password must contains atleast 6 characters." }),
});

export const SettingSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(
      z.string().min(6, { message: "Password must be at least 6 characters" })
    ),
    newPassword: z.optional(
      z
        .string()
        .min(6, { message: "newPassword must be at least 6 characters" })
    ),
  })
  .refine(
    ({ password, newPassword }) => {
      if (password && !newPassword) return false;

      return true;
    },
    { message: "New password is required", path: ["newPassword"] }
  )
  .refine(
    ({ password, newPassword }) => {
      if (newPassword && !password) return false;
      return true;
    },
    { message: "password is required", path: ["password"] }
  );
