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
export function resetPlayerData(): SavedData {
  const defaultData: SavedData = {
    players: {
      numeroGiocatori: 1,
      listaPlayer: [],
      expTotale: {
        facile: 0,
        medio: 0,
        difficile: 0,
        mortale: 0
      }
    },
    lastSaved: new Date().toISOString(),
  };

  if (browser) {
    localStorage.removeItem(STORAGE_KEY);
  }

  return defaultData;
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

export function resetMonsterData(): SavedMonsterData {
  const defaultData: SavedMonsterData = {
    monsterGroup: 1,
    listaMonster: [],
    expSum: 0,
    multiplierState: 0,
    totalExp: 0,
    lastSaved: new Date().toISOString(),
  };

  if (browser) {
    localStorage.removeItem(MONSTER_STORAGE_KEY);
  }

  return defaultData;
}

