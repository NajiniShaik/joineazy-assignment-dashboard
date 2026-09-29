function ProgressBar({ percentage }) {
  return (
    <div
      aria-label={`${percentage}% complete`}
      aria-valuemax="100"
      aria-valuemin="0"
      aria-valuenow={percentage}
      className="h-2.5 overflow-hidden rounded-full bg-[#e8eee9]"
      role="progressbar"
    >
      <div
        className="h-full rounded-full bg-[#65a486] transition-all duration-500"
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export default ProgressBar