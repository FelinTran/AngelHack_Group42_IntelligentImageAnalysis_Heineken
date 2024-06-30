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
        cache_path = 'cache'
        cache_file = os.listdir(cache_path)
        if len(cache_file) == 2:
            print("Cache image is founded")
            filename = os.path.join(
                cache_path,
                cache_file[0]
            )
            return_output = self.analyzer.run(filename)
            print("Finish analyze, remove cache image")
            os.remove(filename)

            return return_output
        elif len(cache_file) > 2:
            return abort(500, message="multiple cache image")
        elif len(cache_file) == 1:
            return abort(500, message="no cache image is founded")

    def post(self):
        filename = request.form.get('image')
        # file = request.files.to_dict()['image']
        # filename = os.path.join(
        #     app.config['UPLOAD_FOLDER'],
        #     f"image.{file.filename.split('.')[-1]}"
        # )
        # file.save(filename)
        print("#####", filename)
        return_output = self.analyzer.run(filename)
        # os.remove(filename)

        return return_output



api.add_resource(Analyze, '/')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port='3000')