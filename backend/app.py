from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///environmental_program.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this to a random secret key
db = SQLAlchemy(app)  # Initialize SQLAlchemy
bcrypt = Bcrypt(app)  # Initialize Bcrypt for password hashing
jwt = JWTManager(app)  # Initialize JWT Manager

# Set up the Gemini API
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")  # Get the Gemini API key from environment variables
genai.configure(api_key=GEMINI_API_KEY)

# Create the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
)

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

# Create the database tables
with app.app_context():
    db.create_all()  # Create database tables if they don't exist

@app.route('/')
def home():
    return "Welcome to Green Street Market!"

# ---------------- User Routes ----------------
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

# ---------------- Product Routes ----------------
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

def analyze_with_gemini(product_data):
    """Analyze product sustainability using Gemini."""
    
    # Extract product data from the request
    product_description = product_data.get('description', '')
    material = product_data.get('material', '')
    certifications = product_data.get('certifications', [])
    manufacturing_location = product_data.get('manufacturingLocation', '')
    durability = product_data.get('durability', '')
    end_of_life = product_data.get('endOfLife', '')

    # Create a prompt using the provided product data
    prompt = f"""
    Analyze the sustainability of the following product:
    Product Description: {product_description}
    Material: {material}
    Certifications: {', '.join(certifications)}
    Manufacturing Location: {manufacturing_location}
    Durability: {durability}
    End-of-Life Disposal: {end_of_life}

    Please provide an eco score out of 100 based on the sustainability of the material, certifications, manufacturing impact, durability, and end-of-life disposal. The response should have the first line as eco score:
    """

    # Start the chat session and send the message
    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(prompt)

    # Log the response for debugging
    print(f"Gemini Response: {response.text}")

    return response.text if isinstance(response.text, str) else "Error in Gemini response"

@app.route('/api/calculate-eco-score', methods=['POST'])
def calculate_eco_score():
    """Calculate the eco score using Gemini."""
    product_data = request.json  # Get the JSON data from the request

    # Ensure product_data is a dictionary
    if not isinstance(product_data, dict):
        return jsonify({"error": "Invalid input format. Expecting JSON."}), 400

    # Analyze product sustainability using Gemini
    gemini_response = analyze_with_gemini(product_data)

    # Extract the eco score from the response
    try:
        # Assuming gemini_response is a formatted string that includes the eco score
        score_line = next(line for line in gemini_response.split('\n') if "Eco Score:" in line)
        eco_score = int(score_line.split(":")[1].strip().split('/')[0])  # Extracting the score correctly
    except (ValueError, StopIteration):
        return jsonify({"eco_score": 50, "message": "Default score returned. Check prompt or API response."}), 500

    return jsonify({'eco_score': eco_score, 'gemini_analysis': gemini_response})

if __name__ == '__main__':
    app.run(debug=True)
