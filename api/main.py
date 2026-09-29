import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

DATA_FILE = os.path.join(os.path.dirname(__file__), "tourforu_data.json")

def load_shared_data():
    if os.path.exists(DATA_FILE):
        try:
            import json
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {"courses": [], "rides": []}

def save_shared_data(data):
    import json, tempfile
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    fd, tmp = tempfile.mkstemp(prefix="tourforu_", suffix=".json", dir=os.path.dirname(DATA_FILE))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)
        os.replace(tmp, DATA_FILE)
    finally:
        if os.path.exists(tmp): os.remove(tmp)

CORS(app, origins=os.getenv("ALLOWED_ORIGINS", "https://kprism.github.io").split(","))

def extract_path(payload):
    routes = payload.get("routes") or []
    if not routes or routes[0].get("result_code") != 0:
        raise ValueError((routes[0].get("result_msg") if routes else None) or "길찾기 결과가 없습니다.")
    path = []
    for section in routes[0].get("sections", []):
        for road in section.get("roads", []):
            vertices = road.get("vertexes") or []
            for i in range(0, len(vertices) - 1, 2):
                point = {"lng": vertices[i], "lat": vertices[i + 1]}
                if not path or path[-1] != point:
                    path.append(point)
    return path, routes[0].get("summary") or {}

@app.get("/api/data")
def get_shared_data():
    data = load_shared_data()
    data["_initialized"] = os.path.exists(DATA_FILE)
    return jsonify(data)

@app.put("/api/data")
def put_shared_data():
    body = request.get_json(silent=True) or {}
    if not isinstance(body.get("courses"), list) or not isinstance(body.get("rides"), list):
        return jsonify({"error":"courses와 rides 배열이 필요합니다."}), 400
    save_shared_data({"courses":body["courses"],"rides":body["rides"]})
    return jsonify({"ok":True,"courses":len(body["courses"]),"rides":len(body["rides"])})

@app.get("/health")
def health():
    return jsonify({"ok": True})

@app.post("/api/routes/car")
def car_route():
    key = os.getenv("KAKAO_REST_API_KEY")
    if not key:
        return jsonify({"error": "KAKAO_REST_API_KEY가 설정되지 않았습니다."}), 503
    points = (request.get_json(silent=True) or {}).get("points") or []
    points = [p for p in points if p.get("lat") is not None and p.get("lng") is not None]
    if len(points) < 2:
        return jsonify({"error": "출발지와 도착지가 필요합니다."}), 400
    if len(points) > 7:
        return jsonify({"error": "일반 자동차 길찾기는 경유지 최대 5개까지 지원합니다."}), 400
    params = {
        "origin": f'{points[0]["lng"]},{points[0]["lat"]}',
        "destination": f'{points[-1]["lng"]},{points[-1]["lat"]}',
        "priority": "RECOMMEND",
        "summary": "false",
        "road_details": "false",
    }
    if len(points) > 2:
        params["waypoints"] = "|".join(f'{p["lng"]},{p["lat"]}' for p in points[1:-1])
    try:
        r = requests.get(
            "https://apis-navi.kakaomobility.com/v1/directions",
            params=params,
            headers={"Authorization": f"KakaoAK {key}", "Content-Type": "application/json"},
            timeout=15,
        )
        data = r.json()
        if not r.ok:
            return jsonify({"error": data.get("msg") or data.get("message") or "카카오 길찾기 요청 실패"}), r.status_code
        path, summary = extract_path(data)
        return jsonify({"path": path, "distance": summary.get("distance"), "duration": summary.get("duration"), "source": "kakao-mobility"})
    except (requests.RequestException, ValueError) as e:
        return jsonify({"error": str(e)}), 502


@app.post("/api/payments/confirm")
def confirm_payment():
    secret = os.getenv("TOSS_SECRET_KEY")
    if not secret:
        return jsonify({"error": "TOSS_SECRET_KEY가 설정되지 않았습니다."}), 503
    body = request.get_json(silent=True) or {}
    payment_key, order_id, amount = body.get("paymentKey"), body.get("orderId"), body.get("amount")
    if not payment_key or not order_id or amount is None:
        return jsonify({"error": "paymentKey, orderId, amount가 필요합니다."}), 400
    try:
        import base64
        auth = base64.b64encode((secret + ":").encode()).decode()
        r = requests.post(
            "https://api.tosspayments.com/v1/payments/confirm",
            json={"paymentKey": payment_key, "orderId": order_id, "amount": int(amount)},
            headers={"Authorization": f"Basic {auth}", "Content-Type": "application/json"},
            timeout=15,
        )
        data = r.json()
        if not r.ok:
            return jsonify({"error": data.get("message") or "토스페이먼츠 결제 승인 실패", "code": data.get("code")}), r.status_code
        return jsonify({"paymentKey": data.get("paymentKey"), "orderId": data.get("orderId"), "status": data.get("status"), "method": data.get("method"), "totalAmount": data.get("totalAmount"), "approvedAt": data.get("approvedAt")})
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 502
