import { browser } from '$app/environment';

const STORAGE_KEY = 'dnd-player-data';

interface SavedData {
  players: {
    numeroGiocatori: number;
    listaPlayer: Giocatore[];
    expTotale: Difficulty;
  };
  lastSaved: string;
}

export function saveDataPlayer(data: SavedData): void {
  if (!browser) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadDataPlayer(): SavedData | null {
  if (!browser) return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as SavedData) : null;
}


const MONSTER_STORAGE_KEY = 'dnd-monster-data';

interface SavedMonsterData {
  monsterGroup: number;
  listaMonster: Mostro[];
  expSum: number;
  multiplierState: number;
  totalExp: number;
  lastSaved: string;
}

export function saveMonsterData(data: SavedMonsterData): void {
  if (!browser) return;
  localStorage.setItem(MONSTER_STORAGE_KEY, JSON.stringify(data));
}

export function loadMonsterData(): SavedMonsterData | null {
  if (!browser) return null;
  const raw = localStorage.getItem(MONSTER_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as SavedMonsterData) : null;
}