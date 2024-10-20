import { cookies } from 'next/headers'

export async function POST() {
    const userName = cookies().get('loggedInUserName')
    const url = 'http://192.168.79.2:8000/api-auth/logout/'
    try {
        const response = await fetch(url, 
            {method: 'POST',    
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: userName.value, 
            })
        })
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const json = await response.json()
        
        cookies().set('loggedInUserID', null)
        cookies().set('loggedInUserName', null)

        return Response.json({ json })
    } catch(error) {
        console.error(error.message)
        return new Response()
    }

}