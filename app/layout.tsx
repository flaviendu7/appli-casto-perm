import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consignes Permanentes Castorama Claye-Souilly',
  description: 'Application interne de gestion des consignes permanentes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
