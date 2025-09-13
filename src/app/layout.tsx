import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Text to Video Generator - Create Vertical Videos for Reels & Shorts',
  description: 'Transform your text into engaging vertical videos perfect for Instagram Reels, YouTube Shorts, and TikTok. AI-powered video generation with 9:16 aspect ratio optimization.',
  keywords: 'text to video, vertical videos, reels generator, shorts creator, AI video, mobile video',
  authors: [{ name: 'Video Generator App' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#6366f1',
  openGraph: {
    title: 'Text to Video Generator',
    description: 'Create stunning vertical videos for social media from text',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Text to Video Generator',
    description: 'Create stunning vertical videos for social media from text',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}