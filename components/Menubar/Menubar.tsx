/**
 * Menubar — APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/
 *
 * Structure:
 *   <div role="menubar">
 *     <button role="menuitem" aria-haspopup="menu" aria-expanded>...</button>
 *     <ul role="menu">
 *       <li role="none"><button role="menuitem">...</button></li>
 *     </ul>
 *   </div>
 *
 * Keyboard on menubar items:
 *   - ArrowLeft/ArrowRight: cycle menubar items.
 *   - ArrowDown / Enter / Space: open submenu, focus first item.
 *   - ArrowUp: open submenu, focus last item.
 *   - Home / End: first / last menubar item.
 *
 * Keyboard in open submenu:
 *   - ArrowDown / ArrowUp: cycle items.
 *   - Home / End: first / last.
 *   - ArrowLeft: close submenu, move focus to previous menubar item (and open its menu).
 *   - ArrowRight: close submenu, move focus to next menubar item (and open its menu).
 *   - Enter / Space: activate item, close all.
 *   - Escape: close submenu, return focus to parent menubar item.
 */
import React, { useEffect, useRef, useState } from "react";
import "./Menubar.css";

interface MenuItem {
    id: string;
    label: React.ReactNode;
    onSelect?: () => void;
}

interface MenubarMenu {
    id: string;
    label: React.ReactNode;
    items: MenuItem[];
}

interface MenubarProps {
    label: string;
    menus: MenubarMenu[];
}

const Menubar: React.FC<MenubarProps> = ({ label, menus }) => {
    const [activeMenu, setActiveMenu] = useState(0);
    const [openMenu, setOpenMenu] = useState<number | null>(null);
    const [focusItem, setFocusItem] = useState(0);
    const barRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

    useEffect(() => {
        if (openMenu === null) {
            barRefs.current[activeMenu]?.focus();
        } else {
            itemRefs.current[`${openMenu}:${focusItem}`]?.focus();
        }
    }, [openMenu, activeMenu, focusItem]);

    const openAt = (mIdx: number, iIdx: number) => {
        setActiveMenu(mIdx);
        setOpenMenu(mIdx);
        setFocusItem(iIdx);
    };

    const closeMenu = (returnToBar = true) => {
        setOpenMenu(null);
        if (returnToBar) barRefs.current[activeMenu]?.focus();
    };

    const activate = (mIdx: number, iIdx: number) => {
        menus[mIdx].items[iIdx].onSelect?.();
        closeMenu(true);
    };

    const moveMenubar = (delta: number) => {
        const n = menus.length;
        const next = (activeMenu + delta + n) % n;
        const wasOpen = openMenu !== null;
        setActiveMenu(next);
        if (wasOpen) openAt(next, 0);
        else setOpenMenu(null);
    };

    const handleBarKey = (e: React.KeyboardEvent, mIdx: number) => {
        let handled = true;
        switch (e.key) {
            case "ArrowLeft":
                moveMenubar(-1);
                break;
            case "ArrowRight":
                moveMenubar(1);
                break;
            case "ArrowDown":
            case "Enter":
            case " ":
                openAt(mIdx, 0);
                break;
            case "ArrowUp":
                openAt(mIdx, menus[mIdx].items.length - 1);
                break;
            case "Home":
                setActiveMenu(0);
                break;
            case "End":
                setActiveMenu(menus.length - 1);
                break;
            default:
                handled = false;
        }
        if (handled) e.preventDefault();
    };

    const handleMenuKey = (e: React.KeyboardEvent, mIdx: number, iIdx: number) => {
        const last = menus[mIdx].items.length - 1;
        let handled = true;
        switch (e.key) {
            case "ArrowDown":
                setFocusItem(iIdx === last ? 0 : iIdx + 1);
                break;
            case "ArrowUp":
                setFocusItem(iIdx === 0 ? last : iIdx - 1);
                break;
            case "Home":
                setFocusItem(0);
                break;
            case "End":
                setFocusItem(last);
                break;
            case "Enter":
            case " ":
                activate(mIdx, iIdx);
                break;
            case "Escape":
                closeMenu(true);
                break;
            case "ArrowLeft": {
                const next = (mIdx - 1 + menus.length) % menus.length;
                openAt(next, 0);
                break;
            }
            case "ArrowRight": {
                const next = (mIdx + 1) % menus.length;
                openAt(next, 0);
                break;
            }
            case "Tab":
                setOpenMenu(null);
                handled = false;
                break;
            default:
                handled = false;
        }
        if (handled) e.preventDefault();
    };

    useEffect(() => {
        if (openMenu === null) return;
        const onDocClick = (e: MouseEvent) => {
            const onBar = barRefs.current.some((el) => el?.contains(e.target as Node));
            const onMenu = Object.values(itemRefs.current).some((el) =>
                el?.contains(e.target as Node)
            );
            if (!onBar && !onMenu) closeMenu(false);
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [openMenu]);

    return (
        <div
            role="menubar"
            aria-label={label}
            aria-orientation="horizontal"
            className="menubar"
        >
            {menus.map((menu, mIdx) => {
                const isOpen = openMenu === mIdx;
                return (
                    <div key={menu.id} className="menubar-group">
                        <button
                            ref={(el) => (barRefs.current[mIdx] = el)}
                            id={`menubar-item-${menu.id}`}
                            type="button"
                            role="menuitem"
                            aria-haspopup="menu"
                            aria-expanded={isOpen}
                            tabIndex={mIdx === activeMenu ? 0 : -1}
                            className={`menubar-item${isOpen ? " is-open" : ""}`}
                            onClick={() => (isOpen ? closeMenu(false) : openAt(mIdx, 0))}
                            onKeyDown={(e) => handleBarKey(e, mIdx)}
                            onFocus={() => setActiveMenu(mIdx)}
                        >
                            {menu.label}
                        </button>
                        {isOpen && (
                            <ul role="menu" aria-labelledby={`menubar-item-${menu.id}`} className="menubar-menu">
                                {menu.items.map((item, iIdx) => (
                                    <li key={item.id} role="none">
                                        <button
                                            ref={(el) =>
                                                (itemRefs.current[`${mIdx}:${iIdx}`] = el)
                                            }
                                            type="button"
                                            role="menuitem"
                                            tabIndex={iIdx === focusItem ? 0 : -1}
                                            className="menubar-menuitem"
                                            onClick={() => activate(mIdx, iIdx)}
                                            onKeyDown={(e) => handleMenuKey(e, mIdx, iIdx)}
                                            onFocus={() => setFocusItem(iIdx)}
                                        >
                                            {item.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Menubar;
