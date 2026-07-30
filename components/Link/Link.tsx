/**
 * A custom accessible link component.
 * It ensures that the link is keyboard accessible and supports additional
 * functionality like opening a context menu on 'Shift + F10' key press.
 *
 * Activation is modality-independent: `onClick` is attached to the rendered
 * element, so pointer activation and Enter (which native anchors translate
 * into a click) both invoke it exactly once. The component deliberately does
 * not call `onClick` from its keydown handler — doing so would fire the
 * callback twice in a real browser, once from the keydown branch and again
 * from the anchor's synthesised click.
 *
 * Rendering is router-agnostic: by default a plain `<a href>` is emitted, so
 * the library carries no router dependency. Supply React Router's `Link` (or
 * any equivalent) via the `linkComponent` prop or a surrounding
 * `LinkComponentProvider` to get client-side navigation.
 *
 * @component
 * @param {object} props - The component props.
 * @param {string|{pathname?: string, search?: string, hash?: string}} props.to - The target URL or location object to navigate to.
 * @param {ReactNode} props.children - The content of the link.
 * @param {function} [props.onClick] - The function to be executed when the link is activated, by pointer or by Enter.
 * @param {React.ComponentType} [props.linkComponent] - Link component to render with; defaults to the provider value, then to a plain anchor.
 * @returns {ReactElement} The rendered AccessibleLink component.
 */
import React from 'react';
import type { LinkComponent, LinkTo } from '../internal/link-component';
import { toHref, useLinkComponent } from '../internal/link-component';
import './Link.css';

/** Props for the Link component. */
interface LinkProps {
  to: LinkTo;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  linkComponent?: LinkComponent | null;
  [extra: string]: unknown;
}

const AccessibleLink: React.FC<LinkProps> = ({
  to,
  children,
  onClick,
  linkComponent,
  ...props
}) => {
  const RouterLink = useLinkComponent(linkComponent);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const { key, shiftKey } = event;

    // Enter is intentionally not handled here: the anchor activates natively
    // and the resulting click event invokes onClick.
    if (key === 'F10' && shiftKey) {
      event.preventDefault();
    }
  };

  if (RouterLink) {
    return (
      <RouterLink to={to} {...props} onClick={onClick} onKeyDown={handleKeyDown}>
        {children}
      </RouterLink>
    );
  }

  return (
    <a href={toHref(to)} {...props} onClick={onClick} onKeyDown={handleKeyDown}>
      {children}
    </a>
  );
};

/** Accessible implementation of the WAI-ARIA APG AccessibleLink pattern. See the top-of-file comment for keyboard and ARIA details. */
export default AccessibleLink;
