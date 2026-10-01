import type { ReactNode } from "react";
import type { ClassYear, CreatePnmBody, Dorm, PnmBodyDetails, StatusType } from "#/util/pnmModel";

export const dormTypes: Dorm[] = [
    "SPEED",
    "BSB",
    "BLUMBERG",
    "MEES",
    "DEMING",
    "SCHARPENBERG",
    "LAKESIDE",
    "PERCOPO",
    "APARTMENTS WEST",
    "APARTMENTS EAST",
    "TBA",
];

export const classTypes: ClassYear[] = [
    "FRESHMAN",
    "SOPHOMORE",
    "JUNIOR",
    "SENIOR",
    "SUPER_SENIOR",
];

export const statusTypes: { value: StatusType; label: string }[] = [
    { value: "SIGMA", label: "Sigma" },
    { value: "DELTA", label: "Delta" },
    { value: "PHI", label: "Phi" },
];

export const usStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

export function formatClassYear(year: ClassYear): string {
    return year
        .toLowerCase()
        .split("_")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
}

export function cx(...classes: Array<string | false | undefined>): string {
    return classes.filter(Boolean).join(" ");
}

export function field(formData: FormData, name: string): string {
    return ((formData.get(name) as string) ?? "").trim();
}

export type FormErrors = Partial<Record<
    | "firstName"
    | "lastName"
    | "classYear"
    | "statusType"
    | "email"
    | "phoneNumber"
    | "dorm"
    | "roomNumber"
    | "streetAddress"
    | "city"
    | "state"
    | "zipCode",
    string
>>;

export type FormProps = {
    inputData?: PnmBodyDetails | null;
    onSubmit: (body: CreatePnmBody) => void;
    isPending?: boolean;
    error?: unknown;
    children?: ReactNode;
};
