from flask import Flask, request
from flask_restful import reqparse, abort, Api, Resource
from image_analyzer import ImageAnalyzer
from threading import Thread
import os

UPLOAD_FOLDER = 'files'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
api = Api(app)

TODOS = {
    'task': 'Analyze images. Input is an image file and output is json-like with raw data. Usage: curl -i -F "image=@<full_image_path>" yenthenas.ddns.net:5000'
}

parser = reqparse.RequestParser()
parser.add_argument('task')

class Analyze(Resource):
    def __init__(self) -> None:
        super().__init__()
        self.analyzer = ImageAnalyzer(
            zeroshot_classifier_model_name_or_path="openai/clip-vit-large-patch14",
            zeroshot_detection_model_name_or_path="IDEA-Research/grounding-dino-base",
            carton_box_detector_path="weights/carton_box_detector/best.pt",
            device='auto'
        )

    def get(self):
        return TODOS
    
    def post(self):
        file = request.files.to_dict()['image']
        filename = os.path.join(
            app.config['UPLOAD_FOLDER'],
            f"image.{file.filename.split('.')[-1]}"
        )
        file.save(filename)
        # return request.form
        # image_folder_path = app.config['UPLOAD_FOLDER']


        return_output = self.analyzer.run(filename)
        os.remove(filename)

        return return_output

def analyze_task(event_name, *kwargs):
    print(event_name)
    return None


api.add_resource(Analyze, '/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)