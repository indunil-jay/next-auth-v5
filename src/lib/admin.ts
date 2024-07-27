"use server";

import { UserRole } from "@prisma/client";
import { currentRole } from "./auth";

export const admin = async () => {
  const role = await currentRole();

  if (role === UserRole.ADMIN) {
    return { success: "Allowed" };
  }
  return { error: "Not Allowed" };
};
