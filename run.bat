@echo off
setlocal

set REPO_URL=https://github.com/lisyoen/lotto-client.git
set REPO_DIR=D:\git\lotto-client
set APP_DIR=D:\git\lotto-client

cd /d %REPO_DIR%
git pull %REPO_URL%
cd /d %APP_DIR%
npm install
npm run restart
