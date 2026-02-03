import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Note } from '../types/note';

const STORAGE_KEY = '@draw_note_notes';

export async function loadNotes(): Promise<Note[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as Note[];
    return list.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export async function saveNote(note: Note): Promise<void> {
  const list = await loadNotes();
  const idx = list.findIndex((n) => n.id === note.id);
  if (idx >= 0) list[idx] = note;
  else list.unshift(note);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function deleteNote(id: string): Promise<void> {
  const list = await loadNotes().then((n) => n.filter((x) => x.id !== id));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function createNewNote(): Note {
  return {
    id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    title: '',
    body: '',
    strokes: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
