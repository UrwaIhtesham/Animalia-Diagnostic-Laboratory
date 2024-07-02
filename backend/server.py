from flask import Flask

app = Flask(__name__)

#API routes
@app.route("/members")

def members():
    return {"members": ["Members1", "Members2", "Members2"]}

if __name__ == "__main__":
    app.run(debug=True)
