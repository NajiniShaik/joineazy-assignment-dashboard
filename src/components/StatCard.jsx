function StatCard({ label, value, detail }) {
  return (
    <article className="rounded-xl border border-[#e1e9e3] bg-white p-5">
      <p className="text-sm font-semibold text-[#728078]">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-[#203329]">
        {value}
      </p>
      {detail && <p className="mt-1 text-sm text-[#849087]">{detail}</p>}
    </article>
  )
}

export default StatCard