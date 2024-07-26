import { auth } from "@/auth";
import { Session } from "next-auth";
/**
 * currentUser is a function to get current user from server-side session.
 * we use hooks for client side session, just like this is likely hook but not acctually it is a function
 *
 * @async
 * @function
 * @returns {Promise<Session["user"]>} A promise that resolves to the current user object if authenticated, otherwise null
 */

export const currentUser = async (): Promise<Session["user"] | undefined> => {
  const session = await auth();
  return session?.user;
};
