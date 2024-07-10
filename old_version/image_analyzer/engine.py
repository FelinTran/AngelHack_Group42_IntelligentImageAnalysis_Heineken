from transformers import (
    AutoProcessor, 
    AutoModelForZeroShotObjectDetection,
    CLIPProcessor, 
    CLIPModel
) 
import torch
from PIL import Image
from typing import List, AnyStr

class Engine:
    def __init__(
        self,
        zeroshot_classifier_model_name_or_path: str,
        zeroshot_detection_model_name_or_path: str,
        device: str = "auto"
    ) -> None:
        if device == "auto":
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device
        
        # Initialize classifier and its processor
        self.zeroshot_classifier = CLIPModel.from_pretrained(zeroshot_classifier_model_name_or_path).to(self.device)
        self.classifier_processor = CLIPProcessor.from_pretrained(zeroshot_classifier_model_name_or_path)

        # Initialize detector and its processor
        self.zeroshot_detector = AutoModelForZeroShotObjectDetection.from_pretrained(zeroshot_detection_model_name_or_path).to(self.device)
        self.detector_processor = AutoProcessor.from_pretrained(zeroshot_detection_model_name_or_path)

    def load_image(
        self,
        image_path: str
    ) -> None:
        self.input_image = Image.open(image_path).convert('RGB')

    def classify(
        self,
        labels: List[str],
        input_image: Image = None
    ) -> dict:
        if input_image is None:
            input_image = self.input_image.convert('RGB')

        inputs = self.classifier_processor(
            text=labels, 
            images=input_image, 
            return_tensors="pt", 
            padding=True
        ).to(self.device)

        with torch.no_grad():
            outputs = self.zeroshot_classifier(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = torch.squeeze(logits_per_image.softmax(dim=1), 0)
        idx = torch.argmax(probs).cpu().item()

        # return_output = {}
        # return_output[labels[idx]] = probs[idx].cpu().item()
        
        return_output = labels[idx]

        if self.device == 'cuda':
            inputs = inputs.to("cpu")

        del inputs, outputs, logits_per_image, probs

        return return_output
    
    def detect(
        self,
        labels: str,
        input_image: Image = None
    ) -> dict:
        if input_image is None:
            input_image = self.input_image

        inputs = self.detector_processor(
            images=input_image, 
            text=labels, 
            return_tensors="pt"
        ).to(self.device)

        with torch.no_grad():
            outputs = self.zeroshot_detector(**inputs)
        
        results = self.detector_processor.post_process_grounded_object_detection(
            outputs,
            inputs.input_ids,
            box_threshold=0.4,
            text_threshold=0.3,
            target_sizes=[self.input_image.size[::-1]]
        )

        return_output = {}
        
        for i in range(len(results[0]['labels'])):
            box = results[0]['boxes'][i].cpu().tolist()
            return_output[i] = {}
            return_output[i]['label'] = results[0]['labels'][i]
            return_output[i]['loc'] = {
                'x1': int(box[0]),
                'y1': int(box[1]),
                'x2': int(box[2]),
                'y2': int(box[3]),
            }

        if self.device == 'cuda':
            inputs = inputs.to("cpu")

        del inputs, outputs, results

        return return_output
        
if __name__ == '__main__':
    from pprint import pprint

    engine = Engine(
        zeroshot_classifier_model_name_or_path="openai/clip-vit-large-patch14",
        zeroshot_detection_model_name_or_path="IDEA-Research/grounding-dino-base",
        device='cpu'
    )

    engine.load_image(
        "/home/yuuhanase/workspace/hackhcmc/draft_hackhcmc/files/image.png"
    )

    detect_output = engine.detect("billboard. banner. poster.")
    classify_output = engine.classify(['grocery', 'supermarket', 'restaurant'])

    print("########### DETECTION ##############")
    pprint(detect_output)
    print("######### CLASSIFICATION ###########")
    pprint(classify_output)