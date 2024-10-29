import Tiptap from "../editor/Tiptap"

export default function ContentEditor(props) {
    
    return (
        <div className={`${!props.activeDocument ? 'hidden' : null} w-full block h-full p-10`}>
            <Tiptap 
                activeDocument={props.activeDocument} 
                setActiveDocTitle={props.setActiveDocTitle} 
                setActiveDocument={props.setActiveDocument}
            />
            <button className="btn btn-sm" onClick={(e) => {props.setActiveDocument(null)}}>Close</button>
        </div>
    )

}