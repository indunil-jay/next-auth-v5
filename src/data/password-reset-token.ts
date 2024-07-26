import { db } from "@/lib/db";

export const getPassswordResetTokenByToken = async (token: string) => {
  try {
    const resetToken = await db.passwordResetToken.findUnique({
      where: { token },
    });
    return resetToken;
  } catch (error) {
    return null;
  }
};
export const getPassswordResetTokenByEmail = async (email: string) => {
  try {
    const resetToken = await db.passwordResetToken.findFirst({
      where: { email },
    });
    return resetToken;
  } catch (error) {
    return null;
  }
};
