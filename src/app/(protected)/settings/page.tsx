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

const SettingPage = () => {
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
