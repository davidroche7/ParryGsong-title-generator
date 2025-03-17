from flask import Flask, render_template, jsonify
import random

app = Flask(__name__)

# Random song title generator
animals = ["Hamster", "Cat", "Pug", "Penguin", "Llama", "Sloth", "Eleanor", "Weasel", "Bird"]
actions = ["Dancing", "Singing", "Riding a Skateboard", "Eating Tacos", "Twirling"]
objects = ["Banana", "Cheeseburger", "Spaceship", "Cupcake", "Rainbow", "Unicycle", "Segway"]
exclamations = ["!", "!!", "!!!]

def generate_title():
    return f"{random.choice(animals)} {random.choice(actions)} {random.choice(objects)}{random.choice(exclamations)}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate')
def generate():
    return jsonify({'title': generate_title()})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
