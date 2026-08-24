export default function PseudocodeEditor ({ value, onChange, executionState }) {
    return (
        <div className="w-full h-full rounded-md border border-solid border-gray-100" style={{"overflow": "hidden"}} aria-label="Pseudoc+odigo">
            <textarea
                value={value}
                onChange={(event) => {
                    onChange(event.target.value);
                }}
                className="w-full h-full resize-none p-md"
                spellCheck={false}
            />
        </div>
    )
}