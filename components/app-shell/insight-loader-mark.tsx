export function InsightLoaderMark({ gradientId }: { gradientId: string }) {
  return (
    <svg
      className="insight-loader-mark"
      viewBox="0 0 100 100"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#332F86" />
          <stop offset="45%" stopColor="#A39CFF" />
          <stop offset="100%" stopColor="#5A54C4" />
        </linearGradient>
      </defs>
      <path
        className="insight-loader-outer"
        stroke={`url(#${gradientId})`}
        d="M29 13.63 71 13.63 92 50 71 86.37 29 86.37 8 50Z"
      />
      <g className="insight-loader-inner" stroke={`url(#${gradientId})`}>
        <polygon points="92,50 71,86.37 56.93,54" />
        <polygon points="71,86.37 29,86.37 50,58" />
        <polygon points="29,86.37 8,50 43.07,54" />
        <polygon points="8,50 29,13.63 43.07,46" />
        <polygon points="29,13.63 71,13.63 50,42" />
        <polygon points="71,13.63 92,50 56.93,46" />
      </g>
    </svg>
  );
}
