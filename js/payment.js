window.TourPayment = {
  start(reservation) {
    sessionStorage.setItem("tourforu_reservation", JSON.stringify(reservation));

    showToast("토스페이먼츠 테스트 결제 연동 준비가 완료되었습니다.");

    setTimeout(() => {
      showPaymentDemo(reservation);
    }, 450);
  }
};
