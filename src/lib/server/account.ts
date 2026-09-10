import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { authMiddleware } from "@/lib/auth/middleware";
import { auth } from "@/lib/auth/server";
import { getSql } from "@/lib/db";

/**
 * Delete this seller's account and everything in it.
 *
 * Google Play requires an app that offers account creation to offer in-app
 * account deletion as well — but this is also just the honest thing to provide:
 * someone closing their shop should be able to close the book.
 *
 * Business rows go first, then the Better Auth identity (which cascades to
 * sessions and credentials). Everything is scoped to the verified caller, so
 * there is no id in the payload to tamper with.
 */
export const deleteMyAccount = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const userId = context.userId;

    // Child rows before parents; the schema has no foreign keys between the
    // BaleBook tables, so the order is for readability rather than constraint
    // enforcement.
    await sql`delete from payments where user_id = ${userId}`;
    await sql`delete from sales where user_id = ${userId}`;
    await sql`delete from expenses where user_id = ${userId}`;
    await sql`delete from clothes where user_id = ${userId}`;
    await sql`delete from bales where user_id = ${userId}`;
    await sql`delete from customers where user_id = ${userId}`;
    await sql`delete from shops where user_id = ${userId}`;
    await sql`delete from businesses where user_id = ${userId}`;

    const request = getRequest();
    if (request) {
      // Removes the user row, its credentials and every session. Enabled by
      // `user.deleteUser` in `src/lib/auth/server.ts`.
      await auth.api.deleteUser({ headers: request.headers, body: {} });
    }

    return { ok: true };
  });
