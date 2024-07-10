from .engine import Engine
import sys
import yolov7
sys.path.insert(0, './yolov7')

class CartonDetector:
    def __init__(
        self,
        engine: Engine,
        weights: str = '../weights/carton_box_detector/best.pt',
        half = True,
        conf = 0.25,
        iou = 0.45
    ) -> None:
        self.engine = engine
        self.detector = yolov7.load(
            weights,
            device=self.engine.device,
            half=half
        )

        # set model parameters
        self.detector.conf = conf  # NMS confidence threshold
        self.detector.iou = iou  # NMS IoU threshold
        self.detector.classes = None  # (optional list) filter by class

    def run(self):
        results = self.detector(self.engine.input_image)
        boxes = results.pred[0][:,:4]

        return boxes.tolist()
    

if __name__ == '__main__':
    engine = Engine(
        zeroshot_classifier_model_name_or_path="openai/clip-vit-large-patch14",
        zeroshot_detection_model_name_or_path="IDEA-Research/grounding-dino-base",
        device='auto'
    )
    engine.load_image('/home/yuuhanase/workspace/hackhcmc/hackhcmc_dataset/66506043_1706721284039.jpg')

    detector = CartonDetector(engine)
    print(detector.run())