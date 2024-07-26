import { getVerificationTokenByEmail } from "@/data/verification-token";
import { v4 as uuid } from "uuid";
import { db } from "@/lib/db";

export const generateVerificationToken = async (email: string) => {
  const token = uuid();
  const expiresAt = new Date(new Date().getTime() + 3600 * 1000); // 1hr

  //check token already sent
  //1 get token if there
  const existingToken = await getVerificationTokenByEmail(email);

  //2 if so delete previous token and generate new token
  //delete
  if (existingToken) {
    await db.verificationToken.delete({ where: { id: existingToken.id } });
  }
  //generate new token
  const verificationToken = await db.verificationToken.create({
    data: {
      token,
      expiresAt,
      email,
    },
  });
  return verificationToken;
};
