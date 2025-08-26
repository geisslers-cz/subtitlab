import { SvelteMap } from 'svelte/reactivity';
import type { MidiTrigger } from '$lib/data';
import { cc, messageType } from '$lib/utils';

export type MIDIInputInfo = {
  id: string;
  name: string | null;
  manufacturer: string | null;
};

export class MidiController {
  readonly #inputs: Map<string, MIDIInput> = new SvelteMap();
  readonly #enabled: Map<string, MIDIInputInfo> = new SvelteMap(loadEnabled());
  readonly #active: Set<MIDIInput> = $derived(
    new Set([...this.#inputs.values()].filter((input) => this.#enabled.has(input.id))),
  );
  readonly #missing: Set<MIDIInputInfo> = $derived(
    new Set([...this.#enabled.values()].filter((info) => !this.#inputs.has(info.id))),
  );
  readonly #map: Map<number, () => void> = new Map();
  readonly #bankSelect: [number, number][] = [...new Array(16).keys()].map(() => [0, 0]);
  #permission?: 'granted' | 'prompt' | 'denied' = $state();
  #ctrl?: AbortController;

  constructor() {
    navigator.permissions.query({ name: 'midi' }).then(async ({ state }) => {
      this.#permission = state;

      if (state === 'granted') {
        await this.init();
      }
    });
  }

  get permission(): 'granted' | 'prompt' | 'denied' | undefined {
    return this.#permission;
  }

  get inputs(): ReadonlyMap<string, MIDIInput> {
    return this.#inputs;
  }

  get enabled(): ReadonlyMap<string, MIDIInputInfo> {
    return this.#enabled;
  }

  get active(): ReadonlySet<MIDIInput> {
    return this.#active;
  }

  get missing(): ReadonlySet<MIDIInputInfo> {
    return this.#missing;
  }

  async init(): Promise<void> {
    this.#ctrl?.abort();

    try {
      const access = await navigator.requestMIDIAccess({ sysex: false });
      this.#mergeInputs(access.inputs);
      this.#permission = 'granted';
      this.#ctrl = new AbortController();

      access.addEventListener('statechange', () => this.#mergeInputs(access.inputs), {
        signal: this.#ctrl.signal,
      });
    } catch {
      this.#permission = 'denied';
    }
  }

  toggle(input: MIDIInput, on: boolean): void {
    if (on) {
      if (this.#enabled.has(input.id)) {
        return;
      }

      input.addEventListener('midimessage', this.#handleMessage);

      this.#enabled.set(input.id, {
        id: input.id,
        name: input.name,
        manufacturer: input.manufacturer,
      });

      saveEnabled(this.#enabled);
    } else {
      input.removeEventListener('midimessage', this.#handleMessage);
      this.#enabled.delete(input.id);
      saveEnabled(this.#enabled);
    }
  }

  map(trigger: MidiTrigger, action: () => void): (() => void) | void {
    const key = triggerToKey(trigger);
    this.#map.set(key, action);

    return () => {
      this.#map.delete(key);
    };
  }

  isMapped(trigger: MidiTrigger): boolean {
    return this.#map.has(triggerToKey(trigger));
  }

  #mergeInputs(inputs: MIDIInputMap): void {
    for (const [id, input] of inputs) {
      const existing = this.#inputs.get(id);
      const enabled = this.#enabled.delete(id);

      if (existing && existing !== input) {
        this.toggle(input, false);
      }

      this.#inputs.set(id, input);

      if (enabled) {
        this.toggle(input, true);
      }
    }

    for (const [id, input] of this.#inputs) {
      if (!inputs.has(id)) {
        this.toggle(input, false);
        this.#inputs.delete(id);
      }
    }
  }

  #handleMessage = (evt: MIDIMessageEvent): void => {
    if (!evt.data || evt.data.length < 2) {
      return;
    }

    const [status, d1, d2 = 0x00] = evt.data;
    const type = status & 0xf0;
    const channel = status & 0x0f;

    switch (type) {
      case messageType.cc:
        switch (d1) {
          case cc.bankSelectMsb:
            this.#bankSelect[channel][0] = d2;
            break;
          case cc.bankSelectLsb:
            this.#bankSelect[channel][1] = d2;
            break;
        }
        break;
      case messageType.program:
        this.#trigger(
          (this.#bankSelect[channel][0] << 24) |
            (this.#bankSelect[channel][1] << 16) |
            (status << 8) |
            d1,
        );
        break;
      case messageType.noteOn:
        if (d2 !== 0) {
          this.#trigger((status << 8) | d1);
        }
        break;
    }
  };

  #trigger(key: number): void {
    this.#map.get(key)?.();
  }
}

function loadEnabled(): Iterable<[string, MIDIInputInfo]> {
  const info = localStorage.getItem('midi-inputs');
  return info !== null ? JSON.parse(info).map((input: MIDIInputInfo) => [input.id, input]) : [];
}

function saveEnabled(inputs: Map<string, MIDIInputInfo>): void {
  if (inputs.size) {
    localStorage.setItem('midi-inputs', JSON.stringify([...inputs.values()]));
  } else {
    localStorage.removeItem('midi-inputs');
  }
}

function triggerToKey(trigger: MidiTrigger): number {
  if (trigger.type === 'note') {
    return (status(messageType.noteOn, trigger) << 8) | word(trigger.note);
  }

  return (
    (word(trigger.bank.msb) << 24) |
    (word(trigger.bank.lsb) << 16) |
    (status(messageType.program, trigger) << 8) |
    word(trigger.program)
  );
}

function status(value: number, trigger: MidiTrigger): number {
  return value | (trigger.channel & 0x0f);
}

function word(value: number): number {
  return value & 0x7f;
}
