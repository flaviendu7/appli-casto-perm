import AppShell from '@/components/AppShell'

export default function DashboardPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-extrabold mb-6">Tableau de bord</h1>
      <div className="grid md:grid-cols-3 gap-5">
        <div className="card p-6"><div className="text-slate-500">Consignes actives</div><div className="text-4xl font-black mt-2">12</div></div>
        <div className="card p-6"><div className="text-slate-500">Urgentes</div><div className="text-4xl font-black mt-2 text-red-600">3</div></div>
        <div className="card p-6"><div className="text-slate-500">Utilisateurs</div><div className="text-4xl font-black mt-2">28</div></div>
      </div>
    </AppShell>
  )
}
