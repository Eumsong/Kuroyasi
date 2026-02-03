import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Path } from 'react-native-svg';
import type { DrawingStroke } from '../types/note';

interface DrawingCanvasProps {
  width: number;
  height: number;
  strokes: DrawingStroke[];
  onStrokesChange: (strokes: DrawingStroke[]) => void;
  strokeColor: string;
  strokeWidth: number;
  isEraser: boolean;
}

export function DrawingCanvas({
  width,
  height,
  strokes,
  onStrokesChange,
  strokeColor,
  strokeWidth,
  isEraser,
}: DrawingCanvasProps) {
  const [currentPath, setCurrentPath] = useState<string | null>(null);
  const currentPoints = useRef<{ x: number; y: number }[]>([]);

  const buildPath = useCallback((points: { x: number; y: number }[]) => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x} ${points[i].y}`;
    }
    return d;
  }, []);

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      currentPoints.current = [{ x: e.x, y: e.y }];
      if (isEraser) {
        // 지우개: 가까운 스트로크 제거는 제스처 끝에서 처리
      } else {
        setCurrentPath(buildPath(currentPoints.current));
      }
    })
    .onUpdate((e) => {
      currentPoints.current.push({ x: e.x, y: e.y });
      if (!isEraser) setCurrentPath(buildPath(currentPoints.current));
    })
    .onEnd(() => {
      if (isEraser) {
        // 간단히: 마지막 스트로크만 제거
        if (strokes.length > 0) {
          onStrokesChange(strokes.slice(0, -1));
        }
      } else if (currentPath) {
        onStrokesChange([
          ...strokes,
          { path: currentPath, color: strokeColor, width: strokeWidth },
        ]);
        setCurrentPath(null);
      }
      currentPoints.current = [];
    });

  return (
    <View style={[styles.canvas, { width, height }]}>
      <GestureDetector gesture={panGesture}>
        <View style={StyleSheet.absoluteFill}>
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            {strokes.map((s, i) => (
              <Path
                key={i}
                d={s.path}
                stroke={s.color}
                strokeWidth={s.width}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {currentPath && (
              <Path
                d={currentPath}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </Svg>
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
