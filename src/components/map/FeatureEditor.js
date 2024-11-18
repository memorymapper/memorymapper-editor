
'use client'
import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import TagConfigurator from "./TagConfigurator"
import { MdModeEdit } from "react-icons/md"
import ContentConfigurator from "./ContentConfigurator"
import { AddThemeModal } from "./AddThemeModal"
import useFeature from "@/swrrequests/useFeature"
import Image from "next/image"
import FeatureThumbnail from "../media/FeatureThumbnail"

export default function FeatureEditor(props) {

    // const [feature, setFeature] = useState(null)
    const draw = !props.featureID ? true : false

    const id = !props.featureID ? props.mapLibreFeatureID : props.featureID
    
    const { feature, isLoading, isError} = useFeature(`?featureID=${id}&draw=${draw}`)

    const [name, setName] = useState(null)
    const [theme, setTheme] = useState(null)
    const [weight, setWeight] = useState(null)
    const [published, setPublished] = useState(null)
    // const [thumbnail, setThumbnail] = useState(null)

    const addThemeModalRef = useRef(null)

    useEffect(() => {
        setName(feature ? feature.properties.name : "")
        setTheme(feature ? feature.properties.theme : "")
        setWeight(feature ? feature.properties.weight : 1)
        setPublished(feature ? feature.properties.published : false)
    }, [feature])

    if (!props.featureID && !props.mapLibreFeatureID) {
        return (
        <div>
            <h3>Instructions</h3>
            <p>Click on a feature to edit it.</p>
            <p>Use the draw controls on the right to add features to the map.</p>
        </div>)
    }

    if (isLoading) {
        return <>Loading...</>
    }

    if (isError) {
        return <>Error...</>
    }

    async function handleThumbnailChange(e) {

        

        try {
            const thumbnail = e.target.files[0]
            let data = new FormData()
            data.append('popup_image', thumbnail)    
            
            const response = await fetch(`http://192.168.79.2:8000/api/1.0/features/${feature.id}/thumbnail/upload/`, {
            method: 'POST',
            body: data,
            })

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }

            const json = await response.json()
            
            console.log(json)

        } catch(error) {
            console.log(error.message)
        }
    }

    async function handleChange(e) {
        switch (e.target.id) {
            case 'name':
                setName(e.target.value)
                break
            case 'weight':
                setWeight(e.target.value)
                break
            case 'theme':
                setWeight(e.target.value)
                break
            case 'published':
                setPublished(e.target.value)
                break
            default:
                // do nothing
                break
        }

        try {
            const url = `/api/feature/point/`
            
            const data = {
                id: feature.id,
                name: name,
                project: props.projectslug,
                mapconfig: props.mapslug,
                geom: feature.geometry,
                weight: weight,
                published: published,
                theme: theme,
                documents: feature.properties.documents,
                popup_image: thumbnail
            }

            const response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify(data)
            })

            console.log(JSON.stringify(data))

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }

            const json = await response.json()

        } catch(error) {
            console.log(error.message)
        }


    }

    

    /*
    useEffect(() => {
        
        async function getFeature() {

            if (!props.mapLibreFeatureID && !props.featureID) {
                return
            }

            try {

                // Check if there's an associated maplibre_id; if there isn't the ID
                // will have come from the server as the UUID field
                let url = ''

                if (!props.featureID) {
                    url = `/api/feature/point/?featureID=${props.mapLibreFeatureID}&draw=${true}`
                } else {
                    url = `/api/feature/point/?featureID=${props.featureID}&draw=${false}`
                }

                const response = await fetch(url)

                if (!response.ok) {
                    throw new Error(`Response status: ${response.status}`)
                }

                const json = await response.json()

                setFeature(json)
            } 
            catch(error) {
                console.log(error.message)
            }
        }

        getFeature()

    }, [props.featureID, props.mapLibreFeatureID])
    */

    /*if (!loadedFeature) {
        return (
        <div>
            <h3>Instructions</h3>
            <p>Click on a feature to edit it.</p>
            <p>Use the draw controls on the right to add features to the map.</p>
        </div>)
    }*/

    // setFeature(loadedFeature)

    return (
        <div className="flex flex-col gap-4 h-full z-50 relative">
            <h2>
                <input 
                    type="text" 
                    id="name" 
                    value={name} 
                    onChange={handleChange}
                    onBlur={handleChange}
                    placeholder="Untitled"
                    className="input input-sm w-full"
                />
            </h2>
            <div className="collapse collapse-arrow">
                {/*<input type="checkbox" defaultChecked/>*/}
                <input type="radio" name="feature-editor-accordion" />
                    <div className="collapse-title">Appearance</div>
                        <div className="collapse-content">
                            <div className="flex flex-col gap-4">
                            <FeatureThumbnail feature={feature} handleThumbnailChange={handleThumbnailChange} />
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Theme</span>
                                </div>
                                <select className="select select-sm w-full max-w-xs" defaultValue={'Choose...'} onChange={(e) => {
                                    if (e.target.value == 'Add new...') {
                                        
                                        addThemeModalRef.current.show()
                                    }
                                }}>
                                    <option disabled>Choose...</option>
                                    <option>None</option>
                                    <option>Add new...</option>
                                </select>
                            </label>
                            <AddThemeModal ref={addThemeModalRef} />
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Published</span>
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="toggle toggle-sm" 
                                    id="published"
                                    defaultChecked={published}
                                />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Weight</span>
                                </div>
                                <input type="range" min={0} max="100" defaultValue={40} className="range range-sm" />
                            </label>
                        </div>
                </div>
            </div>
            <div className="collapse collapse-arrow">
                {/*<input type="checkbox" />*/}
                <input type="radio" name="feature-editor-accordion" />
                <div className="collapse-title">Tags</div>
                <div className="collapse-content">
                    <TagConfigurator feature={props.feature} />
                </div>
            </div>
            <div className="collapse collapse-arrow">
                {/*<input type="checkbox" />*/}
                <input type="radio" name="feature-editor-accordion" />
                <div className="collapse-title">Content</div>
                <div className="collapse-content">
                    <ContentConfigurator 
                        editorVisible={props.editorVisible}
                        setEditorVisible={props.setEditorVisible}
                        feature={feature}
                        activeDocument={props.activeDocument}
                        setActiveDocument={props.setActiveDocument}
                        activeDocTitle={props.activeDocTitle}
                    />
                </div>
            </div>
            <button className="btn btn-sm btn-warning">Delete</button>
        </div>
    )
}