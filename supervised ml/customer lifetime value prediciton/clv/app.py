from flask import Flask, request, jsonify, render_template
import joblib
import pandas as pd

# -------------------------------
# Initialize Flask app
# -------------------------------
app = Flask(__name__)

# -------------------------------
# Load trained model
# -------------------------------
model = joblib.load('clv_model.pkl')

# -------------------------------
# Define expected features
# -------------------------------
features = [
    'Age', 'Unit_Price', 'Quantity', 'Discount_Amount',
    'Session_Duration_Minutes', 'Pages_Viewed', 'Delivery_Time_Days',
    'Customer_Rating', 'Year', 'Month', 'Day', 'Weekend',
    'City_Antalya', 'Product_Category_Books', 'Product_Category_Electronics',
    'Product_Category_Fashion', 'Product_Category_Food',
    'Product_Category_Home & Garden', 'Product_Category_Sports',
    'Product_Category_Toys', 'Device_Type_Tablet'
]

# -------------------------------
# Home route with HTML form
# -------------------------------
@app.route('/')
def home():
    return render_template('index.html')

# -------------------------------
# Prediction route
# -------------------------------
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON or form data
        input_data = [float(request.form.get(f, 0)) for f in features]
        
        # Convert to DataFrame
        input_df = pd.DataFrame([input_data], columns=features)
        
        # Predict
        prediction = model.predict(input_df)[0]
        
        return render_template('index.html', prediction_text=f'Predicted Total CLV: {prediction:.2f}')
    except Exception as e:
        return jsonify({'error': str(e)})

# -------------------------------
# Run the app
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
