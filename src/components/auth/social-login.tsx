"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { FaGithub } from "react-icons/fa";

import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  //create sign in  using client side, next-auth directly @/auth sign in can be use only server components and server actions

  const handleClick = (provider: "google" | "github") => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT,
    });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => handleClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => handleClick("github")}
      >
        <FaGithub className="h-5 w-5" />
      </Button>
    </div>
  );
};
