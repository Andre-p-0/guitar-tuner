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
        upOpacity: 0,
        downOpacity: 0
    })

    useEffect(() => {
        function handleNoteData(data) {
            const newState = {
                note: data.note,
                octave: data.octave,
                upOpacity: data["up-opacity"],
                downOpacity: data["down-opacity"]
            };
            setNoteData(newState);
            console.info("UpOpacity: " + newState.upOpacity + "\nDownOpacity: " + newState.downOpacity);
        }
    
        socket.on("note-data", handleNoteData);

        socket.onAny((event, ...args) => {
            console.log("Socket event received:", event, args);
        });
    
        return () => {
            socket.off("note-data", handleNoteData);
        };
    }, []);

    return (
        <div className="tuner-container">
            <TuneArrows image={greenArrow} opacity={noteData.upOpacity}/>
            <TunerCircle note={noteData.note} octave={noteData.octave} size="300px"/>
            <TuneArrows image={redArrow} opacity={noteData.downOpacity}/>
        </div>
    )
}