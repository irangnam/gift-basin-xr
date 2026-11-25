# 수반 · 배스밤 시뮬레이터 (WebXR)

선물을 주고받는 마법 수반. 배스밤을 넣으면 천천히 풀리며 거품과 색이 번지고, 손으로 물을 저을 수 있음.

- 주소: https://irangnam.github.io/gift-basin-xr/
- 모델: `models/Basin2.glb` (2단 수반 + 크리스마스 가랜드, Blender `Basin2.blend` → `bake_basin2.py` · `export_basin2_web.py`). 이전 벽 분수 수반은 `models/Basin.glb`
- `src/basin-sim.js` — GPU 시뮬레이션: 물결 + 2D 유체(색 번짐) + 물감/거품. 품질 `?q=low|mid|high` (퀘스트 기본 mid)
- `src/basin-water.js` — 수면 셰이더(은은한 물빛 · 흐르는 무늬 · 테두리 반사 · 기포 거품 · 반짝임), 위 접시 물 · 물줄기 · 빛무리, 입자
- `src/bath-bomb.js` — 배스밤(퐁당 → 떠서 천천히 녹으며 색 · 거품), 프리셋 5종, 소리
- 조작: PC — 물 위를 끌어 젓기, 배스밤 고르고 `1층에 넣기` · `위 수반에 넣기`(숫자 1~5 · 스페이스, Shift 를 누르면 위 수반). 위 · 아래 수반 둘 다 젓기 가능. VR — 검지 끝 · 컨트롤러 끝으로 젓기, 트리거 · 핀치하면 손에 배스밤 → 놓으면 떨어짐/던지기, 그립은 색 바꾸기
- 로컬 실행: `serve.command` (또는 `python3 -m http.server`)
