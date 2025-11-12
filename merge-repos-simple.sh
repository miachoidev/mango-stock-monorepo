#!/bin/bash

# 간단한 모노레포 병합 스크립트 (git subtree 사용)
# 이 방법은 더 간단하지만 히스토리가 약간 다르게 보일 수 있습니다.

set -e

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SERVER_REPO_URL="https://github.com/bbnerino/mango-stock-server.git"
CLIENT_REPO_URL="https://github.com/bbnerino/mango-stock-client.git"

echo -e "${GREEN}=== 간단한 모노레포 병합 작업 시작 ===${NC}\n"

# 1. 모노레포 초기화
echo "[1/3] 모노레포 초기화..."
git init
git commit --allow-empty -m "Initial monorepo commit"

# 2. 서버 레포지토리 추가
echo "[2/3] 서버 레포지토리 추가..."
git remote add server-remote $SERVER_REPO_URL
git fetch server-remote

# 서버의 main/master 브랜치를 server 디렉토리로 병합
if git show-ref --verify --quiet refs/remotes/server-remote/main; then
    git subtree add --prefix=server server-remote/main --squash
elif git show-ref --verify --quiet refs/remotes/server-remote/master; then
    git subtree add --prefix=server server-remote/master --squash
else
    echo "서버 레포지토리의 기본 브랜치를 찾을 수 없습니다."
    exit 1
fi

# 3. 클라이언트 레포지토리 추가
echo "[3/3] 클라이언트 레포지토리 추가..."
git remote add client-remote $CLIENT_REPO_URL
git fetch client-remote

# 클라이언트의 main/master 브랜치를 client 디렉토리로 병합
if git show-ref --verify --quiet refs/remotes/client-remote/main; then
    git subtree add --prefix=client client-remote/main --squash
elif git show-ref --verify --quiet refs/remotes/client-remote/master; then
    git subtree add --prefix=client client-remote/master --squash
else
    echo "클라이언트 레포지토리의 기본 브랜치를 찾을 수 없습니다."
    exit 1
fi

# 4. 원격 레포지토리 제거
git remote remove server-remote
git remote remove client-remote

echo -e "\n${GREEN}=== 병합 완료! ===${NC}\n"
echo "주의: 이 방법은 --squash 옵션을 사용하므로 개별 커밋 히스토리가 압축됩니다."
echo "전체 히스토리를 보존하려면 merge-repos.sh를 사용하세요."

