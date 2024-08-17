import Link from "next/link"

async function getProject(slug) {
    const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}projects/${slug}/`

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const json = await response.json()
        return json
    } catch(error) {
        console.log(error)
    }
}


export default async function Page({ params }) {

    const project = await getProject(params.slug)
    
    console.log(project)

    return (
        <div className="flex flex-col w-full">
            <h1>Project { project.title }</h1>
            <Link href="/maps/new/">New Map</Link>
        </div>
    )
}