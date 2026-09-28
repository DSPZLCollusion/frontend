import { QueryClient } from '@tanstack/react-query';
import type { CreatePnmBody, PnmBodyDetails } from './pnmModel';
import { authFetch } from './auth';

export const queryClient = new QueryClient();

const backend_url = import.meta.env.VITE_BACKEND_URL as string;

export type Pnm = {
    id: string;
    first_name: string;
    last_name: string;
    class_year: string;
    status_type?: string | null;
    email: string;
    phone_number: string;
    photo_url: string;
    last_contacted?: string | null;
    // pnm_details view extras (present on search results)
    dorm?: string | null;
    room_number?: string | null;
    interests?: string[];
};

export type SearchFilters = {
    first_name?: string;
    last_name?: string;
    email?: string;
    class_year?: string[];
    status_type?: string[];
    dorm?: string[];
    last_contacted?: string[];
    interests?: string;
};

function buildSearchParams(filters: SearchFilters): URLSearchParams {
    const params = new URLSearchParams();
    if (filters.first_name) params.set('first_name', filters.first_name);
    if (filters.last_name) params.set('last_name', filters.last_name);
    if (filters.email) params.set('email', filters.email);
    if (filters.class_year?.length) params.set('class_year', filters.class_year.join(','));
    if (filters.status_type?.length) params.set('status_type', filters.status_type.join(','));
    if (filters.dorm?.length) params.set('dorm', filters.dorm.join(','));
    if (filters.last_contacted?.length) params.set('last_contacted', filters.last_contacted.join(','));
    if (filters.interests) params.set('interests', filters.interests);
    return params;
}

export type PnmPage = {
    data: Pnm[];
    nextCursor: string | null;
}

export async function fetchPnms({ signal, cursor }: { signal: AbortSignal, cursor?: string | null }): Promise<PnmPage> {
    const params = new URLSearchParams();
    if (cursor) params.set('cursor', cursor);

    const url = `${backend_url}/pnm?${params}`;

    const response = await authFetch(url, { signal });

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the pnms') as Error & { code: number; info: unknown };
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const json = await response.json();
    return { data: json.data, nextCursor: json.nextCursor ?? null };
}

export async function fetchPnm({ id, signal }: { id: string, signal: AbortSignal }): Promise<PnmBodyDetails> {
    const url = `${backend_url}/pnm/${id}`;

    const response = await authFetch(url, { signal });

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the pnms') as Error & { code: number; info: unknown };
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const json = await response.json();
    const pnm = json as PnmBodyDetails;

    return pnm;
}

export async function createNewPnm(pnmDetails: CreatePnmBody) {
    const response = await authFetch(`${backend_url}/pnm`, {
        method: 'POST',
        body: JSON.stringify(pnmDetails),
        headers: {
            'Content-Type': 'application/json',
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

export async function updatePnm({ id, pnmDetails }: { id: string, pnmDetails: CreatePnmBody }) {
    const response = await authFetch(`${backend_url}/pnm/${id}`, {
        method: 'PUT',
        body: JSON.stringify(pnmDetails),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = new Error('An error occurred while updating the event') as Error & { code: number; info: unknown };;
        error.code = response.status;
        error.info = await response.json().catch(() => response.statusText);
        throw error;
    }

    console.log(pnmDetails);

    return response.json();
}

export async function deletePnm({ id }: { id: string }) {
    const response = await authFetch(`${backend_url}/pnm/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = new Error('An error occurred while updating the event') as Error & { code: number; info: unknown };
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    return response.json();
}

export async function searchPnmsAnd(filters: SearchFilters, signal?: AbortSignal): Promise<Pnm[]> {
    const params = buildSearchParams(filters);
    const response = await authFetch(`${backend_url}/pnm/searchAnd?${params}`, { signal });

    if (!response.ok) {
        const error = new Error('An error occurred while searching pnms') as Error & { code: number; info: unknown };
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    return response.json() as Promise<Pnm[]>;
}

export async function searchPnmsOr(filters: SearchFilters, signal?: AbortSignal): Promise<Pnm[]> {
    const params = buildSearchParams(filters);
    const response = await authFetch(`${backend_url}/pnm/searchOr?${params}`, { signal });

    if (!response.ok) {
        const error = new Error('An error occurred while searching pnms') as Error & { code: number; info: unknown };
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    return response.json() as Promise<Pnm[]>;
}

export async function updatePnmContacted({ id }: { id: string }) {
    const response = await authFetch(`${backend_url}/pnm/${id}/last_contact`, {
        method: 'PATCH',
    });
    if (!response.ok) {
        const error = new Error('An error occurred while updating the event') as Error & { code: number; info: unknown };;
        error.code = response.status;
        error.info = await response.json().catch(() => response.statusText);
        throw error;
    }

    return response.json();
}

// export async function fetchEvents({ signal }: { signal: AbortSignal }): Promise<PnmEvent[]> {
//     const url = `${backend_url}/events`;

//     const response = await authFetch(url, { signal });

//     if (!response.ok) {
//         const error = new Error('An error occurred while fetching the events') as Error & { code: number; info: unknown };
//         error.code = response.status;
//         error.info = await response.json();
//         throw error;
//     }

//     const json = await response.json();
//     return json as PnmEvent[];
// }