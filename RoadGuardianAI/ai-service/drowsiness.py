import cv2
import requests

API_SAFE = "http://127.0.0.1:9000/set-safe"
API_DROWSY = "http://127.0.0.1:9000/set-drowsy"

face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Camera not opening. Check camera permission.")
    exit()

while True:
    success, frame = cap.read()

    if not success:
        print("Frame not received.")
        break

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5
    )

    if len(faces) > 0:
        status = "SAFE"

        try:
            requests.get(API_SAFE)
        except:
            print("Driver API not running on port 9000")

        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 3)
            cv2.putText(
                frame,
                "DRIVER ACTIVE",
                (x, y - 10),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 255, 0),
                2
            )

    else:
        status = "DROWSY"

        try:
            requests.get(API_DROWSY)
        except:
            print("Driver API not running on port 9000")

        cv2.putText(
            frame,
            "DROWSINESS ALERT!",
            (40, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            1.2,
            (0, 0, 255),
            3
        )

    cv2.putText(
        frame,
        f"Status: {status}",
        (40, 130),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (255, 255, 255),
        2
    )

    cv2.imshow("RoadSoS Drowsiness Detection", frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()