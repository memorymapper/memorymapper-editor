'use client'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

export default function ProjectConfigurator(props) {

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    async function saveProject(data) {
        const url = process.env.NEXT_PUBLIC_API_ENDPOINT + 'projects/create/'

        console.log(props.userToken)

        try {
            const body = JSON.stringify({
                'title': data.title,
                'owner': props.userId,
                'maps': []
            })
            console.log(body)
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${props.userToken}`
                },
                body: body
            })

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`)
            }

            const json = await response.json()

            router.push(`/projects/${json.slug}/`)

        } catch(error) {
            console.error(error.message)
        }
    }

    const onSubmit = (data) => {
        saveProject(data)
    }

    return (
        <div className='w-full flex flex-col'>
            <div className='w-full'>
                <h1>New Project</h1>
            </div>
            <div className='w-full'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="my-2">
                        <input
                            type="text"
                            name="title"
                            id="title"
                            {...register("title", { required: "Title is required" })}
                            placeholder='Title'
                            aria-invalid={errors.title ? "true" : "false"}
                        />
                        <input type='submit' className="rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mr-2" value='Save' />
                    </div>
                </form>
            </div>
        </div>
    )
}