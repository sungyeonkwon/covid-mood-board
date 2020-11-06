export const genderOptions = [
  'female',
  'male',
  'other',
];

export enum Mood {
  UNDEFINED = 'undefined',
  ANGER = 'anger',
  DISGUST = 'disgust',
  FEAR = 'fear',
  JOY = 'joy',
  MIXED = 'mixed',
  SADNESS = 'sadness',
}

export enum MoodColour {
  RED = '#e33d3d',
  GREEN = '#3d9c48',
  PURPLE = '#9061c9',
  YELLOW = '#fadd02',
  MIXED = 'grey',
  BLUE = '#6699ff',
}

export const MoodColourMap = {
  [Mood.ANGER]: MoodColour.RED,
  [Mood.DISGUST]: MoodColour.GREEN,
  [Mood.FEAR]: MoodColour.PURPLE,
  [Mood.JOY]: MoodColour.YELLOW,
  [Mood.MIXED]: MoodColour.MIXED,
  [Mood.SADNESS]: MoodColour.BLUE,
}

export interface User {
  id: number;
  age?: number;
  latitude: string;
  longitude: string;
  created_by: string;
  gender?: string;
  is_anonymous: boolean;
  message: string;
  mood: string;
  name?: string;
  profession?: string;
}
