import MapConfigurator from "@/components/map/MapConfigurator"

async function getConfig(slug) {
    const url = `http://192.168.79.2:8000/api/1.0/maps/${slug}/`
    
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

export default async function Page({params}) {

    const mapConfig = await getConfig(params.slug)

    return (
        <>
            <MapConfigurator 
                title={mapConfig.title}
                id={mapConfig.id}
                slug={mapConfig.slug}
                owner={mapConfig.owner}
                center={mapConfig.center}
                style={mapConfig.style}
                published={mapConfig.published}
                created={mapConfig.created}
                bounds_sw={mapConfig.bounds_sw}
                bounds_ne={mapConfig.bounds_ne}
                zoom={mapConfig.zoom}
                min_zoom={mapConfig.min_zoom}
                max_zoom={mapConfig.max_zoom}
                scale={mapConfig.scale}
                pitch={mapConfig.pitch}
                bearing={mapConfig.bearing}
                show_terrain={mapConfig.show_terrain}
                terrain_exaggeration={mapConfig.terrain_exaggeration}
            />
        </>
    )
}