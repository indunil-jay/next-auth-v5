import { auth } from "@/auth";
import { DefaultSession } from "next-auth";
/**
 * currentUser is a function to get current user from server-side session.
 * we use hooks for client side session, just like this is likely hook but not acctually it is a function
 *
 * @async
 * @function
 * @returns {Promise<DefaultSession["user"]>} A promise that resolves to the current user object if authenticated, otherwise null
 */

export const currentUser = async (): Promise<DefaultSession["user"]> => {
  const session = await auth();
  return session?.user;
};
