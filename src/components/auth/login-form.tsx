"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CardWrapper } from "@/components/card-wrapper";
import { LoginSchema } from "@/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export const LoginForm = () => {
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [pending, startTransition] = useTransition();

  //toget server-side responses (simple approach)
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  //when login with provider, when they have and error read error from url and show
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already use in with diffrent provider."
      : "";

  //2FA
  const [show2FA, setShow2FA] = useState(false);

  const onSubmit = (value: z.infer<typeof LoginSchema>) => {
    //clear before next response
    setError("");
    setSuccess("");

    //
    startTransition(() =>
      login(value)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data?.error);
          }
          if (data?.success) {
            form.reset();

            setSuccess(data?.success);
          }
          if (data?.twoFactor) {
            setShow2FA(true);
          }
        })
        .catch(() => setError("something went wrong"))
    );
  };

  return (
    <CardWrapper
      headerLabel="Welcome Back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {show2FA && (
              <>
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Two Factor Code</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="123456"
                          type="text"
                          disabled={pending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {!show2FA && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john.doe@example.com"
                          type="email"
                          disabled={pending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="••••••"
                          type="password"
                          disabled={pending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  asChild
                  variant={"link"}
                  size={"sm"}
                  className="px-0 font-normal flex justify-end"
                >
                  <Link href="/auth/reset">Forgot password?</Link>
                </Button>
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={pending}>
            {show2FA ? "Confirm" : "Sign in"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
