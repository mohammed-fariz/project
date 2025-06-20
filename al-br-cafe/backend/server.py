from flask import Flask, request, jsonify
from flask_cors import CORS
import random
import string
import json
from datetime import datetime, timedelta
import requests
import os
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# In-memory storage (use database in production)
users = {}
orders = {}
menu_data = {
    "sandwiches": [
        {"id": "corn-sandwich", "name": "Corn Sandwich", "price": 50, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "veg-sandwich", "name": "Veg Sandwich", "price": 50, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "paneer-sandwich", "name": "Paneer Sandwich", "price": 60, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "chicken-sandwich", "name": "Chicken Sandwich", "price": 60, "category": "non-veg", "image": "/api/placeholder/200/150"},
        {"id": "crispy-chicken-sandwich", "name": "Crispy Chicken Sandwich", "price": 70, "category": "non-veg", "image": "/api/placeholder/200/150"}
    ],
    "fries": [
        {"id": "french-fries", "name": "French Fries", "price": 50, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "malasa-peri-fries", "name": "Malasa Peri Peri Fries", "price": 60, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "salted-fries", "name": "Salted Fries", "price": 50, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "special-cheese-fries", "name": "Special Cheese Fries", "price": 70, "category": "veg", "image": "/api/placeholder/200/150"}
    ],
    "shawarma": [
        {"id": "shawarma", "name": "Shawarma", "price": 60, "category": "non-veg", "image": "/api/placeholder/200/150"},
        {"id": "br-special-shawarma", "name": "B R Special Shawarma", "price": 80, "category": "non-veg", "image": "/api/placeholder/200/150"},
        {"id": "plater-shawarma", "name": "Plater Shawarma", "price": 100, "category": "non-veg", "image": "/api/placeholder/200/150"}
    ],
    "tikka": [
        {"id": "malai-tikka", "name": "Malai Tikka", "price": 140, "category": "non-veg", "image": "/api/placeholder/200/150"},
        {"id": "chicken-tikka", "name": "Chicken Tikka", "price": 140, "category": "non-veg", "image": "/api/placeholder/200/150"},
        {"id": "hariyali-tikka", "name": "Hariyali Tikka", "price": 140, "category": "non-veg", "image": "/api/placeholder/200/150"},
        {"id": "rashmi-tikka", "name": "Rashmi Tikka", "price": 140, "category": "non-veg", "image": "/api/placeholder/200/150"},
        {"id": "tangdi-kabab", "name": "Tangdi Kabab", "price": 120, "category": "non-veg", "image": "/api/placeholder/200/150"}
    ],
    "pizza": [
        {"id": "veg-pizza", "name": "Veg Pizza", "price": 150, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "corn-pizza", "name": "Corn Pizza", "price": 180, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "paneer-pizza", "name": "Paneer Pizza", "price": 180, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "chicken-pizza", "name": "Chicken Pizza", "price": 200, "category": "non-veg", "image": "/api/placeholder/200/150"}
    ],
    "burgers": [
        {"id": "veg-burger", "name": "Veg Burger", "price": 50, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "paneer-burger", "name": "Paneer Burger", "price": 60, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "spl-paneer-burger", "name": "SPL Paneer Burger", "price": 80, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "chicken-burger", "name": "Chicken Burger", "price": 60, "category": "non-veg", "image": "/api/placeholder/200/150"}
    ],
    "beverages": [
        {"id": "cold-coffee", "name": "Cold Coffee", "price": 60, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "kit-kat-coffee", "name": "Kit Kat Coffee", "price": 60, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "ocean-blue-mojito", "name": "Ocean Blue Mojito", "price": 60, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "chocolate-shake", "name": "Chocolate Shake", "price": 60, "category": "veg", "image": "/api/placeholder/200/150"}
    ],
    "icecream": [
        {"id": "vanilla-ice", "name": "Vanilla Ice", "price": 60, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "mango-ice", "name": "Mango Ice", "price": 60, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "strawberry-ice", "name": "Strawberry Ice", "price": 60, "category": "veg", "image": "/api/placeholder/200/150"},
        {"id": "chocolate-ice", "name": "Chocolate Ice", "price": 60, "category": "veg", "image": "/api/placeholder/200/150"}
    ]
}

# Temporary OTP storage
otp_storage = {}

def generate_otp():
    """Generate a 4-digit OTP"""
    return ''.join(random.choices(string.digits, k=4))

def generate_order_id():
    """Generate unique order ID"""
    return 'ALB' + ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

# Authentication Routes
@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    """Send OTP to mobile number"""
    try:
        data = request.get_json()
        mobile = data.get('mobile')
        
        if not mobile or len(mobile) != 10:
            return jsonify({'error': 'Invalid mobile number'}), 400
        
        otp = generate_otp()
        otp_storage[mobile] = {
            'otp': otp,
            'timestamp': datetime.now(),
            'attempts': 0
        }
        
        # In production, integrate with SMS service like Twilio
        # For demo, we'll just return success
        print(f"OTP for {mobile}: {otp}")  # Debug only
        
        return jsonify({
            'success': True,
            'message': 'OTP sent successfully',
            'otp': otp  # Remove this in production
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    """Verify OTP and login user"""
    try:
        data = request.get_json()
        mobile = data.get('mobile')
        otp = data.get('otp')
        
        if mobile not in otp_storage:
            return jsonify({'error': 'OTP not found or expired'}), 400
        
        stored_otp_data = otp_storage[mobile]
        
        # Check if OTP is expired (5 minutes)
        if datetime.now() - stored_otp_data['timestamp'] > timedelta(minutes=5):
            del otp_storage[mobile]
            return jsonify({'error': 'OTP expired'}), 400
        
        # Check attempts
        if stored_otp_data['attempts'] >= 3:
            del otp_storage[mobile]
            return jsonify({'error': 'Too many attempts'}), 400
        
        if stored_otp_data['otp'] != otp:
            stored_otp_data['attempts'] += 1
            return jsonify({'error': 'Invalid OTP'}), 400
        
        # OTP verified successfully
        del otp_storage[mobile]
        
        # Create or get user
        if mobile not in users:
            users[mobile] = {
                'mobile': mobile,
                'created_at': datetime.now().isoformat(),
                'addresses': []
            }
        
        # Generate session token (use JWT in production)
        session_token = generate_password_hash(mobile + str(datetime.now()))
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'token': session_token,
            'user': users[mobile]
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Address Management Routes
@app.route('/api/save-address', methods=['POST'])
def save_address():
    """Save user address"""
    try:
        data = request.get_json()
        mobile = data.get('mobile')
        address = data.get('address')
        landmark = data.get('landmark')
        lat = data.get('lat')
        lng = data.get('lng')
        
        if not all([mobile, address, landmark]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        if mobile not in users:
            return jsonify({'error': 'User not found'}), 404
        
        address_data = {
            'address': address,
            'landmark': landmark,
            'lat': lat,
            'lng': lng,
            'created_at': datetime.now().isoformat()
        }
        
        users[mobile]['addresses'].append(address_data)
        
        return jsonify({
            'success': True,
            'message': 'Address saved successfully',
            'address': address_data
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Google Maps Integration
@app.route('/api/geocode', methods=['POST'])
def geocode_address():
    """Convert address to coordinates using Google Maps API"""
    try:
        
        data = request.get_json()
        address = data.get('address')
        
        # Replace with your Google Maps API key
        api_key = os