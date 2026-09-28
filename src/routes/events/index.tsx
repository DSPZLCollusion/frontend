import EventBlock from '#/components/EventBlock'
import { fetchEvents } from '#/util/event'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/events/')({ component: Events })

function Events() {
    const { data, isPending, isError } = useQuery({
        queryKey: ['events'],
        queryFn: ({ signal }) => fetchEvents({ signal }),
    })

    if (isPending) return <p style={{ padding: '2rem', color: 'var(--muted)' }}>Loading…</p>
    if (isError) return <p style={{ padding: '2rem', color: 'var(--muted)' }}>Failed to load events. Please try again.</p>

    return (
        <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            <header style={{ marginBottom: '1.5rem' }}>
                <h1 style={{
                    fontFamily: "'Fraunces', Georgia, serif",
                    fontSize: '1.75rem',
                    fontWeight: 600,
                    color: 'var(--ink)',
                    margin: 0,
                }}>
                    Events
                </h1>
            </header>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {data.map((event) => (
                    <li key={event.id}>
                        <EventBlock event_name={event.event_name} event_date={event.event_date} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
