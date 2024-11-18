import { forwardRef } from "react"

export const AddThemeModal = forwardRef(function AddThemeModal(props, ref) {
    const { label, ...otherProps } = props
    return (
        <dialog id="new-theme-modal" className="modal" ref={ref}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">Press ESC key or click the button below to close</p>
                <div className="modal-action">
                <form method="dialog">
                    {/* if there is a button in form, it will close the modal */}
                    <button className="btn">Close</button>
                </form>
                </div>
            </div>
        </dialog>
    )
})

