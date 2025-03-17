from flask import Flask, render_template, jsonify, request
import random
import json
import os

app = Flask(__name__)

# Enhanced Random song title generator
animals = [
    "Hamster", "Narwhal", "Space Unicorn", "Panda", "Kitten", "Puppy", "Baby Monkey", 
    "Hedgehog", "Charlotte", "Mummy", "Eleanor", "Pancake", "Pizza", "Taco", "Waffles",
    "Guinea Pig", "Squirrel", "Turtle", "Dolphin", "Otter", "Red Panda", "Bunny", 
    "Penguin", "Owl", "Flying Squirrel", "Potato", "Sloth", "Rainbow Sheep"
]

actions = [
    "Dancing", "Singing", "Riding a Skateboard", "Eating Tacos", "Twirling", "Flying",
    "Shopping for", "Building a", "Surfing on a", "Jumping on a", "Sleeping on a",
    "Racing on a", "Bouncing on a", "Having a Party with a", "Hugging a", "Fighting",
    "Swimming with a", "Playing with a", "Doing Karate with a", "Dreaming about a",
    "Floating on a", "Blasting Off into", "Exploding into", "Rolling on a", "Wearing a"
]

objects = [
    "Banana", "Cheeseburger", "Spaceship", "Cupcake", "Rainbow", "Unicycle", "Segway",
    "Pizza", "Taco", "Burrito", "Donut", "Cotton Candy", "Chocolate", "Ice Cream",
    "Sprinkles", "Space", "Moon", "Party Hat", "Rocket", "Robot", "Laser Beam",
    "Glitter", "Confetti", "Bubble", "Watermelon", "Super Powers", "Jetpack",
    "Trampoline", "Playground", "Moustache", "Pirate Ship", "Snowboard"
]

adjectives = [
    "Fluffy", "Tiny", "Giant", "Super", "Mega", "Ultra", "Happy", "Crazy", "Silly",
    "Goofy", "Sparkly", "Rainbow", "Kawaii", "Chubby", "Fuzzy", "Adorable", "Dancing",
    "Flying", "Magical", "Hyper", "Glittery", "Baby", "Jumbo", "Mini", "Awesome"
]

locations = [
    "in Space", "at the Mall", "on a Taco", "in the Ocean", "on the Moon", 
    "in a Cupcake Factory", "at a Party", "in a Bubble", "on a Pizza", "on YouTube",
    "at the Zoo", "in a Videogame", "on a Rainbow", "in a Donut", "on a Skateboard",
    "in a Rocket Ship", "at the Beach", "in the Clouds", "on a Rollercoaster"
]

exclamations = ["!", "!!", "!!!"]

patterns = [
    "{animal} {action} {object}{exclamation}",
    "{adjective} {animal} {action}{exclamation}",
    "{animal} {action} {object} {location}{exclamation}",
    "{adjective} {animal}{exclamation}",
    "{animal} {action} {adjective} {object}{exclamation}",
    "{adjective} {animal} {location}{exclamation}",
    "The {adjective} {animal}{exclamation}",
    "{animal} with {adjective} {object}{exclamation}",
    "{animal} {location} with {object}{exclamation}",
    "EXTREME {animal} {action}{exclamation}"
]

def generate_title():
    pattern = random.choice(patterns)
    return pattern.format(
        animal=random.choice(animals),
        action=random.choice(actions),
        object=random.choice(objects),
        adjective=random.choice(adjectives),
        location=random.choice(locations),
        exclamation=random.choice(exclamations)
    )

def get_animal_characteristics(title):
    """Extract a likely animal and characteristics from the title for animation"""
    words = title.split()
    animal = None
    for word in words:
        word = word.strip("!,.?")
        if word in animals:
            animal = word
            break
    
    if not animal:
        animal = random.choice(animals)
    
    characteristics = {
        "color": random.choice(["pink", "blue", "green", "yellow", "purple", "rainbow"]),
        "size": random.choice(["tiny", "small", "medium", "large", "huge"]),
        "mood": random.choice(["happy", "excited", "surprised", "silly", "curious"]),
        "accessory": random.choice(["hat", "sunglasses", "bowtie", "cape", "backpack", "nothing"])
    }
    
    return {"animal": animal, "characteristics": characteristics}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate')
def generate():
    title = generate_title()
    characteristics = get_animal_characteristics(title)
    return jsonify({
        'title': title,
        'animal': characteristics
    })

@app.route('/save_drawing', methods=['POST'])
def save_drawing():
    if 'drawing' in request.json:
        drawing_data = request.json['drawing']
        # For simplicity, we're not actually saving the drawing in this example
        # In a real app, you might save to a database or file system
        return jsonify({'success': True, 'message': 'Drawing saved!'})
    return jsonify({'success': False, 'message': 'No drawing data received'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
