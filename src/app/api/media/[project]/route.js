import { auth } from "@/auth"

export async function GET(request, {params}) {

    const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}projects/${params.project}/media/`
    
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