# ADK Bean 🫘

AI 에이전트를 활용한 주식 정보 분석 및 마케팅 자동화 도구입니다.

## 📋 요구사항

- Python 3.12 이상
- macOS, Linux, 또는 Windows
- 터미널/명령 프롬프트 사용 가능

## 🚀 빠른 시작 가이드

### 1. 저장소 클론
```bash
git clone <repository-url>
cd adk-bean
```

### 2. UV 설치
#### macOS (Homebrew 사용)
```bash
brew install uv
```

#### Linux/Windows (공식 설치 스크립트)
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### 3. 프로젝트 환경 설정
```bash
# Python 3.12 설치
uv python install 3.12

# 가상환경 생성
uv venv --python 3.12

# 가상환경 활성화
source .venv/bin/activate  # macOS/Linux
# 또는
.venv\Scripts\activate     # Windows

# 의존성 설치
uv sync
```

### 4. 애플리케이션 실행
```bash
# 가상환경이 활성화된 상태에서
python main.py
```

## 🏗️ 프로젝트 구조

```
adk-bean/
├── main.py                 # 메인 애플리케이션 진입점
├── pyproject.toml          # 프로젝트 설정 및 의존성
├── stock/                  # 주식 관련 에이전트
│   ├── agent.py           # 메인 에이전트
│   ├── prompt.py          # 프롬프트 템플릿
│   └── sub_agents/        # 서브 에이전트들
├── google_tools/          # Google API 도구들
├── mcp_server/            # MCP 서버 구성
└── database/              # 데이터베이스 파일
```

## 🔧 주요 기능

- **주식 정보 분석**: Google ADK를 활용한 주식 데이터 분석
- **콘텐츠 생성**: AI 에이전트를 통한 자동 콘텐츠 생성
- **트렌드 분석**: Google Trends API를 활용한 시장 트렌드 분석
- **MCP 서버**: 다양한 외부 서비스와의 연동

## 📖 사용법

### 기본 실행
```bash
# 가상환경 활성화 후
python main.py
```

### 개발 모드 실행
```bash
# 의존성 다시 설치
uv sync

# 애플리케이션 실행
python main.py
```

## 🔧 개발 환경 설정

### 새로운 패키지 추가
```bash
# 패키지 추가
uv add package-name

# 개발 전용 패키지 추가
uv add --dev package-name
```

### 패키지 제거
```bash
uv remove package-name
```

## 📝 환경 변수

프로젝트 실행 전 필요한 환경 변수들을 설정하세요:

```bash
# .env 파일 생성 (예시)
GOOGLE_API_KEY=your-google-api-key
DATABASE_URL=sqlite:///database/adk-db.sqlite
```

## 🐛 문제 해결

### Python 버전 문제
```bash
# 현재 Python 버전 확인
python --version

# UV로 Python 3.12 설치
uv python install 3.12

# 가상환경 재생성
rm -rf .venv
uv venv --python 3.12
```

### 의존성 설치 문제
```bash
# 캐시 삭제 후 재설치
uv cache clean
uv sync
```

### 가상환경 활성화 확인
```bash
# 가상환경이 활성화되었는지 확인
which python
# 출력 예시: /path/to/project/.venv/bin/python
```

### 모듈 import 오류
```bash
# 프로젝트 루트 디렉토리에서 실행하고 있는지 확인
pwd
# 출력: /path/to/adk-bean

# Python path 확인
python -c "import sys; print(sys.path)"
```

## 💡 유용한 명령어

```bash
# UV 버전 확인
uv --version

# 설치된 패키지 목록 확인
uv pip list

# 프로젝트 정보 확인
uv show

# 가상환경 위치 확인
uv venv --show-path
```

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 기능 브랜치를 생성하세요 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋하세요 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 푸시하세요 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성하세요

## 📜 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해주세요.

---

**참고**: UV는 Rust로 작성된 빠른 Python 패키지 매니저입니다. 기존의 pip/conda보다 훨씬 빠른 설치 속도를 제공합니다.
