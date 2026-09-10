export type CreatePnmBody = {
    info: CreatePnm;
    on_campus: OnCampusHousing | null;
    off_campus: OffCampusHousing | null;
    interests: string[];
};

export type OnCampusHousing = {
    dorm: Dorm;
    room_number: string;
};

export type OffCampusHousing = {
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
};

export type PnmDetails = {
    id: number;
    first_name: string;
    last_name: string;
    class_year: ClassYear;
    status_type?: StatusType;
    email: string;
    phone_number: string;
    photo_url?: string;
    dorm?: Dorm;
    room_number?: string;
    street_address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    interests: string[];
};

export type Pnm = {
    id: number;
    first_name: string;
    last_name: string;
    class_year: ClassYear;
    status_type?: StatusType;
    email: string;
    phone_number: string;
    photo_url?: string;
};

export type CreatePnm = Omit<Pnm, 'id'>;

export type ClassYear = 'FRESHMAN' | 'SOPHOMORE' | 'JUNIOR' | 'SENIOR' | 'SUPER_SENIOR';
export type StatusType = 'DELTA' | 'SIGMA' | 'PHI';
export type Dorm = 'SPEED' | 'BSB' | 'BLUMBERG' | 'MEES' | 'DEMING' |
    'SCHARPENBERG' | 'LAKESIDE' | 'PERCOPO' |
    'APARTMENTS WEST' | 'APARTMENTS EAST' | 'TBA';