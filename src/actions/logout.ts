"use server";

import { signOut } from "@/auth";

export const logout = async () => {
  //this way of logout s use for do some server stuff before logout
  await signOut();
};
