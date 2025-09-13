'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface GeneratedVideo {
  id: string
  text: string
  style: string
  duration: number
  videoUrl: string
  createdAt: Date
}

interface VideoHistoryProps {
  videos: GeneratedVideo[]
  onVideoSelect: (video: GeneratedVideo) => void
  onDownload: (video: GeneratedVideo) => void
}

export default function VideoHistory({ videos, onVideoSelect, onDownload }: VideoHistoryProps) {
  const [localVideos, setLocalVideos] = useState<GeneratedVideo[]>(videos)

  useEffect(() => {
    // Load videos from localStorage on component mount
    const savedVideos = localStorage.getItem('videoHistory')
    if (savedVideos) {
      try {
        const parsedVideos = JSON.parse(savedVideos).map((video: any) => ({
          ...video,
          createdAt: new Date(video.createdAt)
        }))
        setLocalVideos(parsedVideos)
      } catch (error) {
        console.error('Failed to load video history:', error)
      }
    }
  }, [])

  useEffect(() => {
    setLocalVideos(videos)
  }, [videos])

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
      }).format(date)
    }
  }

  const getStyleColor = (style: string) => {
    const colors: { [key: string]: string } = {
      minimal: 'bg-gray-100 text-gray-800',
      dynamic: 'bg-orange-100 text-orange-800',
      colorful: 'bg-purple-100 text-purple-800',
      professional: 'bg-blue-100 text-blue-800',
      cinematic: 'bg-gray-800 text-white',
      modern: 'bg-indigo-100 text-indigo-800'
    }
    return colors[style] || colors.modern
  }

  const clearHistory = () => {
    localStorage.removeItem('videoHistory')
    setLocalVideos([])
  }

  if (localVideos.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 12L12 15L9 12" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 4V15" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 21H19" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">No videos yet</h3>
        <p className="text-xs text-gray-600">Your generated videos will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          {localVideos.length} video{localVideos.length !== 1 ? 's' : ''}
        </span>
        {localVideos.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearHistory}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {localVideos.map((video) => (
          <Card 
            key={video.id} 
            className="cursor-pointer hover:bg-gray-50 transition-colors border-l-4 border-l-indigo-500"
            onClick={() => onVideoSelect(video)}
          >
            <CardContent className="p-3">
              <div className="space-y-2">
                {/* Video thumbnail placeholder */}
                <div className="w-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded aspect-video flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-1">
                      <div className="w-0 h-0 border-l-3 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-0.5"></div>
                    </div>
                    <span className="text-xs">{video.duration}s</span>
                  </div>
                </div>

                {/* Video details */}
                <div>
                  <p className="text-xs text-gray-900 line-clamp-2 font-medium leading-tight">
                    {video.text.length > 50 ? `${video.text.substring(0, 50)}...` : video.text}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge className={`${getStyleColor(video.style)} text-xs`}>
                      {video.style}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {formatDate(video.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 text-xs h-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      onVideoSelect(video)
                    }}
                  >
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="flex-1 text-xs h-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDownload(video)
                    }}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {localVideos.length >= 10 && (
        <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-xs text-yellow-800">
            Only the last 10 videos are kept in history
          </p>
        </div>
      )}
    </div>
  )
}