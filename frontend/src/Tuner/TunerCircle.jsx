export function TunerCircle( { tuneState, note, octave}) {
    return (
        <div className={`circle-container ${tuneState}`} style={{
            width: 300,
            height: 300,
        }}>
            <label className="octave-container">{octave}</label>
            <label className="note-label">{note}</label>
        </div>
    )
}