'use client'
import { useEffect, useState, useRef } from 'react'
import 'react-quill/dist/quill.snow.css'
import ReactQuill from 'react-quill'
import InsertImage from '@/components/media/InsertImage'
import Tiptap from '@/components/editor/Tiptap'


export default function Page() {
    
    const [insertImageOpen, setInsertImageOpen] = useState(false)

    return  (
        <div className='w-full min-h-80'>
            <InsertImage open={insertImageOpen} setOpen={setInsertImageOpen} />
            <Tiptap />
        </div>
    )
}
