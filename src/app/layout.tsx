import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'UNCHAINED | Pedal & Pause',
  description: 'Prepare for your UNCHAINED cycling adventure',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
