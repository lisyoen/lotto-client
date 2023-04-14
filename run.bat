@echo off
setlocal

set REPO_URL=https://github.com/lisyoen/qrscanner.git
set REPO_DIR=D:\git\qrscanner
set APP_DIR=D:\git\qrscanner

cd /d %REPO_DIR%
git pull %REPO_URL%
cd /d %APP_DIR%
npm install
npm run restart
