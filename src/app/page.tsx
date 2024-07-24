import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-sky-500">
      <div className="space-y-6">
        <h1 className="text-6xl font-semibold  drop-shadow-md">Auth</h1>
        <p className="text-lg">A simple authentication service</p>
        <LoginButton>
          <Button>Sign in</Button>
        </LoginButton>
      </div>
    </main>
  );
}
