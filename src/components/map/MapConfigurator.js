'use client'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useRef, useEffect, useState } from 'react'

export default function MapConfigurator(props) {

    console.log(props)

    const mapContainer = useRef(null)
    const map = useRef(null)

    const [zoom, setZoom] = useState(props.zoom)
    const [center, setCenter] = useState(props.center.coordinates)
    const [pitch, setPitch] = useState(props.pitch)
    const [bearing, setBearing] = useState(props.bearing)
    const [title, setTitle] = useState(null)
    const [showTerrain, setShowTerrain] = useState(true)
    const [terrainExaggeration, setShowTerrainExaggeration] = useState(1)

    const [style, setStyle] = useState(props.style)

    // Todo: this should be loaded from memorymapper
    const styles = [
        ["https://api.maptiler.com/maps/positron/style.json", "Positron"], 
        ["https://api.maptiler.com/maps/landscape/style.json", "Landscape"],
        ["https://api.maptiler.com/maps/streets-v2/style.json", "Streets"],
        ["https://api.maptiler.com/maps/dataviz/style.json", "Dataviz"],
        ["https://api.maptiler.com/maps/topo-v2/style.json", 'Topo'],
        ["https://api.maptiler.com/maps/uk-openzoomstack-night/style.json", 'UK OpenZoomStack Night']
    ]

    async function handleClick(e) {
        const centerPoint = {'type': 'Point', 'coordinates': center}
        const response = await fetch('/api/mapconfig/', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer $props.accessToken}`
            },
            body: JSON.stringify({
                'title': title,
                'style': style,
                'center': centerPoint,
                'zoom': zoom,
                'pitch': pitch,
                'bearing': bearing,
                'show_terrain': showTerrain,
                'terrain_exaggeration': terrainExaggeration,
                'min_zoom': 1,
                'max_zoom': 18,
                'scale': 'IMPERIAL'
            })
        })
    }

    const handleStyleChange = (e) => {
        setStyle(e.target.value)
        map.current.setStyle(style + '?key=fL9NKV06gTKowpkIEnt4')
    }

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: style + '?key=fL9NKV06gTKowpkIEnt4',
          center: [props.center.coordinates[0], props.center.coordinates[1]],
          zoom: props.zoom,
          doubleClickZoom: false,
        })

        map.current.on('zoomend', () => {
            setZoom(map.current.getZoom())
        })

        map.current.on('moveend', () => {
            const currentCenter = map.current.getCenter()
            setCenter([currentCenter.lng, currentCenter.lat])
            setBearing(map.current.getBearing())
            setPitch(map.current.getPitch())
        })

    }, [])

    return (
        <div className="w-full bg-blue-50 relative h-full flex">
            <div className='w-1/4 p-5'>
                <h3>Configure Map</h3>
                <input 
                    type="text" 
                    name="title" 
                    placeholder="Untitled" 
                    required 
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    onChange={e => setTitle(e.target.value)}

                />

                <input
                    type="number"
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                    value={center[0]}
                />

                <ul>
                    <li>Zoom: {(Math.round(zoom * 100) / 100).toFixed(2)}</li>
                    <li>Center: {center[0]}, {center[1]}</li>
                    <li>Bearing: {bearing}</li>
                    <li>Pitch: {pitch}</li>
                </ul>

                <select name="style" id="style-select" className="w-full" onChange={handleStyleChange}>
                    {styles.map((s, i) => 
                        <option value={s[0]} key={i}>{s}</option>
                    )}
                </select>

                <button 
                    type="submit" 
                    onClick={handleClick}
                    className='rounded-md bg-stone-50 px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 mt-5 w-full'
                >
                    Save
                </button>
            </div>
            <div ref={mapContainer} className="map block absolute w-3/4 h-full" />
        </div>
    )
}
