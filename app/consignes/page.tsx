import AppShell from '@/components/AppShell'
const data=['Sécurité incendie','Procédure évacuation','Contrôle SSI','Consigne logistique']
export default function Consignes(){return <AppShell><h1 className="text-3xl font-extrabold mb-6">Consignes</h1><div className="card p-6"><input className="input mb-4" placeholder="Rechercher une consigne..."/>{data.map(x=><div className="border-b py-4" key={x}><h3 className="font-bold">{x}</h3><p className="text-slate-500">Priorité normale · Catégorie sécurité</p></div>)}</div></AppShell>}
