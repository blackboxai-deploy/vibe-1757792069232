'use client'

import { Progress } from '@/components/ui/progress'

interface GenerationProgressProps {
  progress: number
}

export default function GenerationProgress({ progress }: GenerationProgressProps) {
  const getProgressMessage = (progress: number): string => {
    if (progress < 10) {
      return 'Initializing video generation...'
    } else if (progress < 30) {
      return 'Processing your text content...'
    } else if (progress < 50) {
      return 'Applying video style and effects...'
    } else if (progress < 70) {
      return 'Generating visual elements...'
    } else if (progress < 90) {
      return 'Rendering vertical video...'
    } else if (progress < 100) {
      return 'Finalizing video output...'
    } else {
      return 'Video generation complete!'
    }
  }

  const getProgressColor = (progress: number): string => {
    if (progress < 25) {
      return 'bg-gradient-to-r from-blue-500 to-blue-600'
    } else if (progress < 50) {
      return 'bg-gradient-to-r from-indigo-500 to-indigo-600'
    } else if (progress < 75) {
      return 'bg-gradient-to-r from-purple-500 to-purple-600'
    } else {
      return 'bg-gradient-to-r from-green-500 to-green-600'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Generating Your Video</h3>
        <span className="text-sm font-medium text-gray-600">{Math.round(progress)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <Progress value={progress} className="h-3 bg-gray-200" />
        <div 
          className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${getProgressColor(progress)}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Message */}
      <p className="text-sm text-gray-600 text-center">
        {getProgressMessage(progress)}
      </p>

      {/* Processing Steps */}
      <div className="grid grid-cols-1 gap-2">
        {[
          { step: 'Text Analysis', threshold: 20 },
          { step: 'Style Application', threshold: 40 },
          { step: 'Visual Generation', threshold: 60 },
          { step: 'Video Rendering', threshold: 80 },
          { step: 'Final Processing', threshold: 100 }
        ].map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
              progress >= item.threshold 
                ? 'bg-green-500' 
                : progress >= item.threshold - 20 
                ? 'bg-blue-500 animate-pulse' 
                : 'bg-gray-300'
            }`}>
              {progress >= item.threshold && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className={`text-sm ${
              progress >= item.threshold 
                ? 'text-green-700 font-medium' 
                : progress >= item.threshold - 20 
                ? 'text-blue-700' 
                : 'text-gray-500'
            }`}>
              {item.step}
            </span>
          </div>
        ))}
      </div>

      {/* Estimated Time */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-blue-800">
            <strong>Estimated time:</strong> 2-5 minutes for high-quality vertical video generation
          </p>
        </div>
      </div>

      {progress > 95 && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            🎉 Almost done! Your vertical video will be ready in seconds...
          </p>
        </div>
      )}
    </div>
  )
}