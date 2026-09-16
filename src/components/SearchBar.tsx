import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { searchPnmsAnd, searchPnmsOr } from "../util/http";
import type { SearchFilters, Pnm } from "../util/http";
import styles from "./SearchBar.module.css";
import PnmBlock from "./PnmBlock";

const CLASS_YEARS = ["FRESHMAN", "SOPHOMORE", "JUNIOR", "SENIOR", "SUPER_SENIOR"];
const STATUSES = ["DELTA", "SIGMA", "PHI"];
const DORMS = [
    "SPEED", "BSB", "BLUMBERG", "MEES", "DEMING",
    "SCHARPENBERG", "LAKESIDE", "PERCOPO",
    "APARTMENTS WEST", "APARTMENTS EAST", "TBA",
];
const LAST_CONTACTED = ["NEVER", "Last Day", "Last Week", "Last Month"]

const CATEGORIES = [
    { value: "first_name", label: "First name" },
    { value: "last_name", label: "Last name" },
    { value: "email", label: "Email" },
    { value: "class_year", label: "Class year" },
    { value: "status_type", label: "Status" },
    { value: "dorm", label: "Dorm" },
    { value: "last_contacted", label: "Last contacted" },
    { value: "interests", label: "Interest" },
] as const;

type CategoryValue = (typeof CATEGORIES)[number]["value"];

const emptyFilters: SearchFilters = {
    first_name: "",
    last_name: "",
    email: "",
    class_year: [],
    status_type: [],
    dorm: [],
    last_contacted: [],
    interests: "",
};

function toggleInList(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

// ── CheckboxGroup ─────────────────────────────────────────────────────────────

interface CheckboxGroupProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (next: string[]) => void;
}

function CheckboxGroup({ label, options, selected, onChange }: CheckboxGroupProps) {
    return (
        <fieldset className={styles["field-group"]}>
            <legend>{label}</legend>
            <div className={styles["chip-row"]}>
                {options.map((opt) => {
                    const active = selected.includes(opt);
                    return (
                        <button
                            type="button"
                            key={opt}
                            className={`${styles.chip} ${active ? styles["chip-active"] : ""}`}
                            onClick={() => onChange(toggleInList(selected, opt))}
                            aria-pressed={active}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </fieldset>
    );
}

// ── AdvancedModal ─────────────────────────────────────────────────────────────

interface AdvancedModalProps {
    initial: SearchFilters;
    initialMode: "ALL" | "ANY";
    onClose: () => void;
    onApply: (draft: SearchFilters, mode: "ALL" | "ANY") => void;
}

function AdvancedModal({ initial, initialMode, onClose, onApply }: AdvancedModalProps) {
    const [draft, setDraft] = useState<SearchFilters>(initial);
    const [mode, setMode] = useState<"ALL" | "ANY">(initialMode);

    const set = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) =>
        setDraft((d) => ({ ...d, [key]: value }));

    return (
        <div className={styles["modal-backdrop"]} onClick={onClose}>
            <div
                className={styles["modal-panel"]}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label="Advanced search"
            >
                <div className={styles["modal-head"]}>
                    <h2>Advanced search</h2>
                    <button className={styles["icon-btn"]} onClick={onClose} aria-label="Close">
                        <X size={18} />
                    </button>
                </div>

                <div className={styles["modal-body"]}>
                    <div className={styles["field-row"]}>
                        <label className={styles["field-group"]}>
                            <span>First name</span>
                            <input value={draft.first_name ?? ""} onChange={(e) => set("first_name", e.target.value)} placeholder="Any first name" />
                        </label>
                        <label className={styles["field-group"]}>
                            <span>Last name</span>
                            <input value={draft.last_name ?? ""} onChange={(e) => set("last_name", e.target.value)} placeholder="Any last name" />
                        </label>
                    </div>

                    <label className={styles["field-group"]}>
                        <span>Email</span>
                        <input value={draft.email ?? ""} onChange={(e) => set("email", e.target.value)} placeholder="name@school.edu" />
                    </label>

                    <CheckboxGroup label="Class year" options={CLASS_YEARS} selected={draft.class_year ?? []} onChange={(v) => set("class_year", v)} />
                    <CheckboxGroup label="Status" options={STATUSES} selected={draft.status_type ?? []} onChange={(v) => set("status_type", v)} />
                    <CheckboxGroup label="Dorm" options={DORMS} selected={draft.dorm ?? []} onChange={(v) => set("dorm", v)} />

                    <CheckboxGroup
                        label="Last contacted"
                        options={LAST_CONTACTED}
                        selected={draft.last_contacted ?? []}
                        onChange={(v) => set("last_contacted", v)}
                    />

                    <label className={styles["field-group"]}>
                        <span>Interests</span>
                        <input value={draft.interests ?? ""} onChange={(e) => set("interests", e.target.value)} placeholder="e.g. Volleyball, Choir" />
                    </label>

                    <div className={styles["mode-toggle"]}>
                        <span>Match</span>
                        <div className={styles.segmented} role="radiogroup" aria-label="Match mode">
                            <button type="button" className={mode === "ALL" ? styles["seg-active"] : ""} onClick={() => setMode("ALL")} role="radio" aria-checked={mode === "ALL"}>
                                All filters
                            </button>
                            <button type="button" className={mode === "ANY" ? styles["seg-active"] : ""} onClick={() => setMode("ANY")} role="radio" aria-checked={mode === "ANY"}>
                                Any filter
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles["modal-foot"]}>
                    <button className={styles["btn-quiet"]} onClick={() => setDraft(emptyFilters)}>
                        Reset fields
                    </button>
                    <button
                        className={styles["btn-primary"]}
                        onClick={() => {
                            onApply(draft, mode);
                            onClose();
                        }}
                    >
                        Search
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── SearchBar ─────────────────────────────────────────────────────────────────

interface SearchBarProps {
    allPnms: Pnm[];
}

export default function SearchBar({ allPnms }: SearchBarProps) {
    const [category, setCategory] = useState<CategoryValue>("first_name");
    const [quickValue, setQuickValue] = useState("");
    const [filters, setFilters] = useState<SearchFilters>(emptyFilters);
    const [matchMode, setMatchMode] = useState<"ALL" | "ANY">("ALL");
    const [advancedActive, setAdvancedActive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [results, setResults] = useState<Pnm[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const summaryLabel = useMemo(() => {
        const parts: string[] = [];
        if (filters.first_name) parts.push(`first name "${filters.first_name}"`);
        if (filters.last_name) parts.push(`last name "${filters.last_name}"`);
        if (filters.email) parts.push(`email "${filters.email}"`);
        if (filters.class_year?.length) parts.push(`class year: ${filters.class_year.join(", ")}`);
        if (filters.status_type?.length) parts.push(`status: ${filters.status_type.join(", ")}`);
        if (filters.dorm?.length) parts.push(`dorm: ${filters.dorm.join(", ")}`);
        if (filters.last_contacted?.length) parts.push(`last contacted: ${filters.last_contacted.join(", ")}`);
        if (filters.interests) parts.push(`interests: ${filters.interests}`);
        return parts.join(matchMode === "ANY" ? " · or · " : " · and · ");
    }, [filters, matchMode]);

    async function executeSearch(nextFilters: SearchFilters, mode: "ALL" | "ANY") {
        setLoading(true);
        setError(null);
        try {
            const data = mode === "ANY"
                ? await searchPnmsOr(nextFilters)
                : await searchPnmsAnd(nextFilters);
            setResults(data);
        } catch {
            setError("Search failed. Please try again.");
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    const runQuick = () => {
        const next: SearchFilters = { ...emptyFilters };
        if (category === "class_year" || category === "status_type" || category === "dorm" || category === "last_contacted") {
            next[category] = quickValue.split(",").map((s) => s.trim()).filter(Boolean);
        } else {
            next[category] = quickValue;
        }
        setFilters(next);
        setMatchMode("ALL");
        executeSearch(next, "ALL");
    };

    const applyAdvanced = (draft: SearchFilters, mode: "ALL" | "ANY") => {
        setFilters(draft);
        setMatchMode(mode);
        setAdvancedActive(true);
        setQuickValue("");
        executeSearch(draft, mode);
    };

    const clearSearch = () => {
        setFilters(emptyFilters);
        setQuickValue("");
        setAdvancedActive(false);
        setResults(null);
        setError(null);
    };

    const roster = results ?? allPnms;
    const isFiltered = results !== null;

    return (
        <div className={styles["pnm-app"]}>
            <div className={styles["pnm-shell"]}>
                <div className={styles["pnm-header"]}>
                    <h1>Recruitment roster</h1>
                    <p>Search potential new members by any field, or open advanced search to combine several.</p>
                </div>

                <div className={styles["search-row"]}>
                    <div className={styles["cat-select"]}>
                        <select value={category} onChange={(e) => setCategory(e.target.value as CategoryValue)} aria-label="Search category">
                            {CATEGORIES.map((c) => (
                                <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} />
                    </div>
                    <input
                        value={quickValue}
                        onChange={(e) => { setAdvancedActive(false); setQuickValue(e.target.value); }}
                        onKeyDown={(e) => e.key === "Enter" && !advancedActive && runQuick()}
                        placeholder={`Search by ${CATEGORIES.find((c) => c.value === category)!.label.toLowerCase()}...`}
                        disabled={advancedActive}
                    />
                    <div className={styles.divider} />
                    <button className={styles["adv-btn"]} onClick={() => setModalOpen(true)}>
                        <SlidersHorizontal size={15} />
                        Advanced
                    </button>
                    <button className={styles["search-btn"]} onClick={runQuick} disabled={loading || advancedActive}>
                        <Search size={15} />
                        {loading ? "Searching…" : "Search"}
                    </button>
                </div>

                {error && <p style={{ color: "var(--wine)", marginTop: "0.75rem", fontSize: "0.88rem" }}>{error}</p>}

                <div className={styles["results-bar"]}>
                    <span>
                        {isFiltered ? (
                            <>
                                <strong>{roster.length}</strong> result{roster.length === 1 ? "" : "s"}
                                {summaryLabel && <> for {summaryLabel}</>}
                            </>
                        ) : (
                            <><strong>{roster.length}</strong> total PNMs</>
                        )}
                    </span>
                    {isFiltered && (
                        <button className={styles["clear-link"]} onClick={clearSearch}>
                            Clear search
                        </button>
                    )}
                </div>

                {roster.length === 0 && !loading ? (
                    <div className={styles["empty-state"]}>
                        <strong>No PNMs match that search.</strong>
                        Try loosening a filter, switching "All filters" to "Any filter," or clear the search to see everyone.
                    </div>
                ) : (
                    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                        {roster.map((info) => (
                            <li key={info.id}>
                                <PnmBlock
                                    id={info.id}
                                    first_name={info.first_name}
                                    last_name={info.last_name}
                                    class_year={info.class_year}
                                    status_type={info.status_type}
                                    email={info.email}
                                    phone_number={info.phone_number}
                                    photo_url={info.photo_url}
                                    last_contacted={info.last_contacted}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {modalOpen && (
                <AdvancedModal
                    initial={filters}
                    initialMode={matchMode}
                    onClose={() => setModalOpen(false)}
                    onApply={applyAdvanced}
                />
            )}
        </div>
    );
}
