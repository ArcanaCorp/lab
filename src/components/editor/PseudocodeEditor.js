export default function PseudocodeEditor ({ value, onChange, executionState }) {
    return (
        <div className="w-full h-full" aria-label="Pseudoc+odigo">
            <textarea
                value={value}
                onChange={(event) => {
                    onChange(event.target.value);
                }}
                className="w-full h-full resize-none"
                spellCheck={false}
            />
        </div>
    )
}