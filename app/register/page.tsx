import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-2xl font-extrabold mb-2">Demande d'inscription</h1>
        <p className="text-sm text-slate-500 mb-6">Votre compte devra être validé par un administrateur.</p>
        <div className="space-y-4">
          <input className="w-full rounded-xl border p-3" placeholder="Nom complet" />
          <input className="w-full rounded-xl border p-3" placeholder="Email" type="email" />
          <input className="w-full rounded-xl border p-3" placeholder="Mot de passe" type="password" />
          <button className="w-full rounded-xl bg-[#0050a4] text-white font-bold p-3">Envoyer la demande</button>
        </div>
        <Link className="block text-center mt-5 text-sm text-[#0050a4] font-semibold" href="/login">Retour connexion</Link>
      </div>
    </div>
  )
}
