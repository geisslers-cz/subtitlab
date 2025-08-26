const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export type MidiNote = {
  name: string;
  sharp: boolean;
  octave: number;
};

export function extractNoteInfo(value: number): MidiNote {
  const note = notes[value % 12];
  const name = note.charAt(0);
  const sharp = note.charAt(1) === '#';
  const octave = Math.floor(value / 12) - 1;
  return { name, sharp, octave };
}

export const noteOptions: ReadonlyMap<number, MidiNote> = new Map(
  [...new Array(128).keys()].reverse().map((note) => [note, extractNoteInfo(note)]),
);

export const messageType = {
  noteOn: 0x90,
  cc: 0xb0,
  program: 0xc0,
} as const;

export const cc = {
  bankSelectMsb: 0,
  bankSelectLsb: 32,
} as const;
