import { BasementTracker } from '@/components/basement-tracker'

export default function BasementPage() {
  return (
    <main className="relative w-full h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="absolute top-4 left-4 z-50">
        <a
          href="/"
          className="px-4 py-2 bg-[#fca311] text-[#000000] font-mono uppercase tracking-wider border-2 border-[#fca311] hover:bg-[#f5d67d] transition-all inline-block"
        >
          &lt;&lt; Return to Black Mesa
        </a>
      </div>
      <BasementTracker />
    </main>
  )
}
