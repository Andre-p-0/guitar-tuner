import greenArrow from "./Assets/greenArrow.png"
import redArrow from "./Assets/redArrow.png"
import { TunerCircle } from "./TunerCircle"
import { TuneArrows } from "./TuneArrows"
import { socket } from "./utils/utils"
import { useState, useEffect } from 'react'

export function Tuner() {
    const [noteData, setNoteData] = useState({
        note: '',
        octave: 0,
        upTransparency: 0,
        downTransparency: 0
    })

    useEffect(() => {
        function handleNoteData(data) {
            setNoteData({
                note: data.note,
                octave: data.octave,
                upTransparency: data["up-transparency"],
                downTransparency: data["down-transparency"]
            });
        }
    
        socket.on("note-data", handleNoteData);
    
        return () => {
            socket.off("note-data", handleNoteData);
        };
    }, []);

    return (
        <div className="tuner-container">
            <TuneArrows image={greenArrow} transparency={noteData.upTransparency}/>
            <TunerCircle note={noteData.note} octave={noteData.octave} size="300px"/>
            <TuneArrows image={redArrow} transparency={noteData.downTransparency}/>
        </div>
    )
}