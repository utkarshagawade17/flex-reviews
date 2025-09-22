import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import ErrorBoundary from '@/components/ErrorBoundary'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Flex Living Reviews Dashboard',
  description: 'Manage and analyze guest reviews for Flex Living properties',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
        <html lang="en" suppressHydrationWarning className="w-full h-full">
          <body className={`${inter.className} w-full h-full`}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <AuthProvider>
                <ErrorBoundary>
                  <Navigation />
                  {children}
                </ErrorBoundary>
              </AuthProvider>
            </ThemeProvider>
          </body>
        </html>
  )
}
