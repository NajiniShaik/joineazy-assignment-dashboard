function ProgressBar({ percentage }) {
  return (
    <div
      aria-label={`${percentage}% complete`}
      aria-valuemax="100"
      aria-valuemin="0"
      aria-valuenow={percentage}
      className="h-3 overflow-hidden rounded-full bg-slate-200"
      role="progressbar"
    >
      <div
        className="h-full rounded-full bg-blue-600 transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export default ProgressBar