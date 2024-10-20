import { MdOutlinePolyline, MdOutlineLocationOn, MdOutlineSquare, MdAdsClick, MdOutlineSettings } from "react-icons/md"

export default function DrawModeSelector(props) {

    function handleClick(e) {
        if (!e.target.dataset.drawmode) {
            console.log(e.target.dataset)
            return
        }
        props.setDrawMode(e.target.dataset.drawmode)
    }

    const classNames = {
        'activated': 'h-8 w-8 py-1 bg-gray-100 border border-gray-50',
        'deactivated': 'h-8 w-8 py-1 bg-white'
    }


    return (
        <div className="bg-white top-3 right-3 absolute z-20 rounded p-px">
            <MdOutlineSettings className={classNames.deactivated} />
            <MdOutlineLocationOn className={props.drawMode == 'draw_point' ? classNames.activated : classNames.deactivated } data-drawmode="draw_point" onClick={handleClick} />
            <MdOutlineSquare className={props.drawMode == 'draw_polygon' ? classNames.activated : classNames.deactivated } data-drawmode="draw_polygon" onClick={handleClick} />
            <MdOutlinePolyline className={props.drawMode == 'draw_line_string' ? classNames.activated : classNames.deactivated } data-drawmode="draw_line_string" onClick={handleClick} />
            <MdAdsClick className={props.drawMode == 'simple_select' ? classNames.activated : classNames.deactivated } data-drawmode="simple_select" onClick={handleClick} />
        </div>
    )
}