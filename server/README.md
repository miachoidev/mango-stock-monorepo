## 🚀 실행 방법

### 1. UV 설치

```bash
brew install uv
```

### 2. Google API Key 설정

```bash
# .env 파일 생성
cp .env.example .env

# .env 파일 편집하여 API 키 설정
# GOOGLE_API_KEY=your_google_api_key_here
```

**Google API Key 발급 방법:**

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 또는 선택
3. **중요: API 활성화**
   - "API 및 서비스" > "라이브러리" 이동
   - "Generative Language API" 검색하여 **활성화**
   - "Vertex AI API" 검색하여 **활성화**
4. "API 및 서비스" > "사용자 인증 정보" 이동
5. "+ 사용자 인증 정보 만들기" > "API 키" 선택
6. 생성된 API 키를 `.env` 파일에 추가:

```
GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
GOOGLE_API_KEY=YOUR_API_KEY
```

### 3. 키움 API Key 발급 방법

```bash
# .env 파일에 키움 API 키 추가
# KIWOOM_APPKEY=your_kiwoom_appkey_here
# KIWOOM_SECRETKEY=your_kiwoom_secretkey_here
```

**키움 API Key 발급 방법:**

1. [키움 REST API 가이드](https://openapi.kiwoom.com/guide/apiguide?dummyVal=0) 접속
2. 키움증권 계정으로 로그인
3. API 사용신청 진행
4. 발급받은 App Key와 Secret Key를 `.env` 파일에 추가:

```
KIWOOM_APPKEY=YOUR_APP_KEY
KIWOOM_SECRETKEY=YOUR_SECRET_KEY
```


### 4. 프로젝트 설정 및 실행

```bash
# Python 3.12 설치
uv python install 3.12

# 가상환경 생성 및 의존성 설치
uv venv --python 3.12
uv sync

# 실행
source .venv/bin/activate
python main.py
```

서버가 `http://localhost:8000`에서 실행됩니다.

## 🌐 ADK Web UI 실행

Web UI를 통해 에이전트와 상호작용하려면:

```bash
# 가상환경 활성화 후
source .venv/bin/activate

# ADK Web UI 실행
adk web --port=8080 --reload stock/

# 또는 다른 포트로 실행
adk web --port=3000 --host=0.0.0.0 stock/
```

Web UI가 `http://localhost:8080`에서 실행됩니다.

## ⚠️ 문제 해결

### Google API 인증 오류

만약 `Your default credentials were not found` 오류가 발생하면:

**방법 1: .env 파일에 API 키 설정**

```bash
# .env 파일 생성 및 편집
echo "GOOGLE_API_KEY=your_google_api_key_here" > .env
```

**방법 2: 환경변수로 직접 설정**

```bash
export GOOGLE_API_KEY="your_google_api_key_here"
```

## 🔧 개발

```bash
# 새 패키지 추가
uv add package-name

# 패키지 제거
uv remove package-name
```

---
