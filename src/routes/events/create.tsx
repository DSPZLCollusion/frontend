import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { type FormEvent } from 'react'

import { createEvent, queryClient } from '#/util/event'
import styles from '#/components/form/Form.module.css'

export const Route = createFileRoute('/events/create')({ component: EventCreate })

function EventCreate() {
    const navigate = useNavigate()

    const { mutate, isPending, isError } = useMutation({
        mutationFn: createEvent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['events'] })
            navigate({ to: '/events' })
        },
    })

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        const event_name = (fd.get('event_name') as string).trim()
        const event_date = new Date(fd.get('event_date') as string)
        mutate({ event_name, event_date })
    }

    function handleCancel() {
        navigate({ to: '/events' })
    }

    return (
        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '3rem 1.5rem' }}>
            <form className={styles.pnmForm} onSubmit={handleSubmit} noValidate>

                <header className={styles.pnmFormHeader}>
                    <p className={styles.pnmFormKicker}>Events</p>
                    <h1 className={styles.pnmFormTitle}>Create Event</h1>
                    <p className={styles.pnmFormSubtitle}>
                        Add a new recruitment event to the schedule.
                    </p>
                </header>

                <section className={styles.pnmSection}>
                    <div className={styles.field}>
                        <label className={styles.fieldLabel} htmlFor="event_name">
                            Event name <span className={styles.fieldRequired}>*</span>
                        </label>
                        <input
                            className={styles.fieldInput}
                            id="event_name"
                            name="event_name"
                            type="text"
                            placeholder="e.g. Fall Rush Kickoff"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.fieldLabel} htmlFor="event_date">
                            Event date <span className={styles.fieldRequired}>*</span>
                        </label>
                        <input
                            className={styles.fieldInput}
                            id="event_date"
                            name="event_date"
                            type="date"
                            required
                        />
                    </div>
                </section>

                {isError && (
                    <div className={styles.pnmFormFooter}>
                        <p className={styles.pnmFormErrorText}>
                            Failed to create event. Please try again.
                        </p>
                    </div>
                )}

                <div className={styles.pnmFormFooter}>
                    <div className={styles.pnmFormActions}>
                        <button type="button" onClick={handleCancel}>
                            Cancel
                        </button>
                        <button
                            className={styles.pnmSubmit}
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? 'Creating…' : 'Create event'}
                        </button>
                    </div>
                </div>

            </form>
        </div>
    )
}
