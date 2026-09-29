window.TOURFORU_TOSS_CLIENT_KEY = "test_ck_5OWRapdA8dWAXNxMB74Aro1zEqZK";
window.TOURFORU_API_BASE = "https://glorious-journey-69p6ww67rx65f55gv-8080.app.github.dev";

window.TourPayment = {
  async start(reservation) {
    sessionStorage.setItem("tourforu_reservation", JSON.stringify(reservation));
    try {
      if (!window.TossPayments) throw new Error("토스페이먼츠 SDK를 불러오지 못했습니다.");
      const tossPayments = TossPayments(window.TOURFORU_TOSS_CLIENT_KEY);
      const payment = tossPayments.payment({ customerKey: TossPayments.ANONYMOUS });
      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: Number(reservation.amount) },
        orderId: reservation.orderId,
        orderName: reservation.course + " 차량·가이드 예약",
        successUrl: location.origin + location.pathname + "?payment=success",
        failUrl: location.origin + location.pathname + "?payment=fail",
      });
    } catch (e) {
      showToast(e.message || "결제창을 열지 못했습니다.");
    }
  },

  async handleRedirect() {
    const q = new URLSearchParams(location.search);
    const result = q.get("payment");
    if (!result) return false;
    if (result === "fail") {
      showPaymentFailure(q.get("message") || "결제가 취소되었거나 실패했습니다.");
      return true;
    }
    const reservation = JSON.parse(sessionStorage.getItem("tourforu_reservation") || "null");
    if (!reservation) {
      showPaymentFailure("예약 정보를 찾을 수 없습니다. 다시 예약해주세요.");
      return true;
    }
    const amount = Number(q.get("amount"));
    if (amount !== Number(reservation.amount) || q.get("orderId") !== reservation.orderId) {
      showPaymentFailure("결제 정보가 예약 정보와 일치하지 않습니다.");
      return true;
    }
    try {
      const r = await fetch(window.TOURFORU_API_BASE + "/api/payments/confirm", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({paymentKey:q.get("paymentKey"), orderId:q.get("orderId"), amount})
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "결제 승인에 실패했습니다.");
      showPaymentSuccess(reservation, data);
    } catch(e) {
      showPaymentFailure(e.message);
    }
    return true;
  }
};