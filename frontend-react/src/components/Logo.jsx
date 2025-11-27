export default function Logo({ className = "w-10 h-10", showText = true, textClassName = "text-2xl" }) {
    return (
        <div className="flex items-center gap-3">
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
            >
                <rect width="100" height="100" rx="24" fill="#0F9E99" />
                <path
                    d="M70 35L50 65L30 35"
                    stroke="white"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M50 65V80"
                    stroke="white"
                    strokeWidth="12"
                    strokeLinecap="round"
                />
                <circle cx="50" cy="25" r="6" fill="white" />
            </svg>
            {showText && (
                <div className={`font-bold tracking-tight ${textClassName}`}>
                    <span className="text-gray-900">Your</span>
                    <span className="text-primary">Utang</span>
                </div>
            )}
        </div>
    );
}
