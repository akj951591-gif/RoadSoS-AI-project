from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

driver_status = {"status": "SAFE"}

@app.route("/")
def home():
    return jsonify({"message": "RoadSoS Driver API Running"})

@app.route("/driver-status")
def get_driver_status():
    return jsonify(driver_status)

@app.route("/set-safe")
def set_safe():
    driver_status["status"] = "SAFE"
    return jsonify(driver_status)

@app.route("/set-drowsy")
def set_drowsy():
    driver_status["status"] = "DROWSY"
    return jsonify(driver_status)

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=9000, debug=True)