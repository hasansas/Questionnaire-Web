export interface DayMasterElement {
  symbol: string;
  pinyin: string;
  value: string;
  role: string;
  interpretation: string;
}

export interface LocalizedDayMaster {
  symbol: string;
  pinyin: string;
  value: string;
  element: DayMasterElement;
}

export interface DayMasterNarrative {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  content: string;
}

export interface DayMasterData {
  LocalizedDayMaster: LocalizedDayMaster;
  narrative: DayMasterNarrative;
}