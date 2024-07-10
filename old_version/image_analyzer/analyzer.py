import argparse
import os
# from image_analyzer import (
#     logger,
#     LogoDetector,
#     ProductDetector,
#     Engine,
#     ContextClassifier,
#     POSMDetector,
#     HumanDetector
# )
from .logger import *
from .engine import *
from .logo_detector import *
from .product_detector import *
from .context_classifier import *
from .human_detector import *
from .posm_detector import *
from .analyzer import *
from pprint import pprint
import torch
from time import time

class ImageAnalyzer:
    def __init__(
        self,
        zeroshot_classifier_model_name_or_path: str,
        zeroshot_detection_model_name_or_path: str,
        carton_box_detector_path: str,
        device = "auto"
    ) -> None:
        if device == "auto":
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device

        self.engine = Engine(
            zeroshot_classifier_model_name_or_path=zeroshot_classifier_model_name_or_path,
            zeroshot_detection_model_name_or_path=zeroshot_detection_model_name_or_path,
            device=self.device
        )

        self.logo_detector = None #LogoDetector()
        self.product_detector = ProductDetector(self.engine, carton_box_detector_path)
        self.human_detector = HumanDetector(self.engine)
        self.posm_detector = POSMDetector(self.engine)
        self.context_classifier = ContextClassifier(self.engine)

    def get_image_filepath(self):
        return os.listdir(self.image_folder_path)

    def run(
        self,
        image_path: str,
    ):
        # Analyze each image:
        self.engine.load_image(image_path)

        start = time()

        # Logo detection

        # Product detection
        product_output = self.product_detector.run()

        # Human detection
        human_output = self.human_detector.run()

        # POSM detection
        posm_output = self.posm_detector.run()

        # Context detection
        context_output = self.context_classifier.run()

        end = time()

        logger.info(f"##### Analyzed time: {end - start}")

        return_output = {
            "product": product_output,
            "human": human_output,
            "posm": posm_output,
            "context": context_output
        }

        # pprint(return_output)
        return return_output


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Analyze images.')
    parser.add_argument(
        'image_folder_path', 
        type=str, 
        help='Full local path of images folder',
    )

    args = parser.parse_args()
    logger.info(f"Received image folder path: {args.image_folder_path}")

    analyzer = ImageAnalyzer(
        zeroshot_classifier_model_name_or_path="openai/clip-vit-large-patch14",
        zeroshot_detection_model_name_or_path="IDEA-Research/grounding-dino-base",
        device='auto'
    )
    analyzer.run(args.image_folder_path)
    
