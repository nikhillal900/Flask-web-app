from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
from db import init_db
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
DB_PATH = os.getenv("DATABASE_URL", "sqlite:///users.db").replace("sqlite:///", "")
PORT = int(os.getenv("PORT", 5000))
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")

init_db()  # ensure database exists

# Tell Flask where frontend files are
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../frontend')

app = Flask(__name__, static_folder=FRONTEND_DIR)
app.config['SECRET_KEY'] = SECRET_KEY
CORS(app)

def query_db(query, args=(), one=False):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(query, args)
    conn.commit()
    r = c.fetchall()
    conn.close()
    return (r[0] if r else None) if one else r

# -------- Serve frontend --------
@app.route('/')
def serve_index():
    return send_from_directory(FRONTEND_DIR, 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory(FRONTEND_DIR, path)

# -------- API endpoints --------
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    try:
        query_db('INSERT INTO users (username, password) VALUES (?, ?)', (username, password))
        return jsonify({"status": "success"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"status": "error", "message": "Username already exists"}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    user = query_db('SELECT * FROM users WHERE username=? AND password=?', (username, password), one=True)
    if user:
        return jsonify({"status": "success"}), 200
    else:
        return jsonify({"status": "error", "message": "Invalid credentials"}), 401

@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    username = data.get('username')
    message = data.get('message')
    query_db('INSERT INTO thoughts (username, message) VALUES (?, ?)', (username, message))
    return jsonify({"status": "success"}), 201

@app.route('/thoughts', methods=['GET'])
def thoughts():
    thoughts = query_db('SELECT username, message FROM thoughts')
    return jsonify(thoughts), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=PORT, debug=os.getenv("FLASK_DEBUG")=="True")
