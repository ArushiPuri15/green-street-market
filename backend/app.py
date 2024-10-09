from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
from flask_sqlalchemy import SQLAlchemy  # Import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity  # Import the required functions
import random 

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///environmental_program.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this to a random secret key
db = SQLAlchemy(app)  # Initialize SQLAlchemy
bcrypt = Bcrypt(app)  # Initialize Bcrypt for password hashing
jwt = JWTManager(app)  # Initialize JWT Manager

# Define User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

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

@app.route('/api/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "User already exists!"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully!"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity={'username': user.username})
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/api/products')
def products():
    # Example product data - replace with your actual data source
    example_products = [
        {"id": 1, "name": "Eco-Friendly Shampoo", "description": "A natural shampoo for all hair types", "price": 15.99, "ecoScore": 80},
        {"id": 2, "name": "Recyclable Water Bottle", "description": "A reusable water bottle made from recycled materials", "price": 12.99, "ecoScore": 90},
        {"id": 3, "name": "Organic Cotton T-Shirt", "description": "A soft t-shirt made from organic cotton", "price": 20.99, "ecoScore": 85},
    ]
    return jsonify({"products": example_products})

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

@app.route('/api/profile', methods=['GET'])
@jwt_required()  # Protect this route with JWT
def profile():
    current_user = get_jwt_identity()  # Get the current user's identity
    user = User.query.filter_by(username=current_user['username']).first()  # Fetch user from the database
    
    if user:
        return jsonify({"username": user.username}), 200  # Return user details (add more fields if needed)
    return jsonify({"message": "User not found!"}), 404

if __name__ == '__main__':
    app.run(debug=True)
