"use client";

{
  /** server-side
  import { auth, signOut } from "@/auth";

const SettingPage = async () => {
  const session = await auth();

  return (
    <div>
      {JSON.stringify(session)}

      <form
        action={async () => {
          "use server";

          await signOut();
        }}
      >
        <button type="submit">SignOut</button>
      </form>
    </div>
  );
};

export default SettingPage;
   */
}

import { logout } from "@/actions/logout";
import useCurrentUser from "@/hooks/use-current-user";
import { useSession } from "next-auth/react";

const SettingPage = () => {
  // const session = useSession();
  const user = useCurrentUser();

  const onClick = () => {
    // signOut();
    logout(); //with server and client combnation
  };

  return (
    <div>
      <button onClick={onClick}>SignOut</button>
    </div>
  );
};

export default SettingPage;
