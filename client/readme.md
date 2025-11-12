# AI 주식 투자 어시스턴트

> 개인 투자자들을 위한 멀티 에이전트 기반 주식 분석 및 투자 조언 서비스

<img width="3146" height="1828" alt="image" src="https://github.com/user-attachments/assets/d3261adb-2920-4803-851b-2a8e6fae00a4" />

## 서비스 소개

AI 주식 투자 어시스턴트는 개인 투자자들이 복잡한 주식 시장에서 더 나은 투자 결정을 내릴 수 있도록 돕는 멀티 에이전트 기반 서비스입니다. 키움증권 API와 ADK(Agent Development Kit)를 활용하여 실시간 데이터 분석과 맞춤형 투자 조언을 제공합니다.
서버 주소 : https://github.com/bbnerino/mango-stock-server

## 왜 이 서비스가 필요한가?

### 개인 투자자들이 겪는 문제점

- **"어떤 종목이 좋을까?"** - 수많은 종목 중에서 선택의 어려움
- **"지금이 매수 타이밍일까?"** - 매수/매도 시점 판단의 어려움
- **"기관들은 뭘 사고 있을까?"** - 기관 투자자들의 동향 파악 어려움

### 주요 문제점들

- 주식 투자는 어렵고 시간이 많이 든다
- 무지성으로 매수한 종목들과 언제 매도해야할지 판단하기가 어려움
- 수많은 전문가들의 종목 추천과 인터넷의 많은 글들이 있지만 어떤 기준으로 내 투자에 적용할지 모르는게 현실
- 시간이 없음. 그냥 매수할지 매도할지 추매할지 알려줬으면 좋겠음

## 주요 기능

- **내 보유 종목들과 기본적인 주식 앱과 같이 종목 정보들을 확인**
- **내가 보유한 종목에 대해서 내 상황에 맞게 분석하여 투자 조언 제공 (매수, 매도, 홀딩 단순하게 명확하게)**
- **여러 종목들에 대해서 종목에 대한 평가나 전망을 분석하고 투자 조언 제공**
- **현재 전체 주식판의 트렌드(섹터, 종목,테마)를 분석하여 어디에 새로 투자할지 데이터를 기반으로 조언**

## 기술 스택

### Frontend (Client)

- **Framework**: Next.js 15.5.2 (React 19.1.0)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Radix UI
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Markdown**: React Markdown + Shiki

### Backend (Server)

- **AI Framework**: ADK (Agent Development Kit)
- **Stock API**: 키움증권 REST API
- **Real-time**: WebSocket 연결
- **Communication**: HTTP API + Server-Sent Events (SSE)

## 멀티 에이전트 구조

여러개의 AI 에이전트가 협력하여 하나의 목표를 달성하는 시스템으로, 마치 회사에서 마케팅, 개발, 기획팀이 협력하듯 각자 전문 분야에서 소통하며 협업합니다.

### 에이전트 구성

1. **종목 분석 에이전트** → 종목별 가격/수급/공매도 분석
2. **계좌 분석 에이전트** → 보유 종목 평단/수익률 분석
3. **업종 분석 에이전트** → 업종 강도/섹터 추세 분석
4. **시세 분석 에이전트** → 오늘 시장 전체 요약
5. **콘텐츠 리서치 에이전트** → 유튜브/구글 검색 기반 정보 수집
6. **기관 트래킹 에이전트** → 유명 투자자/기관 매매 분석

### 멀티 에이전트의 장점

- 각 에이전트가 특정 분야에 특화되어 있어 더 정확하고 깊이 있는 분석 가능
- 에이전트들이 서로의 결과를 검토하고 보완하여 실수나 편향을 줄이고 신뢰할 수 있는 결과 도출
- 새로운 기능이 필요할 때 해당 분야 에이전트만 추가하면 되어 유연한 확장 가능
- 일반 답변보다 토큰을 많이 사용하지만, 그만큼 전문성 있는 답변 가능

## 설치 및 실행

### 요구사항

- Node.js 20.18.0 이상
- 키움증권 계좌 및 API 키

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경 설정

```bash
# .env.local 파일 생성
cp .env.example .env.local

# 환경 변수 설정
KIWOOM_API_KEY=your_kiwoom_api_key
ADK_SERVER_URL=http://localhost:8000
```

## API 문서

### 키움증권 REST API

#### 1. 보유 종목 조회

- **API**: `kt50020` (금현물 잔고확인)
- **URL**: `/api/dostk/acnt`
- **Method**: POST
- **기능**: 현재 보유 종목 목록 조회

#### 2. 실시간 시세 조회 (WebSocket)

- **주식현재가**: `01` - `/api/dostk/websocket`
- **주식호가**: `02` - `/api/dostk/websocket`
- **주식종목정보**: `0g` - `/api/dostk/websocket`

#### 3. 매수/매도 주문

- **매수주문**: `kt50000` - `/api/dostk/ordr`
- **매도주문**: `kt50001` - `/api/dostk/ordr`
- **정정주문**: `kt50002` - `/api/dostk/ordr`
- **취소주문**: `kt50003` - `/api/dostk/ordr`

#### 4. 차트 데이터 조회

- **주식기본정보**: `kt20001` - `/api/dostk/stkinfo`
- **일봉차트**: `kt20002` - `/api/dostk/stkinfo`
- **분봉차트**: `kt20003` - `/api/dostk/stkinfo`

#### 5. 계좌 정보

- **예수금**: `kt50021` - `/api/dostk/acnt`
- **주문체결전체조회**: `kt50030` - `/api/dostk/acnt`
- **주문체결조회**: `kt50031` - `/api/dostk/acnt`

### ADK API

#### 채팅 API

- **일반 채팅**: `POST /api/adk`
- **스트리밍 채팅**: `POST /api/adk/streaming`

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── adk/          # ADK 서버 연동
│   │   └── kiwoom/       # 키움 API 연동
│   ├── stock/            # 주식 관련 페이지
│   └── (chat)/           # 채팅 페이지
├── components/            # React 컴포넌트
│   ├── chat/             # 채팅 관련 컴포넌트
│   ├── stock/            # 주식 관련 컴포넌트
│   └── ui/               # UI 컴포넌트
├── hooks/                # Custom Hooks
├── types/                # TypeScript 타입 정의
└── utils/                # 유틸리티 함수
    └── api/              # API 호출 함수들
```

---

개선 방향
-> 실시간성 화면도 좋지만 1일 2회 정도의 데이터여도 충분할듯하다 ?
미리 데이터를 다 당겨놓고 저장해 놓는 방식은 ?
