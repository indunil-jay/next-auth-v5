"use client";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { admin } from "@/lib/admin";
import { toast } from "sonner";

const Adminpage = () => {
  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        // console.log("API route accessed successfully");
        toast.success("API route accessed successfully");
      } else {
        // console.error("API route access failed");
        toast.error("API route access failed");
      }
    });
  };

  const onServerActionClick = () => {
    admin().then((data) => {
      if (data.error) {
        toast.error(data.error);
      }
      if (data.success) {
        toast.success(data.success);
      }
    });
  };
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl text-center font-semibold">Admin</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <RoleGate allowedRole="ADMIN">
          <FormSuccess message="You are allowed to see this content" />
        </RoleGate>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium"> Admin only API Route</p>
          <Button onClick={onApiRouteClick}>click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium"> Admin only server action</p>
          <Button onClick={onServerActionClick}>click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Adminpage;
