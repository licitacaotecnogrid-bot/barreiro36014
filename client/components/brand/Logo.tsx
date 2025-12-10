type Props = { className?: string; wordmark?: boolean };

export default function Logo({ className = "h-12", wordmark = true }: Props) {
  return (
    <div className="inline-flex flex-col items-center">
      <svg
        className={className}
        viewBox="0 0 280 180"
        role="img"
        aria-label="Logo Barreiro 360"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sunGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="none" />
        <circle cx="95" cy="68" r="22" fill="url(#sunGrad)" opacity="0.9" />
        <g fill="#CBD5E1" opacity="0.5">
          <rect x="110" y="54" width="60" height="12" rx="6" />
          <rect x="165" y="66" width="46" height="10" rx="5" />
        </g>
        <g stroke="hsl(var(--primary))" strokeWidth="3" fill="#F1F5F9">
          <rect x="42" y="92" width="92" height="42" />
          <polygon points="42,92 134,92 134,86 88,70 42,86" fill="white" />
          {Array.from({ length: 6 }).map((_, i) => (
            <g key={i}>
              <rect x={50 + i * 13} y="92" width="8" height="36" fill="#fff" />
              <line x1={54 + i * 13} y1="92" x2={54 + i * 13} y2="128" />
            </g>
          ))}
          <rect x="138" y="86" width="62" height="48" />
          <rect x="172" y="74" width="40" height="60" />
          <rect x="194" y="62" width="24" height="72" />
          <polygon points="194,62 206,50 218,62" fill="#E2E8F0" />
          <polygon points="172,74 192,62 212,74" fill="#E2E8F0" />
          <path d="M156 118 a10 10 0 0 1 20 0 v16 h-20z" fill="#fff" />
          <rect x="200" y="90" width="4" height="12" />
          <rect x="182" y="92" width="8" height="12" rx="2" fill="#fff" />
          <rect x="206" y="46" width="4" height="10" fill="hsl(var(--primary))" />
        </g>
        <path d="M230 132 q-40 34 -120 30" fill="none" stroke="#94A3B8" strokeWidth="3" />
      </svg>
      {wordmark && (
        <div className="mt-2 text-2xl font-semibold tracking-tight text-[hsl(var(--primary))]">
          Barreiro 360
        </div>
      )}
    </div>
  );
}
