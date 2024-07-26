import { currentUser } from "@/lib/auth";

const ServerPage = async () => {
  const user = await currentUser();
  return <div>page</div>;
};

export default ServerPage;
