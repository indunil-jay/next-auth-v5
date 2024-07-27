import { useSession } from "next-auth/react";

/**
 * use this hook in client components
 *
 */
const useCurrentSRole = () => {
  const session = useSession();
  return session?.data?.user.role;
};

export default useCurrentSRole;
