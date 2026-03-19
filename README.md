# Whale ERP Official App

모바일 최적화 ERP 웹 애플리케이션 - 매장/직원/급여/근태 관리 시스템

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16.2.0 (App Router) |
| Language | TypeScript 5 |
| UI | React 19.2.4 (React Compiler) |
| State | Zustand 5 |
| Styling | SCSS + Tailwind CSS 4 |
| UI Libraries | react-modal-sheet, react-tooltip, Swiper 12 |

## Getting Started

```bash
npm install
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인 가능

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 실행 |
| `npm run lint` | ESLint 검사 |

## Features

- **인증**: 로그인, 아이디/비밀번호 찾기, 비밀번호 변경
- **매장 관리**: 매장 생성/조회/수정 (기본 정보, 영업시간, 사진)
- **직원 관리**: 직원 초대, 정보 조회/수정, 고용계약서
- **계약 관리**: 계약 목록/상세, 계약 정보/시간 수정
- **급여 관리**: 정규직/파트타이머 급여 내역, 급여 명세서
- **초과근무**: 초과근무 목록/상세, 근무 수정, 명세서
- **출퇴근 관리**: 출퇴근 기록 조회/상세
- **근무 계획표**: 근무 스케줄 조회/수정
- **사업자 정보**: 사업자 정보 조회/수정
- **AI 채팅**: AI 기반 채팅 팝업

## Project Structure

```
src/
├── app/                # Next.js App Router 페이지
│   ├── (auth)/         # 인증 (로그인, 아이디/비밀번호 찾기)
│   ├── (sub)/          # 서브 페이지 (계약, 급여, 직원, 매장 등)
│   └── list/           # 퍼블리싱 목록
├── components/         # React 컴포넌트
│   ├── ui/             # 공통 UI (Header, Footer, Menu)
│   ├── popup/          # 팝업 컴포넌트
│   ├── bottomsheet/    # 바텀시트 컴포넌트
│   └── [feature]/      # 기능별 컴포넌트
├── store/              # Zustand 상태 관리
└── styles/             # SCSS 스타일시트
```
