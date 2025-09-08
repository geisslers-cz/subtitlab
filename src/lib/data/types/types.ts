import { type Oklch, oklch } from '$lib/components/color-picker';

export type MidiBank = {
  msb: number;
  lsb: number;
};

export type MidiNoteTrigger = { type: 'note'; channel: number; note: number };
export type MidiProgramTrigger = {
  type: 'program';
  channel: number;
  bank: MidiBank;
  program: number;
};
export type MidiTrigger = MidiNoteTrigger | MidiProgramTrigger;

export type CueData = {
  id: string;
  content: string;
};

export type ManualCueData = CueData & {
  chain?: boolean;
  trigger?: MidiTrigger;
};

export type TimedCueData = CueData & {
  from: number;
  to: number;
};

export type CueSize = {
  width: number;
  height: number;
  wrapped: boolean;
};

export type AnyCueData = ManualCueData | TimedCueData;

export type SceneData = {
  id: string;
  title: string;
};

export type ManualSceneData = SceneData & {
  type: 'manual';
  cues: ManualCueData[];
};

export type TimedSceneData = SceneData & {
  type: 'timed';
  cues: TimedCueData[];
  trigger?: MidiTrigger;
};

export type AnySceneData = ManualSceneData | TimedSceneData;
export type SceneType = AnySceneData['type'];

export type ActData = {
  id: string;
  title: string;
  scenes: AnySceneData[];
};

export type FontMetadata = {
  id: string;
  family: string;
  weight?: number;
  style?: string;
};

export type Transition = {
  type: string;
  duration: number;
};

export type SettingsData = {
  fontFamily: FontMetadata | string;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontWeight: number;
  fontStyle: string;
  color: Oklch;
  cueGap: number;
  transitionIn?: Transition;
  transitionOut?: Transition;
};

export type MidiSettingsData = {
  go?: MidiTrigger;
  panic?: MidiTrigger;
};

export type ProjectData = {
  id: string;
  created: string;
  lastModified?: string;
  title: string;
  acts: ActData[];
  settings: SettingsData;
  midi: MidiSettingsData;
};

export const defaultSettings: SettingsData = {
  fontFamily: 'Georgia',
  fontSize: 0.055,
  lineHeight: 0.085,
  letterSpacing: 0,
  fontWeight: 400,
  fontStyle: 'normal',
  color: oklch(80.16, 0.1705, 73.27),
  cueGap: 0.025,
};

export const projectorArea = 0.98;
