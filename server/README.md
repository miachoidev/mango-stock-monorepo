## 🚀 실행 방법

### 1. UV 설치

```bash
brew install uv
```

### 2. 프로젝트 설정 및 실행

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

## 🔧 개발

```bash
# 새 패키지 추가
uv add package-name

# 패키지 제거
uv remove package-name
```

---
