export default function BottomPanel ({ activePanel, setActivePanel, executionState }) {
    return (
        <div className="w-full h" style={{"--h": "300px"}}>
            <ul className="w-full h flex items-center px-md gap-md text-sm border-y border-solid border-gray" style={{"--h": "30px"}}>
                <li className="pointer">Terminal</li>
                <li className="pointer">Errores</li>
                <li className="pointer">Console</li>
            </ul>
            <div className="w-full h-full bg-white"></div>
        </div>
    )
}