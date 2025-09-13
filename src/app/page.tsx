'use client'

import { useState } from 'react'
import VideoGeneratorForm from '@/components/VideoGeneratorForm'
import VideoPreview from '@/components/VideoPreview'
import VideoHistory from '@/components/VideoHistory'
import GenerationProgress from '@/components/GenerationProgress'

interface GeneratedVideo {
  id: string
  text: string
  style: string
  duration: number
  videoUrl: string
  createdAt: Date
}

export default function HomePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [currentVideo, setCurrentVideo] = useState<GeneratedVideo | null>(null)
  const [videoHistory, setVideoHistory] = useState<GeneratedVideo[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleVideoGeneration = async (text: string, style: string, duration: number) => {
    setIsGenerating(true)
    setError(null)
    setGenerationProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + Math.random() * 15
        })
      }, 2000)

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, style, duration }),
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate video')
      }

      const blob = await response.blob()
      const videoUrl = URL.createObjectURL(blob)

      const newVideo: GeneratedVideo = {
        id: Date.now().toString(),
        text,
        style,
        duration,
        videoUrl,
        createdAt: new Date()
      }

      setCurrentVideo(newVideo)
      setVideoHistory(prev => [newVideo, ...prev.slice(0, 9)]) // Keep last 10 videos
      setGenerationProgress(100)

      // Save to localStorage
      localStorage.setItem('videoHistory', JSON.stringify([newVideo, ...videoHistory.slice(0, 9)]))

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video')
      setGenerationProgress(0)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleVideoSelect = (video: GeneratedVideo) => {
    setCurrentVideo(video)
  }

  const handleDownload = (video: GeneratedVideo) => {
    const link = document.createElement('a')
    link.href = video.videoUrl
    link.download = `video-${video.id}.mp4`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Text to Video Generator
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Create stunning vertical videos for Instagram Reels, YouTube Shorts & TikTok
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Video Generation Form */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Generate Video</h2>
              <VideoGeneratorForm
                onGenerate={handleVideoGeneration}
                isGenerating={isGenerating}
              />
              
              {isGenerating && (
                <div className="mt-6">
                  <GenerationProgress progress={generationProgress} />
                </div>
              )}
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Video Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Preview</h2>
              <VideoPreview
                video={currentVideo}
                onDownload={handleDownload}
              />
            </div>
          </div>

          {/* Video History */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">History</h2>
              <VideoHistory
                videos={videoHistory}
                onVideoSelect={handleVideoSelect}
                onDownload={handleDownload}
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Perfect for Social Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-rose-500 rounded-sm"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instagram Reels</h3>
              <p className="text-gray-600">9:16 aspect ratio optimized for Instagram Reels engagement</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-sm"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">YouTube Shorts</h3>
              <p className="text-gray-600">Perfect vertical format for YouTube Shorts algorithm</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-900 to-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-gray-900 to-gray-700 rounded-sm"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">TikTok</h3>
              <p className="text-gray-600">Mobile-first vertical videos for maximum TikTok impact</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}