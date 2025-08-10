import greenArrow from "../Assets/greenArrow.png"
import redArrow from "../Assets/redArrow.png"
import { TunerCircle } from "./TunerCircle"
import { socket } from "../utils/utils"
import { useState, useEffect } from 'react'

export function Tuner() {
    const [noteData, setNoteData] = useState({
        note: '',
        octave: 0,
        upOpacity: 0,
        downOpacity: 0
    })
    const [tuneState, setTuneState] = useState("off")

    useEffect(() => {
        function handleNoteData(data) {
            console.log("Handling note data")
            const newState = {
                note: data.note,
                octave: data.octave,
                upOpacity: data["up-opacity"],
                downOpacity: data["down-opacity"]
            };
            setNoteData(newState);
            if (data["up-opacity"] == 0 && data["down-opacity"] == 0) {
                setTuneState("in-tune")
            }
            else {
                setTuneState("out-tune")
            }
        }

        function onStatus(data) {
            if (data.status === "off") {
                console.log("Clearing Tuner")
                setNoteData({
                    "note": "",
                    "octave": "",
                    "upOpacity": 0,
                    "downOpacity": 0
                })
                setTuneState("off")
            }
        }
    
        socket.on("note-data", handleNoteData);

        socket.on("status", onStatus)
    
        return () => {
            socket.off("note-data", handleNoteData);
        };
    }, []);

    return (
        <div className="tuner-container">
            <div className="tuner-bg">
                <img src={greenArrow} style={{ opacity: noteData.upOpacity }} height={150}/>
                <TunerCircle tuneState={tuneState} note={noteData.note} octave={noteData.octave}/>
                <img src={redArrow} style={{ opacity: noteData.downOpacity }} height={150}/>
            </div>
        </div>
    )
}