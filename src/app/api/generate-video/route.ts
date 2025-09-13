import { NextRequest, NextResponse } from 'next/server'

interface VideoGenerationRequest {
  text: string
  style: string
  duration: number
}

export async function POST(request: NextRequest) {
  try {
    const { text, style, duration }: VideoGenerationRequest = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Text content is required' },
        { status: 400 }
      )
    }

    if (text.length > 500) {
      return NextResponse.json(
        { error: 'Text content must be less than 500 characters' },
        { status: 400 }
      )
    }

    // Create optimized prompt for vertical video generation
    const optimizedPrompt = createVideoPrompt(text, style, duration)

    // Call Replicate API via custom endpoint
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'CustomerId': 'cus_Szde3rnRXMofEO',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify({
        model: 'replicate/google/veo-3',
        messages: [
          {
            role: 'user',
            content: optimizedPrompt
          }
        ]
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to generate video. Please try again.' },
        { status: 500 }
      )
    }

    // Check if response is JSON or video file
    const contentType = response.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      // Handle JSON response (might contain video URL or error)
      const jsonData = await response.json()
      
      if (jsonData.error) {
        return NextResponse.json(
          { error: jsonData.error },
          { status: 500 }
        )
      }
      
      // If JSON contains a video URL, fetch the video
      if (jsonData.video_url || jsonData.url) {
        const videoUrl = jsonData.video_url || jsonData.url
        const videoResponse = await fetch(videoUrl)
        
        if (!videoResponse.ok) {
          return NextResponse.json(
            { error: 'Failed to fetch generated video' },
            { status: 500 }
          )
        }
        
        const videoBuffer = await videoResponse.arrayBuffer()
        
        return new NextResponse(videoBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'video/mp4',
            'Content-Disposition': `attachment; filename="generated-video-${Date.now()}.mp4"`,
          }
        })
      }
      
      return NextResponse.json(
        { error: 'Invalid response from video generation service' },
        { status: 500 }
      )
    }
    
    // If response is already video content
    if (contentType.includes('video/') || contentType.includes('application/octet-stream')) {
      const videoBuffer = await response.arrayBuffer()
      
      return new NextResponse(videoBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp4',
          'Content-Disposition': `attachment; filename="generated-video-${Date.now()}.mp4"`,
        }
      })
    }

    return NextResponse.json(
      { error: 'Unexpected response format from video generation service' },
      { status: 500 }
    )

  } catch (error) {
    console.error('Video generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error during video generation' },
      { status: 500 }
    )
  }
}

function createVideoPrompt(text: string, style: string, duration: number): string {
  const basePrompt = `Create a vertical video (9:16 aspect ratio, 1080x1920 resolution) for social media (Instagram Reels, YouTube Shorts, TikTok).`
  
  const stylePrompts = {
    minimal: 'Clean, minimal design with simple typography and subtle animations. Use soft colors and plenty of white space.',
    dynamic: 'Dynamic and energetic with bold typography, vibrant colors, and smooth transitions. Include motion graphics and visual effects.',
    colorful: 'Bright, colorful design with playful animations and engaging visual elements. Use rainbow gradients and lively transitions.',
    professional: 'Professional and sophisticated design with elegant typography, corporate colors, and polished animations.',
    cinematic: 'Cinematic style with dramatic lighting, film-like color grading, and professional video effects.',
    modern: 'Modern, trendy design with current social media aesthetics, popular fonts, and contemporary visual styles.'
  }

  const selectedStyle = stylePrompts[style as keyof typeof stylePrompts] || stylePrompts.modern

  const durationText = duration <= 15 ? 'short and punchy' : duration <= 30 ? 'medium-paced' : 'comprehensive but engaging'

  return `${basePrompt}

Content: "${text}"

Style: ${selectedStyle}

Duration: ${duration} seconds (${durationText})

Requirements:
- VERTICAL FORMAT: 9:16 aspect ratio (1080x1920 pixels)
- Mobile-optimized for Instagram Reels, YouTube Shorts, TikTok
- Text should be large and readable on mobile devices
- Use kinetic typography with smooth text animations
- Include engaging visual transitions
- Ensure text remains visible throughout the video
- Background should complement the text without overwhelming it
- Add subtle sound-reactive visual elements (even if no audio)
- Make it thumb-stopping and engaging for social media feeds
- High quality, professional output suitable for social media posting

The video should start immediately without long introductions and maintain viewer engagement throughout the ${duration}-second duration.`
}