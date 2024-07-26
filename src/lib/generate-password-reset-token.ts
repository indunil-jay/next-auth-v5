import { getPassswordResetTokenByEmail } from "@/data/password-reset-token";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";
export const generatePasswordResetoken = async (email: string) => {
  const token = uuid();
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000); // 1hr

  //check token already sent
  //1 get token if there
  const existingToken = await getPassswordResetTokenByEmail(email);

  //2 if so delete previous token and generate new token
  //delete
  if (existingToken) {
    await db.passwordResetToken.delete({ where: { id: existingToken.id } });
  }
  //generate new token
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      token,
      expiresAt,
      email,
    },
  });
  return passwordResetToken;
};
