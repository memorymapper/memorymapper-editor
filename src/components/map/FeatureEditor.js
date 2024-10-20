
'use client'
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import TagConfigurator from "./TagConfigurator"
import { MdModeEdit } from "react-icons/md"
import ContentConfigurator from "./ContentConfigurator"

export default function FeatureEditor(props) {

    if (!props.feature) {
        return (
        <div>
            <h3>Instructions</h3>
            <p>Click on a feature to edit it.</p>
            <p>Use the draw controls on the right to add features to the map.</p>
        </div>)
    }

    const session = useSession()

    const [name, setName] = useState(props.featurename)
    const [theme, setTheme] = useState(props.feature.properties.theme)
    const [weight, setWeight] = useState(props.feature.properties.weight)
    const [published, setPublished] = useState(props.feature.properties.published)

    const [documents, setDocuments] = useState([])

    function handleChange(e) {
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
            default:
                // do nothing
                break
        }    
    }

    useEffect(() => {
        setName(props.featurename)
    }, [props.featurename])

    return (
        <div className="flex flex-col gap-4 h-full">
            <h3>Edit Feature</h3>
            <div className="collapse collapse-arrow">
                <input type="checkbox" defaultChecked/>
                    <div className="collapse-title">Name and Thumbnail</div>
                        <div className="collapse-content">
                            <div className="flex flex-col gap-4">
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Feature Name</span>
                                </div>
                                <input 
                                    type="text" 
                                    id="name" 
                                    value={name} 
                                    onChange={handleChange} 
                                    placeholder="Name"
                                    className="input input-sm w-full max-w-xs"
                                >
                                </input>
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Thumbnail</span>
                                </div>
                                <input 
                                    type="file" 
                                    className="file-input w-full max-w-xs file-input-sm" 
                                    id="thumbnail" 
                                />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Theme</span>
                                </div>
                                <select className="select select-sm w-full max-w-xs">
                                    <option disabled selected>Choose...</option>
                                    <option>Homer</option>
                                    <option>Marge</option>
                                    <option>Bart</option>
                                </select>
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Published</span>
                                </div>
                                <input type="checkbox" className="toggle toggle-sm" defaultChecked />
                            </label>
                            <label className="form-control w-full max-w-xs">
                                <div className="label">
                                    <span className="label-text">Size</span>
                                </div>
                                <input type="range" min={0} max="100" value={40} className="range range-sm" />
                            </label>
                        </div>
                </div>
            </div>
            <div className="collapse collapse-arrow">
                <input type="checkbox" />
                <div className="collapse-title">Tags</div>
                <div className="collapse-content">
                    <TagConfigurator feature={props.feature} />
                </div>
            </div>
            <div className="collapse collapse-arrow">
                <input type="checkbox" />
                <div className="collapse-title">Content</div>
                <div className="collapse-content">
                    <ContentConfigurator 
                        editorVisible={props.editorVisible}
                        setEditorVisible={props.setEditorVisible}
                        documents={documents}
                        setDocuments={setDocuments}
                    />
                </div>
            </div>
            <button className="btn btn-sm btn-primary" onClick={async () => {
                                
                try {
                    const url = `/api/feature/point/`
                    
                    const data = {
                        id: props.feature.id,
                        name: name,
                        project: props.projectslug,
                        mapconfig: props.mapslug,
                        geom: props.feature.geometry,
                        weight: weight,
                        published: published,
                        theme: theme
                    }

                    const response = await fetch(url, {
                        method: 'PUT',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${session.data.user.accessToken}`
                        },
                        body: JSON.stringify(data)
                    })

                    if (!response.ok) {
                        throw new Error(`Response status: ${response.status}`)
                    }

                    const json = await response.json()

                } 
                catch(error) {
                    console.log(error.message)
                }

            }}>Save</button>
            <button className="btn btn-sm btn-warning">Delete</button>
        </div>
    )
}