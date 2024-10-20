"use client"
import { MdModeEdit } from "react-icons/md"
import { MdAddCircleOutline } from "react-icons/md"
import { useState } from "react"

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


const docList = [
    {'id': 1, 'title': 'this'},
    {'id': 2, 'title': 'that'},
    {'id': 3, 'title': 'the other'},
]

export default function ContentConfigurator(props) {

    function handleClick(e) {
        props.setDocuments([...props.documents, {'title': null, 'slug': 'null'}])
    }

    const [items, setItems] = useState(docList)

    function handleDragEnd(event) {

        const {active, over} = event
        
        if (active.id !== over.id) {
          setItems((items) => {
            const oldIndex = items.findIndex((item) => item.id === active.id)
            const newIndex = items.findIndex((item) => item.id === over?.id)
            return arrayMove(items, oldIndex, newIndex)
          });
        }
    }

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    return (
        <div className="flex flex-col gap-4">
            <DndContext 
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext 
                    items={items}
                    strategy={verticalListSortingStrategy}
                >
                { items ? items.map((doc) => <ContentWidget title={doc.title} slug={doc.slug} id={doc.id} key={doc.id} />) : null }
                </SortableContext>
            </DndContext>
            <button 
                className="btn bg-base-100 btn-small rounded-full w-12 h-12 p-0 self-center"
                onClick={(e) => {props.setEditorVisible(true)}}
                >
                    <MdAddCircleOutline onClick={handleClick}/>
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

    return (
        
        <div className="bg-base-100 w-100 shadow p-2 rounded-sm flex flex-row justify-between" style={style} ref={setNodeRef} {...attributes} {...listeners}>
            <span>{props.id}</span>
            <MdModeEdit />
        </div>
        
    )
}