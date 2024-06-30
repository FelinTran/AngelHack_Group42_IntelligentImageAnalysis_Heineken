from .engine import Engine
# from .logger import *
from .carton_detector import CartonDetector
from pprint import pprint

class ProductDetector:
    def __init__(
        self, 
        engine,
        carton_box_detector_path = '/home/yuuhanase/workspace/hackhcmc/draft_hackhcmc/weights/carton_box_detector/best.pt'
    ) -> None:
        self.engine = engine
        
        self.carton_box_detector = CartonDetector(
            self.engine,
            carton_box_detector_path
        )

        self.product = [
            'beer crate.',
            'beer bottle.',
            'beer canned.',
            # 'canned beer.',
            # 'bottle.',
            'canned.',
            'crate.',
        ]
        self.brand = [
            'bivina',
            'bia viet',
            'heineken',
            'tiger',
            'larue',
            'strongbow',
            'edelweiss',
            'coke',
            'water',
            'undefined'
        ]
    
    def run(self):
        return_output = {}
        idx = 0
        carton_boxes = self.carton_box_detector.run()
        for carton_box in carton_boxes:
            im = self.engine.input_image.crop(carton_box)
            brand = self.engine.classify(
                labels=self.brand,
                input_image=im
            )
            return_output[idx] = {}
            return_output[idx]['brand'] = brand
            return_output[idx]['label'] = 'carton box'
            return_output[idx]['loc'] = {
                "x1": int(carton_box[0]),
                "y1": int(carton_box[1]),
                "x2": int(carton_box[2]),
                "y2": int(carton_box[3])
            }
            idx += 1

        for product in self.product:
            output = self.engine.detect(product)
            if output:
                for key in output:
                    box = list(output[key]['loc'].values())
                    im = self.engine.input_image.crop(box)
                    brand = self.engine.classify(
                        labels=self.brand,
                        input_image=im
                    )
                    # output[key]['brand'] = list(brand.keys())[0]
                    output[key]['brand'] = brand
                    return_output[idx] = output[key]
                    idx += 1

        return return_output
    
if __name__ == "__main__":
    engine = Engine(
        zeroshot_classifier_model_name_or_path="openai/clip-vit-large-patch14",
        zeroshot_detection_model_name_or_path="IDEA-Research/grounding-dino-base",
        device='auto'
    )

    product_detector = ProductDetector(engine)

    engine.load_image('/home/yuuhanase/workspace/hackhcmc/draft_hackhcmc/files/image.png')

    output = product_detector.run()
    pprint(output)