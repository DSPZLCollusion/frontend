import { Link } from '@tanstack/react-router'
import styles from './Navbar.module.css'

export default function Navbar() {
    return (
        <nav className={styles.nav}>
            <Link to="/" className={styles.link}>Home</Link>
            <Link to="/pnms" className={styles.link}>PNMs</Link>
            <Link to="/pnms/create" className={styles.link}>Create PNM</Link>
            <Link to="/events" className={styles.link}>Events</Link>
            <Link to="/events/create" className={styles.link}>Create Event</Link>
        </nav>
    )
}