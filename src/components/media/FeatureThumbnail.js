import MediaLibraryModalContent from "./MediaLibraryModalContent"

export default function FeatureThumbnail(props) {

    if (props.feature.properties.popup_image) {
        return (
            <>
            <div className="w-100 relative h-fit">
                <img src={props.feature.properties.popup_image} />
                <button className="btn btn-xs absolute bottom-2 right-2 w-fit h-2"
                onClick={()=>document.getElementById('my_modal_1').showModal()}>Change...</button>
            </div>
            <dialog id="my_modal_1" className="modal">
                <MediaLibraryModalContent projectSlug={props.feature.properties.project}/>
            </dialog>
          </>
        )
    }


    return (
        <label className="form-control w-full max-w-xs">
            <div className="label">
                <span className="label-text">Thumbnail</span>
            </div>
            <input 
                type="file" 
                className="file-input w-full max-w-xs file-input-sm" 
                id="thumbnail"
                onChange={props.handleThumbnailChange} 
            />
        </label>
    )
}