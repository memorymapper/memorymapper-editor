import { auth } from "@/auth"

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const featureID = searchParams.get('featureID')
    const draw = searchParams.get('draw')
    const session = await auth()
    
    try {
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}features/${featureID}/?draw=${draw}`
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${session.user.accessToken}`
            }
        })

        if (!response.ok) {
            const json = {
                ok: false,
                error: response.status
            }
            return new Response({json})
        }

        const json = await response.json()

        return Response.json(json)
    } catch(error) {
        console.error(error.message)
        return new Response()
    }
}


export async function POST(request) {

    const session = await auth()
    const data = await request.json()

    try {
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}features/points/create/`
        const response = await fetch(url, {
            method: 'POST',
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

        return Response.json({ json })
    } catch(error) {
        console.error(error.message)
        return new Response()
    }
}



export async function PUT(request) {

    const session = await auth()
    const data = await request.json()

    try {
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}features/${data.id}/?draw=false`
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

        return Response.json({ json })
    } catch(error) {
        console.error(error.message)
        return new Response()
    }
}