from flask import Flask, render_template, jsonify
from datetime import datetime, timezone

# Initiate the Flask app instance
app = Flask(__name__)

# Constants
## Vana'Diel Constants
VANA_RATE = 25.0

## Chosen Earth epoch time and date
EARTH_EPOCH_UTC = datetime(2026, 1, 23, 14, 12, 45, tzinfo=timezone.utc)

## Chosen Earth epoch time and date in milliseconds
EARTH_EPOCH_MS = int(EARTH_EPOCH_UTC.timestamp() * 1000)

## Corresponding Vana'Diel epoch and day of the week
VANA_EPOCH_SECONDS = 3 * 3600 + 45 * 60  # 03:45:00
VANA_EPOCH_WEEKDAY_INDEX = 4  # Iceday (Firesday=0)

## Corresponding Vana'Diel date
VANA_EPOCH_YEAR = 1496
VANA_EPOCH_MONTH = 5
VANA_EPOCH_DAY = 5

## Vana'Diel days of the week
VANA_WEEK = [
    ("Firesday", "Fire"),
    ("Earthsday", "Earth"),
    ("Watersday", "Water"),
    ("Windsday", "Wind"),
    ("Iceday", "Ice"),
    ("Lightningday", "Thunder"),
    ("Lightsday", "Light"),
    ("Darksday", "Dark"),
]

# Routes

## Home route
@app.get('/')
def home():
    return render_template('index.html')

## API route for frontend(JS)
@app.get('/api/vanatime')
def api_vanatime():

    # Current time in ms
    server_now_ms = int(datetime.now(timezone.utc).timestamp() * 1000)

    return jsonify({
        "server_now_ms": server_now_ms,
        "vana_rate": VANA_RATE,
        "earth_epoch_ms": EARTH_EPOCH_MS,
        "vana_epoch_seconds": VANA_EPOCH_SECONDS,
        "vana_week": VANA_WEEK,
        "vana_epoch_weekday_index": VANA_EPOCH_WEEKDAY_INDEX,
        "vana_epoch_date": {
            "y": VANA_EPOCH_YEAR,
            "m": VANA_EPOCH_MONTH,
            "d": VANA_EPOCH_DAY,
        }
    })


if __name__ == '__main__':
    app.run(debug=True)