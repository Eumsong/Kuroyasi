# 그림 노트 (Draw Note)

굿노트처럼 **메모**와 **그리기**를 함께 쓸 수 있는 모바일 노트 앱입니다.  
**iOS**와 **Android** 모두에서 같은 앱으로 사용할 수 있는 크로스 플랫폼 앱입니다.

## 지원 플랫폼

| 플랫폼   | 지원 |
|----------|------|
| iOS      | ✅ (iPhone, iPad) |
| Android  | ✅ (폰, 태블릿) |

## 기능

- **노트 목록**: 만든 노트를 한눈에 보고 열기
- **메모**: 제목과 본문 텍스트 입력
- **그리기**: 캔버스에 손가락으로 그림
  - 펜 색상 16가지
  - 굵기 2 / 4 / 8
  - 지우개(마지막 스트로크 삭제)
- **자동 저장**: 입력과 그림이 자동으로 저장됩니다.
- **삭제**: 노트 상세 화면 우측 상단 "삭제"로 노트 삭제

## 실행 방법

1. 터미널에서 프로젝트 폴더로 이동한 뒤 의존성 설치:

   ```bash
   npm install
   ```

2. Expo 개발 서버 실행:

   ```bash
   npx expo start
   ```

3. **실기기에서 실행 (iOS / Android 공통)**  
   - **iOS**: App Store에서 **Expo Go** 설치 → QR 코드 스캔  
   - **Android**: Play 스토어에서 **Expo Go** 설치 → QR 코드 스캔  
   - PC와 휴대폰이 **같은 Wi‑Fi**에 연결되어 있어야 합니다.

4. **에뮬레이터/시뮬레이터에서 실행**  
   - **iOS 시뮬레이터** (Mac 필요): 터미널에서 `i` 키 누르거나 `npx expo start --ios`  
   - **Android 에뮬레이터**: 터미널에서 `a` 키 누르거나 `npx expo start --android`

## 테스트 방법

### 1단계: 의존성 설치
프로젝트 폴더에서 터미널을 열고:
```bash
npm install
```

### 2단계: 앱 실행
```bash
npx expo start
```
실행하면 터미널에 **QR 코드**가 나타납니다.

### 3단계: 실기기에서 테스트 (권장)
1. **휴대폰**에 **Expo Go** 앱 설치  
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)  
   - [Android Play 스토어](https://play.google.com/store/apps/details?id=host.exp.exponent)
2. PC와 휴대폰을 **같은 Wi‑Fi**에 연결
3. **Android**: Expo Go 앱에서 "QR 코드 스캔"으로 터미널의 QR 스캔  
   **iOS**: iPhone 카메라로 QR 코드 스캔 → 나오는 알림으로 Expo Go 실행
4. 앱이 열리면 다음을 확인:
   - 홈에서 **+** 버튼으로 새 노트 생성
   - 제목·본문 입력 후 **그리기** 영역에서 손가락으로 그림
   - 색상·굵기·지우개 동작
   - 뒤로 가기 후 목록에 노트가 보이는지, 다시 열어도 내용이 유지되는지

### 4단계: 에뮬레이터에서 테스트 (선택)
- **Android**: Android Studio로 에뮬레이터 설치 후, `npx expo start` 실행한 터미널에서 **a** 키 입력
- **iOS** (Mac만): Xcode 설치 후 시뮬레이터에서 **i** 키 입력

## 기술 스택

- **Expo** (React Native)
- **TypeScript**
- **React Navigation** (화면 전환)
- **React Native SVG** (그리기)
- **React Native Gesture Handler** (터치 그리기)
- **AsyncStorage** (노트 저장)

## 프로젝트 구조

```
모바일 앱/
├── App.tsx                 # 앱 진입점, 네비게이션 설정
├── src/
│   ├── components/
│   │   └── DrawingCanvas.tsx   # 그리기 캔버스
│   ├── screens/
│   │   ├── HomeScreen.tsx      # 노트 목록
│   │   └── NoteDetailScreen.tsx # 노트 상세(메모 + 그리기)
│   ├── store/
│   │   └── notes.ts            # 노트 저장/불러오기
│   └── types/
│       └── note.ts             # 노트 타입 정의
├── package.json
├── app.json
└── tsconfig.json
```

즐겁게 사용해 보세요.
