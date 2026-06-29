import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0050a4] to-[#003b78] p-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 h-14 w-14 rounded-2xl bg-[#0050a4] text-white flex items-center justify-center font-black">C</div>
          <h1 className="text-2xl font-extrabold">Consignes Permanentes</h1>
          <p className="text-sm text-slate-500 mt-1">Castorama Claye-Souilly</p>
        </div>
        <form className="space-y-4">
          <input className="w-full rounded-xl border p-3" placeholder="Email" type="email" />
          <input className="w-full rounded-xl border p-3" placeholder="Mot de passe" type="password" />
          <button className="w-full rounded-xl bg-[#0050a4] text-white font-bold p-3" type="button">Se connecter</button>
        </form>
        <div className="text-center mt-5 text-sm">
          <Link className="text-[#0050a4] font-semibold" href="/register">Créer un compte</Link>
        </div>
      </div>
    </div>
  )
}
