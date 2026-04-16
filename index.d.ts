// Type definitions for apg-react
// Project: https://github.com/AFixt/apg-react
// Definitions: hand-written; kept in lockstep with the component PropTypes.

import * as React from "react";

/* ------------------------------------------------------------------ */
/* Accordion                                                           */
/* ------------------------------------------------------------------ */
export interface AccordionItem {
    title: React.ReactNode;
    content: React.ReactNode;
}
export interface AccordionProps {
    items: AccordionItem[];
    openIndex: number | null;
    toggleItem: (index: number) => void;
}
export const Accordion: React.FC<AccordionProps>;

/* ------------------------------------------------------------------ */
/* Alert                                                               */
/* ------------------------------------------------------------------ */
export interface AlertProps {
    message: string;
    type: "info" | "warning" | "error";
}
export const Alert: React.FC<AlertProps>;

/* ------------------------------------------------------------------ */
/* AlertDialog                                                         */
/* ------------------------------------------------------------------ */
export interface AlertDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    onClose: () => void;
}
export const AlertDialog: React.FC<AlertDialogProps>;

/* ------------------------------------------------------------------ */
/* Article                                                             */
/* ------------------------------------------------------------------ */
export interface ArticleData {
    id: string;
    title: React.ReactNode;
    content: React.ReactNode;
}
export interface ArticleProps {
    article: ArticleData;
    ariaPosinset: number;
    ariaSetsize: number;
}
export const Article: React.FC<ArticleProps>;

/* ------------------------------------------------------------------ */
/* Breadcrumb                                                          */
/* ------------------------------------------------------------------ */
export interface BreadcrumbItem {
    path: string;
    label: string;
}
export interface BreadcrumbProps {
    items: BreadcrumbItem[];
}
export const Breadcrumb: React.FC<BreadcrumbProps>;

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */
export interface ButtonProps {
    action: () => void;
    label: string;
    shortcutKey?: string;
    ariaDescribedby?: string;
    isDisabled?: boolean;
    isToggleButton?: boolean;
    toggleState?: boolean;
}
export const Button: React.FC<ButtonProps>;

/* ------------------------------------------------------------------ */
/* Carousel                                                            */
/* ------------------------------------------------------------------ */
export interface CarouselSlide {
    id: string;
    label: string;
    content: React.ReactNode;
}
export interface CarouselProps {
    slides: CarouselSlide[];
}
export const Carousel: React.FC<CarouselProps>;

/* ------------------------------------------------------------------ */
/* Checkbox                                                            */
/* ------------------------------------------------------------------ */
export interface CheckboxProps {
    label: string;
    checked: boolean | null;
    onChange: (next: boolean | null) => void;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
    isTriState?: boolean;
}
export const Checkbox: React.FC<CheckboxProps>;

/* ------------------------------------------------------------------ */
/* CheckboxGroup                                                       */
/* ------------------------------------------------------------------ */
export interface CheckboxGroupItem {
    id: string;
    label: string;
}
export interface CheckboxGroupProps {
    label: string;
    items: CheckboxGroupItem[];
}
export const CheckboxGroup: React.FC<CheckboxGroupProps>;

/* ------------------------------------------------------------------ */
/* Combobox                                                            */
/* ------------------------------------------------------------------ */
export interface ComboboxOption {
    value: string;
    label: string;
}
export interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onChange?: (next: string) => void;
    label?: string;
    autocomplete?: "none" | "list" | "both";
    placeholder?: string;
}
export const Combobox: React.FC<ComboboxProps>;

/* ------------------------------------------------------------------ */
/* Disclosure                                                          */
/* ------------------------------------------------------------------ */
export interface DisclosureProps {
    title: React.ReactNode;
    children: React.ReactNode;
}
export const Disclosure: React.FC<DisclosureProps>;

/* ------------------------------------------------------------------ */
/* Feed                                                                */
/* ------------------------------------------------------------------ */
export interface FeedProps {
    fetchArticles: () => Promise<ArticleData[]>;
}
export const Feed: React.FC<FeedProps>;

/* ------------------------------------------------------------------ */
/* Grid                                                                */
/* ------------------------------------------------------------------ */
export interface GridColumn {
    key: string;
    label: React.ReactNode;
}
export interface GridProps {
    caption?: React.ReactNode;
    label: string;
    columns: GridColumn[];
    rows: Record<string, React.ReactNode | string | number>[];
    idPrefix?: string;
}
export const Grid: React.FC<GridProps>;

/* ------------------------------------------------------------------ */
/* Link                                                                */
/* ------------------------------------------------------------------ */
export interface LinkProps {
    to: string | object;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
    [extra: string]: unknown;
}
export const Link: React.FC<LinkProps>;

/* ------------------------------------------------------------------ */
/* Listbox                                                             */
/* ------------------------------------------------------------------ */
export interface ListboxOption {
    value: string;
    label: React.ReactNode;
}
export interface ListboxProps {
    options: ListboxOption[];
    value?: string | string[];
    onChange?: (next: string | string[]) => void;
    multiple?: boolean;
    label?: string;
    labelId?: string;
}
export const Listbox: React.FC<ListboxProps>;

/* ------------------------------------------------------------------ */
/* MenuButton                                                          */
/* ------------------------------------------------------------------ */
export interface MenuItem {
    id: string;
    label: React.ReactNode;
    onSelect?: () => void;
}
export interface MenuButtonProps {
    label: React.ReactNode;
    items: MenuItem[];
    idPrefix?: string;
}
export const MenuButton: React.FC<MenuButtonProps>;

/* ------------------------------------------------------------------ */
/* Menubar                                                             */
/* ------------------------------------------------------------------ */
export interface MenubarMenu {
    id: string;
    label: React.ReactNode;
    items: MenuItem[];
}
export interface MenubarProps {
    label: string;
    menus: MenubarMenu[];
}
export const Menubar: React.FC<MenubarProps>;

/* ------------------------------------------------------------------ */
/* Meter                                                               */
/* ------------------------------------------------------------------ */
export interface MeterProps {
    value: number;
    minValue?: number;
    maxValue?: number;
    label?: string;
    labelId?: string;
    userFriendlyText?: (value: number) => string;
}
export const Meter: React.FC<MeterProps>;

/* ------------------------------------------------------------------ */
/* ModalDialog                                                         */
/* ------------------------------------------------------------------ */
export interface ModalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    ariaLabel?: string;
    ariaDescribedby?: string;
    children: React.ReactNode;
    initialFocusRef?: React.RefObject<HTMLElement>;
}
export const ModalDialog: React.FC<ModalDialogProps>;

/* ------------------------------------------------------------------ */
/* Progressbar                                                         */
/* ------------------------------------------------------------------ */
export interface ProgressbarProps {
    value?: number;
    min?: number;
    max?: number;
    label?: string;
    labelId?: string;
    valueText?: string;
}
export const Progressbar: React.FC<ProgressbarProps>;

/* ------------------------------------------------------------------ */
/* RadioGroup                                                          */
/* ------------------------------------------------------------------ */
export interface RadioOption {
    value: string;
    label: string;
}
export interface RadioGroupProps {
    name: string;
    label?: string;
    labelId?: string;
    options: RadioOption[];
    value?: string;
    onChange?: (next: string) => void;
}
export const RadioGroup: React.FC<RadioGroupProps>;

/* ------------------------------------------------------------------ */
/* Slider                                                              */
/* ------------------------------------------------------------------ */
export interface SliderProps {
    min: number;
    max: number;
    step?: number;
    initialValue?: number;
    ariaLabelledby?: string;
    isVertical?: boolean;
    getUserFriendlyValue?: (value: number) => string;
}
export const Slider: React.FC<SliderProps>;

/* ------------------------------------------------------------------ */
/* SliderMultiThumb                                                    */
/* ------------------------------------------------------------------ */
export interface SliderMultiThumbProps {
    min: number;
    max: number;
    step?: number;
    initialLow?: number;
    initialHigh?: number;
    labelLow?: string;
    labelHigh?: string;
    getValueText?: (value: number) => string;
    onChange?: (value: { low: number; high: number }) => void;
}
export const SliderMultiThumb: React.FC<SliderMultiThumbProps>;

/* ------------------------------------------------------------------ */
/* Spinbutton                                                          */
/* ------------------------------------------------------------------ */
export interface SpinbuttonProps {
    min: number;
    max: number;
    step?: number;
    ariaLabelledby?: string;
    initialValue?: number;
}
export const Spinbutton: React.FC<SpinbuttonProps>;

/* ------------------------------------------------------------------ */
/* Switch                                                              */
/* ------------------------------------------------------------------ */
export interface SwitchProps {
    label?: string;
    ariaLabelledby?: string;
    ariaDescribedby?: string;
    initialChecked?: boolean;
}
export const Switch: React.FC<SwitchProps>;

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */
export interface TabDef {
    id: string;
    label: React.ReactNode;
    content: React.ReactNode;
}
export interface TabsProps {
    tabs: TabDef[];
    defaultIndex?: number;
    activation?: "automatic" | "manual";
    orientation?: "horizontal" | "vertical";
    idPrefix?: string;
}
export const Tabs: React.FC<TabsProps>;

/* ------------------------------------------------------------------ */
/* Textbox                                                             */
/* ------------------------------------------------------------------ */
export interface TextboxProps {
    label?: string;
    value?: string;
    onChange?: (next: string, event?: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
    required?: boolean;
    readOnly?: boolean;
    invalid?: boolean;
    errorMessage?: string;
    helperText?: string;
    id?: string;
    name?: string;
    type?: string;
}
export const Textbox: React.FC<TextboxProps>;

/* ------------------------------------------------------------------ */
/* Toolbar                                                             */
/* ------------------------------------------------------------------ */
export interface ToolbarProps {
    label?: string;
    ariaLabelledby?: string;
    orientation?: "horizontal" | "vertical";
    children: React.ReactNode;
}
export const Toolbar: React.FC<ToolbarProps>;

/* ------------------------------------------------------------------ */
/* Tooltip                                                             */
/* ------------------------------------------------------------------ */
export interface TooltipProps {
    text: string;
    position?: "top" | "right" | "bottom" | "left";
    children: React.ReactNode;
}
export const Tooltip: React.FC<TooltipProps>;

/* ------------------------------------------------------------------ */
/* TreeView                                                            */
/* ------------------------------------------------------------------ */
export interface TreeNode {
    id: string;
    label: React.ReactNode;
    children?: TreeNode[];
}
export interface TreeViewProps {
    label: string;
    nodes: TreeNode[];
    onSelect?: (id: string) => void;
    defaultExpanded?: string[];
}
export const TreeView: React.FC<TreeViewProps>;

/* ------------------------------------------------------------------ */
/* TreeGrid                                                            */
/* ------------------------------------------------------------------ */
export interface TreeGridColumn {
    key: string;
    label: React.ReactNode;
}
export interface TreeGridRow {
    id: string;
    children?: TreeGridRow[];
    [column: string]: unknown;
}
export interface TreeGridProps {
    label: string;
    columns: TreeGridColumn[];
    rows: TreeGridRow[];
    defaultExpanded?: string[];
}
export const TreeGrid: React.FC<TreeGridProps>;
