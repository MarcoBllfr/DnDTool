interface Giocatore {
    livello: number;
  }
  
interface Difficulty {
    facile: number;
    medio: number;
    difficile: number;
    mortale: number;
  }

  interface Mostro {
    Cr: string;
    quantity: number;
  }

  interface CalcState {
  totalExp: number;
  expSum: number;
  multiplierState: number;
  monsterQuantity: number;
  numeroGiocatori: number;
  expTotale: Difficulty;
  listaPlayer: Giocatore[];
  listaMonster: Mostro[];
  monsterGroup: number;
}