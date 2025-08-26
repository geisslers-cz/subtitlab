<script lang="ts" module>
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { tv, type VariantProps } from 'tailwind-variants';
  import { cn, type WithElementRef } from '$lib/utils';

  export const buttonVariants = tv({
    base: [
      'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20',
      'dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
      'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md',
      'text-sm font-medium outline-none transition-all focus-visible:ring-[3px]',
      'disabled:opacity-50 aria-disabled:opacity-50',
      '[&_[data-slot=icon]]:shrink-0 cursor-pointer',
      'data-[active=true]:text-active',
    ],
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 text-white',
        outline:
          'bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 border',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>[data-slot=icon]]:px-3',
        xs: 'h-6 gap-1 rounded px-1 has-[>[data-slot=icon]]:px-1 text-xs',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>[data-slot=icon]]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>[data-slot=icon]]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];
  export type ButtonSize = VariantProps<typeof buttonVariants>['size'];

  export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
    WithElementRef<HTMLAnchorAttributes> & {
      variant?: ButtonVariant;
      size?: ButtonSize;
      tooltip?: string;
      active?: boolean;
    };
</script>

<script lang="ts">
  import { mergeProps } from 'svelte-toolbelt';
  import { tooltip } from '$lib/components/tooltip';

  let {
    class: className,
    variant = 'default',
    size = 'default',
    ref = $bindable(null),
    href = undefined,
    type = 'button',
    disabled,
    tooltip: tooltipContent,
    active,
    children,
    ...restProps
  }: ButtonProps = $props();

  let baseProps: Record<string, unknown> = $derived({
    'data-slot': 'button',
    class: cn(buttonVariants({ variant, size }), className),
  });

  let widgetProps: Record<string, unknown> = $derived(
    href !== undefined
      ? {
          href: disabled ? undefined : href,
          'aria-disabled': disabled,
          role: disabled ? 'link' : undefined,
          tabindex: disabled ? -1 : undefined,
        }
      : {
          type,
          disabled,
          'data-active': active || undefined,
        },
  );

  let disableProps: Record<string, unknown> = $derived(
    disabled ? { onclick: (evt: MouseEvent) => evt.preventDefault() } : {},
  );
</script>

{#if href}
  <a
    bind:this={ref}
    {...tooltip.attach(() => tooltipContent)}
    {...mergeProps(disableProps, restProps, baseProps, widgetProps)}
  >
    {@render children?.()}
  </a>
{:else}
  <button
    bind:this={ref}
    {...tooltip.attach(() => tooltipContent)}
    {...mergeProps(disableProps, restProps, baseProps, widgetProps)}
  >
    {@render children?.()}
  </button>
{/if}
