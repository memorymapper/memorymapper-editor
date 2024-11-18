import MediaItemCard from "./MediaItemCard"
import useImages from "@/swrrequests/useImages"


export default function MediaLibraryModalContent(props) {

    const {images, isLoading, isError} = useImages(props.projectSlug)

    if (isLoading) return <p>Loading...</p>

    if (isError) return <p>Error...</p>

    console.log(images)

    return (
        <div className="modal-box max-w-full max-h-full">
            <h3 className="font-bold text-lg">Image Library</h3>
            <div className="flex">
                {images ? images.map((i) => <MediaItemCard image={i} key={i.id} />) : null}

            </div>
            <div className="modal-action">
            <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
            </form>
            </div>
        </div>
    )
}