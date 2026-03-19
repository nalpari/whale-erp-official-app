<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Memo

- 모든 답변과 추론과정은 한국어로 작성한다.
- task가 끝나면 서브 에이전트를 사용해서 린트체크, 타입체크, 빌드체크를 수행한다.
- 린트체크시 오류가 있으면 반드시 해결하고 넘어가도록 하고, 경고가 있더라도 해결하려고 노력한다.
- 커밋시에 접두사는 영어로 나머지 타이틀과 내용은 한국어로 작성한다.
- task 완료시 CLAUDE.md 및 README.md 문서에 업데이트가 필요하면 진행한다.
- 가급적 react 19.2 버전의 최신 문법을 사용한다.

# Project Overview

Whale ERP Official App - 모바일 최적화 ERP 웹 애플리케이션

# Tech Stack

- **Framework**: Next.js 16.2.0 (App Router, React Compiler 활성화)
- **Language**: TypeScript 5
- **UI**: React 19.2.4
- **State Management**: Zustand 5 (devtools 미들웨어 사용)
- **Styling**: SCSS + Tailwind CSS 4 (PostCSS)
- **UI Libraries**: react-modal-sheet, react-tooltip, Swiper 12

# Project Structure

```
src/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 (Header, Footer, RnbMenu, Popup, BottomSheet)
│   ├── page.tsx            # 메인 페이지
│   ├── (auth)/             # 인증 라우트 그룹
│   │   └── login/          # 로그인, 아이디/비밀번호 찾기
│   ├── (sub)/              # 서브 페이지 라우트 그룹
│   │   ├── contract/       # 계약 관리
│   │   ├── fulltimer/      # 정규직 급여 관리
│   │   ├── parttimer/      # 파트타이머 급여 관리
│   │   ├── overtime/       # 초과근무 관리
│   │   ├── commute/        # 출퇴근 관리
│   │   ├── staff/          # 직원 관리 (초대, 편집, 고용계약)
│   │   ├── storeinfo/      # 매장 정보 관리 (생성, 편집)
│   │   ├── plan/           # 근무 계획표
│   │   ├── master-info/    # 사업자 정보
│   │   └── changepw/       # 비밀번호 변경
│   └── list/               # 퍼블리싱 목록 (개발 참조용)
├── components/
│   ├── ui/                 # 공통 UI (Header, Footer, RnbMenu, PopupControler, BottomSheetControler)
│   ├── popup/              # 팝업 (Alert, AIChat, PhotoPopup, AddressSearchPop)
│   ├── bottomsheet/        # 바텀시트 (검색, 선택, 옵션 등 20+ 시트)
│   ├── main/               # 메인 페이지 컨텐츠
│   ├── login/              # 로그인 관련 컴포넌트
│   ├── contract/           # 계약 관련 컴포넌트
│   ├── fulltimer/          # 정규직 관련 컴포넌트
│   ├── parttimer/          # 파트타이머 관련 컴포넌트
│   ├── overtime/           # 초과근무 관련 컴포넌트
│   ├── commute/            # 출퇴근 관련 컴포넌트
│   ├── staff/              # 직원 관련 컴포넌트
│   ├── storeinfo/          # 매장 관련 컴포넌트
│   ├── plan/               # 근무 계획표 컴포넌트
│   ├── master-info/        # 사업자 정보 컴포넌트
│   ├── changepw/           # 비밀번호 변경 컴포넌트
│   └── publist/            # 퍼블리싱 참조 컴포넌트
├── store/                  # Zustand 스토어
│   ├── useMenuStore.ts           # 메뉴 상태 관리
│   ├── usePopupControler.ts      # 팝업 상태 관리 (AIChat, Alert, Photo, AddressSearch)
│   └── useBottomSheetControler.ts # 바텀시트 상태 관리 (20+ 시트)
├── styles/                 # SCSS 스타일
│   ├── abstracts/          # 변수, 믹스인
│   ├── base/               # 리셋, 폰트, 입력폼, 버튼 등
│   ├── components/         # 컨텐츠, 테이블, 팝업, 바텀시트
│   └── layout/             # 레이아웃, 로그인, 메인, 팝업, 바텀시트
└── public/assets/          # 폰트, 이미지 정적 자원
```

# Architecture Conventions

- **라우팅**: App Router 기반, `(auth)` / `(sub)` 라우트 그룹으로 분리
- **상태 관리**: Zustand store에서 UI 컨트롤 (팝업, 바텀시트, 메뉴)
- **스타일링**: SCSS 모듈 구조 (abstracts → base → components → layout)
- **컴포넌트 구조**: 페이지는 `app/` 라우트, 실제 구현은 `components/` 디렉토리
- **경로 별칭**: `@/*` → `./src/*`
