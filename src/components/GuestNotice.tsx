import { Link } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";

export function GuestNotice({
  title = "You're browsing as a guest",
  body = "Guests don't have a business yet. Sign in or create an account to set up your business and keep your records.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="card-surface mt-3 p-6 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50">
        <LockKeyhole className="h-6 w-6 text-blue-900" aria-hidden />
      </span>
      <h2 className="mt-4 font-display text-lg font-semibold text-blue-900">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{body}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Link
          to="/auth"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-900 px-5 text-sm font-semibold text-primary-foreground"
        >
          Log in or sign up
        </Link>
      </div>
    </section>
  );
}
