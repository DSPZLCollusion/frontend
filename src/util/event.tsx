import { QueryClient } from "@tanstack/react-query";
import { authFetch } from "./auth";

export const queryClient = new QueryClient();

const backend_url = import.meta.env.VITE_BACKEND_URL as string;

export type CreateEventDetails = {
    event_name: string;
    event_date: Date;
}

export type EventDetails = {
    id: string;
    event_name: string;
    event_date: Date;
}

export type EventFormDetails = {
    id: string;
    event_status: string;
}

export type eventDetails = EventDetails;

export async function fetchEvents({ signal }: { signal: AbortSignal }) {
    const url = `${backend_url}/events`;

    const response = await authFetch(url, { signal });

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the pnms') as Error & { code: number; info: unknown };
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const json = await response.json();
    const events = json as eventDetails[];

    return events;
}

export async function createEvent(createEventDetails: CreateEventDetails) {
    const response = await authFetch(`${backend_url}/events`, {
        method: 'POST',
        body: JSON.stringify(createEventDetails),
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!response.ok) {
        const error = new Error('An error occurred while creating the pnm') as Error & { code: number; info: unknown };
        error.code = response.status;
        error.info = await response.json().catch(() => response.statusText);
        throw error;
    }

    const { event } = await response.json();

    return event;
}