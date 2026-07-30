/**
 * Optional router integration for the link-rendering components (Link, Breadcrumb).
 *
 * This library must not force a router on consumers, so nothing here imports
 * `react-router-dom`. Components resolve the element used to render a link in
 * this order:
 *
 *   1. an explicit `linkComponent` prop,
 *   2. the value supplied to the nearest `LinkComponentProvider`,
 *   3. a plain `<a href>` (the dependency-free default).
 *
 * Applications that use React Router opt in once, at the root:
 *
 *   import { Link as RouterLink } from 'react-router-dom';
 *   import { LinkComponentProvider } from '@afixt/apg-react';
 *
 *   <LinkComponentProvider value={RouterLink}>...</LinkComponentProvider>
 *
 * @module internal/link-component
 */
import React, { createContext, useContext } from 'react';

/** A location descriptor: either a path string or a router location-like object. */
export type LinkTo = string | { pathname?: string; search?: string; hash?: string };

/** Props any injected link component must accept. Extra props are forwarded verbatim. */
export interface LinkComponentProps {
  to: LinkTo;
  children?: React.ReactNode;
  [extra: string]: unknown;
}

/** A component capable of rendering a link for a `to` location (e.g. React Router's `Link`). */
export type LinkComponent = React.ComponentType<LinkComponentProps>;

const LinkComponentContext = createContext<LinkComponent | null>(null);

/** Props for {@link LinkComponentProvider}. */
export interface LinkComponentProviderProps {
  /** The link component to use, e.g. `Link` from `react-router-dom`. */
  value: LinkComponent | null;
  children?: React.ReactNode;
}

/**
 * Supplies the link component used by every descendant Link and Breadcrumb.
 * Without it those components render plain anchors.
 *
 * @param props - The provider props.
 * @param props.value - The link component to use, e.g. React Router's `Link`.
 * @param props.children - The subtree that should use `value`.
 * @returns {React.ReactElement} The provider element.
 */
export const LinkComponentProvider: React.FC<LinkComponentProviderProps> = ({
  value,
  children,
}) => <LinkComponentContext.Provider value={value}>{children}</LinkComponentContext.Provider>;

/**
 * Resolves the link component to render with, preferring an explicit override
 * over the surrounding provider. Returns null when neither is present, meaning
 * the caller should fall back to a plain anchor.
 *
 * @param {LinkComponent | null} [override] - An explicit `linkComponent` prop, if given.
 * @returns {LinkComponent | null} The component to render, or null for a plain anchor.
 */
export const useLinkComponent = (override?: LinkComponent | null): LinkComponent | null => {
  const fromContext = useContext(LinkComponentContext);
  return override ?? fromContext;
};

/**
 * Converts a `to` location into an `href` for the plain-anchor fallback.
 * Location objects are flattened to `pathname + search + hash`.
 *
 * @param {LinkTo} to - The target location.
 * @returns {string} A URL usable as an anchor `href`.
 */
export const toHref = (to: LinkTo): string => {
  if (typeof to === 'string') {
    return to;
  }

  if (to && typeof to === 'object') {
    const { pathname = '', search = '', hash = '' } = to;
    return `${pathname}${search}${hash}` || '#';
  }

  return '#';
};
