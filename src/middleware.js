export { auth as middleware } from "@/auth"

/*export { auth as middleware } from "@/auth";

export const config = {
    matcher: ['/blocknote', '/mdxeditor']
}*/

// import LogOutButton from "./components/buttons/LogOutButton"

// export function middleware(request) {
//     const loggedInUserID = request.cookies.get('loggedInUserID')?.value

//     console.log(loggedInUserID)

//     /*if (loggedInUserID && !request.nextUrl.pathname.startsWith('/dashboard')) {
//         return Response.redirect(new URL('/', request.url))
//     }*/
    
//     if (!loggedInUserID && !request.nextUrl.pathname.startsWith('/auth/login')) {
//         return Response.redirect(new URL('/auth/login', request.url))
//     }
// }


// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }
