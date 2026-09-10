import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import styles from './$pnmId.module.css';
import DEFAULT_IMG from '../../assets/Default_PNM_Image.jpg';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deletePnm, fetchPnm, queryClient } from '#/util/http';
import { useState } from 'react';
import Modal from '#/UI/Modal';

export const Route = createFileRoute('/pnms/$pnmId/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { pnmId } = Route.useParams();

  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['pnm', pnmId],
    queryFn: ({ signal }) => fetchPnm({ id: pnmId, signal })
  })

  const navigate = useNavigate();

  const { mutate, isPending: isPendingDeletion, isError: isErrorDeleting, error: deleteError } = useMutation({
    mutationFn: deletePnm,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none'
      })
      navigate({ to: '/pnms' });
    }
  });

  function handleStartDelete() {
    setIsDeleting(true);
  }

  function handleStopDelete() {
    setIsDeleting(false);
  }

  function handleDelete() {
    mutate({ id: pnmId });
  }

  let content = <p>Something</p>;

  if (isPending) {
    content = <p>Loading...</p>;
  }

  if (isError) {
    content = <p className={styles.errorText}>{error?.message ?? 'Failed to load this PNM.'}</p>;
  }

  if (data) {
    const { photo_url, first_name, last_name, class_year, status_type, email, phone_number } = data.info;
    const off_campus = data.off_campus;
    const on_campus = data.on_campus;
    const interests = data.interests;
    content = (
      <>
        <aside className={styles.sidebar}>
          <div className={styles.photoWrap}>
            <img
              src={photo_url ? photo_url : DEFAULT_IMG}
              alt={`${first_name} ${last_name}`}
              className={styles.photo}
            />

          </div>

          <h1 className={styles.name}>
            {first_name} {last_name}
          </h1>

          <div className={styles.metaRow}>
            <span className={styles.classYear}>Class of {class_year}</span>
            {status_type && (
              <span className={styles.statusTag}>{status_type}</span>
            )}
          </div>

          <div className={styles.contactList}>
            <a className={styles.contactLink} href={`mailto:${email}`}>
              {email}
            </a>
            <a className={styles.contactLink} href={`tel:${phone_number}`}>
              {phone_number}
            </a>
          </div>
        </aside>

        <main className={styles.main}>
          {(off_campus || on_campus) && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Where they live</h2>
              {off_campus && (
                <p className={styles.sectionBody}>
                  {off_campus.street_address}, {off_campus.city}
                </p>
              )}
              {on_campus && (
                <p className={styles.sectionBody}>
                  {on_campus.dorm}, room {on_campus.room_number}
                </p>
              )}
            </section>
          )}

          {interests.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Interests</h2>
              <ul className={styles.interestList}>
                {interests.map((interest) => (
                  <li key={interest} className={styles.interestTag}>
                    {interest}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </>
    )
  }

  const fullName = data ? `${data.info.first_name} ${data.info.last_name}` : 'this PNM';

  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>Delete {fullName}?</h2>
          <p>This can't be undone. All of their info will be permanently removed.</p>
          <div className={styles.formActions}>
            {isPendingDeletion && <p>Deleting, hang on...</p>}
            {!isPendingDeletion && (
              <>
                <button className="button-text" onClick={handleStopDelete}>
                  Cancel
                </button>
                <button className="button button-danger" onClick={handleDelete}>
                  Delete
                </button>
              </>
            )}
          </div>
          {isErrorDeleting && (
            <p className={styles.errorText}>
              {deleteError?.message ?? 'Failed to delete. Please try again.'}
            </p>
          )}
        </Modal>
      )}
      <div className={styles.page}>
        {content}
      </div>
      <div className={styles.actions}>
        <button className="button-text" onClick={handleStartDelete}>
          Delete
        </button>
        <Link to="edit" className={styles.editLink}>Edit</Link>
      </div>
    </>
  )
}