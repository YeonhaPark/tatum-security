# Tatum Security Frontend 과제

## 🚀 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 📁 프로젝트 구조

본 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처 패턴을 적용하여 구성되었습니다.

```
tatum-security/
├── app/                    # Next.js App Router (Routing & Layouts)
│   ├── api/               # API Routes
│   ├── globals.css        # Global Styles
│   ├── layout.tsx
│   └── page.tsx
├── entities/              # 비즈니스 엔티티 (Domain Objects)
│   └── cloud/
│       ├── api/           # API 호출 로직
│       ├── model/         # 상태 관리 & 타입 정의
│       └── ui/            # 재사용 가능한 엔티티 컴포넌트
├── features/              # 사용자 기능 (User Interactions)
│
├── widgets/               # 독립적인 UI 블록 (Page Sections)
│   ├── cloud-form-modal/  # 클라우드 계정 생성/수정 모달
│   │   ├── ui/            # UI 컴포넌트들
│   │   ├── model/         # 타입 정의
│   │   └── lib/           # 유틸리티 함수
│   └── cloud-table/       # 클라우드 계정 목록 테이블
├── shared/                # 공통 코드 (Shared Resources)
│   ├── lib/               # 유틸리티 함수
│   │   ├── data/          # Mock 데이터
│   │   └── utils.ts       # 공통 유틸리티
│   ├── types/             # 공통 타입 정의
│   └── ui/                # UI 컴포넌트 라이브러리
├── public/                # 정적 파일

```

## 🛠 사용된 주요 라이브러리

### Core Framework

- **Next.js 15** - React 기반 풀스택 프레임워크
- **React 19** - 사용자 인터페이스 구축
- **TypeScript** - 정적 타입 검사

### UI & Styling

- **Tailwind CSS 4** - 유틸리티 우선 CSS 프레임워크
- **Radix UI** - 접근 가능한 헤드리스 UI 컴포넌트
  - Dialog, Select, Label, Popover, Radio Group 등
- **Lucide React** - 아이콘 라이브러리
- **class-variance-authority (CVA)** - 조건부 CSS 클래스 관리
- **clsx & tailwind-merge** - 클래스명 조합 및 최적화

### State Management & Data Fetching

- **TanStack Query (React Query) v5** - 서버 상태 관리
- **React Hook Form** - 폼 상태 관리 및 검증
- **Zod** - 스키마 검증 라이브러리

### Development Tools

- **ESLint** - 코드 품질 검사
- **Prettier** - 코드 포맷팅
- **pnpm** - 빠르고 효율적인 패키지 매니저

### Additional Libraries

- **date-fns** - 날짜 조작 라이브러리
- **react-day-picker** - 날짜 선택 컴포넌트
- **next-themes** - 다크/라이트 모드 지원
- **sonner** - 토스트 알림
- **cmdk** - 명령 팔레트 UI

## 🏗 FSD (Feature-Sliced Design) 패턴을 선택한 이유

### 1. **명확한 관심사의 분리**

FSD 패턴은 **Layers**(계층), **Slices**(슬라이스), **Segments**(세그먼트)라는 3가지 핵심 개념을 통해 명확한 관심사의 분리를 실현합니다. 각 계층(shared, entities, features, widgets, pages, app)은 고유한 역할을 담당하며, 비즈니스 도메인별로 코드를 구조화하여 응집도를 높입니다. 또한 기술적 관심사(ui, model, api)별로 분리하여 유지보수성을 크게 향상시킵니다.

### 2. **확장 가능한 아키텍처**

```
낮은 수준 ←──────────────────→ 높은 수준
shared → entities → features → widgets → pages → app
```

FSD의 가장 큰 특징은 의존성 방향이 한 방향으로만 흐르도록 강제한다는 점입니다. 이를 통해 순환 참조를 원천적으로 방지하고, 새로운 기능을 추가할 때 기존 코드에 미치는 영향을 최소화합니다. 결과적으로 모듈 간 결합도는 낮추면서 각 모듈 내부의 응집도는 높이는 이상적인 구조를 만들어냅니다.

### 3. **팀 협업 효율성**

도메인 중심의 설계를 통해 각 개발자가 특정 도메인(cloud, user 등)에 집중할 수 있어 전문성을 높일 수 있습니다. 서로 다른 위젯이나 피처를 독립적으로 병렬 개발할 수 있어 개발 속도가 향상되며, 각 슬라이스별로 명확한 코드 소유권을 설정하여 책임 소재를 분명히 할 수 있습니다.

### 4. **테스트 및 디버깅 용이성**

각 레이어와 슬라이스가 독립적으로 구성되어 있어 단위 테스트 작성이 매우 수월합니다. 버그가 발생했을 때 영향 범위를 빠르게 특정할 수 있으며, Mock 데이터 작성 및 테스트 환경 구성도 간단하게 처리할 수 있습니다.

### 5. **재사용성과 일관성**

shared/ui 레이어를 통해 전체 애플리케이션에서 일관된 UI 컴포넌트를 사용할 수 있으며, entities 레이어에서 비즈니스 로직과 상태 관리를 중앙집중화합니다. widgets 레이어는 페이지 간 재사용 가능한 UI 블록을 제공하여 개발 효율성과 코드 일관성을 동시에 확보합니다.

## ⚙️ UX 구현 사항

- GET 시 credentials 필드는 마스킹 처리되어 옴을 가정하였으므로 버튼을 눌러서 수정하려는 액션을 할 때 빈 필드로 보여지게끔 구성하였습니다.
- 사용자가 실수로 모달 바깥 부분을 클릭하여 모달이 닫히는 것을 방지하기 위해 명시적으로 닫기, 취소 버튼을 클릭해야 모달이 닫히도록 처리하였습니다.
- 웹 접근성(Web Accessibility, a11y)을 고려하여 컴포넌트에 라벨링, 키보드 네비게이션, ARIA 속성을 적용하였습니다.

---

# API 관리방안

## 1. API 문서 확인

1. **API 확정 시점**
   - API는 Swagger/OpenAPI 문서 또는 별도 문서로 공유받습니다.
   - 스펙이 100% 확정되기 전이라도 더미 데이터나 Mock Server를 활용하여 프론트엔드 개발을 병렬로 진행합니다.
   - API 스펙이 확정되는 시점을 기준으로 타입 정의와 훅 생성을 시작합니다.

2. **변경 관리**
   - API 변경 이력을 문서로 관리하여 프론트엔드/백엔드 모두 추적 가능하게 합니다.
   - 이 변경 이력은 단일 원천 코드를 원칙으로, "원천(Single Source of Truth) → 변경 감지 → 기록 자동화 → 타입 생성·릴리스 노트"의 흐름을 따릅니다.
   - **원천 단일 소스화**: 모든 API 변경은 반드시 스펙 파일에서 먼저 반영되며, 프론트엔드와 백엔드는 동일한 스펙을 기준으로 개발을 진행합니다.
   - **변경 감지**: CI/CD에서 스펙파일의 변경을 감지하여 이전 버전과 비교(diff)하고, 브레이킹 체인지(새 endpoint 추가, enum 추가 등) 여부를 자동 검출합니다.
   - **기록 자동화**: API 변경 사항은 `CHANGELOG.md` 또는 릴리스 노트로 기록됩니다. 특히 브레이킹 변경은 Deprecated → 제거 일정이 함께 명시되어야 하며, 마이그레이션 가이드와 함께 문서화됩니다.
   - **타입 생성·릴리스 노트**: 최신 OpenAPI 스펙을 기반으로 타입 정의 파일을 자동 생성(`swagger-typescript-api`, `openapi-typescript`)하고, FE에서는 해당 타입을 활용하여 훅을 업데이트합니다. 동시에 릴리스 노트를 발행하여 변경 사항을 팀 전체에 공유합니다.

   백엔드의 스펙이 너무 자주 바뀌는 불상사가 생길 수도 있습니다. 이러한 경우 배포 1-2일 전에는 스펙 동결이라던가, 주1회 내지 격주 배포 등 배포 주기에 대한 정책을 명확화하는 것이 필요합니다.
   변경 이력과 적용 관리에 대해서는 팀 전체가 정책에 대해 동의하고 이를 존중하며 따르는 자세를 가져야 합니다.

---

## 2. API 타입 정의

API 타입은 프로젝트 내 **공통 타입 모듈**로 분리하여 관리합니다.  
도메인 단위(`cloud.ts`, `user.ts`)로 나누어 유지보수성을 높입니다.
타입 생성은 `swagger-typescript-api` 등 타입 자동생성 도구를 사용합니다.

```ts
// shared/types/cloud.ts
export interface Cloud {
  id: string;
  name: string;
  provider: "AWS" | "GCP" | "AZURE";
  regionList: string[];
  proxyUrl?: string;
  scheduleScanEnabled: boolean;
  frequency: "HOUR" | "DAY" | "WEEK" | "MONTH";
  date: string;
  weekday: string;
  hour: string;
  minute: string;
}
```

---

## 3. API 호출 훅 구성

React Query를 기반으로 API 호출 훅을 작성합니다.
본 예시에서는 FSD 패턴을 적용하여 `entities/<domain>/api/` 경로에서 관리하는 것으로 소개하겠습니다.

### 폴더 구조 예시

```
entities/
  cloud/
    api/
      useGetClouds.ts
      useCreateCloud.ts
      useUpdateCloud.ts
      useDeleteCloud.ts
    ui/
      CloudList.tsx
      CloudForm.tsx
    model/
      cloud.types.ts
```

### 1) Query Key 관리

React Query의 `queryKey`는 캐시를 식별하는 중요한 요소입니다.  
대규모 프로젝트에서는 문자열 배열을 개별 훅마다 하드코딩하면 관리가 어려워지고, invalidateQueries 시에도 혼란이 생길 수 있습니다.

이를 방지하기 위해 **Query Key 팩토리**를 도입하여 하드코딩으로 인한 혼선을 막고 일원화된 규칙으로 관리합니다.

### 예시: 팩토리 생성

```ts
// entities/cloud/api/keys.ts
export const cloudKeys = {
  all: () => ["clouds"] as const,
  lists: () => [...cloudKeys.all(), "list"] as const,
  list: (filters?: Record<string, any>) =>
    [...cloudKeys.lists(), filters] as const,
  details: () => [...cloudKeys.all(), "detail"] as const,
  detail: (id: string) => [...cloudKeys.details(), id] as const,
};
```

```ts
// entities/cloud/api/useGetClouds.ts
import { useQuery } from "@tanstack/react-query";
import { cloudKeys } from "./keys";

export function useGetClouds(filters?: Record<string, any>) {
  return useQuery({
    queryKey: cloudKeys.list(filters),
    queryFn: async () => {
      const qs = filters ? `?${new URLSearchParams(filters)}` : "";
      const res = await fetch(`/api/clouds${qs}`);
      if (!res.ok) throw new Error("Failed to fetch clouds");
      return res.json();
    },
  });
}
```

```ts
// entities/cloud/api/useCreateCloud.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cloudKeys } from "./keys";

export function useCreateCloud() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: any) => {
      const res = await fetch("/api/clouds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create cloud");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cloudKeys.lists() });
    },
  });
}
```

### 2) 에러처리, 인증토큰 주입, 로깅 등을 일관되게 적용하기 위한 wrapper 함수 생성

한 곳에서 같은 규칙으로 처리하여 규모가 커져도 공통 함수만 수정하면 되도록 합니다.

### 예시:

```ts
// lib/api.ts
export async function apiFetch(input: string, init: RequestInit & { auth?: boolean; trace?: boolean } = {}) {
  const headers = new Headers(init.headers);

  // 토큰 붙이기
  if (init.auth) {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : (await import('next/headers')).cookies().get('access_token')?.value;

    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }


  const requestId = crypto.randomUUID();
  if (init.trace) headers.set('X-Request-ID', requestId);

  const res = await fetch(input, { ...init, headers, credentials: 'include' });
  const log = { url: input, method: init.method || 'GET', requestId };

  if (!res.ok) {
    let body: any = null;
    try { body = await res.json(); } catch

    const message = body?.message || body?.error || 'Unexpected error';
    const error = { status: res.status, message, requestId };

    if (process.env.NODE_ENV === 'development') {
      console.warn('[API ERROR]', { ...log, error, body });
    } else {
      // TODO: Sentry/Datadog 연동
    }

    throw error;
  }

  if (process.env.NODE_ENV === 'development' && init.trace) {
    console.info('[API OK]', { ...log, status: res.status });
  }

  if (res.status === 204) return undefined;
  return res.json();
}

```

---

## 4. 협업 플로우

1. **API 설계**
   - 백엔드가 Swagger/OpenAPI 문서 초안을 공유합니다.
   - 프론트엔드는 문서를 바탕으로 타입과 훅의 인터페이스를 정의합니다.

2. **개발 병렬 진행**
   - 백엔드가 실제 API를 개발하는 동안, 프론트엔드는 더미 데이터/Mock Server를 활용하여 UI와 상태 관리 로직을 미리 구성합니다.

3. **API 연결**
   - 백엔드에서 API 개발이 완료되면 실제 endpoint를 연결합니다.
   - React Query의 캐싱(`staleTime`, `invalidateQueries`) 전략을 검증합니다.

4. **변경 대응**
   - API 스펙 변경 시 타입 정의 파일을 우선적으로 수정합니다.
   - 타입 오류를 통해 영향 범위를 빠르게 파악하고 보완합니다.

---

## 결론

요약하면

1. **Swagger/OpenAPI 기반 문서화**
2. **자동 타입 생성 + 도메인별 타입 분리**
3. **React Query 훅 모듈화 및 캐싱 전략**
4. **프론트엔드와 백엔드 협업 시점 명확화**

이 네 가지 정책에 대해 정확히 토론하는 것이 중요하다고 생각합니다.
이를 통해 개발 생산성을 높이는 방안에 대해 구성원들이 동의할 수 있는 일관된 정책을 세우고, API 관리 복잡도를 해결하는 것이 필요합니다.

# i18n 적용방안

### i18n JSON 관리

- i18n 파일을 위한 라이브러리로 intlayer를 사용하는 것을 추천합니다.
- 번역파일(JSON or ts)이 컴포넌트 단위로 관리되어 컴포넌트 삭제시 동기화되어 삭제됩니다. 필요없는 번역 파일이 프로젝트에 쌓여 관리 비용이 늘어나는 일을 방지할 수 있습니다.
- JSON or ts 파일 생성 시 타입 파일이 자동 생성되어 코드에서 번역 키 사용 시 자동완성 및 타이핑 안정성을 확보할 수 있습니다.
- 무료 라이브러리이므로 초기 셋팅 비용이 없고 빠르게 적용할 수 있습니다.
- intlayer는 컴포넌트와 번역 리소스의 Colocation(인접 관리) 을 지원하기 때문에, 개발자가 화면 단위로 맥락을 쉽게 유지할 수 있습니다.
- Glossory(용어집)을 운영하여 자주 사용되거나 중요한 단어는 사전에 정의하여 일관되게 사용하게 합니다.

### 번역 수행

- 번역 수행이 힘들다면 Lokalise 같은 TMS(Translation Management System) 툴을 활용하여 번역을 자동화하고 머지 전 번역 결과에 대해 휴먼체크로 검수합니다.
- 언어 문체나 스타일 등을 일관적으로 적용할 수 있어 톤앤매너의 어색함 없이 번역을 제공할 수 있습니다.

### 코드 작성

기본적으로 intlayer는 컴포넌트 인접 `.content.ts` 파일로 번역 리소스를 관리합니다:

```ts
// widgets/cloud-table/cloud-table.content.ts
import { t, type Dictionary } from "intlayer";

const cloudTableContent = {
  key: "cloud-table",
  content: {
    cloud: t({ en: "Cloud", ko: "클라우드" }),
    accounts: t({ en: "Accounts", ko: "계정" }),
    loading: t({ en: "Loading clouds...", ko: "클라우드 로딩 중..." }),
    // ... 기타 번역
  },
} satisfies Dictionary;

export default cloudTableContent;
```

### Intlayer to JSON 변환

intlayer의 `.content.ts` 파일들을 일반적인 i18n JSON 구조로 변환할 수 있는 변환 스크립트를 작성할 수 있습니다. 이를 통해 intlayer의 컴포넌트 인접 관리 방식의 DX 이점 활용하라 수 있고, 배포시에는 표준 JSON 형태로 변환하여 다른 i18n 라이브러리나 TMS와 호환 가능합니다.

#### 사용법

```bash
# intlayer content 파일들을 /i18n/<locale>/*.json으로 변환
pnpm run build:i18n
```

#### 결과 구조

```
i18n/
├── en/
│   ├── cloud-table.json
│   ├── home-page.json
│   └── index.json (통합 파일)
└── ko/
    ├── cloud-table.json
    ├── home-page.json
    └── index.json (통합 파일)
```

#### 생성된 파일 예시

```json
// i18n/en/cloud-table.json
{
  "cloud": "Cloud",
  "accounts": "Accounts",
  "loading": "Loading clouds...",
  "deleteModalDescription": "Are you sure you want to delete this cloud?"
}

// i18n/ko/cloud-table.json
{
  "cloud": "클라우드",
  "accounts": "계정",
  "loading": "클라우드 로딩 중...",
  "deleteModalDescription": "이 클라우드를 삭제하시겠습니까?"
}
```
