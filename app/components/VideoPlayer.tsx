"use client"
import { useEffect, useRef } from "react"

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

let apiReady = false
let apiLoading = false
const waiters: (() => void)[] = []

function loadYT(callback: () => void) {
  if (apiReady) return callback()

  waiters.push(callback)
  if (apiLoading) return

  apiLoading = true
  const tag = document.createElement("script")
  tag.src = "https://www.youtube.com/iframe_api"
  document.body.appendChild(tag)

  window.onYouTubeIframeAPIReady = () => {
    apiReady = true
    waiters.forEach(cb => cb())
    waiters.length = 0
  }
}

export function YouTubePlayer({
  videoId,
  onEnded,
}: {
  videoId: string
  onEnded?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)
  const lastVideoRef = useRef<string | null>(null)

  // create player only ONCE
  useEffect(() => {
    let mounted = true

    loadYT(() => {
      if (!mounted || !containerRef.current || playerRef.current) return

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
          fs: 0,
        },
        events: {
          onReady: (e: any) => e.target.playVideo(),
          onStateChange: (e: any) => {
            if (e.data === window.YT.PlayerState.ENDED) onEnded?.()
          },
        },
      })

      lastVideoRef.current = videoId
    })

    return () => {
      mounted = false
    }
  }, [])

  // change video ONLY if id actually changed
  useEffect(() => {
    if (!playerRef.current) return
    if (videoId === lastVideoRef.current) return

    playerRef.current.loadVideoById(videoId)
    lastVideoRef.current = videoId
  }, [videoId])

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-lg">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
