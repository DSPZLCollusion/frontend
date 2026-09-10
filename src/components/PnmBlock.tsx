import styles from './PnmBlock.module.css';
import DEFAULT_IMG from '../assets/Default_PNM_Image.jpg';
import { Link } from '@tanstack/react-router';

type PnmBlockProps = {
    id: string;
    first_name: string;
    last_name: string;
    class_year: string;
    status_type?: string | null;
    email: string;
    phone_number: string;
    photo_url: string;
};

export default function PnmBlock({
    id,
    first_name,
    last_name,
    class_year,
    status_type = 'SIGMA',
    email,
    phone_number,
    photo_url,
}: PnmBlockProps) {
    return (
        <Link to="/pnms/$pnmId" params={{ pnmId: id }}>
            <article className={styles.card}>
                <div className={styles.content}>
                    <img
                        src={photo_url ? photo_url : DEFAULT_IMG}
                        alt={`${first_name} ${last_name}`}
                        className={styles.photo}
                    />
                    <h2 className={styles.name}>
                        {first_name} {last_name}
                    </h2>
                    <h3 className={styles.meta}>
                        {class_year} · {status_type}
                    </h3>
                    <p className={styles.contact}>{email}</p>
                    <p className={styles.contact}>{phone_number}</p>
                </div>
            </article>
        </Link>
    );
}