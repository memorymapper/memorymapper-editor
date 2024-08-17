export async function GET(request, {params}) {
    const url = `http://192.168.76.2:8000/api/1.0/documents/${params.slug}`
    
    try {
        const response = await fetch(url)
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