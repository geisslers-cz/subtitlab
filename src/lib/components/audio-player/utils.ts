export const sampleRate = 24000;
export const peaksPerSecond = 50;

const samplesPerPeak = sampleRate / peaksPerSecond;

export type AudioFile = {
  duration: number;
  peaks: number[];
};

export async function analyseAudioFile(file: File): Promise<AudioFile> {
  const data = await loadFile(file);
  const peaks = getPeaks(await simplify(data));
  return { duration: data.duration, peaks };
}

async function loadFile(file: File): Promise<AudioBuffer> {
  const ctx = new AudioContext();
  const data = await ctx.decodeAudioData(await file.arrayBuffer());
  await ctx.close();
  return data;
}

async function simplify(data: AudioBuffer): Promise<Float32Array> {
  const ctx = new OfflineAudioContext({
    numberOfChannels: 1,
    sampleRate: sampleRate,
    length: (data.length * sampleRate) / data.sampleRate,
  });

  const src = ctx.createBufferSource();
  src.buffer = data;
  src.channelInterpretation = 'speakers';
  src.connect(ctx.destination);
  src.start(0);

  const buffer = await ctx.startRendering();
  return buffer.getChannelData(0);
}

function getPeaks(data: Float32Array): number[] {
  return [...new Array(Math.ceil(data.length / samplesPerPeak)).keys()].map((i) =>
    Math.max(
      ...data.subarray(i * samplesPerPeak, (i + 1) * samplesPerPeak).map((v) => Math.abs(v)),
    ),
  );
}
