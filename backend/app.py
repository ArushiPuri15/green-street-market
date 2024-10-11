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

# Define Product model
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(300), nullable=False)
    price = db.Column(db.Float, nullable=False)
    eco_score = db.Column(db.Integer, nullable=True)  # Eco score can be added later
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Relate to user

    def __repr__(self):
        return f'<Product {self.name}>'

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
        access_token = create_access_token(identity={'username': user.username, 'id': user.id})
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"message": "Invalid credentials!"}), 401

@app.route('/api/products', methods=['POST'])
@jwt_required()
def add_product():
    current_user = get_jwt_identity()
    data = request.json
    new_product = Product(
        name=data['name'],
        description=data['description'],
        price=data['price'],
        eco_score=data.get('eco_score', None),  # Optional eco score
        user_id=current_user['id']  # Store the user ID with the product
    )
    db.session.add(new_product)
    db.session.commit()
    return jsonify({"message": "Product added successfully!"}), 201

@app.route('/api/products', methods=['GET'])
@jwt_required()
def get_products():
    current_user = get_jwt_identity()
    products = Product.query.filter_by(user_id=current_user['id']).all()
    return jsonify([{'id': p.id, 'name': p.name, 'description': p.description, 'price': p.price, 'eco_score': p.eco_score} for p in products]), 200

@app.route('/api/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    current_user = get_jwt_identity()
    data = request.json
    product = Product.query.filter_by(id=product_id, user_id=current_user['id']).first()
    
    if product:
        product.name = data['name']
        product.description = data['description']
        product.price = data['price']
        product.eco_score = data.get('eco_score', product.eco_score)  # Only update if provided
        db.session.commit()
        return jsonify({"message": "Product updated successfully!"}), 200
    return jsonify({"message": "Product not found!"}), 404

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    current_user = get_jwt_identity()
    product = Product.query.filter_by(id=product_id, user_id=current_user['id']).first()
    
    if product:
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": "Product deleted successfully!"}), 200
    return jsonify({"message": "Product not found!"}), 404

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
