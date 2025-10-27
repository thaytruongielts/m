export interface Belief {
  text: string;
  tense: string;
  translation: string;
}

export interface TransformedBeliefs {
  logic: Belief[];
  emotion: Belief[];
  animal: Belief[];
}