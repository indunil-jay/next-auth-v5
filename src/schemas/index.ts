import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "email is required." })
    .email({ message: "invalid email address." }),
  password: z.string().min(1, { message: "password is required." }),
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
