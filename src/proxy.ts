import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

/**
 * Next.js 16 "proxy" (formerly middleware).
 * 1) Refreshes the Supabase session cookies for /admin routes.
 * 2) Early redirect for signed-out visitors. This is only a convenience:
 *    every admin page/action ALSO verifies the owner on the server (lib/auth.ts) and RLS enforces it in the DB.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";

  const env = getSupabasePublicEnv();
  if (!env) {
    return isLogin ? NextResponse.next() : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authorized = user?.app_metadata?.role === "owner";

  if (!authorized && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (authorized && isLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = { matcher: ["/admin/:path*"] };
