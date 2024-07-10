from .engine import Engine
from pprint import pprint

class POSMDetector:
    def __init__(
        self, 
        engine: Engine
    ) -> None:
        self.engine = engine
        self.posm = [
            'ice bucket.',
            # 'ice box.',
            'box.',
            'frigde.',
            # 'signage.',
            'billboard.',
            'poster.',
            'standee.',
            # 'tent card.',
            'display stand.',
            'tabletop.',
            'parasol.'
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
            'undefined'
        ]

    def run(self):
        return_output = {}
        idx = 0
        for posm in self.posm:
            output = self.engine.detect(posm)
            if output:
                for key in output:
                    box = list(output[key]['loc'].values())
                    # print(box)

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
        # return self.engine.detect("billboard. banner. poster.")
        # return self.engine.detect(
        #     ' '.join(self.posm)
        # )
    
if __name__ == "__main__":
    engine = Engine(
        zeroshot_classifier_model_name_or_path="openai/clip-vit-large-patch14",
        zeroshot_detection_model_name_or_path="IDEA-Research/grounding-dino-base",
        device='auto'
    )

    posm_detector = POSMDetector(engine)

    engine.load_image('/home/yuuhanase/workspace/hackhcmc/hackhcmc_dataset/66502765_1708608985838.jpg')

    output = posm_detector.run()
    pprint(output)