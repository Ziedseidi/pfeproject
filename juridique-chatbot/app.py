from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import unicodedata
import re
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)
CORS(app)

# Charger les données
data = pd.read_csv("lois.csv")

# Nettoyage simple
def normalize_text(text):
    text = text.lower()
    text = ''.join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    text = re.sub(r'[^\w\s]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

# Appliquer la normalisation
data["normalized_question"] = data["question"].apply(normalize_text)

# Charger un modèle de similarité sémantique
model = SentenceTransformer('paraphrase-MiniLM-L6-v2')

# Encoder toutes les questions du CSV
question_embeddings = model.encode(data["normalized_question"], convert_to_tensor=True)

@app.route("/")
def home():
    return "Bienvenue sur le chatbot juridique sémantique !"

@app.route("/question", methods=["GET"])
def get_answer():
    user_question = request.args.get("q", "")
    user_norm = normalize_text(user_question)

    # Embedding de la question utilisateur
    user_embedding = model.encode(user_norm, convert_to_tensor=True)

    # Calcul des similarités
    similarities = util.cos_sim(user_embedding, question_embeddings)[0]
    best_score = float(similarities.max())
    best_index = int(similarities.argmax())

    if best_score > 0.5:
        return jsonify({
            "question": data.iloc[best_index]["question"],
            "réponse": data.iloc[best_index]["réponse"],
            "score_sémantique": round(best_score, 2)
        })
    else:
        return jsonify({
            "réponse": "Désolé, je ne comprends pas bien votre question. Pouvez-vous reformuler ?",
            "score_sémantique": round(best_score, 2)
        })

if __name__ == "__main__":
    app.run(debug=True)
