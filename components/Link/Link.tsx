/**
 * A custom accessible link component.
 *
 * The component adds no keyboard handling of its own, because a link needs
 * none: the rendered element is a real anchor, so focus, Enter activation, and
 * the Shift+F10 context menu all come from the platform. Anything this
 * component intercepted would only take behaviour away from keyboard users.
 *
 * Activation is modality-independent: `onClick` is attached to the rendered
 * element, so pointer activation and Enter (which native anchors translate
 * into a click) both invoke it exactly once. `onClick` is deliberately not
 * called from a keydown handler — doing so would fire the callback twice in a
 * real browser, once from the keydown branch and again from the anchor's
 * synthesised click.
 *
 * Rendering is router-agnostic: by default a plain `<a href>` is emitted, so
 * the library carries no router dependency. Supply React Router's `Link` (or
 * any equivalent) via the `linkComponent` prop or a surrounding
 * `LinkComponentProvider` to get client-side navigation, or pass
 * `linkComponent={null}` to force a plain anchor inside a provider.
 *
 * @component
 * @param {object} props - The component props.
 * @param {string|{pathname?: string, search?: string, hash?: string}} props.to - The target URL or location object to navigate to.
 * @param {ReactNode} props.children - The content of the link.
 * @param {function} [props.onClick] - The function to be executed when the link is activated, by pointer or by Enter.
 * @param {React.ComponentType|null} [props.linkComponent] - Link component to render with; omit to use the provider value, or pass null to force a plain anchor.
 * @param {string} [props.className] - Extra classes, appended to the component's own `link` class rather than replacing it.
 * @returns {ReactElement} The rendered AccessibleLink component.
 */
import React from 'react';
import type { LinkComponent, LinkTo } from '../_internal/link-component';
import { toHref, useLinkComponent } from '../_internal/link-component';
import './Link.css';

/** Props for the Link component. */
interface LinkProps {
  to: LinkTo;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  linkComponent?: LinkComponent | null;
  className?: string;
  [extra: string]: unknown;
}

const AccessibleLink: React.FC<LinkProps> = ({
  to,
  children,
  onClick,
  linkComponent,
  className,
  ...props
}) => {
  const RouterLink = useLinkComponent(linkComponent);

  // The stylesheet targets `.link`, so the class has to come from here: the
  // rendered element is a native anchor whose `link` role is implicit, and a
  // role selector never matches it. `className` is destructured out of `props`
  // and appended rather than spread over, so a consumer passing one adds to the
  // component's styles instead of silently stripping them.
  const classes = className ? `link ${className}` : 'link';

  // No keydown handler: Enter activation and the Shift+F10 context menu are
  // native anchor behaviour, and a consumer's own onKeyDown rides through
  // `props` untouched.
  if (RouterLink) {
    return (
      <RouterLink to={to} className={classes} {...props} onClick={onClick}>
        {children}
      </RouterLink>
    );
  }

  return (
    <a href={toHref(to)} className={classes} {...props} onClick={onClick}>
      {children}
    </a>
  );
};

/** Accessible implementation of the WAI-ARIA APG AccessibleLink pattern. See the top-of-file comment for keyboard and ARIA details. */
export default AccessibleLink;
