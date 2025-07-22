export function TunerCircle( { size, note, octave}) {
    return (
        <div className="circle-container" style={{
            width: size,
            height: size,
        }}>
            <label className="octave-container">{octave}</label>
            <label className="note-label">{note}</label>
        </div>
    )
}