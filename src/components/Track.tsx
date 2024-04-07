import './Track.css'
type TProps = {
    name: string;
    singer: string;
    onClick: VoidFunction;
}
export const Track = (props: TProps) => {

    return (
        <>
            <div className="track" onClick={props.onClick}>
                <p className="name">{props.singer} | {props.name}</p>
            </div>
        </>
    )
}