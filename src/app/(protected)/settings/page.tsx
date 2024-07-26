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

// import { useSession, signOut } from "next-auth/react";
// const SettingPage = async () => {
//   const session = useSession();

//   const onClick = () => {
//     signOut();
//   };

//   return (
//     <div>
//       {JSON.stringify(session)}

//       <button onClick={onClick}>SignOut</button>
//     </div>
//   );
// };

// export default SettingPage;
