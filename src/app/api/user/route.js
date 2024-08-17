import { cookies } from "next/headers"

export async function GET() {
    const url = 'http://192.168.76.2:8000/api-auth/user/'
    const token = cookies().get('userToken')
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${token.value}`
            }
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        
        const json = await response.json()

        cookies().set('loggedInUserID', json.pk)
        cookies().set('loggedInUserName', json.username)

        return Response.json({json})
    } catch(error) {
        console.error(error.message)
        return new Response()
    }
}