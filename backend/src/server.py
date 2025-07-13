from flask import Flask
from flask_socketio import SocketIO, emit
import tuner

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True, async_mode="threading") # Allows all origins for testing

tuner_state = 'off'

@app.route('/')
def index():
    return "SocketIO server running"

@socketio.on("connect")
def handle_connect():
    print("Client connected")
    tuner.set_socketio(socketio)
    emit("status", {"status": tuner_state})

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected")

@socketio.on("get-status")
def handle_get_status():
    emit("status", {"status": tuner_state})

@socketio.on("tuner-toggle")
def handle_tuner_toggle(data):
    global tuner_state
    new_status = data.get("status")

    if new_status == "on" and tuner_state == "off":
        tuner.start()  # Call the function to activate tuner
        tuner_state = "on"

    elif new_status == "off" and tuner_state == "on":
        tuner.stop()  # Call the function to deactivate tuner
        tuner_state = "off"

    print(f"Tuner = {tuner_state}")
    emit("status", {"status": tuner_state}, broadcast=True)  # Notify all client 

print("Server on")

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, use_reloader=False, )