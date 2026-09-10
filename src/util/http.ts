import { QueryClient } from '@tanstack/react-query';
import type { CreatePnmBody } from './pnmModel';

export const queryClient = new QueryClient();

const backend_url = import.meta.env.VITE_LOCAL_BACKEND as string;

export type Pnm = {
    id: string;
    first_name: string;
    last_name: string;
    class_year: string;
    status_type?: string | null;
    email: string;
    phone_number: string;
    photo_url: string;
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
    if (filters.interests) params.set('interests', filters.interests);
    return params;
}

console.log("This is the backend url " + backend_url);

export async function fetchPnms({ signal }: { signal: AbortSignal }): Promise<Pnm[]> {
    const url = `${backend_url}/pnm`;

    const response = await fetch(url, { signal: signal });

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the pnms') as Error & { code: number; info: unknown };
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const json = await response.json();
    console.log('raw response:', json);
    const pnms = json as Pnm[];

    return pnms;
}

export async function fetchPnm({ id, signal }: { id: string, signal: AbortSignal }): Promise<CreatePnmBody> {
    const url = `${backend_url}/pnm/${id}`;

    const response = await fetch(url, { signal: signal });

    if (!response.ok) {
        const error = new Error('An error occurred while fetching the pnms') as Error & { code: number; info: unknown };
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    const json = await response.json();
    console.log('raw response:', json);
    const pnm = json as CreatePnmBody;

    return pnm;
}

export async function createNewPnm(pnmDetails: CreatePnmBody) {
    const response = await fetch(`${backend_url}/pnm`, {
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
    const response = await fetch(`${backend_url}/pnm/${id}`, {
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

    return response.json();
}

export async function deletePnm({ id }: { id: string }) {
    const response = await fetch(`${backend_url}/pnm/${id}`, {
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
    const response = await fetch(`${backend_url}/pnm/searchAnd?${params}`, { signal });

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
    const response = await fetch(`${backend_url}/pnm/searchOr?${params}`, { signal });

    if (!response.ok) {
        const error = new Error('An error occurred while searching pnms') as Error & { code: number; info: unknown };
        error.code = response.status;
        error.info = await response.json();
        throw error;
    }

    return response.json() as Promise<Pnm[]>;
}