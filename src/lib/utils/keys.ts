const apple = /iPhone|iPad|iPod|Mac/i.test(navigator.platform);

export function isCtrlKey(evt: KeyboardEvent): boolean {
  return apple ? evt.metaKey : evt.ctrlKey;
}

export function composeKey(evt: KeyboardEvent): string {
  const key: string[] = [];

  if (isCtrlKey(evt)) key.push('Ctrl');
  if (evt.shiftKey) key.push('Shift');
  if (evt.altKey) key.push('Alt');

  key.push(evt.key);
  return key.join('+');
}
