export interface EventMap {
  [event: string]: any;
}

export type AnyEventListener = (data: any) => void;
export type EventListener<Data> = (data: Data) => void;

export interface EventTarget<Events extends EventMap> {
  addEventListener<Event extends keyof Events>(
    event: Event,
    listener: EventListener<Events[Event]>,
  ): void;
  removeEventListener<Event extends keyof Events>(
    event: Event,
    listener: EventListener<Events[Event]>,
  ): void;
  emit<Event extends keyof Events>(event: Event, data: Events[Event]): void;
}

export class EventDispatcher<Events extends EventMap> implements EventTarget<Events> {
  readonly #listeners: Map<string, Set<AnyEventListener>> = new Map();

  addEventListener<Event extends keyof Events>(
    type: Event,
    listener: EventListener<Events[Event]>,
  ): void;
  addEventListener(type: string, listener: AnyEventListener): void {
    let listeners = this.#listeners.get(type);

    if (!listeners) {
      this.#listeners.set(type, (listeners = new Set()));
    }

    listeners.add(listener);
  }

  removeEventListener<Event extends keyof Events>(
    type: Event,
    listener: EventListener<Events[Event]>,
  ): void;
  removeEventListener(type: string, listener: AnyEventListener): void {
    this.#listeners.get(type)?.delete(listener);
  }

  removeAllListeners(): void {
    for (const listeners of this.#listeners.values()) {
      listeners.clear();
    }

    this.#listeners.clear();
  }

  emit<Event extends keyof Events>(type: Event, data: Events[Event]): void;
  emit(type: string, data: any): void {
    const listeners = this.#listeners.get(type);

    if (!listeners) {
      return;
    }

    for (const listener of listeners) {
      listener(data);
    }
  }
}
