"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  asChild,
  mode = "redirect",
}: LoginButtonProps) => {
  const router = useRouter();

  const handleonClick = () => {
    console.log("clicked");
    router.push("/auth/login");
  };

  if (mode === "modal") {
    return <span></span>;
  }

  return (
    <span onClick={handleonClick} className="cursor-pointer">
      {children}
    </span>
  );
};
