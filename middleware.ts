import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl

        // Public routes that don't require authentication
        const publicRoutes = ["/", "/login", "/register"]

        // Check if the current path is a public route
        if (publicRoutes.includes(pathname)) {
            return NextResponse.next()
        }

        // Since localStorage isn't available in middleware, we'll let the client handle auth
        // The client-side code should redirect to login if no token in localStorage
        return NextResponse.next()
    } catch (error) {
        return NextResponse.next()
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
}
