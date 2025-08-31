from flask import Flask,jsonify
from flask_cors import CORS
from scraper import fetch_latest_news

app = Flask(__name__)
CORS(app)
@app.route("/latest-news",methods=["GET"])
def get_latest_news():
    try:
        news = fetch_latest_news(5)
        return jsonify(news)
    except Exception as e:
        return jsonify({"error":str(e)}),500
    
if __name__ == "__main__":
    app.run(debug=True)