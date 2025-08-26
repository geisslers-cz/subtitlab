export async function sleep(t: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, t));
}

export async function sleepUntil(t: number, signal?: AbortSignal): Promise<boolean> {
  const dt = t - Date.now();

  if (dt > 30) {
    await sleep(dt - 30);
  }

  while (t - Date.now() > 0 && !signal?.aborted) {
    await Promise.resolve();
  }

  return !signal?.aborted;
}

export type Timeout = {
  postpone(time: number): void;
  clear(): void;
};

export function startTimeout(time: number): [AbortSignal, Timeout] {
  const controller = new AbortController();
  const abort = controller.abort.bind(controller);
  let tmr = setTimeout(abort, time);

  return [
    controller.signal,
    {
      postpone(time: number) {
        clearTimeout(tmr);
        tmr = setTimeout(abort, time);
      },
      clear() {
        clearTimeout(tmr);
      },
    },
  ];
}
