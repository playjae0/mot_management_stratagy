# mot_management_stratagy

# 굿잇츠 · 전략 참견 시점: 그때 그 회의

고려대 MOT 경영전략 9조 기말 영상의 촬영 화면과 Remotion 제작 소스.

## 실행

```powershell
cd edit-motion
npm ci
npm run dev -- --no-open
```

Studio: http://localhost:3000/M1-Pangyo (M1 지도), `/I6-CEO` (대표 소개), `/Demo` (14초 이어보기).

촬영 화면은 `촬영HTML/1화.html`부터 `5화.html`까지 파일을 브라우저로 직접 열면 된다. 한 파일 안에 CSS·JS·데이터·SVG를 포함하며 웹폰트만 CDN을 사용한다. 네트워크가 없으면 맑은 고딕으로 표시된다.

로컬 미리보기: 루트에서 `node scripts/serve.cjs` → http://127.0.0.1:4173/촬영HTML/1화.html#H1-03

## 촬영 HTML 조작

- `#H1-02` 같은 해시로 화면 직접 열기.
- PageDown / PageUp: 다음 / 이전 페이지. 페이지 변경 시 초기화.
- a~f / 좌우 화살표: 상태 선택. R: 처음 상태.
- Space: 애니메이션 시작 또는 현황판·재구독률의 다음 상태.
- 백틱: 숨겨진 페이지 목록. 촬영 전 반드시 닫는다.
- F11 전체 화면. 가로 화면 1920×1080, 폰 화면 1080×1920 비율 유지.

| 파일 | 화면 |
|---|---|
| 1화 | H1-02 권역 현황판(a~f), H1-03 행사 키비주얼 |
| 2화 | H2-02 리소스, H2-03 리뷰(a/b), H2-04 튜닝, H2-05 배차(a/b), H2-06 기사 앱, H2-07 뉴스(a/b) |
| 3화 | H3-02 원가표, H3-04 재구독률(a~c), H3-05 배너(a/b) |
| 4화 | H4-03 광고 집행 현황 |
| 5화 | H5-01 고객의 소리(a~d), H5-02 단어 빈도 |

수정 후 재생성: `node scripts/build-html.cjs`. 기존 출력 HTML을 직접 수정하면 재생성 시 덮어쓰므로 생성기와 JSON을 수정한다.

## Remotion

- 공식 create-video blank 템플릿, Remotion 4.0.541, 1920×1080, 임시 30fps.
- M1 11초, I6 데모 3초. `Demo`는 두 장면 검증용 14초이며 회사·출연진 전체 소개본이 아니다.
- 원본 9초 I6 대신 3초를 시험. 능력치 3줄의 가독성은 팀 검토 필요.
- `data/brand.json`: 회사명·색·화면 규격·fps·주요 문구.
- `data/regions.json`: 권역 수치·원인. `data/cast.json`: 배역·이름·능력치.
- `data/narration.json`: I6 원고 보존. 현재 데모는 무음이고 원고를 새로 축약하지 않았다.
- `edit-motion/public/characters/ceo_base.png`, `ceo_proud.png`를 넣으면 실루엣 대신 사용. 파일이 없으면 실루엣으로 표시.
- 지도: KOSTAT 2013 시군구 경계. 판교는 지시서대로 **성남시 분당구 전체를 대용**. 실제 판교 생활권 경계가 아니다.

```powershell
cd edit-motion
npx remotion still src/index.ts M1-Pangyo ../previews/M1-Pangyo.png --frame=120
npx remotion still src/index.ts I6-CEO ../previews/I6-CEO.png --frame=65
npx remotion render src/index.ts Demo ../previews/Demo.mp4 --codec=h264 --pixel-format=yuv420p
npm run lint
```

## 기준·자료 관리

2026-11-07 대화 지시가 Drive 원본보다 우선: 회사명 굿잇츠, 회사·출연진 소개 전체 20초 이내, 지금은 실루엣·임시 글자 로고. 대본 대사는 수정하지 않는다. M1은 별도 인서트이므로 11초 유지.

Drive 원본과 개인 사진·촬영 원본은 공개 저장소에 올리지 않는다. 읽은 자료 사본은 Git 제외된 `source-private/`에 보관한다. 렌더링 결과는 `previews/`(Git 제외). 소스 변경과 Drive 원본 변경은 자동 양방향 동기화되지 않는다.

Drive 원본 링크와 식별자는 공개 저장소에 포함하지 않는다. 제작 기준은 배경자료 00~07, 촬영준비 프롬프트 v5, 타임라인 v3.9다.

20초 전체 소개 타이밍안(미구현): 오프닝 1초 + 회사 3초 + 팀장 4명 각 2.5초 + 대표 3초 + 단체 마무리 2초 = **19초**. 전체 원고 낭독은 이 길이에 들어가지 않으므로 음성·자막 범위는 별도 결정한다.

## 데이터·글꼴 출처

- [southkorea/southkorea-maps](https://github.com/southkorea/southkorea-maps), KOSTAT 2013. 저장소 README의 KOSTAT 항목: Free to share or remix. 수도권 79개 시군구만 추출한 `metro.geo.json` 사용. 지도 원본 수치는 프로젝트의 가상 주문 수치와 무관하다.
- Pretendard 1.3.9, SIL Open Font License. `edit-motion/public/fonts/OFL.txt` 동봉.

TV 실제 촬영 시의 밝기·깜빡임·물결무늬와 휴대폰 실기기 가독성은 현장 시험 촬영으로 확인해야 한다.
