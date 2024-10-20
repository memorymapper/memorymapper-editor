export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const mapconfig = searchParams.get('mapconfig')
    
    try {
        const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}features/points/?mapconfig=${mapconfig}`
        const response = await fetch(url, {
            method: 'GET',
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