import Link from 'next/link'

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="bg-[#0050a4] text-white px-6 py-4 shadow">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="font-bold text-lg">Consignes Permanentes Castorama Claye-Souilly</div>
          <nav className="flex gap-4 text-sm">
            <Link href="/dashboard">Tableau de bord</Link>
            <Link href="/consignes">Consignes</Link>
            <Link href="/login">Connexion</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-6">{children}</main>
    </div>
  )
}
