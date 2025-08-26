import Root from './audio-player.svelte';
import Timeline, {
  type TimelineCanvasLayer,
  type TimelineContentProps,
  type TimelineProps,
} from './timeline.svelte';
import type { TimelinePaintProps } from './timeline-canvas.svelte';

export { useAudioPlayer } from './audio-player.svelte';
export type { AudioPlayerContext } from './context.svelte';

export {
  Root,
  Timeline,
  type TimelineCanvasLayer,
  type TimelineContentProps,
  type TimelinePaintProps,
  type TimelineProps,
  Root as AudioPlayer,
  Timeline as AudioPlayerTimeline,
  type TimelineCanvasLayer as AudioPlayerTimelineLayer,
  type TimelineContentProps as AudioPlayerTimelineContentProps,
  type TimelinePaintProps as AudioPlayerTimelinePaintProps,
  type TimelineProps as AudioPlayerTimelineProps,
};
