import { useState, useEffect } from 'react'
import { socket } from "./utils/utils/"

export function Panel() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isOn, setIsOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log("Tuner Button Panel useEffect Run")
        /* This runs when socket receives connect */
        function onConnect() {
            setIsConnected(true);
            socket.emit('get-status');
            console.log("socket is connected")
        }
        /* This runs when socket receives disconnect */
        function onDisconnect() {
            setIsConnected(false);
            console.log("socket is disconnected")
        }

        function onStatus(data) {
            console.log("Received on status")
            setIsOn(data.status === 'on');
            setIsLoading(false);
        }

        /* When socket receives connect - run onConnect */
        socket.on('connect', onConnect);
        /* When socket receives disconnect - run onDisconnect */
        socket.on('disconnect', onDisconnect);
        /* When socket receives status - run onStatus */
        socket.on('status', onStatus);

        socket.on("connect_error", (err) => {
            console.error("connection error:", err.message);
        });

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('status', onStatus)
        };
    }, []);

    const handleToggle = () => {
        if (!isConnected) return;

        const newStatus = isOn ? 'off' : 'on';
        setIsLoading(true);
        socket.emit('tuner-toggle', {status:newStatus});
        console.log("Handling Toggle")
    }

    return (
        <div className='button-panel'>
            <label className={`connection-status ${isConnected ? 'on' : 'off'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
            </label>
            <button className={`connection-button ${isConnected ? 'on' : 'off'}`} onClick={handleToggle} disabled={!isConnected || isLoading}>
                {isConnected ? isOn ? "On" : "Off" : "Unavailable"}
            </button>
        </div>
    )
}