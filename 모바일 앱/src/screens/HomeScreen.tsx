import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Note } from '../types/note';
import { createNewNote, loadNotes } from '../store/notes';

export function HomeScreen({ navigation }: any) {
  const [notes, setNotes] = useState<Note[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadNotes().then(setNotes);
    }, [])
  );

  const openNote = (note: Note) => {
    navigation.navigate('NoteDetail', { note });
  };

  const addNote = () => {
    const note = createNewNote();
    navigation.navigate('NoteDetail', { note });
  };

  const formatDate = (ms: number) => {
    const d = new Date(ms);
    const now = new Date();
    const sameDay =
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear();
    if (sameDay) {
      return d.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return d.toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>그림 노트</Text>
        <Text style={styles.subtitle}>메모하고 그리기</Text>
      </View>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>아직 노트가 없어요</Text>
            <Text style={styles.emptyHint}>+ 버튼으로 새 노트를 만들어 보세요</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
            ]}
            onPress={() => openNote(item)}
          >
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.title || '(제목 없음)'}
            </Text>
            <Text style={styles.cardPreview} numberOfLines={2}>
              {item.body || '내용을 입력하거나 그림을 그려 보세요.'}
            </Text>
            <Text style={styles.cardDate}>{formatDate(item.updatedAt)}</Text>
          </Pressable>
        )}
      />

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={addNote}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a24',
  },
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#2d2d3a',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#a0a0b0',
    marginTop: 4,
  },
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  empty: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#808090',
  },
  emptyHint: {
    fontSize: 14,
    color: '#606070',
    marginTop: 8,
  },
  card: {
    backgroundColor: '#2d2d3a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardPressed: {
    opacity: 0.9,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  cardPreview: {
    fontSize: 14,
    color: '#a0a0b0',
    marginTop: 6,
  },
  cardDate: {
    fontSize: 12,
    color: '#606070',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7c6cf9',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabPressed: {
    opacity: 0.9,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
    lineHeight: 32,
  },
});
