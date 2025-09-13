'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface VideoGeneratorFormProps {
  onGenerate: (text: string, style: string, duration: number) => void
  isGenerating: boolean
}

const videoStyles = [
  { value: 'minimal', label: 'Minimal', description: 'Clean and simple design' },
  { value: 'dynamic', label: 'Dynamic', description: 'Energetic with bold animations' },
  { value: 'colorful', label: 'Colorful', description: 'Bright and playful' },
  { value: 'professional', label: 'Professional', description: 'Corporate and sophisticated' },
  { value: 'cinematic', label: 'Cinematic', description: 'Dramatic and film-like' },
  { value: 'modern', label: 'Modern', description: 'Trendy social media style' }
]

const durations = [
  { value: 15, label: '15 seconds', description: 'Quick and punchy' },
  { value: 30, label: '30 seconds', description: 'Standard length' },
  { value: 45, label: '45 seconds', description: 'Extended content' },
  { value: 60, label: '60 seconds', description: 'Full-length reel' }
]

export default function VideoGeneratorForm({ onGenerate, isGenerating }: VideoGeneratorFormProps) {
  const [text, setText] = useState('')
  const [style, setStyle] = useState('modern')
  const [duration, setDuration] = useState(30)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!text.trim()) {
      newErrors.text = 'Text content is required'
    } else if (text.length < 10) {
      newErrors.text = 'Text must be at least 10 characters long'
    } else if (text.length > 500) {
      newErrors.text = 'Text must be less than 500 characters'
    }

    if (!style) {
      newErrors.style = 'Please select a video style'
    }

    if (!duration) {
      newErrors.duration = 'Please select a duration'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onGenerate(text, style, duration)
  }

  const selectedStyleInfo = videoStyles.find(s => s.value === style)
  const selectedDurationInfo = durations.find(d => d.value === duration)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Text Input */}
      <div className="space-y-2">
        <Label htmlFor="text" className="text-sm font-medium text-gray-700">
          Video Content
        </Label>
        <Textarea
          id="text"
          placeholder="Enter your text content for the video... Be descriptive and engaging!"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={`min-h-[120px] resize-none ${errors.text ? 'border-red-500 focus:border-red-500' : ''}`}
          maxLength={500}
          disabled={isGenerating}
        />
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>{errors.text && <span className="text-red-500">{errors.text}</span>}</span>
          <span>{text.length}/500</span>
        </div>
      </div>

      {/* Style Selection */}
      <div className="space-y-2">
        <Label htmlFor="style" className="text-sm font-medium text-gray-700">
          Video Style
        </Label>
        <Select value={style} onValueChange={setStyle} disabled={isGenerating}>
          <SelectTrigger className={errors.style ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select a video style" />
          </SelectTrigger>
          <SelectContent>
            {videoStyles.map((styleOption) => (
              <SelectItem key={styleOption.value} value={styleOption.value}>
                <div className="flex flex-col">
                  <span className="font-medium">{styleOption.label}</span>
                  <span className="text-xs text-gray-500">{styleOption.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedStyleInfo && (
          <Card className="bg-gray-50 border-0">
            <CardContent className="p-3">
              <p className="text-xs text-gray-600">{selectedStyleInfo.description}</p>
            </CardContent>
          </Card>
        )}
        {errors.style && <span className="text-xs text-red-500">{errors.style}</span>}
      </div>

      {/* Duration Selection */}
      <div className="space-y-2">
        <Label htmlFor="duration" className="text-sm font-medium text-gray-700">
          Video Duration
        </Label>
        <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))} disabled={isGenerating}>
          <SelectTrigger className={errors.duration ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            {durations.map((durationOption) => (
              <SelectItem key={durationOption.value} value={durationOption.value.toString()}>
                <div className="flex flex-col">
                  <span className="font-medium">{durationOption.label}</span>
                  <span className="text-xs text-gray-500">{durationOption.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedDurationInfo && (
          <Card className="bg-gray-50 border-0">
            <CardContent className="p-3">
              <p className="text-xs text-gray-600">{selectedDurationInfo.description}</p>
            </CardContent>
          </Card>
        )}
        {errors.duration && <span className="text-xs text-red-500">{errors.duration}</span>}
      </div>

      {/* Generate Button */}
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-3"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating Video...</span>
          </div>
        ) : (
          'Generate Video'
        )}
      </Button>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h4 className="font-medium text-blue-900 mb-2">Perfect for Social Media</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• 9:16 vertical aspect ratio (1080x1920)</li>
            <li>• Optimized for Instagram Reels, YouTube Shorts, TikTok</li>
            <li>• Mobile-friendly text size and animations</li>
            <li>• High-quality MP4 output ready for upload</li>
          </ul>
        </CardContent>
      </Card>
    </form>
  )
}