#!/bin/bash
# 더블클릭하면 이 폴더를 http://localhost:8000 으로 띄웁니다 (macOS)
cd "$(dirname "$0")"
echo "수반 시뮬레이터: http://localhost:8000"
echo "종료: 이 창을 닫거나 Ctrl+C"
(sleep 1; open "http://localhost:8000/") &
python3 -m http.server 8000
