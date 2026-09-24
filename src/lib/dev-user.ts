// TODO(auth): delete this file once Auth.js is wired up (Week 2).
//
// The API needs to know who is posting. Until login exists, client code
// sends the id of a seeded user and the server accepts it in development
// only — in production the header is ignored and writes return 401.

/** The seeded user we pretend to be while there is no login. */
export const DEV_USER_ID = "u-1";

export function devUserHeader(): Record<string, string> {
  return process.env.NODE_ENV === "production" ? {} : { "x-user-id": DEV_USER_ID };
}
