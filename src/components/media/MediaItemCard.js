export default function MediaItemCard(props) {

    const created = new Date(props.image.created)

    console.log(created)

    return (
        <div className="card card-compact bg-base-100 w-1/4 shadow-sm rounded-sm">
            <figure>
                <img
                src={props.image.file}
                alt="Shoes" />
            </figure>
            <div className="card-body">
                <h3>{props.image.name}</h3>
                <p>Uploaded by {props.image.owner.username} on {created.toDateString()}</p>
                <div className="card-actions justify-end">
                <button className="btn">Choose</button>
                </div>
            </div>
        </div>
    )
}