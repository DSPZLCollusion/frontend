
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