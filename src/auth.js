import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Credentials({
    providerId: 'django',
    credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
    },
    authorize: async (credentials) => {
        let user = null
        
        user = await doSignIn(credentials)

        if (!user) {
            // No user found, so this is their first attempt to login
            // meaning this is also the place you could do registration
            throw new Error("User not found.")
        }
        // return user object with their profile data
        return user
    },
  })],
  callbacks: {
    async jwt({ token, user }) {
        
        if (user) { // User is available during sign-in
            token.accessToken = user.accessToken
            token.userId = user.userId
          }
          return token
    },
    async session({session, token}) {
        session.user.userId = token.userId
        session.user.accessToken = token.accessToken
        return session
    },
    async redirect({ url, baseUrl }) {
        // Allows relative callback URLs
        if (url.startsWith("/")) return `${baseUrl}${url}`
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url
        return baseUrl
    }
  },
  events: {
    async signOut({token}) {
        console.log(token)
        const response = await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token.accessToken}`
            },
            body: {
                'username': session.user.name
            }
        })
    }
  }
})


async function doSignIn(credentials) {

    let accessToken = null
    // const loginUrl = 'http://192.168.79.2:8000/api/token/'
    const loginUrl = 'http://192.168.79.2:8000/api-auth/login/'
    try {
        const response = await fetch(loginUrl, {
            method: 'POST',
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: credentials.username, 
                password: credentials.password
            })
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const json = await response.json()
        console.log(json)

        accessToken = json.key
    } catch(error) {
        console.error(error.message)
    }

    if (accessToken) {
        try {
            const profileUrl = 'http://192.168.79.2:8000/api-auth/user/'
            const response = await fetch(profileUrl, 
                {method: 'GET',    
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Token ${userToken}`
                    "Authorization": `Token ${accessToken}`
                }
            })
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }

        const json = await response.json()

        console.log(json)

        const userData = {
            name: json.username,
            email: json.email,
            image: json.profile_photo,
            accessToken: accessToken,
            userId: json.pk
        }

        return userData

        } catch(error) {
            console.error(error.message)
        }
    }

}


/*
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
        const key = json.json.key

        const resp = await fetch(loginUrl, {
            method: 'GET',    
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${key}`
            }
        })
        // return resp
    } catch(error) {
        console.error(error.message)
    }
}

export async function signOut(username) {
    const logOutUrl = 'http://localhost:3000/api/auth/logout/'
    const response = await fetch(logOutUrl, {
        method: 'POST',
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "username": username
        })
    })
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`)
    } else {
        return response
    }
}

*/