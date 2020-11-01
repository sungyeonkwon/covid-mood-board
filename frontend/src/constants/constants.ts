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
  age?: number;
  coords: string;
  created_by: string;
  gender?: string;
  is_anonymous: boolean;
  message: string;
  mood: string;
  name?: string;
  profession?: string;
}
