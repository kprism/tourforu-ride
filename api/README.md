# TOURFORU Ride route API

Cloud Run용 자동차 실제 도로경로 프록시입니다.

환경변수:
- KAKAO_REST_API_KEY: Kakao Developers REST API key
- ALLOWED_ORIGINS: 기본값 https://kprism.github.io

배포 후 관리자 페이지에서 window.TOURFORU_API_BASE 값을 Cloud Run 서비스 URL로 설정합니다.
