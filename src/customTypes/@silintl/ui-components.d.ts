
declare module '@silintl/ui-components' {
  import type { SvelteComponentTyped } from 'svelte';
  import type { writable } from 'svelte/store';

  export type actions = writable<any[]>;
  
  interface ButtonProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    disabled?: any;
    outlined?: any;
    raised?: any;
    prependIcon?: any;
    appendIcon?: any;
    url?: any;
  };
  export class Button extends SvelteComponentTyped<ButtonProps> {};
  
  export function isAboveMobile(): boolean;
  
  export function isAboveTablet(): boolean;
  
  interface CardProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    secondary?: string;
    outlined?: boolean;
    color?: string;
    isClickable?: boolean;
    noPadding?: boolean;
  };
  export class Card extends SvelteComponentTyped<CardProps> {};
  
  interface CheckboxProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    label?: string;
    checked?: boolean;
    disabled?: boolean;
    uppercase?: boolean;
  };
	export class Checkbox extends SvelteComponentTyped<CheckboxProps> {};
  
  interface DatatableProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    label?: string;
  };
	export class Datatable extends SvelteComponentTyped<DatatableProps> {};

  export namespace Datatable {
    interface HeaderProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
      // no exported members
    };
    export class Header extends SvelteComponentTyped<HeaderProps> {};

    export namespace Header {
      interface ItemProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
        numeric?: boolean;
        columnID?: string;
        sortable?: boolean;
      };
      export class Item extends SvelteComponentTyped<ItemProps> {};
    }

    interface DataProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
      // no exported members
    };
    export class Data extends SvelteComponentTyped<DataProps> {};

    export namespace Data {
      interface RowProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
        clickable?: boolean;
      };
      export class Row extends SvelteComponentTyped<RowProps> {};

      export namespace Row {
        interface ItemProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
          numeric?: boolean;
          colspan?: number;
        };
        export class Item extends SvelteComponentTyped<ItemProps> {};
      }
    }
  }
  
  export namespace Dialog {
    interface AlertProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
      open?: boolean;
      title?: string;
      defaultAction?: string;
    };
	  export class Alert extends SvelteComponentTyped<AlertProps> {};

    interface SimpleProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
      open?: boolean;
      title?: string;
    };
	  export class Simple extends SvelteComponentTyped<SimpleProps> {};
  };
  
  interface DrawerProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    title?: string;
    subtitle?: string;
    menuItems?: any[];
    dismissible?: boolean;
    hasTopAppBar?: boolean;
    hideForTablet?: boolean;
    hideForPhonesOnly?: boolean;
    isFullHeightMenu?: boolean;
    miniMenu?: boolean;
    modal?: boolean;
    toggle?: boolean;
  };
	export class Drawer extends SvelteComponentTyped<DrawerProps> {};
  
  interface FabProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    icon?: string;
    label?: string;
    mini?: boolean;
    extended?: boolean;
    url?: string;
    action?: any;
  };
	export class Fab extends SvelteComponentTyped<FabProps> {};
  
  interface IconButtonProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    icon?: any;
    ariaLabel?: any;
  };
	export class IconButton extends SvelteComponentTyped<IconButtonProps> {};
  
  interface ListProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    twoLine?: boolean;
    avatar?: boolean;
  };
	export class List extends SvelteComponentTyped<ListProps> {};
  
  export namespace Progress {
    interface CircularProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
      // no exported members
    };
	  export class Circular extends SvelteComponentTyped<CircularProps> {};

    interface LinearProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
      indeterminate?: boolean;
      value?: number;
    }
    export class Linear extends SvelteComponentTyped<LinearProps> {};
  };
  
  interface SelectProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    options?: any[];
    width?: string;
    disabled?: boolean;
    selectedID?: string;
  };
	export class Select extends SvelteComponentTyped<SelectProps> {};
  
  interface SnackbarProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    // no exported members
  };
	export class Snackbar extends SvelteComponentTyped<SnackbarProps> {};
  
  interface TabBarProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    tab?: number;
  };
	export class TabBar extends SvelteComponentTyped<TabBarProps> {};
  
  interface TextAreaProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    label?: string;
    value?: string;
    placeholder?: string;
    rows?: number | string;
    maxlength?: number;
    autofocus?: boolean;
    rtl?: boolean;
  };
	export class TextArea extends SvelteComponentTyped<TextAreaProps> {};
  
  interface TextFieldProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    label?: string;
    value?: string;
    placeholder?: string;
    maxlength?: number;
    autofocus?: boolean;
    disabled?: boolean;
  };
	export class TextField extends SvelteComponentTyped<TextFieldProps> {};
  
  interface TooltipProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    tooltipID?: any;
    positionX?: any;
    positionY?: any;
  };
	export class Tooltip extends SvelteComponentTyped<TooltipProps> {};
  
  interface TopAppBarProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    bgColorIsVariant?: boolean;
    dense?: boolean;
    fixed?: boolean;
    navIconBreakpointClass?: string;
  };
	export class TopAppBar extends SvelteComponentTyped<TopAppBarProps> {};
  
  interface BadgeProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    color?: string;
    borderRadius?: string;
    padding?: string;
    bordered?: boolean;
  };
	export class Badge extends SvelteComponentTyped<BadgeProps> {};
  
  interface CustomCardProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    src?: string;
    alt?: string;
    title?: string;
    icon?: string;
    disabled?: boolean;
    buttons?: any;
    footerText?: string;
  };
	export class CustomCard extends SvelteComponentTyped<CustomCardProps> {};
  
  interface FormProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    // no exported members
  };
	export class Form extends SvelteComponentTyped<FormProps> {};
  
  interface PageProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    loading?: any;
    title?: any;
    layout?: any;
    center?: any;
    noProgress?: any;
  };
	export class Page extends SvelteComponentTyped<PageProps> {};
  
  interface StaticChipProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    bgColor?: string;
  };
	export class StaticChip extends SvelteComponentTyped<StaticChipProps> {};
  
  export function setNotice(label: string, action?: string, callback?: Function): void;
  
  interface TourProps extends svelte.JSX.HTMLAttributes<HTMLElementTagNameMap['div']> {
    steps?: any[];
    data?: any;
  };
	export class Tour extends SvelteComponentTyped<TourProps> {};

}

module '@silintl/ui-components/random' {
    export function generateRandomID(prefix?: string): string;  
}