import MapEditor from "@/components/map/MapEditor"

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

    const mapConfig = await getConfig(params.mapslug)

    return (
        <>
            <MapEditor 
                title={mapConfig.title}
                center={mapConfig.center}
                style={mapConfig.style}
                zoom={mapConfig.zoom}
                maxZooom={mapConfig.max_zoom}
                minZoom={mapConfig.min_zoom}
                scale={mapConfig.scale}
                pitch={mapConfig.pitch}
                bearing={mapConfig.bearing}
                showTerrain={mapConfig.show_terrain}
                terrainExaggeration={mapConfig.terrain_exaggeration}
            />
        </>
    )
}