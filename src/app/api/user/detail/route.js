import { cookies } from "next/headers"

export async function GET(request) {
    // const userId = cookies().get('loggedInUserID')

    const userId = cookies().get('userToken').value
    const url = `http://192.168.79.2:8000/api/1.0/users/${userId}`
    
    /*try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        // const json = await response.json()

        // console.log(json)

        // return Response.json({ json })
    } catch(error) {
        console.error(error.message)
        return new Response()
    }*/
}