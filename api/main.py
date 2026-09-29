import os
import requests
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
DATA_FILE = os.path.join(os.path.dirname(__file__), "tourforu_data.json")

def empty_data():
    return {"courses":[],"rides":[],"drivers":[],"reservations":[],"payments":[]}

def load_shared_data():
    if os.path.exists(DATA_FILE):
        try:
            import json
            with open(DATA_FILE,"r",encoding="utf-8") as f:
                data=json.load(f)
            for k,v in empty_data().items():data.setdefault(k,v)
            return data
        except Exception:pass
    return empty_data()

def save_shared_data(data):
    import json,tempfile
    fd,tmp=tempfile.mkstemp(prefix="tourforu_",suffix=".json",dir=os.path.dirname(DATA_FILE))
    try:
        with os.fdopen(fd,"w",encoding="utf-8") as f:json.dump(data,f,ensure_ascii=False)
        os.replace(tmp,DATA_FILE)
    finally:
        if os.path.exists(tmp):os.remove(tmp)

CORS(app,origins=os.getenv("ALLOWED_ORIGINS","https://kprism.github.io").split(","))

def extract_path(payload):
    routes=payload.get("routes") or []
    if not routes or routes[0].get("result_code")!=0:raise ValueError((routes[0].get("result_msg") if routes else None) or "길찾기 결과가 없습니다.")
    path=[]
    for section in routes[0].get("sections",[]):
        for road in section.get("roads",[]):
            vertices=road.get("vertexes") or []
            for i in range(0,len(vertices)-1,2):
                point={"lng":vertices[i],"lat":vertices[i+1]}
                if not path or path[-1]!=point:path.append(point)
    return path,routes[0].get("summary") or {}

@app.get("/api/data")
def get_shared_data():
    data=load_shared_data();data["_initialized"]=os.path.exists(DATA_FILE);return jsonify(data)

@app.put("/api/data")
def put_shared_data():
    body=request.get_json(silent=True) or {}
    for k in ("courses","rides","drivers","reservations","payments"):
        if not isinstance(body.get(k,[]),list):return jsonify({"error":f"{k} 배열이 필요합니다."}),400
    payload={k:body.get(k,[]) for k in empty_data()};save_shared_data(payload)
    return jsonify({"ok":True,**{k:len(v) for k,v in payload.items()}})

@app.post("/api/reservations")
def create_reservation():
    body=request.get_json(silent=True) or {}
    if not body.get("orderId"):return jsonify({"error":"orderId가 필요합니다."}),400
    data=load_shared_data();items=data["reservations"]
    old=next((x for x in items if x.get("orderId")==body["orderId"]),None)
    if old:old.update(body)
    else:items.insert(0,body)
    save_shared_data(data);return jsonify({"ok":True,"reservation":body})

@app.patch("/api/reservations/<order_id>")
def update_reservation(order_id):
    body=request.get_json(silent=True) or {};data=load_shared_data();item=next((x for x in data["reservations"] if x.get("orderId")==order_id),None)
    if not item:return jsonify({"error":"예약을 찾을 수 없습니다."}),404
    item.update(body);save_shared_data(data);return jsonify({"ok":True,"reservation":item})

@app.get("/health")
def health():return jsonify({"ok":True})

@app.post("/api/routes/car")
def car_route():
    key=os.getenv("KAKAO_REST_API_KEY")
    if not key:return jsonify({"error":"KAKAO_REST_API_KEY가 설정되지 않았습니다."}),503
    points=(request.get_json(silent=True) or {}).get("points") or [];points=[p for p in points if p.get("lat") is not None and p.get("lng") is not None]
    if len(points)<2:return jsonify({"error":"출발지와 도착지가 필요합니다."}),400
    if len(points)>7:return jsonify({"error":"일반 자동차 길찾기는 경유지 최대 5개까지 지원합니다."}),400
    params={"origin":f'{points[0]["lng"]},{points[0]["lat"]}',"destination":f'{points[-1]["lng"]},{points[-1]["lat"]}',"priority":"RECOMMEND","summary":"false","road_details":"false"}
    if len(points)>2:params["waypoints"]="|".join(f'{p["lng"]},{p["lat"]}' for p in points[1:-1])
    try:
        r=requests.get("https://apis-navi.kakaomobility.com/v1/directions",params=params,headers={"Authorization":f"KakaoAK {key}","Content-Type":"application/json"},timeout=15);data=r.json()
        if not r.ok:return jsonify({"error":data.get("msg") or data.get("message") or "카카오 길찾기 요청 실패"}),r.status_code
        path,summary=extract_path(data);return jsonify({"path":path,"distance":summary.get("distance"),"duration":summary.get("duration"),"source":"kakao-mobility"})
    except (requests.RequestException,ValueError) as e:return jsonify({"error":str(e)}),502

@app.post("/api/payments/confirm")
def confirm_payment():
    secret=os.getenv("TOSS_SECRET_KEY")
    if not secret:return jsonify({"error":"TOSS_SECRET_KEY가 설정되지 않았습니다."}),503
    body=request.get_json(silent=True) or {};payment_key,order_id,amount=body.get("paymentKey"),body.get("orderId"),body.get("amount")
    if not payment_key or not order_id or amount is None:return jsonify({"error":"paymentKey, orderId, amount가 필요합니다."}),400
    try:
        import base64
        auth=base64.b64encode((secret+":").encode()).decode();r=requests.post("https://api.tosspayments.com/v1/payments/confirm",json={"paymentKey":payment_key,"orderId":order_id,"amount":int(amount)},headers={"Authorization":f"Basic {auth}","Content-Type":"application/json"},timeout=15);result=r.json()
        if not r.ok:return jsonify({"error":result.get("message") or "토스페이먼츠 결제 승인 실패","code":result.get("code")}),r.status_code
        payment={"paymentKey":result.get("paymentKey"),"orderId":result.get("orderId"),"status":result.get("status"),"method":result.get("method"),"totalAmount":result.get("totalAmount"),"approvedAt":result.get("approvedAt")}
        data=load_shared_data();data["payments"]=[x for x in data["payments"] if x.get("orderId")!=order_id];data["payments"].insert(0,payment)
        reservation=next((x for x in data["reservations"] if x.get("orderId")==order_id),None)
        if reservation:reservation.update({"status":"confirmed","paymentStatus":"paid","paidAt":payment["approvedAt"]})
        save_shared_data(data);return jsonify(payment)
    except requests.RequestException as e:return jsonify({"error":str(e)}),502
