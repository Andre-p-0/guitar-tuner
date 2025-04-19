import { useState, useEffect } from 'react'
import { socket } from "./utils/utils/"

export function Panel() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isOn, setIsOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        /* This runs when socket receives connect */
        function onConnect() {
            setIsConnected(true);
            socket.emit('get-status');
            console.log("connected")
        }
        /* This runs when socket receives disconnect */
        function onDisconnect() {
            setIsConnected(false);
        }

        socket.on("connect_error", (err) => {
            console.error("connection error:", err.message);
        });

        function onStatus(data) {
            setIsOn(data.status === 'on');
            setIsLoading(false);
        }

        /* When socket receives connect run onConnect */
        socket.on('connect', onConnect);
        /* When socket receives connect run onDisconnect */
        socket.on('disconnect', onDisconnect);
        socket.on('status', onStatus);

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
    }

    return (
        <div>
            <label className={`connection-status ${isConnected ? 'on' : 'off'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
                </label>
            <button className={`connection-button ${isConnected ? 'on' : 'off'}`} onClick={handleToggle} disabled={!isConnected || isLoading}>
                {isConnected ? 'Please Wait...' : isOn ? 'Turn Off' : 'Turn On'}
            </button>
        </div>
    )
}