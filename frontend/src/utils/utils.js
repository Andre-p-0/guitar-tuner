import io from "socket.io-client";

export const socket = io("http://host.docker.internal:5000", {transports: ["websocket"]})