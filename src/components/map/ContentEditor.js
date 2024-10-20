import Tiptap from "../editor/Tiptap"

export default function ContentEditor(props) {
    
    if (!props.editorVisible) {
        return null
    }

    return (
        <div className="w-full block h-full p-10">
            <Tiptap />
            <button className="btn btn-sm" onClick={(e) => {props.setEditorVisible(false)}}>Close</button>
        </div>
    )

}