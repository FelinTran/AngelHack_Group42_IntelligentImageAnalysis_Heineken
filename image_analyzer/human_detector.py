from .engine import *
from .logger import *
from pprint import pprint
from ultralytics import YOLOv10

class HumanDetector:
    def __init__(
        self, 
        engine: Engine,
        conf_threshold = 0.6
    ) -> None:
        self.engine = engine
        self.conf_threshold = conf_threshold
        self.human_detector = YOLOv10.from_pretrained(f'jameslahm/yolov10x')

    def run(self):
        # human_detection = self.engine.detect("person")
        result = self.human_detector.predict(
            self.engine.input_image,
            imgsz=self.engine.input_image.size,
            conf=self.conf_threshold,
            device=self.engine.device,
            classes=[0],
            verbose=False,
            save=False
        )[0]
        human_output = result.boxes.xyxy.cpu().tolist()
        # print(len(human_output))
        return_output = {}
        for idx, box in enumerate(human_output):
            im = self.engine.input_image.crop(box)
            gender = self.engine.classify(
                labels=['male', 'female'],
                input_image=im
            )
            action = self.engine.classify(
                labels=['eating', 'drinking', 'smiling', 'talking', 'shopping', 'undefined'],
                input_image=im
            )
            emotion = self.engine.classify(
                labels=['happy', 'angry', 'enjoy', 'relax', 'neutral', 'undefined'],
                input_image=im
            )
            role = self.engine.classify(
                labels=['drinker', 'promotion girl', 'seller', 'buyer'],
                input_image=im
            )
            return_output[idx] = {
                'loc': {
                    'x1': int(box[0]),
                    'y1': int(box[1]),
                    'x2': int(box[2]),
                    'y2': int(box[3]),
                    
                },
                # 'gender': list(gender.keys())[0],
                # 'action': list(action.keys())[0],
                # 'emotion': list(emotion.keys())[0],
                # 'role': list(role.keys())[0]
                'gender': gender,
                'action': action,
                'emotion': emotion,
                'role': role
            }
        return return_output



if __name__ == "__main__":
    engine = Engine(
        zeroshot_classifier_model_name_or_path="openai/clip-vit-large-patch14",
        zeroshot_detection_model_name_or_path="IDEA-Research/grounding-dino-base",
        device='auto'
    )

    human_detector = HumanDetector(engine)

    engine.load_image('/home/yuuhanase/workspace/hackhcmc/hackhcmc_dataset/66506043_1706721284039.jpg')

    output = human_detector.run()
    pprint(output)