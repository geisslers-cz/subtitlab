import type { ActionReturn } from 'svelte/action';
import { createAttachmentKey, fromAction } from 'svelte/attachments';
import { type Options as TooltipOptions, tooltip as tooltipPrimitive } from 'svooltip';
import { cn } from '$lib/utils';

const globals: Omit<TooltipOptions, 'content'> = {
  target: 'body',
  delay: [350, 0],
  shiftPadding: 10,
  classes: {
    container: cn(
      'absolute left-0 top-0 z-50 w-fit rounded-md px-3 py-1.5 text-xs text-balance',
      'bg-accent text-accent-foreground border',
      'data-[placement=top]:origin-center',
      'data-[placement=top-start]:origin-bottom-left',
      'data-[placement=top-end]:origin-bottom-right',
      'data-[placement=right]:origin-left',
      'data-[placement=right-start]:origin-top-left',
      'data-[placement=right-end]:origin-bottom-left',
      'data-[placement=bottom]:origin-top',
      'data-[placement=bottom-start]:origin-top-left',
      'data-[placement=bottom-end]:origin-top-right',
      'data-[placement=left]:origin-right',
      'data-[placement=left-start]:origin-top-right',
      'data-[placement=left-end]:origin-bottom-right',

      '[&.in]:animate-in [&.in]:fade-in-0 [&.in]:zoom-in-95',
      '[&.out]:animate-out [&.out]:fade-out-0 [&.out]:zoom-out-95',

      'data-[placement=bottom]:slide-in-from-top-2',
      'data-[placement=left]:slide-in-from-right-2',
      'data-[placement=right]:slide-in-from-left-2',
      'data-[placement=top]:slide-in-from-bottom-2',
    ),
    content: 'relative text-pre-line',
    arrow: cn(
      'absolute bg-accent z-50 size-2.5 border border-transparent rotate-45 rounded-[2px]',
      'in-data-[placement=top]:border-r-border in-data-[placement=top]:border-b-border',
      'in-data-[placement=bottom]:border-l-border in-data-[placement=bottom]:border-t-border',
      'in-data-[placement=left]:border-t-border in-data-[placement=left]:border-r-border',
      'in-data-[placement=right]:border-l-border in-data-[placement=right]:border-b-border',
    ),
    animationEnter: 'in',
    animationLeave: 'out',
  },
};

type HtmlContent = { html: string };

export function tooltip(
  node: HTMLElement,
  content?: HtmlContent | string,
): ActionReturn<HtmlContent | string | undefined> {
  const options = normalizeOptions(content);
  let tt = options ? tooltipPrimitive(node, { ...globals, ...options }) : undefined;

  return {
    update: (content) => {
      const options = normalizeOptions(content);

      if (!options) {
        tt?.destroy();
      } else if (!tt) {
        tt = tooltipPrimitive(node, { ...globals, ...options });
      } else {
        tt.update({ ...globals, ...options });
      }
    },
    destroy: () => {
      tt?.destroy();
      tt = undefined;
    },
  };
}

tooltip.attach = (content: () => HtmlContent | string | undefined) => {
  return {
    [createAttachmentKey()]: fromAction(tooltip, content),
  };
};

function normalizeOptions(
  content?: HtmlContent | string,
): Pick<TooltipOptions, 'html' | 'content'> | undefined {
  if (content === undefined) {
    return undefined;
  }

  const options =
    typeof content === 'string' ? { content, html: false } : { content: content.html, html: true };

  return options.content.length ? options : undefined;
}
