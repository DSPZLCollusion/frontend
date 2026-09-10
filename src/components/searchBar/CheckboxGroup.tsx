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