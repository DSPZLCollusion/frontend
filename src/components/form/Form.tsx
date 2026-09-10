import { useState } from "react";
import type { FormEvent, KeyboardEvent, ReactNode } from 'react'
import Input from "./Input";
import type {
    ClassYear,
    CreatePnmBody,
    Dorm,
    OffCampusHousing,
    OnCampusHousing,
    PnmDetails,
    StatusType,
} from "#/util/pnmModel";
import styles from "./Form.module.css";

const dormTypes: Dorm[] = [
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

const classTypes: ClassYear[] = [
    "FRESHMAN",
    "SOPHOMORE",
    "JUNIOR",
    "SENIOR",
    "SUPER_SENIOR",
];

const statusTypes: { value: StatusType; label: string }[] = [
    { value: "SIGMA", label: "Sigma" },
    { value: "DELTA", label: "Delta" },
    { value: "PHI", label: "Phi" },
];

const usStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

function formatClassYear(year: ClassYear): string {
    return year
        .toLowerCase()
        .split("_")
        .map((word) => word[0].toUpperCase() + word.slice(1))
        .join(" ");
}

function cx(...classes: Array<string | false | undefined>): string {
    return classes.filter(Boolean).join(" ");
}

function field(formData: FormData, name: string): string {
    return ((formData.get(name) as string) ?? "").trim();
}

type FormErrors = Partial<Record<
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

type FormProps = {
    inputData?: CreatePnmBody | null;
    onSubmit: (body: CreatePnmBody) => void;
    isPending?: boolean;
    error?: unknown;
    children?: ReactNode;
};

export default function Form({ inputData, onSubmit, isPending = false, error, children }: FormProps) {
    const [isOnCampus, setIsOnCampus] = useState(() => !inputData?.off_campus?.street_address);

    // Interests are the one field that need live state — they're built up as
    // chips rather than a single input value, so `defaultValue` doesn't apply.
    const [interestInput, setInterestInput] = useState("");
    const [interests, setInterests] = useState<string[]>(inputData?.interests ?? []);

    const [errors, setErrors] = useState<FormErrors>({});

    function handleCampusSwitch(nextIsOnCampus: boolean) {
        if (nextIsOnCampus === isOnCampus) return;
        setIsOnCampus(nextIsOnCampus);
        setErrors((prev) => ({
            ...prev,
            dorm: undefined,
            roomNumber: undefined,
            streetAddress: undefined,
            city: undefined,
            state: undefined,
            zipCode: undefined,
        }));
    }

    function addInterest(raw: string) {
        const value = raw.trim();
        if (!value) return;
        setInterests((prev) => (prev.includes(value) ? prev : [...prev, value]));
        setInterestInput("");
    }

    function removeInterest(target: string) {
        setInterests((prev) => prev.filter((interest) => interest !== target));
    }

    function handleInterestKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            addInterest(interestInput);
        } else if (event.key === "Backspace" && interestInput === "" && interests.length > 0) {
            removeInterest(interests[interests.length - 1]);
        }
    }

    function validate(formData: FormData): FormErrors {
        const next: FormErrors = {};

        if (!field(formData, "first-name")) next.firstName = "First name is required.";
        if (!field(formData, "last-name")) next.lastName = "Last name is required.";
        if (!field(formData, "class-year")) next.classYear = "Select a class year.";
        if (!field(formData, "status-type")) next.statusType = "Select a chapter.";

        const email = field(formData, "email");
        if (!email) {
            next.email = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            next.email = "Enter a valid email address.";
        }

        if (!field(formData, "phone-number")) next.phoneNumber = "Phone number is required.";

        if (isOnCampus) {
            if (!field(formData, "dorm")) next.dorm = "Select a dorm.";
            if (!field(formData, "room-number")) next.roomNumber = "Room number is required.";
        } else {
            if (!field(formData, "street-address")) next.streetAddress = "Street address is required.";
            if (!field(formData, "city")) next.city = "City is required.";
            if (!field(formData, "state")) next.state = "State is required.";

            const zipCode = field(formData, "zip-code");
            if (!zipCode) {
                next.zipCode = "Zip code is required.";
            } else if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
                next.zipCode = "Enter a valid zip code.";
            }
        }

        return next;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const nextErrors = validate(formData);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        const onCampusHousing: OnCampusHousing | null = isOnCampus
            ? { dorm: field(formData, "dorm") as Dorm, room_number: field(formData, "room-number") }
            : null;

        const offCampusHousing: OffCampusHousing | null = !isOnCampus
            ? {
                street_address: field(formData, "street-address"),
                city: field(formData, "city"),
                state: field(formData, "state"),
                zip_code: field(formData, "zip-code"),
            }
            : null;

        const photoUrl = field(formData, "photo-url");

        const body: CreatePnmBody = {
            info: {
                first_name: field(formData, "first-name"),
                last_name: field(formData, "last-name"),
                class_year: field(formData, "class-year") as ClassYear,
                status_type: field(formData, "status-type") as StatusType,
                email: field(formData, "email"),
                phone_number: field(formData, "phone-number"),
                ...(photoUrl ? { photo_url: photoUrl } : {}),
            },
            on_campus: onCampusHousing,
            off_campus: offCampusHousing,
            interests,
        };

        onSubmit(body);
    }

    return (
        <form className={styles.pnmForm} onSubmit={handleSubmit} noValidate>
            <header className={styles.pnmFormHeader}>
                <p className={styles.pnmFormKicker}>Recruitment Intake</p>
                <h1 className={styles.pnmFormTitle}>New Member Record</h1>
                <p className={styles.pnmFormSubtitle}>
                    Enter the potential new member&rsquo;s details below to add them to the roster.
                </p>
            </header>

            <section className={styles.pnmSection}>
                <h2 className={styles.pnmSectionTitle}>About the PNM</h2>
                <div className={cx(styles.row, styles.row2)}>
                    <Input
                        label="First Name"
                        id="first-name"
                        type="text"
                        required
                        defaultValue={inputData?.info?.first_name ?? ''}
                        error={errors.firstName}
                    />
                    <Input
                        label="Last Name"
                        id="last-name"
                        type="text"
                        required
                        defaultValue={inputData?.info?.last_name ?? ''}
                        error={errors.lastName}
                    />
                </div>

                <div className={cx(styles.row, styles.row2)}>
                    <div className={cx(styles.field, errors.classYear && styles.fieldError)}>
                        <label htmlFor="class-year" className={styles.fieldLabel}>
                            Class Year<span className={styles.fieldRequired} aria-hidden="true"> *</span>
                        </label>
                        <select
                            id="class-year"
                            name="class-year"
                            className={styles.fieldInput}
                            defaultValue={inputData?.info?.class_year ?? ''}
                        >
                            <option value="">Select a class year</option>
                            {classTypes.map((year) => (
                                <option key={year} value={year}>
                                    {formatClassYear(year)}
                                </option>
                            ))}
                        </select>
                        {errors.classYear && (
                            <span className={styles.fieldErrorText} role="alert">{errors.classYear}</span>
                        )}
                    </div>

                    <div className={cx(styles.field, errors.statusType && styles.fieldError)}>
                        <label htmlFor="status-type" className={styles.fieldLabel}>
                            Chapter<span className={styles.fieldRequired} aria-hidden="true"> *</span>
                        </label>
                        <select
                            id="status-type"
                            name="status-type"
                            className={styles.fieldInput}
                            defaultValue={inputData?.info?.status_type ?? ''}
                        >
                            <option value="">Select a chapter</option>
                            {statusTypes.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        {errors.statusType && (
                            <span className={styles.fieldErrorText} role="alert">{errors.statusType}</span>
                        )}
                    </div>
                </div>

                <div className={cx(styles.row, styles.row2)}>
                    <Input
                        label="Email"
                        id="email"
                        type="email"
                        required
                        defaultValue={inputData?.info?.email ?? ''}
                        error={errors.email}
                    />
                    <Input
                        label="Phone Number"
                        id="phone-number"
                        type="tel"
                        required
                        placeholder="(555) 555-5555"
                        defaultValue={inputData?.info?.phone_number ?? ''}
                        error={errors.phoneNumber}
                    />
                </div>

                <Input
                    label="Photo URL"
                    id="photo-url"
                    type="url"
                    placeholder="Optional"
                    defaultValue={inputData?.info?.photo_url ?? ''}
                />
            </section>

            <section className={styles.pnmSection}>
                <h2 className={styles.pnmSectionTitle}>Housing</h2>

                <div className={styles.campusToggle} role="group" aria-label="Housing type">
                    <button
                        type="button"
                        className={cx(styles.campusToggleOption, isOnCampus && styles.campusToggleOptionActive)}
                        aria-pressed={isOnCampus}
                        onClick={() => handleCampusSwitch(true)}
                    >
                        On Campus
                    </button>
                    <button
                        type="button"
                        className={cx(styles.campusToggleOption, !isOnCampus && styles.campusToggleOptionActive)}
                        aria-pressed={!isOnCampus}
                        onClick={() => handleCampusSwitch(false)}
                    >
                        Off Campus
                    </button>
                </div>

                {isOnCampus ? (
                    <div className={cx(styles.row, styles.row2)}>
                        <div className={cx(styles.field, errors.dorm && styles.fieldError)}>
                            <label htmlFor="dorm" className={styles.fieldLabel}>
                                Dorm<span className={styles.fieldRequired} aria-hidden="true"> *</span>
                            </label>
                            <select
                                id="dorm"
                                name="dorm"
                                className={styles.fieldInput}
                                defaultValue={inputData?.on_campus?.dorm ?? ''}
                            >
                                <option value="">Select a dorm</option>
                                {dormTypes.map((d) => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                            {errors.dorm && (
                                <span className={styles.fieldErrorText} role="alert">{errors.dorm}</span>
                            )}
                        </div>
                        <Input
                            label="Room Number"
                            id="room-number"
                            type="text"
                            required
                            defaultValue={inputData?.on_campus?.room_number ?? ''}
                            error={errors.roomNumber}
                        />
                    </div>
                ) : (
                    <>
                        <Input
                            label="Street Address"
                            id="street-address"
                            type="text"
                            required
                            defaultValue={inputData?.off_campus?.street_address ?? ''}
                            error={errors.streetAddress}
                        />
                        <div className={cx(styles.row, styles.row3)}>
                            <Input
                                label="City"
                                id="city"
                                type="text"
                                required
                                defaultValue={inputData?.off_campus?.city ?? ''}
                                error={errors.city}
                            />
                            <div className={cx(styles.field, errors.state && styles.fieldError)}>
                                <label htmlFor="state" className={styles.fieldLabel}>
                                    State<span className={styles.fieldRequired} aria-hidden="true"> *</span>
                                </label>
                                <select
                                    id="state"
                                    name="state"
                                    className={styles.fieldInput}
                                    defaultValue={inputData?.off_campus?.state ?? ''}
                                >
                                    <option value="">State</option>
                                    {usStates.map((abbr) => (
                                        <option key={abbr} value={abbr}>{abbr}</option>
                                    ))}
                                </select>
                                {errors.state && (
                                    <span className={styles.fieldErrorText} role="alert">{errors.state}</span>
                                )}
                            </div>
                            <Input
                                label="Zip Code"
                                id="zip-code"
                                type="text"
                                required
                                placeholder="12345"
                                defaultValue={inputData?.off_campus?.zip_code ?? ''}
                                error={errors.zipCode}
                            />
                        </div>
                    </>
                )}
            </section>

            <section className={styles.pnmSection}>
                <h2 className={styles.pnmSectionTitle}>Interests</h2>
                <div className={styles.interestsField}>
                    <div className={styles.interestsChips}>
                        {interests.map((interest) => (
                            <span className={styles.interestChip} key={interest}>
                                {interest}
                                <button
                                    type="button"
                                    className={styles.interestChipRemove}
                                    aria-label={`Remove ${interest}`}
                                    onClick={() => removeInterest(interest)}
                                >
                                    &times;
                                </button>
                            </span>
                        ))}
                        <input
                            id="interests"
                            className={styles.interestsInput}
                            type="text"
                            placeholder={interests.length ? "" : "Type an interest and press Enter"}
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            onKeyDown={handleInterestKeyDown}
                            onBlur={() => addInterest(interestInput)}
                        />
                    </div>
                    <p className={styles.fieldHint}>Press Enter or comma to add each interest.</p>
                </div>
            </section>

            <div className={styles.pnmFormFooter}>
                {error != null && (
                    <p className={styles.pnmFormErrorText} role="alert">
                        {error instanceof Error ? error.message : "Something went wrong. Please try again."}
                    </p>
                )}
                <div className={styles.pnmFormActions}>
                    {children}
                    <button type="submit" className={styles.pnmSubmit} disabled={isPending}>
                        {isPending ? "Saving..." : "Save"}
                    </button>
                </div>
            </div>
        </form>
    );
}