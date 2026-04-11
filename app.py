from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pickle
import pandas as pd
import random
import time
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Load model and encoder safely
try:
    with open('model.pkl', 'rb') as f:
        model = pickle.load(f)
    with open('category_encoder.pkl', 'rb') as f:
        le = pickle.load(f)
except Exception as e:
    print("Warning: Models not found. Did you run train_model.py first?")
    model, le = None, None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """Single-transaction API Endpoint for model inference"""
    data = request.json
    income = float(data.get('income', 0))
    expense = float(data.get('expense', 0))
    category = data.get('category', 'food')
    day = int(data.get('day', 1))

    if income <= 0:
        return jsonify({"risk": "unknown", "message": "Income must be greater than 0."})

    expense_ratio = expense / income
    is_weekend = 1 if day >= 6 else 0
    
    try:
        if category in le.classes_:
            category_encoded = le.transform([category])[0]
        else:
            category_encoded = 0 
    except:
        category_encoded = 0

    features = pd.DataFrame({
        'expense_ratio': [expense_ratio],
        'category_encoded': [category_encoded],
        'is_weekend': [is_weekend]
    })

    prediction = model.predict(features)[0]
    risk_label = "risky" if prediction == 1 else "safe"

    percentage_spent = (expense / income) * 100
    if percentage_spent > 70:
        personality = "Impulsive"
    elif percentage_spent < 60:
        personality = "Saver"
    else:
        personality = "Balanced Spender"
        
    score = int(max(0, 100 - percentage_spent))

    advice = "AI Insight: Your spending pattern looks stable and safe for now."
    if risk_label == "risky":
        if is_weekend:
            advice = "You are extremely likely to overspend this weekend! Be careful."
        else:
            advice = "High risk of overspending detected for this expense category."
    elif personality == "Saver":
        advice = "Great discipline! Tracking these positive habits builds wealth over time."

    return jsonify({
        "risk": risk_label,
        "message": advice,
        "personality": personality,
        "health_score": f"{score}%"
    })

@app.route('/connect_account', methods=['POST'])
def connect_account():
    """Mocks connecting to an external payment app like Paytm/PhonePe"""
    data = request.json
    provider = data.get('provider', 'Paytm')
    time.sleep(1.5)
    return jsonify({"status": "success", "token": f"mock_token_{provider.lower()}_{random.randint(1000,9999)}"})

@app.route('/analyze_history', methods=['POST'])
def analyze_history():
    """Generates 6-month historical data and returns aggregate insights + vampire subscriptions"""
    data = request.json
    income = float(data.get('income', 5000))
    token = data.get('token', '')

    categories = ['Food', 'Entertainment', 'Shopping', 'Transport', 'Bills']
    months = []
    current_date = datetime.now()
    
    total_spent_6m = 0
    total_income_6m = income * 6
    category_totals = {c: 0 for c in categories}
    
    for i in range(5, -1, -1):
        month_date = current_date - timedelta(days=30 * i)
        month_name = month_date.strftime("%b")
        
        month_expense = income * random.uniform(0.4, 0.9)
        total_spent_6m += month_expense
        
        month_data = {"name": month_name, "expenses": int(month_expense)}
        months.append(month_data)
        
        for cat in categories:
            if cat == 'Bills':
                cat_exp = income * 0.15
            else:
                cat_exp = month_expense * random.uniform(0.1, 0.3)
            category_totals[cat] += int(cat_exp)

    savings_rate = 100 - ((total_spent_6m / total_income_6m) * 100)
    top_category = max(category_totals, key=category_totals.get)
    
    if savings_rate < 20:
        archetype = "The Catalyst (High Volatility)"
        risk_level = "Elevated"
        savings_advice = f"Warning: You are spending too much on {top_category}. Cut your {top_category} budget by 20% to build a safety net."
        invest_advice = "Focus on Liquid Funds and High-Yield Savings Accounts (FDs) to build your emergency corpus first. Avoid risky assets for now."
    elif savings_rate > 40:
        archetype = "The Architect (Strategic Saver)"
        risk_level = "Minimal"
        savings_advice = f"Excellent retention! Your {top_category} expenses are well within limits."
        invest_advice = "You have excess liquidity. Deploy 30% into Nifty 50 Index Funds and 10% into aggressive growth assets (Crypto/Tech Stocks) to maximize yield."
    else:
        archetype = "The Explorer (Fluid Spender)"
        risk_level = "Moderate"
        savings_advice = f"You are balanced, but {top_category} is eating into your potential investments. Try limiting impulse buys on weekends."
        invest_advice = "Start a SIP in Bluechip Mutual Funds and look into Sovereign Gold Bonds (SGBs) for stable, tax-efficient returns."

    pie_data = [{"name": k, "value": v} for k, v in category_totals.items()]

    # Generate mock Vampire Subscriptions
    vampires = [
        {"id": "v1", "name": "Netflix Premium", "amount": 22.99, "category": "Entertainment", "status": "active"},
        {"id": "v2", "name": "Spotify Duo", "amount": 14.99, "category": "Entertainment", "status": "active"},
        {"id": "v3", "name": "Unknown Gym Charge", "amount": 49.00, "category": "Health", "status": "active"},
        {"id": "v4", "name": "Adobe Cloud", "amount": 54.99, "category": "Software", "status": "active"}
    ]

    return jsonify({
        "status": "success",
        "trend_data": months,
        "category_data": pie_data,
        "vampires": vampires,
        "insights": {
            "archetype": archetype,
            "risk_level": risk_level,
            "savings_rate": f"{int(savings_rate)}%",
            "savings_number": int(savings_rate),
            "top_category": top_category,
            "savings_advice": savings_advice,
            "invest_advice": invest_advice
        }
    })

@app.route('/forecast', methods=['POST'])
def forecast():
    """Predictive 5-Year Wealth Forecasting"""
    data = request.json
    income = float(data.get('income', 5000))
    current_savings_rate = float(data.get('savings_rate', 20)) / 100
    
    current_monthly_savings = income * current_savings_rate
    optimized_monthly_savings = income * (current_savings_rate + 0.15) # Assume they save 15% more
    
    forecast_data = []
    current_wealth = 0
    optimized_wealth = 0
    
    # 7% annual return for status quo, 12% for optimized (Index funds + active investing)
    rate_current = 1.07 ** (1/12)
    rate_optimized = 1.12 ** (1/12)

    for month in range(0, 61, 12): # 0 to 60 months, step 12
        year_num = month // 12
        
        forecast_data.append({
            "year": f"Year {year_num}",
            "status_quo": int(current_wealth),
            "optimized": int(optimized_wealth)
        })
        
        # Compound for next 12 months
        for _ in range(12):
            current_wealth = (current_wealth + current_monthly_savings) * rate_current
            optimized_wealth = (optimized_wealth + optimized_monthly_savings) * rate_optimized

    return jsonify({"forecast": forecast_data})

@app.route('/chat', methods=['POST'])
def chat():
    """Simulated AI Co-Pilot for Memex"""
    data = request.json
    message = data.get('message', '').lower()
    
    time.sleep(1) # Simulate AI thinking
    
    if "ps5" in message or "console" in message or "playstation" in message:
        return jsonify({"reply": "Based on your Neural Sync, your Entertainment budget is currently running hot. However, if you sever the 'Adobe Cloud' and 'Unknown Gym Charge' vampire subscriptions, you can comfortably afford a PS5 in exactly 2.5 months without touching your emergency fund."})
    elif "afford" in message or "buy" in message or "car" in message:
        return jsonify({"reply": "I've analyzed your capital outflows. To afford major purchases right now, you need to increase your savings retention by 15%. I suggest routing your excess liquidity directly into a high-yield SIP before you consider taking on debt."})
    elif "hello" in message or "hi" in message:
        return jsonify({"reply": "Neural core online. I have analyzed your last 6 months of ledger data. How can I assist you with your capital deployment today?"})
    else:
        return jsonify({"reply": "I am analyzing your request against your 6-month historical nodes. Can you provide more specifics so I can run a deeper Monte Carlo simulation on your capital?"})

if __name__ == '__main__':
    app.run(debug=True, port=8000)
