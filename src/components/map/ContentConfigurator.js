"use client"
import { MdModeEdit, MdDragIndicator, MdAddCircleOutline } from "react-icons/md"
import { useState, useEffect } from "react"

import {
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
  } from '@dnd-kit/core'
  import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
  } from '@dnd-kit/sortable'

import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

export default function ContentConfigurator(props) {

    const [documents, setDocuments] = useState([])

    async function handleClick(e) {

        const doc = {
            'title': '',
            'body': '',
            'point': props.feature.id,
            'order': documents.length
        }

        const url = '/api/entry/'

        const resp = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(doc)
        })
        
        const data = await resp.json()

        setDocuments([...documents, data])
    }

    async function handleDragEnd(event) {

        const {active, over} = event
        
        if (active.id !== over.id) {
            const oldIndex = documents.findIndex((item) => item.id === active.id)
            const newIndex = documents.findIndex((item) => item.id === over?.id)
            const newDocuments = arrayMove(documents, oldIndex, newIndex)
            // Update the array order so it's reflected in the UI
            setDocuments(newDocuments)

            async function updateOrder(doc, index) {
                // Function to update server side
                try {
                    const url = `/api/entry/${doc.id}/`
                    
                    const resp = await fetch(url, {
                        method: 'PUT',
                        body: JSON.stringify({
                            'id': doc.id,
                            'title': doc.title,
                            'point': props.point,
                            'order': index
                        })
                    })


                } catch (error) {
                    console.log(error)
                }
            }

            // Update server side...
            newDocuments.forEach(async (doc, index) => {
                updateOrder(doc, index)
            })
        }

    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    useEffect(()=> {

        async function getDocuments() {

            try {
                const url = `/api/entry/?feature=${props.feature.id}`

                const response = await fetch(url)

                const json = await response.json()

                setDocuments(json)
            } 
            
            catch (error) {
                console.log(error)
            }

        }

        getDocuments()

    }, [props.feature])

    return (
        <div className="flex flex-col gap-4">
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext 
                    items={documents}
                    strategy={verticalListSortingStrategy}
                >
                { documents ? documents.map((doc) => <ContentWidget title={doc.title} slug={doc.slug} id={doc.id} key={doc.id} point={props.feature.id} setActiveDocument={props.setActiveDocument} activeDocument={props.activeDocument} activeDocTitle={props.activeDocTitle}/>) : null }
                </SortableContext>
            </DndContext>
            <button className="btn bg-base-100 btn-small rounded-full w-12 h-12 p-0 self-center" onClick={handleClick}>
                <MdAddCircleOutline />
            </button>
        </div>
    )
}


function ContentWidget(props) {

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id})

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    async function handleClick(e) {
        props.setActiveDocument(props.id)
    }

    

    return (
        
        <div className="bg-base-100 w-100 shadow p-2 rounded-sm flex flex-row justify-between" style={style} >
            <div ref={setNodeRef} {...attributes} {...listeners}>
            <MdDragIndicator />
            </div>
            <span className="text-sm">{props.title ? props.title : 'Untitled'}</span>
            <button onClick={handleClick}><MdModeEdit /></button>
        </div>
        
    )
}