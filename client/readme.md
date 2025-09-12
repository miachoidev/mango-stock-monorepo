# stock project

node -v 20.18.0
`npm install`
`npm run dev`

# 키움 API

키움 REST API - 주식화면 개발용 API 목록

1. 보유 종목 조회
   No. 1 - kt50020 (금현물 잔고확인)
   URL: /api/dostk/acnt
   Method: POST
   기능: 현재 보유 종목 목록 조회

2. 실시간 시세 조회 (WebSocket)
   No. 2 - 01 (주식현재가)
   URL: /api/dostk/websocket
   Method: POST (WebSocket)
   기능: 보유 종목의 실시간 현재가 조회
   No. 3 - 02 (주식호가)
   URL: /api/dostk/websocket
   Method: POST (WebSocket)
   기능: 실시간 호가 정보 조회
   No. 4 - 0g (주식종목정보)
   URL: /api/dostk/websocket
   Method: POST (WebSocket)
   기능: 종목 기본 정보 조회

3. 매수/매도 주문
   No. 5 - kt50000 (금현물 매수주문)
   URL: /api/dostk/ordr
   Method: POST
   기능: 주식 매수 주문
   No. 6 - kt50001 (금현물 매도주문)
   URL: /api/dostk/ordr
   Method: POST
   기능: 주식 매도 주문
   No. 7 - kt50002 (금현물 정정주문)
   URL: /api/dostk/ordr
   Method: POST
   기능: 주문 정정
   No. 8 - kt50003 (금현물 취소주문)
   URL: /api/dostk/ordr
   Method: POST
   기능: 주문 취소

4. 차트 데이터 조회
   No. 9 - kt20001 (주식기본정보요청)
   URL: /api/dostk/stkinfo
   Method: POST
   기능: 종목 기본 정보 및 차트 데이터
   No. 10 - kt20002 (주식일봉차트조회요청)
   URL: /api/dostk/stkinfo
   Method: POST
   기능: 일봉 차트 데이터 조회
   No. 11 - kt20003 (주식분봉차트조회요청)
   URL: /api/dostk/stkinfo
   Method: POST
   기능: 분봉 차트 데이터 조회

5. 계좌 정보
   No. 12 - kt50021 (금현물 예수금)
   URL: /api/dostk/acnt
   Method: POST
   기능: 예수금 잔고 조회
   No. 13 - kt50030 (금현물 주문체결전체조회)
   URL: /api/dostk/acnt
   Method: POST
   기능: 전체 주문 체결 내역 조회
   No. 14 - kt50031 (금현물 주문체결조회)
   URL: /api/dostk/acnt
   Method: POST
   기능: 특정 주문 체결 내역 조회

6. 실시간 추가 정보
   No. 15 - 0H (주식예상체결)
   URL: /api/dostk/websocket
   Method: POST (WebSocket)
   기능: 예상 체결가 조회
   No. 16 - 0F (주식당일거래원)
   URL: /api/dostk/websocket
   Method: POST (WebSocket)
   기능: 당일 거래원 정보
