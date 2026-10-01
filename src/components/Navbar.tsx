import { useEffect, useId, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import styles from './Navbar.module.css'

function ChevronDown() {
    return (
        <svg viewBox="0 0 10 6" fill="none" aria-hidden="true" focusable="false">
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

type DropdownItem = { to: string; label: string }

type DropdownProps = {
    label: string
    items: DropdownItem[]
    open: boolean
    onToggle: () => void
    onClose: () => void
}

function Dropdown({ label, items, open, onToggle, onClose }: DropdownProps) {
    const menuId = useId()
    const triggerRef = useRef<HTMLButtonElement>(null)

    return (
        <div
            className={styles.dropdown}
            onKeyDown={e => {
                if (e.key === 'Escape' && open) {
                    e.stopPropagation()
                    onClose()
                    triggerRef.current?.focus() // return focus to the trigger
                }
            }}
        >
            <button
                ref={triggerRef}
                type="button"
                className={styles.dropdownTrigger}
                aria-expanded={open}
                aria-controls={menuId}
                onClick={onToggle}
            >
                {label} <ChevronDown />
            </button>

            {open && (
                <ul id={menuId} className={styles.dropdownMenu}>
                    {items.map(item => (
                        <li key={item.to}>
                            <Link to={item.to} className={styles.dropdownItem} onClick={onClose}>
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default function Navbar() {
    // Only one dropdown can be open at a time
    const [openMenu, setOpenMenu] = useState<string | null>(null)
    const navRef = useRef<HTMLElement>(null)

    const close = () => setOpenMenu(null)
    const toggle = (id: string) => setOpenMenu(current => (current === id ? null : id))

    // Close when clicking/tapping or tabbing to anything outside the navbar
    useEffect(() => {
        if (!openMenu) return

        const handleOutside = (e: Event) => {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setOpenMenu(null)
            }
        }

        document.addEventListener('pointerdown', handleOutside)
        document.addEventListener('focusin', handleOutside)
        return () => {
            document.removeEventListener('pointerdown', handleOutside)
            document.removeEventListener('focusin', handleOutside)
        }
    }, [openMenu])

    return (
        <nav className={styles.nav} ref={navRef} aria-label="Main">
            <Link to="/" className={styles.link} onClick={close}>Home</Link>

            <Dropdown
                label="PNMs"
                items={[
                    { to: '/pnms', label: 'PNM Overview' },
                    { to: '/pnms/create', label: 'Create PNM' },
                ]}
                open={openMenu === 'pnms'}
                onToggle={() => toggle('pnms')}
                onClose={close}
            />

            <Dropdown
                label="Events"
                items={[
                    { to: '/events', label: 'Event Overview' },
                    { to: '/events/create', label: 'Create Event' },
                ]}
                open={openMenu === 'events'}
                onToggle={() => toggle('events')}
                onClose={close}
            />
        </nav>
    )
}