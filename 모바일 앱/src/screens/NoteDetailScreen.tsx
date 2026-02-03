import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { Note } from '../types/note';
import { saveNote, deleteNote } from '../store/notes';
import { DrawingCanvas } from '../components/DrawingCanvas';

const COLORS = [
  '#1a1a24',
  '#e53935',
  '#d81b60',
  '#8e24aa',
  '#5e35b1',
  '#3949ab',
  '#1e88e5',
  '#00acc1',
  '#00897b',
  '#43a047',
  '#7cb342',
  '#c0ca33',
  '#fdd835',
  '#ffb300',
  '#fb8c00',
  '#f4511e',
];

const CANVAS_HEIGHT = 220;
export function NoteDetailScreen({ route, navigation }: any) {
  const { note: initialNote } = route.params;
  const [note, setNote] = useState<Note>(initialNote);
  const [strokeColor, setStrokeColor] = useState(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);

  const width = Dimensions.get('window').width - 32;

  const updateNote = useCallback(
    (updates: Partial<Note>) => {
      const next = {
        ...note,
        ...updates,
        updatedAt: Date.now(),
      };
      setNote(next);
      saveNote(next);
    },
    [note]
  );

  const handleDelete = useCallback(() => {
    deleteNote(note.id);
    navigation.goBack();
  }, [note.id, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>삭제</Text>
        </Pressable>
      ),
    });
  }, [navigation, handleDelete]);

  const titleFromBody = (body: string) => {
    const firstLine = body.split('\n')[0].trim();
    return firstLine.slice(0, 50) || '';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          style={styles.titleInput}
          placeholder="제목 (선택)"
          placeholderTextColor="#606070"
          value={note.title}
          onChangeText={(title) => updateNote({ title })}
        />

        <TextInput
          style={styles.bodyInput}
          placeholder="메모를 입력하세요..."
          placeholderTextColor="#606070"
          multiline
          value={note.body}
          onChangeText={(body) =>
            updateNote({
              body,
              title: note.title || titleFromBody(body) || note.title,
            })
          }
        />

        <Text style={styles.sectionLabel}>그리기</Text>
        <View style={styles.toolbar}>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <Pressable
                key={c}
                style={[
                  styles.colorDot,
                  { backgroundColor: c },
                  strokeColor === c && !isEraser && styles.colorDotSelected,
                ]}
                onPress={() => {
                  setStrokeColor(c);
                  setIsEraser(false);
                }}
              />
            ))}
          </View>
          <View style={styles.toolRow}>
            <Pressable
              style={[styles.toolBtn, isEraser && styles.toolBtnActive]}
              onPress={() => setIsEraser(!isEraser)}
            >
              <Text style={styles.toolBtnText}>지우개</Text>
            </Pressable>
            <View style={styles.widthRow}>
              {[2, 4, 8].map((w) => (
                <Pressable
                  key={w}
                  style={[
                    styles.widthBtn,
                    strokeWidth === w && !isEraser && styles.widthBtnActive,
                  ]}
                  onPress={() => setStrokeWidth(w)}
                >
                  <View style={[styles.widthDot, { width: w, height: w, borderRadius: w / 2 }]} />
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <DrawingCanvas
          width={width}
          height={CANVAS_HEIGHT}
          strokes={note.strokes}
          onStrokesChange={(strokes) => updateNote({ strokes })}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          isEraser={isEraser}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a24',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    paddingVertical: 4,
  },
  bodyInput: {
    fontSize: 16,
    color: '#e0e0e0',
    minHeight: 100,
    marginBottom: 20,
    paddingVertical: 4,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a0a0b0',
    marginBottom: 10,
  },
  toolbar: {
    marginBottom: 12,
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  colorDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorDotSelected: {
    borderColor: '#fff',
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toolBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2d2d3a',
  },
  toolBtnActive: {
    backgroundColor: '#7c6cf9',
  },
  toolBtnText: {
    color: '#fff',
    fontSize: 14,
  },
  widthRow: {
    flexDirection: 'row',
    gap: 8,
  },
  widthBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2d2d3a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  widthBtnActive: {
    backgroundColor: '#3d3d4a',
  },
  widthDot: {
    backgroundColor: '#fff',
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  deleteButtonText: {
    color: '#f44336',
    fontSize: 16,
  },
});
