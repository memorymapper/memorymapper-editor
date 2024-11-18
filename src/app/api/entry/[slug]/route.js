import { auth } from "@/auth"

export async function GET(request, {params}) {
    const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}documents/pk/${params.slug}/`
    
    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const json = await response.json()

        return Response.json(json)
    } catch(error) {
        console.error(error.message)
        return new Response()
    }
}

export async function PUT(request, {params}) {

    const session = await auth()
    const data = await request.json()

    try {
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}documents/pk/${params.slug}/`
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${session.user.accessToken}`
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const json = {
                ok: false,
                error: response.status
            }
            return new Response({json})
        }

        const json = await response.json()

        return Response.json( json )
    } catch(error) {
        console.error(error.message)
        return new Response()
    }
}