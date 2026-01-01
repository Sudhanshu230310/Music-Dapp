"use client"

import { useState, forwardRef, type ButtonHTMLAttributes } from "react"
import { ArrowUp, ArrowDown, Play, Menu, Wallet, Music, Zap, Coins, CheckCircle2, X } from "lucide-react"

// --- Local UI Components ---

const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }
>(({ className, variant = "default", size = "default", ...props }, ref) => {
  const getVariantClass = (v: string) => {
    switch (v) {
      case "outline":
        return "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground border-primary text-primary"
      case "ghost":
        return "hover:bg-accent hover:text-accent-foreground"
      case "destructive":
        return "bg-destructive text-destructive-foreground hover:opacity-90"
      default:
        return "bg-primary text-primary-foreground hover:opacity-90"
    }
  }

  const getSizeClass = (s: string) => {
    switch (s) {
      case "sm":
        return "h-9 px-3"
      case "lg":
        return "h-11 px-8"
      case "icon":
        return "h-10 w-10"
      default:
        return "h-10 px-4 py-2"
    }
  }

  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${getVariantClass(variant)} ${getSizeClass(size)} ${className}`}
      {...props}
    />
  )
})
Button.displayName = "Button"

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

const useLocalToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, variant = "default" }: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, title, description, variant }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }

  return { toast, toasts, removeToast: (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)) }
}

export default function MusicLandingPage() {
  const { toast, toasts, removeToast } = useLocalToast()
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const handleConnect = () => {
    setIsWalletConnected(true)
    toast({
      title: "Wallet Connected",
      description: "Successfully connected your Solana wallet.",
    })
  }

  const handleVote = (direction: "up" | "down") => {
    if (!isWalletConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your Solana wallet to vote.",
        variant: "destructive",
      })
      return
    }
    toast({
      title: direction === "up" ? "Upvoted!" : "Downvoted",
      description: `Transaction pending on Solana...`,
    })
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 min-w-[300px] border shadow-lg animate-in slide-in-from-right-full flex justify-between items-start ${
              t.variant === "destructive"
                ? "bg-destructive text-destructive-foreground"
                : "bg-card text-card-foreground"
            }`}
          >
            <div>
              {t.title && <div className="font-bold text-sm uppercase tracking-tight">{t.title}</div>}
              {t.description && <div className="text-xs opacity-90 mt-1">{t.description}</div>}
            </div>
            <button onClick={() => removeToast(t.id)} className="opacity-50 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Navigation */}
      {/* Hero Section */}
      <header className="px-6 md:px-10 py-20 md:py-32 grid md:grid-cols-2 gap-12 items-end border-b border-border">
        <div className="animate-in fade-in slide-in-from-left duration-1000">
          <h1 className="text-6xl md:text-[8rem] font-serif leading-[0.9] tracking-tighter uppercase mb-8">
            Sound <br /> Equity.
          </h1>
          <p className="max-w-md text-lg text-muted-foreground leading-relaxed">
            The first music ecosystem where fans dictate culture. Upvote your favorite tracks using Solana and shape the
            future of sound.
          </p>
        </div>
        <div className="flex flex-col items-start gap-8 animate-in fade-in slide-in-from-right duration-1000">
          <div className="flex items-center gap-4 text-primary group cursor-pointer">
            <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
              <Play className="fill-current" />
            </div>
            <span className="uppercase tracking-[0.2em] text-xs font-bold">Watch the concept</span>
          </div>
          <Button
            onClick={handleConnect}
            className="w-full md:w-auto h-16 px-10 bg-primary text-primary-foreground hover:opacity-90 transition-opacity uppercase tracking-widest font-bold flex gap-3"
          >
            {isWalletConnected ? (
              <>
                <CheckCircle2 className="w-5 h-5" /> Connected
              </>
            ) : (
              <>
                <Wallet className="w-5 h-5" /> Connect Wallet
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Content Section */}
      <section className="px-6 md:px-10 py-24 border-b border-border bg-card/30">
        <div className="max-w-4xl">
          <span className="text-xs uppercase tracking-[0.4em] text-primary font-bold mb-4 block">The Protocol</span>
          <h2 className="text-4xl md:text-6xl font-serif mb-12 leading-tight">
            Decentralized Curation. <br /> Real Economic Impact.
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-10 h-10 border border-primary flex items-center justify-center">
                <Music className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">Discover</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Browse exclusive tracks from independent artists. Filter by genre, BPM, or governance stage.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 border border-primary flex items-center justify-center">
                <Coins className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">Vote with SOL</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Found a hit? Support it with Solana. Your votes directly fund the artist and increase visibility.
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 border border-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight">Earn Rewards</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                As a backer, you earn a share of streaming royalties once the track reaches quorum.
              </p>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  )
}
