import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import styles from './MobileNavbar.module.css'

function HamburgerIcon({ open }: { open: boolean }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.hamburgerIcon}>
            {open ? (
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
                <>
                    <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </>
            )}
        </svg>
    )
}

function ChevronDown() {
    return (
        <svg viewBox="0 0 10 6" fill="none" aria-hidden="true" className={styles.chevron}>
            <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default function MobileNavbar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [pnmsOpen, setPnmsOpen] = useState(false)
    const [eventsOpen, setEventsOpen] = useState(false)

    const close = () => setMenuOpen(false)

    return (
        <nav className={styles.nav}>
            <span className={styles.brand}>Home</span>
            <button
                className={styles.hamburger}
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
            >
                <HamburgerIcon open={menuOpen} />
            </button>

            {menuOpen && (
                <div className={styles.panel}>
                    <Link to="/" className={styles.item} onClick={close}>Home</Link>

                    {/* PNMs section */}
                    <button
                        className={`${styles.item} ${styles.sectionToggle}`}
                        onClick={() => setPnmsOpen(o => !o)}
                        aria-expanded={pnmsOpen}
                    >
                        PNMs
                        <span className={pnmsOpen ? styles.chevronOpen : ''}>
                            <ChevronDown />
                        </span>
                    </button>
                    {pnmsOpen && (
                        <div className={styles.subItems}>
                            <Link to="/pnms" className={styles.subItem} onClick={close}>Overview</Link>
                            <Link to="/pnms/create" className={styles.subItem} onClick={close}>Create</Link>
                        </div>
                    )}

                    {/* Events section */}
                    <button
                        className={`${styles.item} ${styles.sectionToggle}`}
                        onClick={() => setEventsOpen(o => !o)}
                        aria-expanded={eventsOpen}
                    >
                        Events
                        <span className={eventsOpen ? styles.chevronOpen : ''}>
                            <ChevronDown />
                        </span>
                    </button>
                    {eventsOpen && (
                        <div className={styles.subItems}>
                            <Link to="/events" className={styles.subItem} onClick={close}>Overview</Link>
                            <Link to="/events/create" className={styles.subItem} onClick={close}>Create</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}
