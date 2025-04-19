export function TuneArrows( { image, transparency }) {
    return (
        <img src={image} style={{ transparency:{transparency} }}/>
    )
}