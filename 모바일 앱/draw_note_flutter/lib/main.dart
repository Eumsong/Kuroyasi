// =============================================================================
// Flutter 벡터 기반 드로잉 메모장 앱 (굿노트 스타일)
// - CustomPainter + GestureDetector로 부드러운 드로잉
// - 그림 데이터는 이미지가 아닌 좌표·속성 리스트(벡터)로 관리
// - main.dart 하나에 전체 코드 포함 (복사 후 바로 실행 가능)
// =============================================================================

import 'package:flutter/material.dart';

// -----------------------------------------------------------------------------
// 1. 데이터 모델: 한 번에 그린 "한 줄" = 스트로크 (나중에 개별 수정/삭제 가능)
// -----------------------------------------------------------------------------

/// 그린 한 스트로크 = 연속된 좌표들 + 색상·굵기
/// 이미지가 아닌 객체 리스트로 관리하여 수정·개별 삭제가 가능하도록 함
class DrawingStroke {
  final List<Offset> points;
  final Color color;
  final double strokeWidth;

  DrawingStroke({
    required this.points,
    required this.color,
    required this.strokeWidth,
  });
}

// -----------------------------------------------------------------------------
// 2. 공책 배경 + 그리기 레이어를 그리는 CustomPainter
// -----------------------------------------------------------------------------

/// 캔버스에 "가로줄 그리드"와 "그린 스트로크"를 그림
class DrawingPainter extends CustomPainter {
  final List<DrawingStroke> strokes;
  final DrawingStroke? currentStroke;
  final Color gridColor;
  final double gridSpacing;

  DrawingPainter({
    required this.strokes,
    this.currentStroke,
    this.gridColor = const Color(0xFFE0E0E0),
    this.gridSpacing = 24.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    _drawGrid(canvas, size);
    for (final stroke in strokes) {
      _drawStroke(canvas, stroke);
    }
    if (currentStroke != null) {
      _drawStroke(canvas, currentStroke!);
    }
  }

  /// 연한 회색 가로줄(공책 격자) 그리기
  void _drawGrid(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = gridColor
      ..strokeWidth = 1.0
      ..style = PaintingStyle.stroke;

    double y = 0;
    while (y <= size.height) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
      y += gridSpacing;
    }
  }

  /// 한 스트로크를 부드럽게 연결하여 그림 (필기감 개선)
  /// 좌표 사이를 Quadratic Bezier로 연결해 매끄럽게 표현
  void _drawStroke(Canvas canvas, DrawingStroke stroke) {
    if (stroke.points.length < 2) return;

    final paint = Paint()
      ..color = stroke.color
      ..strokeWidth = stroke.strokeWidth
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..isAntiAlias = true;

    final path = Path();
    final points = stroke.points;

    path.moveTo(points[0].dx, points[0].dy);

    for (int i = 1; i < points.length; i++) {
      final p0 = points[i - 1];
      final p1 = points[i];
      // 제어점 = 두 점의 중점 → 현재 위치에서 p1까지 부드러운 곡선으로 연결
      final mid = Offset((p0.dx + p1.dx) / 2, (p0.dy + p1.dy) / 2);
      path.quadraticBezierTo(mid.dx, mid.dy, p1.dx, p1.dy);
    }
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(DrawingPainter oldDelegate) {
    return oldDelegate.strokes != strokes ||
        oldDelegate.currentStroke != currentStroke;
  }
}

// -----------------------------------------------------------------------------
// 3. 메인 앱 진입점
// -----------------------------------------------------------------------------

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '드로잉 메모장',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const DrawingPage(),
    );
  }
}

// -----------------------------------------------------------------------------
// 4. 드로잉 화면 (상단 툴바 + 캔버스 + 하단 팔레트)
// -----------------------------------------------------------------------------

class DrawingPage extends StatefulWidget {
  const DrawingPage({super.key});

  @override
  State<DrawingPage> createState() => _DrawingPageState();
}

class _DrawingPageState extends State<DrawingPage> {
  // 그린 모든 스트로크 리스트 (벡터 데이터)
  final List<DrawingStroke> _strokes = [];

  // 지금 그리는 중인 스트로크 (손을 뗄 때까지)
  DrawingStroke? _currentStroke;

  // 현재 선택된 펜 색상
  Color _penColor = Colors.black;

  // 현재 펜 굵기
  double _strokeWidth = 3.0;

  // 하단 팔레트용 색상 (최소 4가지: 검정, 빨강, 파랑, 초록)
  static const List<Color> _paletteColors = [
    Colors.black,
    Colors.red,
    Colors.blue,
    Colors.green,
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      body: SafeArea(
        child: Column(
          children: [
            _buildTopToolbar(),
            Expanded(child: _buildCanvas()),
            _buildBottomPalette(),
          ],
        ),
      ),
    );
  }

  /// 상단 툴바: 현재 펜 색상 표시 + 전체 지우기 버튼
  Widget _buildTopToolbar() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      color: Colors.white,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // 현재 선택된 펜 색상 표시
          Row(
            children: [
              Text(
                '펜 색상',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[700],
                ),
              ),
              const SizedBox(width: 12),
              Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: _penColor,
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.grey.shade400, width: 1),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.2),
                      blurRadius: 2,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
              ),
            ],
          ),
          // 전체 지우기 버튼
          TextButton.icon(
            onPressed: () {
              setState(() {
                _strokes.clear();
                _currentStroke = null;
              });
            },
            icon: const Icon(Icons.delete_outline, size: 20),
            label: const Text('전체 지우기'),
            style: TextButton.styleFrom(
              foregroundColor: Colors.red.shade700,
            ),
          ),
        ],
      ),
    );
  }

  /// 캔버스: 공책 배경 + 제스처로 그리기
  Widget _buildCanvas() {
    return LayoutBuilder(
      builder: (context, constraints) {
        return GestureDetector(
          onPanStart: (details) {
            // GestureDetector 기준 로컬 좌표 사용 (캔버스와 동일 좌표계)
            final offset = details.localPosition;
            setState(() {
              _currentStroke = DrawingStroke(
                points: [offset],
                color: _penColor,
                strokeWidth: _strokeWidth,
              );
            });
          },
          onPanUpdate: (details) {
            if (_currentStroke == null) return;
            final offset = details.localPosition;
            setState(() {
              _currentStroke = DrawingStroke(
                points: [..._currentStroke!.points, offset],
                color: _currentStroke!.color,
                strokeWidth: _currentStroke!.strokeWidth,
              );
            });
          },
          onPanEnd: (details) {
            if (_currentStroke != null && _currentStroke!.points.length > 1) {
              setState(() {
                _strokes.add(_currentStroke!);
                _currentStroke = null;
              });
            } else {
              setState(() => _currentStroke = null);
            }
          },
          child: RepaintBoundary(
            child: CustomPaint(
              size: Size(constraints.maxWidth, constraints.maxHeight),
              painter: DrawingPainter(
                strokes: _strokes,
                currentStroke: _currentStroke,
                gridColor: Colors.grey.shade300!,
                gridSpacing: 24.0,
              ),
            ),
          ),
        );
      },
    );
  }

  /// 하단 팔레트: 색상 버튼 4개 + 펜 굵기 슬라이더
  Widget _buildBottomPalette() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      color: Colors.white,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 색상 선택 버튼 (검정, 빨강, 파랑, 초록)
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: _paletteColors.map((color) {
              final isSelected = _penColor.value == color.value;
              return GestureDetector(
                onTap: () => setState(() => _penColor = color),
                child: Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: color,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isSelected ? Colors.blue : Colors.grey.shade400,
                      width: isSelected ? 3 : 1,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.15),
                        blurRadius: 4,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 16),
          // 펜 굵기 슬라이더
          Row(
            children: [
              Text(
                '굵기',
                style: TextStyle(
                  fontSize: 14,
                  color: Colors.grey[700],
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Slider(
                  value: _strokeWidth,
                  min: 1.0,
                  max: 12.0,
                  divisions: 11,
                  label: _strokeWidth.round().toString(),
                  onChanged: (v) => setState(() => _strokeWidth = v),
                ),
              ),
              Text(
                '${_strokeWidth.round()}',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey[600],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// =============================================================================
// [참고] 그린 내용 저장/불러오기 시 사용할 수 있는 패키지
// =============================================================================
//
// 1) 벡터 데이터(스트로크 리스트) 저장/불러오기
//    - path_provider: 로컬 파일 저장 경로 (getApplicationDocumentsDirectory)
//    - 스트로크를 JSON으로 직렬화 후 File에 쓰기/읽기
//
//    pubspec.yaml 추가:
//      dependencies:
//        path_provider: ^2.1.0
//
//    사용 예:
//      final dir = await getApplicationDocumentsDirectory();
//      final file = File('${dir.path}/drawing.json');
//      await file.writeAsString(jsonEncode(strokesToJson(_strokes)));
//
// 2) 이미지로 내보내기(갤러리 저장)
//    - image_gallery_saver 또는 gal: 갤러리에 이미지 저장
//    - CustomPainter로 그린 내용을 ui.Picture로 렌더링 후 image로 변환해 저장
//
//    pubspec.yaml 추가:
//      dependencies:
//        image_gallery_saver: ^2.0.0
//      # 또는 gal: ^2.3.0
//
//    사용 예 (대략):
//      final recorder = ui.PictureRecorder();
//      final canvas = Canvas(recorder);
//      // DrawingPainter로 canvas에 그리기
//      final picture = recorder.endRecording();
//      final image = await picture.toImage(width, height);
//      final byteData = await image.toByteData(format: ImageByteFormat.png);
//      await ImageGallerySaver.saveImage(byteData!.buffer.asUint8List());
//
// 3) 권한 (Android / iOS)
//    - Android: AndroidManifest.xml에 WRITE_EXTERNAL_STORAGE 등 필요 시 추가
//    - iOS: Info.plist에 NSPhotoLibraryAddUsageDescription 등 추가
//
// =============================================================================
