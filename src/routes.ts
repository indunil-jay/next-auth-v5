/**
 * An Array of routes that are accessible to the public
 * Theser routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes: string[] = ["/", "/auth/new-verification"];

/**
 * An Array of routes that  used  authentication
 *
 * @type {string[]}
 */

export const protectedRoutes: string[] = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix will be used api authentication purpose
 * @type {string}
 */

export const apiAuthPrefix: string = "/api/auth";

/**
 * The defaul redirect after login
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/settings";
