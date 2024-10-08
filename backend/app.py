from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
from flask_sqlalchemy import SQLAlchemy  # Import SQLAlchemy
import random 

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///environmental_program.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)  # Initialize SQLAlchemy

# Define the EnvironmentalAction model
class EnvironmentalAction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f'<EnvironmentalAction {self.action}>'

# Create the database tables
with app.app_context():
    db.create_all()  # Create database tables if they don't exist

@app.route('/')
def home():
    return "Welcome to Green Street Market!"

@app.route('/api/products')
def products():
    return jsonify({"products": ["Product 1", "Product 2", "Product 3"]})

@app.route('/api/dynamic-pricing')
def dynamic_pricing():
    # Simulate dynamic pricing logic
    price = random.uniform(10.0, 50.0)  # Simulate a price between $10 and $50
    return jsonify({"dynamic_price": round(price, 2)})

@app.route('/api/sustainability', methods=['POST'])
def sustainability():
    product_description = request.json.get('description', '')
    # Simple logic for assigning a sustainability score
    score = random.randint(1, 100)  # Simulating a score between 1 and 100
    return jsonify({"score": score})

@app.route('/api/environmental-program', methods=['POST'])
def environmental_program():
    action = request.json.get('action')  # 'resell', 'donate', or 'recycle'
    product_description = request.json.get('description', '')
    
    if action not in ['resell', 'donate', 'recycle']:
        return jsonify({"message": "Invalid action!"}), 400

    # Create a new EnvironmentalAction instance
    new_action = EnvironmentalAction(action=action, description=product_description)
    
    # Add to the session and commit to save to the database
    db.session.add(new_action)
    db.session.commit()

    return jsonify({"message": f"Successfully {action}d the product with description: '{product_description}'!"})

@app.route('/api/environmental-actions', methods=['GET'])
def get_environmental_actions():
    actions = EnvironmentalAction.query.all()
    return jsonify([{'action': action.action, 'description': action.description} for action in actions])

if __name__ == '__main__':
    app.run(debug=True)
