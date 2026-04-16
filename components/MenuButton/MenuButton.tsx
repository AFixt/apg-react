/**
 * MenuButton — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
 *
 * Keyboard model on the button:
 *   - Enter / Space / ArrowDown: open menu, focus first item.
 *   - ArrowUp: open menu, focus last item.
 *
 * Keyboard model within the menu:
 *   - ArrowDown / ArrowUp: cycle items.
 *   - Home / End: first / last.
 *   - Enter: activate focused item, close menu, return focus to button.
 *   - Escape: close menu, return focus to button.
 *   - Tab: close menu and let focus proceed.
 */
import React, { useEffect, useRef, useState } from "react";
import "./MenuButton.css";

interface MenuItem {
    id: string;
    label: React.ReactNode;
    onSelect?: () => void;
}

interface MenuButtonProps {
    label: React.ReactNode;
    items: MenuItem[];
    idPrefix?: string;
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, items, idPrefix }) => {
    const [open, setOpen] = useState(false);
    const [focusIndex, setFocusIndex] = useState(0);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const menuId = `${idPrefix || "menu"}-list`;

    const openMenu = (index: number) => {
        setOpen(true);
        setFocusIndex(index);
    };

    const closeMenu = (returnFocus = true) => {
        setOpen(false);
        if (returnFocus) buttonRef.current?.focus();
    };

    useEffect(() => {
        if (open) {
            itemRefs.current[focusIndex]?.focus();
        }
    }, [open, focusIndex]);

    const handleButtonKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        switch (e.key) {
            case "Enter":
            case " ":
            case "ArrowDown":
                e.preventDefault();
                openMenu(0);
                break;
            case "ArrowUp":
                e.preventDefault();
                openMenu(items.length - 1);
                break;
            default:
                break;
        }
    };

    const activate = (i: number) => {
        items[i].onSelect?.();
        closeMenu(true);
    };

    const handleMenuKey = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
        const last = items.length - 1;
        let handled = true;
        switch (e.key) {
            case "ArrowDown":
                setFocusIndex(i === last ? 0 : i + 1);
                break;
            case "ArrowUp":
                setFocusIndex(i === 0 ? last : i - 1);
                break;
            case "Home":
                setFocusIndex(0);
                break;
            case "End":
                setFocusIndex(last);
                break;
            case "Enter":
                activate(i);
                break;
            case "Escape":
                closeMenu(true);
                break;
            case "Tab":
                setOpen(false);
                handled = false;
                break;
            default:
                handled = false;
        }
        if (handled) e.preventDefault();
    };

    useEffect(() => {
        if (!open) return;
        const onDocClick = (e: MouseEvent) => {
            if (
                !buttonRef.current?.contains(e.target as Node) &&
                !itemRefs.current.some((el) => el?.contains(e.target as Node))
            ) {
                closeMenu(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [open]);

    return (
        <div className="menu-button-container">
            <button
                ref={buttonRef}
                type="button"
                className="menu-button"
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={menuId}
                onClick={() => (open ? closeMenu(false) : openMenu(0))}
                onKeyDown={handleButtonKey}
            >
                {label}
                <span aria-hidden="true" className="menu-button-caret">▾</span>
            </button>
            {open && (
                <ul
                    id={menuId}
                    role="menu"
                    className="menu"
                    aria-label={typeof label === "string" ? label : undefined}
                >
                    {items.map((item, i) => (
                        <li key={item.id} role="none">
                            <button
                                ref={(el) => (itemRefs.current[i] = el)}
                                role="menuitem"
                                type="button"
                                className="menuitem"
                                tabIndex={i === focusIndex ? 0 : -1}
                                onClick={() => activate(i)}
                                onKeyDown={(e) => handleMenuKey(e, i)}
                            >
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MenuButton;
