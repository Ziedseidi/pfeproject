from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import re
import unicodedata

app = Flask(__name__)
CORS(app)

data = pd.read_csv("lois.csv")

def normalize_text(text):
    text = text.lower()
    # enlever accents
    text = ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    # enlever ponctuation
    text = re.sub(r'[^\w\s]', '', text)
    # enlever espaces multiples
    text = re.sub(r'\s+', ' ', text).strip()
    return text

@app.route("/")
def home():
    return "Bienvenue sur le chatbot juridique !"

@app.route("/question", methods=["GET"])
def get_answer():
    user_question = request.args.get("q", "")
    user_norm = normalize_text(user_question)

    for _, row in data.iterrows():
        question_norm = normalize_text(str(row["question"]))
        # si la question normalisée du CSV est exactement égale à la question normalisée de l'utilisateur
        if question_norm == user_norm:
            return jsonify({
                "question": row["question"],
                "réponse": row["réponse"]
            })

    return jsonify({"réponse": "Désolé, je n'ai pas trouvé de réponse à votre question."})

if __name__ == "__main__":
    app.run(debug=True)
