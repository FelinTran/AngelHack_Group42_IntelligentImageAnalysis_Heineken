from flask import Flask, jsonify
import queue
import threading
import requests

app = Flask(__name__)

global data
global Img_id

with open("./demo_data.json", "r") as f:
    data = f.read()
Img_id = queue.Queue()


def send_data(img_id, data=data):
    
    #* Send the new Analyzed data to the ExpressJS server: {img_id, analyze}

    new_data = jsonify({'img_id': img_id, 'analyze': data})

    try:
        # Sending POST request to localhost:3000
        response = requests.post(
            'http://localhost:3000/upload/analyze', json=new_data)

        # Check if the request was successful
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.RequestException as e:
        return e


def worker():
    while True:
        if Img_id.empty():
            continue
        
        img_id = Img_id.get(block=True, timeout=10000)
        # * Call the model to analyze the image

        if (img_id):
            send_data(img_id, data)

        Img_id.task_done()


t = threading.Thread(target=worker)


@app.route('/')
def home():
    return "Welcome to the Home Page!"


@app.route('/push/<img_id>')
def push_img(img_id):
    img_id.put(item=img_id, block=True, timeout=10000)


@app.route('/analyze/<img_id>')
def analyze_img(img_id):
    return jsonify(data)


if __name__ == '__main__':
    t.start()
    app.run(debug=True)
    t.join()
