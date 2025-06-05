import { browser } from '$app/environment';

interface SavedData {
    players: {
      numeroGiocatori: number;
      listaPlayer: Giocatore[];
      expTotale: {
        facile: number;
        medio: number;
        difficile: number;
        mortale: number;
      };
    };
    monsters: {
      monsterGroup: number;
      listaMonster: Mostro[];
      totalExp: number;
      expSum: number;
      multiplierState: number;
    };
    lastSaved: string;
  }

  const STORAGE_KEY = 'dnd-encounter-data';
