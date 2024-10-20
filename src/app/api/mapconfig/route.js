import { cookies } from "next/headers"

export async function POST(request) {

    const userToken = cookies().get('userToken').value
    const loggedInUserID = cookies().get('loggedInUserID').value

    const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}maps/create/`

    const data = await request.json()

    console.log(JSON.stringify(data))

    data.owner = loggedInUserID
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${userToken}`
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const json = await response.json()

        return Response.json({ json })
    } catch(error) {
        console.error(error.message)
        return new Response()
    }
}