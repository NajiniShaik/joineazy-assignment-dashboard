function StatCard({ label, value, detail }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
      {detail && <p className="mt-1 text-sm text-slate-500">{detail}</p>}
    </article>
  )
}

export default StatCard