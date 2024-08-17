import MapConfigurator from "@/components/map/MapConfigurator"
import { cookies } from "next/headers"


export default function Page() {
    return (
        <MapConfigurator 
            id={0}
            owner={cookies().get('loggedInUserID').value}
            center={{coordinates: [0,0]}}
            published={false}
            zoom={15}
            style={'https://api.maptiler.com/maps/streets-v2/style.json'}
            min_zoom={0}
            max_zoom={22}
            show_terrain={false}
            terrain_exaggeration={1}
        />
    )
}