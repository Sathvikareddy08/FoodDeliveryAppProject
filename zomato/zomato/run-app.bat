@echo off
cd /d %~dp0
call npm install
call ng serve 