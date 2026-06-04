import { LoginForm } from "@/components/auth/login-form";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-4 py-10">
      <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
        <section className="max-w-2xl">
          <p className="text-sm font-medium text-primary">{APP_NAME}</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">Validate startup ideas with structured AI research.</h1>
          <p className="mt-4 text-base text-muted-foreground">
            Turn raw ideas into investor-ready analysis across market demand, competitors, sentiment, financials, and execution risk.
          </p>
        </section>
        <LoginForm />
      </div>
    </main>
  );
}

