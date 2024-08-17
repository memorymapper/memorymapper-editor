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

export async function GET() {
    const userToken = cookies().get('userToken').value
    const url = 'http://192.168.79.2:8000/api-auth/user/'
    try {
        const response = await fetch(url, 
            {method: 'GET',    
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
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