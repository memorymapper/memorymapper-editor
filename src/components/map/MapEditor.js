'use client'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import React, { useRef, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import MapboxDraw from "@mapbox/mapbox-gl-draw"
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import DrawModeSelector from './DrawModeSelector'
import {useSession} from "next-auth/react"
import FeatureEditor from './FeatureEditor'
import ContentEditor from './ContentEditor'

export default function MapEditor(props) {

    const mapContainer = useRef(null)
    const mapRef = useRef(null)
    const drawRef = useRef(null)
    const params = useParams()
    const session = useSession()

    const activeUser = useRef(null)

    const [drawMode, setDrawMode] = useState(null)

    const [feature, setFeature] = useState(null)

    const [editorVisible, setEditorVisible] = useState(false)

    useEffect(() => {
        if (mapRef.current) return // stops map from intializing more than once
      
        mapRef.current = new maplibregl.Map({
          container: mapContainer.current,
          style: props.style + '?key=fL9NKV06gTKowpkIEnt4',
          center: props.center.coordinates,
          zoom: props.zoom,
          doubleClickZoom: false,
          minZoom: props.minZoom,
          maxZoom: props.maxZoom,
          pitch: props.pitch,
          bearing: props.bearing,
        })

        drawRef.current = new MapboxDraw()

        async function getFeatures() {
            try {
                const url = `/api/feature/point/list/?mapconfig=${params.mapslug}`
                const response = await fetch(url)

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`)
                } 

                const json = await response.json()
                
                return json.json

                //setFeautures(json.json)
            } 
            catch(error) {
                console.log(error)
            }
        }

        async function drawCreate(e) {
            const feature = e.features[0]
            
            try {
                const url = '/api/feature/point/'

                const data = {
                    "geom": feature.geometry,
                    "name": "",
                    "maplibre_id": feature.id,
                    "theme": null,
                    "popup_image": null,
                    "thumbnail_url": "",
                    "weight": 1.0,
                    "published": false,
                    "mapconfig": params.mapslug,
                    "project": params.projectslug
                }

                const response = await fetch(url, {
                    
                    method: 'POST',
                    headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${activeUser.current.accessToken}`
                        },
                        body: JSON.stringify(data),
                    }
                )

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`)
                }

                const json = await response.json()

                setFeature(json.json)
            } 
            catch(error) {
                console.log(error.massage)
            }
        }

        async function updateSelect(e) {
            const feature = e.features[0]
            
            try {

                // Check if there's an associated maplibre_id; if there isn't the ID
                // will have come from the server as the UUID field
                let url = ''

                if (!feature.properties.maplibre_id) {
                    url = `/api/feature/point/?featureID=${feature.id}&draw=${true}`
                } else {
                    url = `/api/feature/point/?featureID=${feature.id}&draw=${false}`
                }

                const response = await fetch(url, {
                    
                    method: 'GET',
                    headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${activeUser.current.accessToken}`
                        },
                    }
                )

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`)
                }

                const json = await response.json()

                setFeature(json.json)
            } 
            catch(error) {
                console.log(error.message)
            }
        }

        async function drawUpdate(e) {
            // Post an update to the server...
            console.log(e.features[0])
        }

        mapRef.current.addControl(drawRef.current, 'top-right')
        
        mapRef.current.on('load', async function() {
            mapRef.current.on('draw.create', drawCreate)
            mapRef.current.on('draw.update', drawUpdate)
            // mapRef.current.on('draw.delete', drawDelete)
            mapRef.current.on('draw.modechange', (e) => {
                setDrawMode(drawRef.current.getMode())
            })
            mapRef.current.on('draw.selectionchange', updateSelect)
            const features = await getFeatures()
            drawRef.current.set(features)
        })

    }, [])

    useEffect(() => {
        if (mapRef.current.loaded() && drawRef.current) {
            drawRef.current.changeMode(drawMode)
        }
    }, [drawMode])

    useEffect(() => {
        if (session.data) {
            activeUser.current = session.data.user
        }
    }, [session])

    return (
        <>
        <div className="w-full bg-blue-50 relative h-full flex">
            <div className='w-1/3 p-5 bg-base-100'>
                <FeatureEditor 
                    feature={feature} 
                    projectslug={params.projectslug} 
                    mapslug={params.mapslug} 
                    featurename={feature ? feature.properties.name : ""}
                    editorVisible={editorVisible}
                    setEditorVisible={setEditorVisible}
                />
            </div>
            <div ref={mapContainer} className="map block w-2/3 h-full static">
                <DrawModeSelector drawMode={drawMode} setDrawMode={setDrawMode} />
            </div>
        </div>
        <div className={editorVisible ? 'w-full fixed flex h-full justify-end z-30' : 'hidden'}>
            <div className="w-2/3 h-full bg-base-100 border-l border-t">
                <ContentEditor 
                    editorVisible={editorVisible}
                    setEditorVisible={setEditorVisible}
                />
            </div>
        </div>
        </>
    )
}