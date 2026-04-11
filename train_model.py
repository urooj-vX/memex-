import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import LabelEncoder
import pickle

print("Starting training process...")

# 1. Generate Dataset
np.random.seed(42)
n_samples = 200
incomes = np.random.choice([3000, 5000, 8000, 10000, 12000], n_samples)
expenses = incomes * np.random.uniform(0.05, 0.8, n_samples)
categories = np.random.choice(['food', 'bills', 'entertainment', 'shopping', 'transport'], n_samples)
days = np.random.randint(1, 8, n_samples)
is_weekends = np.where(days >= 6, 1, 0)
expense_ratios = expenses / incomes

labels = []
for i in range(n_samples):
    # Rule based labeling for training: high expense ratio + weekend shopping/ent -> risky
    if expense_ratios[i] > 0.5:
        labels.append('risky')
    elif expense_ratios[i] > 0.3 and is_weekends[i] == 1 and categories[i] in ['entertainment', 'shopping']:
        labels.append('risky')
    else:
        labels.append('safe')

df = pd.DataFrame({
    'income': incomes,
    'expense': expenses.astype(int),
    'category': categories,
    'day_of_week': days,
    'is_weekend': is_weekends,
    'label': labels
})

df.to_csv('dataset.csv', index=False)
print("Saved synthetic data to dataset.csv")

# 2. Train Model
df = pd.read_csv('dataset.csv')
df['expense_ratio'] = df['expense'] / df['income']

le = LabelEncoder()
df['category_encoded'] = le.fit_transform(df['category'])

# save the encoder classes for later usage in inference
with open('category_encoder.pkl', 'wb') as f:
    pickle.dump(le, f)

# Select features exactly as the master prompt suggests
X = df[['expense_ratio', 'category_encoded', 'is_weekend']]
y = df['label'].apply(lambda x: 1 if x == 'risky' else 0)

model = LogisticRegression()
model.fit(X, y)

with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

print(f"Saved model.pkl successfully! Model accuracy on training data: {model.score(X, y):.2f}")
