# Flutter 벡터 기반 드로잉 메모장 앱

굿노트(Goodnotes) 스타일의 **벡터 기반 드로잉 메모장**입니다.  
**iOS**와 **Android** 모두에서 동작하며, `lib/main.dart` 하나에 전체 코드가 있어 복사해 바로 실행할 수 있습니다.

## 실행 방법

### 0. 사전 준비 (Flutter 설치)

1. **Flutter 설치**
   - 공식 사이트: https://docs.flutter.dev/get-started/install
   - Windows: ZIP 다운로드 후 압축 해제하고, `flutter` 폴더를 원하는 위치(예: `C:\flutter`)에 두기.
   - **PATH 추가**: `C:\flutter\bin` (설치한 경로의 `bin` 폴더)을 시스템 환경 변수 Path에 추가.

2. **설치 확인**
   터미널(명령 프롬프트 또는 PowerShell)에서:
   ```bash
   flutter doctor
   ```
   - Android용: **Android Studio** 설치 후 Android SDK 설정.
   - iOS용(Mac만): **Xcode** 설치 후 `flutter doctor`에서 iOS 체크 통과할 것.

3. **기기/에뮬레이터 준비**
   - **실기기**: USB로 PC에 연결 후, 기기에서 "USB 디버깅"(Android) 또는 "이 컴퓨터 신뢰"(iOS) 허용.
   - **에뮬레이터**: Android Studio에서 AVD(에뮬레이터) 생성, 또는 Mac에서 Xcode로 iOS 시뮬레이터 실행.

---

### 1단계: 프로젝트 폴더로 이동

터미널을 연 뒤, 이 프로젝트가 있는 **draw_note_flutter** 폴더로 이동합니다.

**예시 (Windows, 프로젝트가 바탕 화면인 경우):**
```bash
cd "C:\Users\사용자이름\OneDrive\바탕 화면\모바일 앱\draw_note_flutter"
```
- 경로에 한글이 있으면 반드시 **큰따옴표**로 감싸기.
- Cursor/VS Code에서는 상단 메뉴 **터미널 → 새 터미널**을 연 다음, 아래처럼 **모바일 앱**까지 먼저 이동한 뒤 `draw_note_flutter`로 들어가도 됩니다.
  ```bash
  cd "c:\Users\eemso\OneDrive\바탕 화면\모바일 앱"
  cd draw_note_flutter
  ```

**예시 (Mac/Linux):**
```bash
cd ~/Desktop/모바일\ 앱/draw_note_flutter
```

---

### 2단계: 패키지 가져오기

프로젝트 폴더에서 한 번만 실행하면 됩니다.

```bash
flutter pub get
```

- `pubspec.yaml`에 적힌 패키지를 다운로드합니다.
- 오류가 나오면 인터넷 연결과 Flutter 설치 경로(PATH)를 확인하세요.

---

### 3단계: 앱 실행

같은 터미널에서 다음을 입력합니다.

```bash
flutter run
```

- **연결된 기기가 한 대**이면 그 기기에 자동으로 설치·실행됩니다.
- **기기가 여러 대**이면 터미널에 번호가 나오므로, 실행할 기기 번호를 입력한 뒤 Enter를 누릅니다.

---

### 4단계: 플랫폼별로 실행하기 (선택)

| 목적 | 명령어 |
|------|--------|
| **Android 기기/에뮬레이터**만 사용 | `flutter run -d android` |
| **iOS 시뮬레이터**(Mac만) | `flutter run -d ios` 또는 에뮬레이터 실행 후 `flutter run` |
| **연결된 기기 목록 보기** | `flutter devices` |

- Android 에뮬레이터를 쓰는 경우: Android Studio에서 **AVD Manager**로 가상 기기를 만든 뒤 실행해 두고, `flutter run` 또는 `flutter run -d android`를 실행합니다.
- iOS 시뮬레이터: Mac에서 Xcode 설치 후 **Xcode → Open Developer Tool → Simulator**로 시뮬레이터를 켜 두고 `flutter run`을 실행합니다.

---

### 5단계: 실행 후 조작

- 앱이 실행되면 **캔버스**에 손가락(또는 마우스)으로 그릴 수 있습니다.
- **상단**: 현재 펜 색상, **전체 지우기** 버튼.
- **하단**: 색상 버튼(검정/빨강/파랑/초록), **굵기 슬라이더**.

---

### 자주 나오는 문제

| 증상 | 확인할 것 |
|------|-----------|
| `flutter: command not found` | Flutter가 설치된 폴더의 `bin`을 PATH에 넣었는지, 터미널을 다시 연 뒤 `flutter doctor` 실행 |
| `No devices found` | USB 케이블 연결, 기기에서 USB 디버깅/신뢰 허용, 또는 에뮬레이터 실행 여부 |
| `cd` 시 "경로를 찾을 수 없습니다" | 경로에 한글이 있으면 큰따옴표로 감쌌는지, 실제 폴더 경로가 맞는지 확인 |
| 빌드 오류 | `flutter clean` 후 `flutter pub get` → 다시 `flutter run` |

## 그린 내용 저장/불러오기 패키지 안내

### 1) 벡터 데이터(스트로크 리스트) 저장·불러오기

그림을 **이미지가 아닌 좌표·색상·굵기 리스트**로 저장하려면:

| 패키지 | 용도 | 사용 방법 |
|--------|------|-----------|
| **path_provider** | 앱 전용 문서 디렉터리 경로 얻기 | `getApplicationDocumentsDirectory()`로 디렉터리 받은 뒤, 그 안에 JSON 파일 저장 |

**pubspec.yaml 추가:**
```yaml
dependencies:
  path_provider: ^2.1.0
```

**사용 예 (요지):**
- `DrawingStroke` 리스트를 JSON으로 직렬화 (예: `points` → `[{x,y}, ...]`, `color` → value, `strokeWidth` → number).
- `File('${dir.path}/drawing.json').writeAsString(jsonEncode(직렬화한_데이터))`.
- 불러올 때 `jsonDecode` 후 다시 `DrawingStroke` 리스트로 복원.

### 2) 이미지로 내보내기(갤러리 저장)

캔버스를 **이미지 파일**로 저장해 갤러리에 넣으려면:

| 패키지 | 용도 | 사용 방법 |
|--------|------|-----------|
| **image_gallery_saver** | 갤러리에 이미지 저장 | `ImageGallerySaver.saveImage(bytes)` 등으로 PNG 바이트 저장 |
| **gal** (대안) | 최신 갤러리 API (권한·저장) | `Gal.putImageBytes(path, bytes)` 등 |

**pubspec.yaml 추가 (예시):**
```yaml
dependencies:
  image_gallery_saver: ^2.0.0
```

**사용 예 (요지):**
- `CustomPainter`로 그리는 내용을 `PictureRecorder` + `Canvas`로 그린 뒤 `picture.toImage()`로 `Image` 생성.
- `image.toByteData(format: ImageByteFormat.png)`로 바이트 얻기.
- `ImageGallerySaver.saveImage(byteList)` 호출.

### 3) 권한 설정

- **Android**: `android/app/src/main/AndroidManifest.xml`에 저장/갤러리 관련 권한 필요 시 추가 (예: `WRITE_EXTERNAL_STORAGE`, scoped storage 대응).
- **iOS**: `ios/Runner/Info.plist`에 `NSPhotoLibraryAddUsageDescription` 등 갤러리 접근 설명 추가.

자세한 API는 각 패키지 공식 문서를 참고하면 됩니다.

## 프로젝트 구조

```
draw_note_flutter/
├── lib/
│   └── main.dart    ← 전체 앱 코드 (복사해 바로 실행 가능)
├── pubspec.yaml
└── README.md
```

## 구현 요약

- **드로잉 엔진**: `CustomPainter` + `GestureDetector` (onPanStart/Update/End)
- **데이터**: 이미지가 아닌 `List<DrawingStroke>` (Offset 리스트 + 색상·굵기)로 벡터 관리
- **필기감**: 좌표 사이를 `quadraticBezierTo`로 부드럽게 연결
- **UI**: 연한 회색 가로줄 배경, 상단 툴바(현재 색상 + 전체 지우기), 하단 팔레트(색상 4종 + 굵기 슬라이더)
