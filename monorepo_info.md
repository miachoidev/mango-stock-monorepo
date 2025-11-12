# Mango Stock Monorepo

이 레포지토리는 mango-stock-server와 mango-stock-client를 하나의 모노레포로 통합한 것입니다.

## 병합 방법

### 방법 1: 전체 히스토리 보존 (권장)

이 방법은 모든 커밋 히스토리와 기여자 정보를 완벽하게 보존합니다.

```bash
# 실행 권한 부여
chmod +x merge-repos.sh

# 스크립트 실행
./merge-repos.sh
```

**필수 요구사항:**
- `git-filter-repo` 설치 (권장)
  ```bash
  brew install git-filter-repo
  # 또는
  pip install git-filter-repo
  ```

### 방법 2: 간단한 병합 (히스토리 압축)

이 방법은 더 간단하지만 커밋 히스토리가 압축됩니다.

```bash
# 실행 권한 부여
chmod +x merge-repos-simple.sh

# 스크립트 실행
./merge-repos-simple.sh
```

## 디렉토리 구조

병합 후 예상되는 구조:

```
mango-stock-monorepo/
├── server/          # mango-stock-server 소스
├── client/          # mango-stock-client 소스
└── README.md
```

## 병합 후 작업

1. **파일 구조 확인**
   ```bash
   ls -la
   ```

2. **히스토리 확인**
   ```bash
   git log --oneline --graph --all
   ```

3. **원격 레포지토리 연결 및 푸시**
   ```bash
   git remote add origin https://github.com/miachoidev/mango-stock-monorepo.git
   git branch -M main  # 또는 master
   git push -u origin main
   ```

## 문제 해결

### git-filter-repo 설치 오류

macOS에서:
```bash
brew install git-filter-repo
```

Python이 설치되어 있다면:
```bash
pip install git-filter-repo
```

### 병합 충돌 발생 시

스크립트가 자동으로 처리하지만, 수동으로 해결해야 할 경우:
```bash
# 충돌 파일 확인
git status

# 충돌 해결 후
git add .
git commit -m "Resolve merge conflicts"
```

## 참고

- 원본 레포지토리:
  - Server: https://github.com/bbnerino/mango-stock-server.git
  - Client: https://github.com/bbnerino/mango-stock-client.git

