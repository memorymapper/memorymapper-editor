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

    const project = await getProject(params.projectslug)

    const created = new Date(project.created)
    
    return (
        <div className="flex flex-col w-full m-10">
            <h1>{ project.title }</h1>
            <span>Created { created.toDateString() }</span>
            <div className="w-full grid grid-cols-3 gap-4">
            {project.maps.length ? project.maps.map(map => (
                <div key={map} className="card bg-base-100 shadow-md rounded-sm my-4">
                    <div className="card-body">
                    <h2 className="card-title">{map}</h2>
                    <div className="card-actions justify-end">
                        <Link href={`${params.projectslug}/maps/${map}/edit`}>Edit</Link>
                    </div>
                    </div>
                </div>
                
            )) : null }
            <div className="card bg-base-100 shadow-md rounded-sm my-4">
                <div className="card-body">
                    <h2 className="card-title">New</h2>
                    <div className="card-actions justify-end">
                        <Link href="/maps/new/">+</Link>
                    </div>
                </div>
            </div>
            
            </div>
            
        </div>
    )
}