import './globals.css'
import { Inter } from 'next/font/google'
import AnimatedLayout from '@/components/animated-layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Chronoly | Smart Time Tracking',
  description: 'Effortlessly track your time and boost productivity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AnimatedLayout>
          {children}
        </AnimatedLayout>
      </body>
    </html>
  )
}
