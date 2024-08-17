import Tiptap from '@/components/editor/Tiptap'
import { cookies } from 'next/headers'

async function getDocument(slug) {
    const url = `http://192.168.79.2:8000/api/1.0/documents/${slug}`

    try {
        const response = await fetch(url)
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }
        const json = await response.json()
        return json
    } catch(error) {
        console.log(error)
    }
}

export default async function Page({params}) {

    const doc = await getDocument(params.slug)
    const userToken = cookies().get('userToken').value

    return  (
        <div className='w-full min-h-80'>
            <Tiptap 
                title={doc.title} 
                content={doc.body} 
                documentId={doc.id} 
                slug={params.slug}
                userToken={userToken}
            />
        </div>
    )
}
