interface Giocatore {
    livello: number;
  }
  
interface Difficulty {
    facile: number;
    medio: number;
    difficile: number;
    mortale: number;
  }

  //i used this in to the MonsterCalculator component 
  interface Mostro {
    Cr: string;
    quantity: number;
  }

  interface CalcState {
  renderStatus:string;
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

//this is for json reading and monster list
interface Monster {
  readonly name: string;
  readonly meta: string;
  readonly "Armor Class": string;
  readonly "Hit Points": string;
  readonly Speed: string;
  readonly STR: string;
  readonly STR_mod: string;
  readonly DEX: string;
  readonly DEX_mod: string;
  readonly CON: string;
  readonly CON_mod: string;
  readonly INT: string;
  readonly INT_mod: string;
  readonly WIS: string;
  readonly WIS_mod: string;
  readonly CHA: string;
  readonly CHA_mod: string;
  readonly "Saving Throws"?: string;
  readonly Skills?: string;
  readonly Senses: string;
  readonly Languages: string;
  readonly Challenge: string;
  readonly Traits?: string; // HTML string
  readonly Actions?: string; // HTML string
  readonly Reactions?: string; // HTML string
  readonly "Legendary Actions"?: string; // HTML string
  readonly "Damage Vulnerabilities"?: string;
  readonly "Damage Resistances"?: string;
  readonly "Damage Immunities"?: string;
  readonly "Condition Immunities"?: string;
  readonly img_url: string;
}
