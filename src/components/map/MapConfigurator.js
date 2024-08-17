'use client'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useRef, useEffect, useState, useContext } from 'react'

export default function MapConfigurator(props) {

    const mapContainer = useRef(null)
    const map = useRef(null)

    const [zoom, setZoom] = useState(props.zoom)
    const [center, setCenter] = useState(props.center.coordinates)
    const [pitch, setPitch] = useState(props.pitch)
    const [bearing, setBearing] = useState(props.bearing)

    const handleClick = (e) => {
        console.log('fired')
    }

    useEffect(() => {
        if (map.current) return; // stops map from intializing more than once
      
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: props.style + '?key=fL9NKV06gTKowpkIEnt4',
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
            <div className='w-1/4'>
                <h3>Configure Map</h3>
                <input 
                    type="text" 
                    name="title" 
                    placeholder="Untitled" 
                    required 
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'

                />
                <ul>
                    <li>Zoom: {(Math.round(zoom * 100) / 100).toFixed(2)}</li>
                    <li>Center: {center[0]}, {center[1]}</li>
                    <li>Bearing: {bearing}</li>
                    <li>Pitch: {pitch}</li>
                </ul>
                <button 
                    aria-disabled={status.pending} 
                    type="submit" 
                    onClick={handleClick}
                    className='rounded-md bg-stone-50 px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
                >
                    Save
                </button>
            </div>
            <div ref={mapContainer} className="map block absolute w-3/4 h-full" />
        </div>
    )
}
