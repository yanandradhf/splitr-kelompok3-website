// Extracted from dashboard AmountBarChart
const makeNiceScale = (maxVal, tickCount = 5) => {
  if (!isFinite(maxVal) || maxVal <= 0) {
    return { max: 1, ticks: [0, 0.25, 0.5, 0.75, 1], step: 0.25 };
  }
  const raw = maxVal / tickCount;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const niceNorm = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  const step = niceNorm * mag;
  const niceMax = Math.ceil(maxVal / step) * step;
  const ticks = [];
  for (let v = 0; v <= niceMax + 1e-9; v += step) ticks.push(v);
  return { max: niceMax, ticks, step };
};

const BarChart = ({
  data = [],
  valueKey = "amount",
  labelKey = "label",
  unitLabel = "Amount (Million Rp)",
  height = 260,
  color = "#2dd4bf"
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 grid place-items-center text-sm text-slate-500">
        No data available
      </div>
    );
  }

  const pad = { l: 64, r: 16, t: 16, b: 34 };
  const minBarW = 18;
  const barGap = 8;

  const maxVal = Math.max(...data.map((d) => Number(d[valueKey] || 0)));
  const { max: niceMax, ticks } = makeNiceScale(maxVal, 5);

  const contentW = data.length * minBarW + (data.length - 1) * barGap;
  const width = Math.max(520, pad.l + pad.r + contentW);
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;

  const scaleY = (v) => pad.t + innerH - (v / (niceMax || 1)) * innerH;
  const barW = Math.max(minBarW, innerW / data.length - barGap);

  return (
    <div className="overflow-x-auto pr-1">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-64"
        aria-label="Bar chart"
      >
        {/* Y grid + ticks */}
        {ticks.map((t, i) => {
          const y = scaleY(t);
          return (
            <g key={`tick-${i}-${t}`}>
              <line x1={pad.l} y1={y} x2={width - pad.r} y2={y} stroke="#e5e7eb" strokeWidth="1" />
              <line x1={pad.l - 4} y1={y} x2={pad.l} y2={y} stroke="#94a3b8" strokeWidth="1" />
              <text x={pad.l - 8} y={y + 3} textAnchor="end" fontSize="11" fill="#64748b">
                {t}
              </text>
            </g>
          );
        })}
        
        {/* Y axis line */}
        <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + innerH} stroke="#cbd5e1" strokeWidth="1" />

        {/* Y axis title */}
        <text x={14} y={pad.t + innerH / 2} fontSize="11" fill="#64748b" transform={`rotate(-90 14 ${pad.t + innerH / 2})`}>
          {unitLabel}
        </text>

        {/* Bars */}
        {data.map((d, i) => {
          const x = pad.l + i * (barW + barGap);
          const val = Number(d[valueKey] || 0);
          const y = scaleY(val);
          const h = (val / (niceMax || 1)) * innerH;
          return (
            <g key={`bar-${i}-${d[labelKey]}`}>
              <rect x={x} y={y} width={barW} height={h} rx="4" fill={color}>
                <title>{`${d[labelKey]}: ${val}`}</title>
              </rect>
              <text x={x + barW / 2} y={height - 10} textAnchor="middle" fontSize="10" fill="#64748b">
                {d[labelKey]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default BarChart;