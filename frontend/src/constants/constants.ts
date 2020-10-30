export const genderOptions = [
  'female',
  'male',
  'other',
];

export enum Mood {
  ANGER = 'anger',
  DISGUST = 'disgust',
  FEAR = 'fear',
  JOY = 'joy',
  MIXED = 'mixed',
  SADNESS = 'sadness',
}

export enum MoodColour {
  RED = 1,
  GREEN,
  PURPLE,
  YELLOW,
  MIXED,
  BLUE,
}

export interface MoodOption {
  [Mood.ANGER]: MoodColour.RED;
  [Mood.DISGUST]: MoodColour.GREEN;
  [Mood.FEAR]: MoodColour.PURPLE;
  [Mood.JOY]: MoodColour.YELLOW;
  [Mood.MIXED]: MoodColour.MIXED;
  [Mood.SADNESS]: MoodColour.BLUE;
}

export interface User {
  id: number;
  created_date: string;
  isAnonymous: boolean;
  mood: string;
  coords: string;
  message: string;
  age?: number;
  gender?: string;
  name?: string;
  profession?: string;
}
