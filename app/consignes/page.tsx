import AppShell from '@/components/AppShell'

const consignes = [
  { titre: 'Sécurité incendie', cat: 'Sécurité', prio: 'Haute' },
  { titre: 'Essais SSI hebdomadaires', cat: 'SSI', prio: 'Normale' },
  { titre: 'Ouverture cour matériaux', cat: 'Logistique', prio: 'Normale' },
]

export default function ConsignesPage() {
  return (
    <AppShell>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold">Consignes</h1>
        <button className="rounded-xl bg-[#0050a4] text-white px-4 py-2 font-bold">Nouvelle consigne</button>
      </div>
      <div className="space-y-4">
        {consignes.map((c) => (
          <div className="card p-5" key={c.titre}>
            <div className="font-bold text-lg">{c.titre}</div>
            <div className="text-sm text-slate-500 mt-1">{c.cat} · Priorité {c.prio}</div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}
