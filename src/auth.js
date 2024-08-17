//import NextAuth from "next-auth"
//import GitHub from "next-auth/providers/github"
 
//export const { handlers, signIn, signOut, auth } = NextAuth({
//  providers: [/*GitHub*/],
//})

export async function signIn(formData) {
  const loginUrl = 'http://localhost:3000/api/auth/login/'
    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: formData.get('username'), 
                password: formData.get('password')
            })
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const json = await response.json()
        const setLoggedInUserURL = 'http://localhost:3000/api/auth/login/'
        const resp = await fetch(setLoggedInUserURL)
        console.log(resp)
    } catch(error) {
        console.error(error.message)
    }
}

