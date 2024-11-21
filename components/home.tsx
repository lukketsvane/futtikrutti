'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { ArrowDown, MapPin, Calendar, Clock, Send } from 'lucide-react'

type CountdownProps = {
  date: Date | number | string;
  renderer: (props: { days: number; hours: number; minutes: number; seconds: number; completed: boolean }) => React.ReactNode;
};

const Countdown = dynamic<CountdownProps>(() => import('react-countdown').then((mod) => mod.default), { 
  ssr: false 
});

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => <p>Loading Spline scene...</p>
})

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitted(false)

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        setEmail('')
      } else {
        const data = await response.json()
        setError(data.message || 'An error occurred. Please try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    }
  }

  const countdownRenderer = useCallback(({ days, hours, minutes, seconds, completed }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    if (completed) {
      return <span className="font-mono text-3xl">Festivalen har startet!</span>
    } else {
      return (
        <div className="w-full max-w-6xl mx-auto px-4">
          <div className="flex justify-between text-white mb-16">
            <div className="text-lg">FUTTI KRUTTO FESTIVAL</div>
            <div className="text-lg">BLI MED OSS PÅ KRUTTVERKET</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex gap-3">
              {[
                { value: days, label: 'Dager' },
                { value: hours, label: 'Timer' },
                { value: minutes, label: 'Minutter' },
                { value: seconds, label: 'Sekunder' },
              ].map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="bg-white rounded-sm w-24 h-24 flex items-center justify-center shadow-lg">
                    <span className="font-mono text-black text-5xl font-bold">{String(value).padStart(2, '0')}</span>
                  </div>
                  <span className="text-gray-400 mt-2 text-sm font-normal">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between text-white mt-16">
            <div className="text-lg">BLI MED PÅ FESTIVALEN</div>
            <div className="text-lg">KRUTTVERKET, OSLO</div>
          </div>
        </div>
      )
    }
  }, [])

  return (
    <main className="relative bg-[#f5e6d3] font-sans font-black overflow-x-hidden">
      <div className="w-full h-screen overflow-hidden flex items-center justify-center relative">
        {dimensions.width > 0 && (
          <Spline
            scene="https://prod.spline.design/j1MY9NLCib91rAlF/scene.splinecode"
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        )}
        <div className="absolute bottom-8 animate-bounce z-10">
          <ArrowDown className="w-8 h-8 text-[#1B998B]" />
        </div>
      </div>

      <div className="min-h-screen px-4 md:px-8 space-y-16 max-w-full mx-auto relative z-10">
        <section className="max-w-4xl mx-auto pt-24">
          <h1 className="text-4xl md:text-7xl mb-6 text-[#1B998B] break-words tracking-tight">NABOLAGSFESTIVAL PÅ KRUTTVERKET</h1>
          <p className="text-xl md:text-2xl mb-4 text-[#1B998B]">Bli med oss for en uforglemmelig opplevelse av musikk, kunst og kultur ved historiske Kruttverket!</p>
          <div className="flex flex-wrap gap-4 mt-8">
            <div className="flex items-center gap-2 bg-[#FF6B35] text-white p-2">
              <Calendar className="w-6 h-6" />
              <span>Lørdag 07.12.24</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1B998B] text-white p-2">
              <Clock className="w-6 h-6" />
              <span>12:00 - 23:00</span>
            </div>
            <div className="flex items-center gap-2 bg-[#7768AE] text-white p-2">
              <MapPin className="w-6 h-6" />
              <span>Kruttverket, Oslo</span>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl mb-8 text-[#1B998B] tracking-tight">PRAKTISK INFO</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#FF6B35] p-8 clip-path-polygon">
              <h3 className="text-2xl md:text-3xl mb-4 text-white tracking-tight">ADRESSE & ANKOMST</h3>
              <div className="space-y-4 text-white">
                <p>Kruttverket, Festivalveien 123, Oslo</p>
                <p>Følg skilting fra Alnaelva</p>
                <p>5 minutter gange fra T-banestasjonen</p>
                <p>Sykkelparkering tilgjengelig</p>
              </div>
            </div>
            <div className="bg-[#7768AE] p-8 clip-path-polygon">
              <h3 className="text-2xl md:text-3xl mb-4 text-white tracking-tight">TRANSPORT & PARKERING</h3>
              <div className="space-y-4 text-white">
                <p>T-bane: Linje 2, 3 og 4</p>
                <p>Buss: Rute 21, 31 og 54</p>
                <p>Tog: 10 min gange fra stasjonen</p>
                <p>Begrenset parkering - vi oppfordrer til kollektivtransport</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#1B998B] p-8 clip-path-polygon max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl mb-8 text-white tracking-tight">NYHETSBREV</h2>
          <p className="text-white mb-4">Meld deg på vårt nyhetsbrev for å få siste nytt om festivalen!</p>
          {isSubmitted ? (
            <p className="text-white font-bold">Takk for påmeldingen! Du vil snart motta vårt nyhetsbrev.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Din e-postadresse"
                required
                className="p-2 flex-grow"
                aria-label="E-postadresse for nyhetsbrev"
              />
              <button type="submit" className="bg-[#FF6B35] text-white p-2 flex items-center justify-center">
                <Send className="w-6 h-6 mr-2" />
                <span>Meld meg på</span>
              </button>
            </form>
          )}
          {error && <p className="text-red-500 mt-2" role="alert">{error}</p>}
        </section>
      </div>

      <div className="bg-[#4569B4] py-24">
        <Countdown
          date={new Date('2024-12-07T13:00:00+01:00')}
          renderer={countdownRenderer}
        />
      </div>
    </main>
  )
}