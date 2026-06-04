"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLoginMutation, useSignupMutation } from "@/lib/api/hooks";

export function LoginForm() {
  const router = useRouter();
  const login = useLoginMutation();
  const signup = useSignupMutation();
  const [email, setEmail] = useState("founder@example.com");
  const [password, setPassword] = useState("password123");
  const [fullName, setFullName] = useState("Startup Founder");
  const [organizationId, setOrganizationId] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await login.mutateAsync({ email, password, organization_id: organizationId });
    router.push("/dashboard");
  }

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await signup.mutateAsync({ email, password, full_name: fullName });
    router.push("/dashboard");
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Access workspace</CardTitle>
        <CardDescription>Use an existing organization or create a founder workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="signup">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup">Sign up</TabsTrigger>
            <TabsTrigger value="login">Log in</TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <form className="grid gap-4" onSubmit={handleSignup}>
              <div className="grid gap-2">
                <Label htmlFor="signup-name">Name</Label>
                <Input id="signup-name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              <Button type="submit" disabled={signup.isPending}>
                {signup.isPending ? "Creating..." : "Create workspace"}
              </Button>
              {signup.error ? <p className="text-sm text-destructive">{signup.error.message}</p> : null}
            </form>
          </TabsContent>
          <TabsContent value="login">
            <form className="grid gap-4" onSubmit={handleLogin}>
              <div className="grid gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="organization-id">Organization ID</Label>
                <Input id="organization-id" value={organizationId} onChange={(event) => setOrganizationId(event.target.value)} />
              </div>
              <Button type="submit" disabled={login.isPending || !organizationId}>
                {login.isPending ? "Signing in..." : "Sign in"}
              </Button>
              {login.error ? <p className="text-sm text-destructive">{login.error.message}</p> : null}
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

