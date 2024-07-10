import argparse
import os
from image_analyzer import (
    logger,
    ImageAnalyzer
)
from pprint import pprint
import torch
from time import time

if __name__ == '__main__':
    start = time()
    parser = argparse.ArgumentParser(description='Analyze images.')
    parser.add_argument(
        'full_image_path', 
        type=str, 
        help='Full local path of an image',
    )

    args = parser.parse_args()
    logger.info(f"Received image folder path: {args.full_image_path}")

    analyzer = ImageAnalyzer(
        zeroshot_classifier_model_name_or_path="openai/clip-vit-large-patch14",
        zeroshot_detection_model_name_or_path="IDEA-Research/grounding-dino-base",
        carton_box_detector_path="/home/yuuhanase/workspace/hackhcmc/draft_hackhcmc/weights/carton_box_detector/best.pt",
        device='auto'
    )
    run_only_time_start = time()
    analyzer.run(args.full_image_path)
    run_only_time_end = time()
    end = time()
    print("##### TIME TAKEN: ", end - start, run_only_time_end - run_only_time_start)
    
