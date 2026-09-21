"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

type Mode = "login" | "signup";

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function AuthForm({ mode }: { mode: Mode }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): Errors {
    const next: Errors = {};

    if (mode === "signup" && name.trim().length === 0) {
      next.name = "Please enter your name.";
    }
    if (!EMAIL_REGEX.test(email)) {
      next.email = "Please enter a valid email address.";
    }
    if (password.length < 8) {
      next.password = "Password must be at least 8 characters.";
    }
    if (mode === "signup" && confirmPassword !== password) {
      next.confirmPassword = "Passwords do not match.";
    }

    return next;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    // TODO(auth): wire this up to the real login/signup API.
    console.log({ mode, name, email, password });
    setSubmitted(true);
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <h1 className="text-xl font-bold">
          {mode === "login" ? "Log in" : "Create your account"}
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {mode === "signup" && (
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-[var(--secondary)]">
                  {errors.name}
                </p>
              )}
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-medium">
              {mode === "signup" ? "School email" : "Email"}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-[var(--secondary)]">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-[var(--secondary)]">
                {errors.password}
              </p>
            )}
          </div>

          {mode === "signup" && (
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--border)] px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-[var(--secondary)]">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {submitted && (
            <p className="text-xs text-[var(--muted)]">
              Not connected to the backend yet.
            </p>
          )}

          <button
            type="submit"
            className="mt-2 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            {mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[var(--muted)]">
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-[var(--accent)]">
                Sign up
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-[var(--accent)]">
                Log in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
