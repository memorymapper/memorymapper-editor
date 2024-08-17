/*export { auth as middleware } from "@/auth";

export const config = {
    matcher: ['/blocknote', '/mdxeditor']
}*/

export function middleware(request) {
    const loggedInUser = request.cookies.get('loggedInUserID')?.value

    /*if (loggedInUser && !request.nextUrl.pathname.startsWith('/dashboard')) {
        return Response.redirect(new URL('/dashboard', request.url))
    }*/
    
    if (!loggedInUser && !request.nextUrl.pathname.startsWith('/auth/login')) {
        return Response.redirect(new URL('/auth/login', request.url))
    }
}


export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
