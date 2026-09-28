import styles from './EventBlock.module.css';

export default function EventBlock({ event_name, event_date }: { event_name: string; event_date: string | Date }) {
    const formatted = new Date(event_date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <article className={styles.card}>
            <div className={styles.content}>
                <h2 className={styles.name}>{event_name}</h2>
                <p className={styles.date}>{formatted}</p>
            </div>
        </article>
    );
}
