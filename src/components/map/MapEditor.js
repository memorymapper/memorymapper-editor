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
import useFeatures from '@/swrrequests/useFeatures'
import { MdCreate, MdOutlineSettings } from "react-icons/md"

export default function MapEditor(props) {

    const mapContainer = useRef(null)
    const mapRef = useRef(null)
    const drawRef = useRef(null)
    const params = useParams()
    const session = useSession()

    const activeUser = useRef(null)
    const [drawMode, setDrawMode] = useState(null)
    const [feature, setFeature] = useState(null)

    const [featureID, setFeatureID] = useState(null)
    const [mapLibreFeatureID, setMapLibreFeatureID] = useState(null)

    const [activeDocument, setActiveDocument] = useState(null)
    // Split out just cos it's simpler - this updates the doc title in the ContentConfigurator when changed in the text editor
    const [activeDocTitle, setActiveDocTitle] = useState(null) 
    const [documents, setDocuments] = useState([])

    const {features, isLoading, isError} = useFeatures(`?mapconfig=${params.mapslug}`)

    useEffect(() => {
        if (mapRef.current) return // stops map from intializing more than once
        if (drawRef.current) return

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

        const blue = '#3bb2d0'
        const orange = '#fbb03b'
        const white = '#fff'

        drawRef.current = new MapboxDraw(
            {
                userProperties: true,
                /*styles: [{
                    id: 'labels',
                    source: 'mapbox-gl-draw-cold',
                    type: 'symbol',
                    layout: {
                        'text-field': ['get', 'user_name']
                    },
                    paint: {
                      
                    }
                }]*/
            }
        )

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
                    "theme": "",
                    // "popup_image": null,
                    "thumbnail_url": "",
                    "weight": 1.0,
                    "published": false,
                    "mapconfig": params.mapslug,
                    "project": params.projectslug,
                    "documents": []
                }

                const response = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    }
                )

                console.log(JSON.stringify(data))

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`)
                }

                const json = await response.json()

                setFeature(json)
                setDocuments(json.properties.documents)

                drawRef.current.delete(feature.id)
                drawRef.current.add(json)

            } 
            catch(error) {
                console.log(error.message)
            }
        }

        async function updateSelect(e) {
            // Clear the existing values
            setMapLibreFeatureID(null)
            setFeatureID(null)
            
            const feature = e.features[0]

            if (!feature) {
                return
            }
            
            // If it's been added since the last time the features
            // were loaded, it won't have a memorymapper id, only
            // the one the mapLibre has given it
            if (!feature.properties.maplibre_id) {
                setMapLibreFeatureID(feature.id)
            } else {
                setFeatureID(feature.id)
            }
        }

        async function drawUpdate(e) {
            // Post an update to the server...
            const feature = e.features[0]
            
            try {
                const data = {
                    "id": feature.id,
                    "geom": feature.geometry,
                    "name": feature.properties.name,
                    "maplibre_id": feature.properties.maplibre_id,
                    "theme": feature.properties.theme,
                    "popup_image": feature.properties.popup_image,
                    "thumbnail_url": feature.properties.thumbnail_url,
                    "weight": feature.properties.weight,
                    "published": feature.properties.published,
                    "mapconfig": params.mapslug,
                    "project": params.projectslug
                }

                const url = `/api/feature/point/`

                const response = await fetch(url, {
                        method: 'PUT',
                        body: JSON.stringify(data),
                    }
                )

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`)
                }

                const json = await response.json()

                setFeature(json.json)
                setDocuments(json.json.properties.documents)
            }
            catch(error) {
                console.log(error.message)
            }
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
            // const features = await getFeatures()
            // const loadedFeatures = await features
            // drawRef.current.set(loadedFeatures)
        })

    }, [])

    useEffect(() => {
        if (features && mapRef.current) {
            drawRef.current.set(features)
        }
    }, [features])

    useEffect(() => {
        if (mapRef.current.loaded() && drawRef.current) {
            drawRef.current.changeMode(drawMode)
        }
    }, [drawMode])

    return (
        <>
        <div className="w-full bg-blue-50 relative h-full flex">
            {/*<div className='h-full w-1/12 bg-base-100'>
                <ul className="menu bg-base-100 w-100">
                    <li className='text-center'><a><MdOutlineSettings /></a></li>
                    <li><a><MdCreate /></a></li>
                </ul>
    </div>*/}
            <div className='w-4/12 p-5 bg-base-100'>
                <FeatureEditor 
                    projectslug={params.projectslug} 
                    mapslug={params.mapslug} 
                    featurename={feature && feature.properties ? feature.properties.name : ""}
                    setActiveDocument={setActiveDocument}
                    activeDocument={activeDocument}
                    documents={documents}
                    setDocuments={setDocuments}
                    activeDocTitle={activeDocTitle}
                    featureID={featureID}
                    mapLibreFeatureID={mapLibreFeatureID}
                />
            </div>
            <div ref={mapContainer} className="map block w-2/3 h-full static">
                <DrawModeSelector drawMode={drawMode} setDrawMode={setDrawMode} />
            </div>
        </div>
        <div className={activeDocument ? 'w-full fixed flex h-full justify-end z-30 ' : 'hidden'}>
            <div className="w-2/3 h-full bg-base-100 border-l border-t">
                <ContentEditor 
                    setActiveDocument={setActiveDocument}
                    activeDocument={activeDocument}
                    activeDocTitle={activeDocTitle}
                    setActiveDocTitle={setActiveDocTitle}
                />
            </div>
        </div>
        </>
    )
}