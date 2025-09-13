'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface GeneratedVideo {
  id: string
  text: string
  style: string
  duration: number
  videoUrl: string
  createdAt: Date
}

interface VideoPreviewProps {
  video: GeneratedVideo | null
  onDownload: (video: GeneratedVideo) => void
}

export default function VideoPreview({ video, onDownload }: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVideoLoad = () => {
    setError(null)
  }

  const handleVideoError = () => {
    setError('Failed to load video. Please try generating again.')
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const getStyleColor = (style: string) => {
    const colors: { [key: string]: string } = {
      minimal: 'bg-gray-100 text-gray-800',
      dynamic: 'bg-orange-100 text-orange-800',
      colorful: 'bg-rainbow-100 text-purple-800',
      professional: 'bg-blue-100 text-blue-800',
      cinematic: 'bg-gray-800 text-white',
      modern: 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800'
    }
    return colors[style] || colors.modern
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="w-16 h-20 mx-auto mb-4 bg-gradient-to-b from-gray-300 to-gray-400 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Video Generated Yet</h3>
          <p className="text-gray-600 text-sm">Generate your first vertical video to see it here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Video Player */}
      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '9/16' }}>
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-red-600 text-xl">!</span>
              </div>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        ) : (
          <video
            src={video.videoUrl}
            controls
            className="w-full h-full object-cover"
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
            onPlay={handlePlay}
            onPause={handlePause}
            preload="metadata"
            poster={`data:image/svg+xml,${encodeURIComponent(`
              <svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#6366f1"/>
                <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="48" font-family="Arial">
                  Loading Video...
                </text>
              </svg>
            `)}`}
          >
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Play indicator */}
        {isPlaying && (
          <div className="absolute top-4 right-4 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>LIVE</span>
          </div>
        )}
      </div>

      {/* Video Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate font-medium">
                {video.text.length > 60 ? `${video.text.substring(0, 60)}...` : video.text}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Generated {formatDate(video.createdAt)}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-1 ml-4">
              <Badge className={getStyleColor(video.style)}>
                {video.style}
              </Badge>
              <span className="text-xs text-gray-500">{video.duration}s</span>
            </div>
          </div>

          {/* Download Button */}
          <Button
            onClick={() => onDownload(video)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            size="sm"
          >
            <div className="flex items-center space-x-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Download MP4</span>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Specs */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 mb-3">Video Specifications</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Aspect Ratio:</span>
              <span className="font-medium text-gray-900 ml-2">9:16</span>
            </div>
            <div>
              <span className="text-gray-600">Resolution:</span>
              <span className="font-medium text-gray-900 ml-2">1080x1920</span>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <span className="font-medium text-gray-900 ml-2">{video.duration} seconds</span>
            </div>
            <div>
              <span className="text-gray-600">Format:</span>
              <span className="font-medium text-gray-900 ml-2">MP4</span>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600">
              ✓ Optimized for Instagram Reels, YouTube Shorts, and TikTok
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}