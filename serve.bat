@echo off
cd /d "%~dp0"
echo 수반 시뮬레이터: http://localhost:8000  (창을 닫으면 꺼짐)
start http://localhost:8000
python -m http.server 8000 || py -m http.server 8000
