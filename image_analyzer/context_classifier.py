from transformers import (
    pipeline,
)
# from image_analyzer import Engine
from .logger import *
from .engine import *
from pprint import pprint

class ContextClassifier:
    def __init__(
        self, 
        engine: Engine,
    ) -> None:
        self.engine = engine
        self.context_list = [
            'bar', 
            'pub', 
            'restaurant',
            'grocery',
            'supermarket', 
            'store'
        ]
        self.action_list = [
            'party',
            'celebration',
            'undefined',
            'gathering',
            'happy hour',
            'fun time'
        ]
        self.environment_list = [
            'indoor',
            'outdoor'
        ]
    
    def run(self):
        context_output = self.engine.classify(self.context_list)

        action_output = self.engine.classify(self.action_list)

        environment = self.engine.classify(self.environment_list)

        return_output = {
            # 'context': list(context_output.keys())[0],
            # 'action': list(action_output.keys())[0],
            # 'environment': list(environment.keys())[0],
            'context': context_output,
            'action': action_output,
            'environment': environment
        }
        return return_output
    
if __name__ == "__main__":
    engine = Engine(
        zeroshot_classifier_model_name_or_path="openai/clip-vit-large-patch14",
        zeroshot_detection_model_name_or_path="IDEA-Research/grounding-dino-base",
        device='auto'
    )

    classifier = ContextClassifier(engine)

    engine.load_image('/home/yuuhanase/workspace/hackhcmc/hackhcmc_dataset/66502765_1708608985838.jpg')

    output = classifier.run()
    pprint(output)