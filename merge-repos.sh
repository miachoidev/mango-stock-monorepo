#!/bin/bash

# 모노레포 병합 스크립트
# 이 스크립트는 두 개의 레포지토리를 하나의 모노레포로 병합합니다.
# 히스토리와 기여자 정보를 모두 보존합니다.

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 레포지토리 URL
MONOREPO_URL="https://github.com/miachoidev/mango-stock-monorepo.git"
SERVER_REPO_URL="https://github.com/bbnerino/mango-stock-server.git"
CLIENT_REPO_URL="https://github.com/bbnerino/mango-stock-client.git"

# 디렉토리 이름
SERVER_DIR="server"
CLIENT_DIR="client"
TEMP_DIR="temp-repos"

echo -e "${GREEN}=== 모노레포 병합 작업 시작 ===${NC}\n"

# 1. 현재 디렉토리 확인 (스크립트 파일과 문서는 제외)
# .git 디렉토리나 실제 소스 파일이 있으면 경고
EXISTING_FILES=$(ls -A . 2>/dev/null | grep -v -E "^(merge-repos.*\.sh|README\.md|\.git)$" || true)
if [ -n "$EXISTING_FILES" ] || [ -d ".git" ]; then
    if [ -d ".git" ]; then
        echo -e "${YELLOW}경고: 이미 git 저장소가 초기화되어 있습니다.${NC}"
        read -p "기존 git 저장소를 사용하시겠습니까? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
        # 기존 git 저장소 사용 시 초기화 건너뛰기
        SKIP_INIT=true
    else
        echo -e "${RED}오류: 현재 디렉토리에 파일이 있습니다:${NC}"
        echo "$EXISTING_FILES"
        echo ""
        echo "스크립트 파일과 README 외의 파일이 있으면 병합 작업을 진행할 수 없습니다."
        exit 1
    fi
else
    SKIP_INIT=false
fi

# 2. git filter-repo 설치 확인 (권장 방법)
# brew나 pip 설치 둘 다 인식 가능하도록 개선
if command -v git-filter-repo &> /dev/null || git filter-repo --help &> /dev/null 2>&1; then
    USE_FILTER_REPO=true
    echo -e "${GREEN}✓ git-filter-repo가 설치되어 있습니다.${NC}\n"
else
    echo -e "${YELLOW}경고: git-filter-repo가 설치되어 있지 않습니다.${NC}"
    echo "설치 방법:"
    echo "  brew install git-filter-repo"
    echo "  또는"
    echo "  pip install git-filter-repo"
    echo ""
    read -p "계속하시겠습니까? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    USE_FILTER_REPO=false
fi

# 3. 임시 디렉토리 생성
mkdir -p $TEMP_DIR
cd $TEMP_DIR

# 4. 서버 레포지토리 클론 및 필터링
echo -e "${GREEN}[1/4] 서버 레포지토리 처리 중...${NC}"
git clone $SERVER_REPO_URL server-orig
cd server-orig

if [ "$USE_FILTER_REPO" = true ]; then
    # git-filter-repo 사용 (더 빠르고 안전함)
    git filter-repo --to-subdirectory-filter $SERVER_DIR --force
    # filter-repo 후 clean-up (백업 refs 정리)
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
else
    # git filter-branch 사용 (대체 방법)
    echo "git filter-branch를 사용하여 파일 이동 중..."
    git filter-branch --prune-empty --force --index-filter '
        git ls-files -s | sed "s-\t\"*-&'$SERVER_DIR'/-" |
        GIT_INDEX_FILE=$GIT_INDEX_FILE.new git update-index --index-info &&
        mv "$GIT_INDEX_FILE.new" "$GIT_INDEX_FILE"
    ' --tag-name-filter cat -- --all
    rm -rf .git/refs/original/
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
fi

cd ..

# 5. 클라이언트 레포지토리 클론 및 필터링
echo -e "${GREEN}[2/4] 클라이언트 레포지토리 처리 중...${NC}"
git clone $CLIENT_REPO_URL client-orig
cd client-orig

if [ "$USE_FILTER_REPO" = true ]; then
    git filter-repo --to-subdirectory-filter $CLIENT_DIR --force
    # filter-repo 후 clean-up (백업 refs 정리)
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
else
    # git filter-branch 사용 (대체 방법)
    echo "git filter-branch를 사용하여 파일 이동 중..."
    git filter-branch --prune-empty --force --index-filter '
        git ls-files -s | sed "s-\t\"*-&'$CLIENT_DIR'/-" |
        GIT_INDEX_FILE=$GIT_INDEX_FILE.new git update-index --index-info &&
        mv "$GIT_INDEX_FILE.new" "$GIT_INDEX_FILE"
    ' --tag-name-filter cat -- --all
    rm -rf .git/refs/original/
    git reflog expire --expire=now --all
    git gc --prune=now --aggressive
fi

cd ..

# 6. 모노레포 초기화
echo -e "${GREEN}[3/4] 모노레포 초기화 중...${NC}"
cd ..
if [ "$SKIP_INIT" != true ]; then
    git init
    git remote add origin $MONOREPO_URL 2>/dev/null || git remote set-url origin $MONOREPO_URL
else
    # 기존 git 저장소 사용
    git remote add origin $MONOREPO_URL 2>/dev/null || git remote set-url origin $MONOREPO_URL
    echo -e "${GREEN}✓ 기존 git 저장소를 사용합니다.${NC}"
fi

# 7. 모노레포 루트 .gitignore 추가 (빌드 캐시 방지)
if [ ! -f .gitignore ] || ! grep -q "Monorepo root" .gitignore 2>/dev/null; then
    echo -e "# Monorepo root\nnode_modules/\n__pycache__/\n*.log\n.env\n.DS_Store" >> .gitignore
    git add .gitignore
    git commit -m "chore: add monorepo root .gitignore" 2>/dev/null || true
fi

# 8. 서버 레포지토리 병합
echo -e "${GREEN}[4/5] 서버 레포지토리 병합 중...${NC}"
git remote add server-orig $TEMP_DIR/server-orig
git fetch server-orig

# 서버의 기본 브랜치 찾기 및 병합
SERVER_BRANCH=""
if git show-ref --verify --quiet refs/remotes/server-orig/main; then
    SERVER_BRANCH="main"
elif git show-ref --verify --quiet refs/remotes/server-orig/master; then
    SERVER_BRANCH="master"
else
    # 첫 번째 브랜치 사용
    SERVER_BRANCH=$(git branch -r | grep 'server-orig/' | head -1 | sed 's|server-orig/||' | xargs)
fi

if [ -n "$SERVER_BRANCH" ]; then
    echo "서버 브랜치 병합: $SERVER_BRANCH"
    git merge --allow-unrelated-histories -m "Merge server repository (branch: $SERVER_BRANCH)" server-orig/$SERVER_BRANCH
else
    echo -e "${RED}오류: 서버 레포지토리의 브랜치를 찾을 수 없습니다.${NC}"
    exit 1
fi

# 9. 클라이언트 레포지토리 병합
echo -e "${GREEN}[5/5] 클라이언트 레포지토리 병합 중...${NC}"
git remote add client-orig $TEMP_DIR/client-orig
git fetch client-orig

# 클라이언트의 기본 브랜치 찾기 및 병합
CLIENT_BRANCH=""
if git show-ref --verify --quiet refs/remotes/client-orig/main; then
    CLIENT_BRANCH="main"
elif git show-ref --verify --quiet refs/remotes/client-orig/master; then
    CLIENT_BRANCH="master"
else
    # 첫 번째 브랜치 사용
    CLIENT_BRANCH=$(git branch -r | grep 'client-orig/' | head -1 | sed 's|client-orig/||' | xargs)
fi

if [ -n "$CLIENT_BRANCH" ]; then
    echo "클라이언트 브랜치 병합: $CLIENT_BRANCH"
    git merge --allow-unrelated-histories -m "Merge client repository (branch: $CLIENT_BRANCH)" client-orig/$CLIENT_BRANCH
else
    echo -e "${RED}오류: 클라이언트 레포지토리의 브랜치를 찾을 수 없습니다.${NC}"
    exit 1
fi

# 10. 원격 레포지토리 URL 업데이트 (나중에 업데이트 가져오기 위해 유지)
# 로컬 경로 대신 실제 원격 URL로 변경
git remote set-url server-orig $SERVER_REPO_URL
git remote set-url client-orig $CLIENT_REPO_URL

echo -e "${GREEN}✓ 원격 레포지토리 정보가 유지되었습니다.${NC}"
echo "  - server-orig: $SERVER_REPO_URL"
echo "  - client-orig: $CLIENT_REPO_URL"
echo "  (나중에 업데이트를 가져오려면: git fetch server-orig && git merge server-orig/main)"

# 11. 임시 디렉토리 정리
echo -e "${GREEN}임시 파일 정리 중...${NC}"
cd ..
rm -rf $TEMP_DIR

# 12. 기본 브랜치 이름 확인 및 설정
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "master")
if [ -z "$CURRENT_BRANCH" ] || [ "$CURRENT_BRANCH" = "master" ]; then
    # main 브랜치로 변경 시도
    if git show-ref --verify --quiet refs/heads/main 2>/dev/null || \
       git show-ref --verify --quiet refs/remotes/server-orig/main 2>/dev/null || \
       git show-ref --verify --quiet refs/remotes/client-orig/main 2>/dev/null; then
        git branch -M main 2>/dev/null || true
        CURRENT_BRANCH="main"
    fi
fi

echo -e "\n${GREEN}=== 병합 완료! ===${NC}\n"
echo "다음 단계:"
echo "1. 파일 구조 확인: ls -la"
echo "2. 히스토리 확인: git log --oneline --graph --all"
echo "3. 원격 레포지토리에 푸시: git push -u origin $CURRENT_BRANCH"

