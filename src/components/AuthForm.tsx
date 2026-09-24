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
/** Only Albert School students can post, so only school email addresses. */
const SCHOOL_DOMAIN = "albertschool.com";

const field =
  "mt-1.5 w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-sky";

export default function AuthForm({ mode }: { mode: Mode }) {
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): Errors {
    const next: Errors = {};

    if (isSignup && name.trim().length === 0) {
      next.name = "Enter the name your classmates know you by.";
    }
    if (!EMAIL_REGEX.test(email)) {
      next.email = "That does not look like an email address.";
    } else if (isSignup && !email.trim().toLowerCase().endsWith(`@${SCHOOL_DOMAIN}`)) {
      next.email = `Sign up with your @${SCHOOL_DOMAIN} address.`;
    }
    if (password.length < 8) {
      next.password = "Use at least 8 characters.";
    }
    if (isSignup && confirmPassword !== password) {
      next.confirmPassword = "The two passwords are different.";
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

    // TODO(auth): call the real sign-in / sign-up endpoint (Auth.js).
    setSubmitted(true);
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-5 py-12">
      <div className="w-full">
        <h1 className="display text-3xl font-extrabold text-navy">
          {isSignup ? "Join StudentSwap" : "Welcome back"}
        </h1>
        <p className="mt-2 text-sm text-slate">
          {isSignup
            ? `Open to anyone with an @${SCHOOL_DOMAIN} address.`
            : "Log in to post a place or manage your listings."}
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {isSignup && (
            <div>
              <label htmlFor="name" className="text-sm font-medium text-navy">
                Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={Boolean(errors.name)}
                className={field}
              />
              {errors.name && <p className="mt-1.5 text-xs text-danger">{errors.name}</p>}
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm font-medium text-navy">
              School email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={`you@${SCHOOL_DOMAIN}`}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={Boolean(errors.email)}
              className={`${field} placeholder:text-slate/60`}
            />
            {errors.email && <p className="mt-1.5 text-xs text-danger">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-navy">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              aria-invalid={Boolean(errors.password)}
              className={field}
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-danger">{errors.password}</p>
            )}
          </div>

          {isSignup && (
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-medium text-navy">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                aria-invalid={Boolean(errors.confirmPassword)}
                className={field}
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-danger">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-full bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-700"
          >
            {isSignup ? "Create my account" : "Log in"}
          </button>

          {submitted && (
            <p className="rounded-xl bg-mist px-4 py-3 text-sm text-slate">
              Accounts are not switched on yet — Taoufik is building the login.
              Everything else on the site works in the meantime.
            </p>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-slate">
          {isSignup ? "Already have an account? " : "New here? "}
          <Link
            href={isSignup ? "/login" : "/signup"}
            className="font-medium text-deep underline underline-offset-4"
          >
            {isSignup ? "Log in" : "Create an account"}
          </Link>
        </p>
      </div>
    </div>
  );
}
