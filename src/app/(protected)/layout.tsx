import Navbar from "./_components/navbar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen flex flex-col gap-y-10 bg-sky-500 justify-center items-center">
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
