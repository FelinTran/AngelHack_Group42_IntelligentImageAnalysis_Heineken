# HachHCMC - Heineken's Intelligent Image Analyzer
Welcome to the HEINEKEN Vietnam Brand Experience Analyzer! This project aims to revolutionize brand experience tracking by leveraging advanced image analysis to automatically detect key elements such as brand logos, products, POSM, consumer activities, and image contexts. Our solution provides actionable insights to enhance brand visibility and optimize marketing efforts.

In this project, we use 4 models, of which 2 are responsible for specifically detecting cartons and people. On the other hand, we use two ZeroShot models to perform classification and detection tasks respectively.

## Installation
1. Clone this repository to your local machine:

2. Navigate to the project directory:

3. Install dependencies (if any):
#### 1. ExpressJS Setup
```npm i```
#### 2. Python Setup
```pip install -r requirements.txt```

## Usage
Run two terminals:
-  Expressjs: ```npm start```
-  Python: ```python app.py```
-  Open your web browser and visit http://localhost:5000

## Testing
We use Jest for testing. To run tests: Go to ```app.js```, and change the Business Problem you want to be tested in the testing route.
E.g: 
```
app. get('/testing', function (req, res, next) {
    res.status(200).send(compile('pages/info_page.hbs', {
        layout: 'index.hbs'
    }))
})
```
