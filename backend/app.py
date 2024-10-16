from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
import string
import random
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///environmental_program.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this to a random secret key
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Define User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(50), default='customer')  # Default role is 'customer'
    eco_points = db.Column(db.Integer, default=0)  # Add eco_points field with default value 0

    def __repr__(self):
        return f'<User {self.username}>'


# Define Product model
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(300), nullable=False)
    price = db.Column(db.Float, nullable=False)
    eco_score = db.Column(db.Integer, nullable=True)  # Eco score can be added later
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Product {self.name}>'

# Define RecycleItem model
class RecycleItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(150), nullable=False)
    material = db.Column(db.String(150), nullable=False)
    condition = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(300), nullable=True)
    status = db.Column(db.String(50), default="Pending")
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date_submitted = db.Column(db.DateTime, default=db.func.current_timestamp())

# Define Voucher model
class Voucher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(100), unique=True, nullable=False)
    discount_value = db.Column(db.Float, nullable=False)  # Discount percentage
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    valid_until = db.Column(db.DateTime, nullable=False)
    is_redeemed = db.Column(db.Boolean, default=False)


# Define Admin model
class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)

# Create tables if not already created
with app.app_context():
    db.create_all()

@app.route('/')
def home():
    return "Welcome to Green Street Market!"

# ---------------- User Routes ----------------
@app.route('/api/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    role = request.json.get('role', 'customer')  # Default to customer if not provided

    if User.query.filter_by(username=username).first():
        return jsonify({"message": "User already exists!"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password, role=role)  # Include role in user creation
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        access_token = create_access_token(identity={'username': user.username, 'id': user.id, 'role': user.role})
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"message": "Invalid credentials!"}), 401

# Admin Registration Route
@app.route('/api/admin/register', methods=['POST'])
def register_admin():
    username = request.json.get('username')
    password = request.json.get('password')

    if Admin.query.filter_by(username=username).first():
        return jsonify({"message": "Admin already exists!"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_admin = Admin(username=username, password=hashed_password)
    db.session.add(new_admin)
    db.session.commit()

    return jsonify({"message": "Admin registered successfully!"}), 201

# ---------------- Recycle Program Routes ----------------
@app.route('/api/recycle', methods=['POST'])
@jwt_required()
def submit_recycle_item():
    current_user = get_jwt_identity()
    data = request.json

    recycle_item = RecycleItem(
        product_name=data['product_name'],
        material=data['material'],
        condition=data['condition'],
        description=data.get('description', ''),
        user_id=current_user['id']
    )
    db.session.add(recycle_item)
    db.session.commit()

    return jsonify({"message": "Recycle item submitted successfully!"}), 201

@app.route('/api/recycle_items', methods=['GET'])
@jwt_required()
def get_recycle_items():
    current_user = get_jwt_identity()
    items = RecycleItem.query.filter_by(user_id=current_user['id']).all()
    return jsonify([{
        'id': item.id,
        'product_name': item.product_name,
        'material': item.material,
        'condition': item.condition,
        'description': item.description,
        'status': item.status,
        'date_submitted': item.date_submitted
    } for item in items]), 200

# ---------------- Admin Routes ----------------
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    username = request.json.get('username')
    password = request.json.get('password')

    admin = Admin.query.filter_by(username=username).first()
    if admin and bcrypt.check_password_hash(admin.password, password):
        access_token = create_access_token(identity={'username': admin.username, 'role': 'admin'})
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"message": "Invalid admin credentials!"}), 401

# Admin Dashboard API for approving or rejecting recyclable items
@app.route('/api/admin/recycle_items', methods=['GET'])
@jwt_required()
def get_admin_recycle_items():
    current_user = get_jwt_identity()
    if current_user.get('role') != 'admin':
        return jsonify({"message": "Unauthorized"}), 403  # Check if user is an admin

    # Get all pending recyclable items
    items = RecycleItem.query.filter_by(status="Pending").all()
    return jsonify([{
        'id': item.id,
        'product_name': item.product_name,
        'material': item.material,
        'condition': item.condition,
        'description': item.description,
        'status': item.status,
        'date_submitted': item.date_submitted
    } for item in items]), 200

# Approve or reject recycle item
@app.route('/api/admin/recycle_item/<int:item_id>', methods=['PUT'])
@jwt_required()
def approve_recycle_item(item_id):
    current_user = get_jwt_identity()
    if current_user.get('role') != 'admin':
        return jsonify({"message": "Unauthorized"}), 403

    item = RecycleItem.query.get(item_id)
    if not item:
        return jsonify({"message": "Item not found!"}), 404

    status = request.json.get('status')
    if status not in ['Approved', 'Rejected']:
        return jsonify({"message": "Invalid status!"}), 400

    item.status = status
    db.session.commit()

    # Generate voucher if approved
    if status == 'Approved':
        generate_voucher(item.user_id, discount_value=15)  # Generate a 15% voucher

    return jsonify({"message": f"Item {status} successfully!"}), 200

# Function to generate a voucher with a specific discount
def generate_voucher(user_id, discount_value=15):
    voucher_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=10))
    voucher = Voucher(
        code=voucher_code,
        discount_value=discount_value,
        user_id=user_id,
        valid_until=datetime.utcnow() + timedelta(days=30)
    )
    db.session.add(voucher)
    db.session.commit()

@app.route('/api/vouchers', methods=['GET'])
@jwt_required()
def get_vouchers():
    current_user = get_jwt_identity()
    vouchers = Voucher.query.filter_by(user_id=current_user['id'], is_redeemed=False).all()
    return jsonify([{
        'code': voucher.code,
        'discount_value': voucher.discount_value,
        'valid_until': voucher.valid_until,
        'is_redeemed': voucher.is_redeemed
    } for voucher in vouchers]), 200

@app.route('/api/eco_points', methods=['GET'])
@jwt_required()
def get_eco_points():
    current_user = get_jwt_identity()
    # Fetch eco points logic here
    # Assuming you store eco points in your user model
    user = User.query.get(current_user['id'])
    return jsonify({"points": user.eco_points})

if __name__ == '__main__':
    # Create the necessary tables if they don't exist
    with app.app_context():
        db.create_all()  # This will create the necessary tables
    
    app.run(debug=True)
