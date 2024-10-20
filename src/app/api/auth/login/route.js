import { cookies } from 'next/headers'

export async function POST(request) {
    const credentials = await request.json()
    const url = 'http://192.168.79.2:8000/api-auth/login/'
    try {
        const response = await fetch(url, {
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
        cookies().set('userToken', json.key)
        return Response.json({json})
    } catch(error) {
        console.error(error.message)
    }
}

export async function GET(request) {
    // Sets the logged in user on the basis of the token passed in the 
    // headers
    try {
        // const userToken = cookies().get('userToken').value
        const userToken = request.headers.get('authorization')
        cookies().set('userToken', userToken)
        const url = 'http://192.168.79.2:8000/api-auth/user/'
        const response = await fetch(url, 
            {method: 'GET',    
            headers: {
                "Content-Type": "application/json",
                "Authorization": userToken
            }
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const json = await response.json()
        
        cookies().set('loggedInUserID', json.pk)
        cookies().set('loggedInUserName', json.username)

        return Response.json({ json })
    } catch(error) {
        console.error(error.message)
        return new Response()
    }

}