'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import { useEffect, useState } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import InsertImage from '@/components/media/InsertImage'

// Toolbar icons

import Bold from '/src/img/icons/bold.svg'
import Italic from '/src/img/icons/italic.svg'
import Clear from '/src/img/icons/clear-formatting.svg'
import Paragraph from '/src/img/icons/pilcrow.svg'
import H1 from '/src/img/icons/h-1.svg'
import H2 from '/src/img/icons/h-2.svg'
import H3 from '/src/img/icons/h-3.svg'
import BulletList from '/src/img/icons/list.svg'
import NumberList from '/src/img/icons/list-numbers.svg'
import BlockQuote from '/src/img/icons/blockquote.svg'
import Photo from '/src/img/icons/photo.svg'
import Audio from '/src/img/icons/music.svg'
import Movie from '/src/img/icons/movie.svg'
import Undo from '/src/img/icons/arrow-back.svg'
import Redo from '/src/img/icons/arrow-forward.svg'
import { document } from 'postcss'
import useDocument from '@/swrrequests/useDocument'


export default function Tiptap(props) {

    const {document, loading, error} = useDocument(props.activeDocument)

    const [htmlContent, setHtmlContent] = useState('')
    const [title, setTitle] = useState('')

    const [insertImageOpen, setInsertImageOpen] = useState(false)

    function onTitleChange(e) {
        setTitle(e.target.value)
        props.setActiveDocTitle(e.target.value)
        saveUpdateDocument()
    }

    const editor = useEditor({
        extensions: [StarterKit],
        content: htmlContent,
        onUpdate: ({editor}) => {
            const html = editor.getHTML()
            setHtmlContent(document? document.body : html)
        },
        editorProps: {
            attributes: {
                class: 'ring-1 ring-inset ring-gray-100 focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-400 min-h-80 mb-2 text-sm rounded-sm py-1.5 px-1.5'
            }
        }
    })

    useEffect(() => {
        setHtmlContent(document ? document.body : null)
        setTitle(document ? document.title : null)
        if (editor) {
            editor.commands.setContent(document ? document.body : null)
        }
    }, [props.activeDocument])

    /*useEffect(() => {

        if (!props.activeDocument) {
            return
        }

        async function getDocument() {
            try {
                const url = `/api/entry/${props.activeDocument}/`
                const resp = await fetch(url)

                const json = await resp.json()

                setHtmlContent(json.body)
                setTitle(json.title)
                editor.commands.setContent(json.body)
            } catch (error) {
                console.log(error)
            }
        }
        getDocument()
    }, [props.activeDocument])*/

    


    async function saveUpdateDocument() {
        try {
            const url = `/api/entry/${props.activeDocument}/`
            const response = await fetch(url, {
                method: 'PUT',
                body: JSON.stringify({
                    id: props.activeDocument,
                    title: title,
                    body: htmlContent,
                })
            })
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }
            const json = await response.json()
        } catch(error) {
            console.error(error.message)
        }
    }

    if (!editor) {
        return null
    }

    if (!props.activeDocument) {
        return null
    }

    if (loading) {
        return <p>Loading...</p>
    }

    if (error) {
        return <p>Error...</p>
    }

   
    return ( 
        <>
            <InsertImage open={insertImageOpen} setOpen={setInsertImageOpen} />
            <div className="my-2">
                <input
                    type="text"
                    name="title"
                    id="title"
                    className={"block w-full rounded-sm border-0 p-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"}
                    placeholder='Title'
                    onChange={onTitleChange}
                    onBlur={onTitleChange}
                    defaultValue={document ? document.title : document}
                />
            </div>
            <div className='editor-toolbar mb-2'>
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={editor.isActive("paragraph") ? "is-active" : null}
                    >
                    <Image priority src={Paragraph} alt="paragraph"  className="mx-0 h-4 w-4" />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "is-active" : null}
                >
                    <Image priority src={Bold} alt="bold" className="mx-0 h-4 w-4" />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "is-active" : null}
                >
                    <Image priority src={Italic} alt="italic"  className="mx-0 h-4 w-4" />
                </button>
                {/*<button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "is-active" : ""}
                >
                strike
                </button>*/}
                <button onClick={() => editor.chain().focus().clearNodes().run()}
                >
                    <Image priority src={Clear} alt="clear" className="mx-0 h-4 w-4" />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive("heading", { level: 1 }) ? "is-active" : null}
                >
                    <Image priority src={H1} alt="H1"  className="mx-0 h-4 w-4" />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive("heading", { level: 2 }) ? "is-active" : null}
                >
                    <Image priority src={H2} alt="H2"  className="mx-0 h- w-4" />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive("heading", { level: 3 }) ? "is-active" : null}
                >
                    <Image priority src={H3} alt="H1"  className="mx-0 h-4 w-4" />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "is-active" : ""}
                >
                    <Image priority src={BulletList} alt="H1"  className="mx-0 h-4 w-4" />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "is-active" : ""}
                >
                    <Image priority src={NumberList} alt="H1"  className="mx-0 h-4 w-4" />
                </button>
                <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "is-active" : ""}
                >
                    <Image priority src={BlockQuote} alt="H1"  className="mx-0 h-4 w-4" />
                </button>
                <button onClick={() => editor.chain().focus().undo().run()}>
                    <Image priority src={Undo} alt="H1"  className="mx-0 h-4 w-4" />
                </button>
                <button onClick={() => editor.chain().focus().redo().run()}>
                    <Image priority src={Redo} alt="H1"  className="mx-0 h-4 w-4" />
                </button>
            </div>
            <div>
                <EditorContent editor={editor} />
                {/*<input type='submit' className="rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2" value='Save' />*/}
                {<button
                    type="button"
                    className="rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2"
                    onClick={saveUpdateDocument}
                    >Save
                </button>
                }
                {/*
                <button
                    type="button"
                    className="rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2"
                    onClick={saveUpdateDocument}
                >
                    Publish
                </button>
                <button
                    type="button"
                    className="rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={saveUpdateDocument}
                >
                    Delete
                </button>*/}
                <button className="btn btn-sm" onClick={(e) => {
                        setHtmlContent("")
                        setTitle(null)
                        props.setActiveDocument(null)
                    }
                }>Close</button>
            </div>
        </>
    )
}
