import { useEffect } from 'react'
import { ArrowRight, Calendar, Car, CheckCircle2, Gauge, MapPin, Phone, ShieldCheck, Star } from 'lucide-react'

import '../styles/edmonton-cars.css'

const navLinks = [
  { label: 'Process', href: '#process' },
  { label: 'Inventory', href: '#inventory' },
  { label: 'Proof', href: '#proof' },
  { label: 'SEO', href: '#seo' },
  { label: 'Contact', href: '#contact' },
]

const heroHighlights = [
  'Live Edmonton & area inventory updates twice daily.',
  'Finance specialists reply in under one hour.',
  'Mobile-first funnel converts shoppers into booked drives.',
]

const highlightItems = [
  { icon: MapPin, title: 'Local Inventory', description: 'Edmonton, Sherwood Park, and St. Albert dealers synced with VIN-level detail.' },
  { icon: Gauge, title: 'Finance Ready', description: 'Prime, near-prime, and rebuilding credit paths with instant pre-qualification.' },
  { icon: ShieldCheck, title: 'Protected Delivery', description: 'Warranty, rust, and tire programs pre-packaged for every quote.' },
]

const steps = [
  { label: 'Step 01', title: 'Share your goals', description: 'Tell us budget, payment target, and trade details so we can match the right vehicles.' },
  { label: 'Step 02', title: 'Review curated offers', description: 'We source written offers from vetted Edmonton partners and email a side-by-side summary.' },
  { label: 'Step 03', title: 'Book the drive', description: 'Lock in your test drive slot and arrive to a ready vehicle with paperwork prepped.' },
]

const inventory = [
  {
    name: '2024 Ford F-150 Lariat FX4',
    payment: '$589 bi-weekly',
    features: ['0% APR for 36 months', 'Remote start + winter package', 'Trade-in top ups to $6,000'],
    type: 'Truck',
  },
  {
    name: '2023 Toyota RAV4 Hybrid Limited',
    payment: '$512 bi-weekly',
    features: ['5.8L/100km city', 'Toyota Safety Sense™ 2.5', 'No-charge lifetime oil changes'],
    type: 'SUV',
  },
  {
    name: '2024 Hyundai Elantra N Line',
    payment: '$398 bi-weekly',
    features: ['Dual-clutch transmission', 'Apple CarPlay + Android Auto', 'First payment deferred 90 days'],
    type: 'Sedan',
  },
]

const benefits = [
  'Copy engineered for “car deals Edmonton”, “truck financing near me”, and “same day test drive”.',
  'Structured data blocks align with Google Helpful Content updates and dealer schema.',
  'Lead capture reinforced with service-level promise and social proof above the fold.',
]

const seoPillars = [
  'Downtown Edmonton',
  'Sherwood Park',
  'St. Albert',
  'Spruce Grove',
  'Fort Saskatchewan',
  'South Edmonton Common',
  'West Edmonton Mall Auto Row',
  'Nisku & Leduc',
]

const testimonials = [
  {
    name: 'Jordan M.',
    quote: 'Four test drives scheduled within 48 hours and every dealer came prepared with financing. The process felt concierge-level.',
    rating: 5,
  },
  {
    name: 'Priya K.',
    quote: 'Our family found a hybrid SUV without calling five stores. The Edmonton-first copy built trust instantly.',
    rating: 5,
  },
]

const heroImageUrl =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-lynxexotics-3802510.jpg-zWCJEcmVKByRkAyQ6bqKs37jZAckM1.jpeg'

export default function EdmontonCarsTemplate() {
  useEffect(() => {
    document.title = 'Edmonton Cars | Auto Lead Generation Funnel'
  }, [])

  return (
    <main className="edm-page">
      <header className="edm-nav" id="home">
        <div className="edm-nav__inner">
          <a href="https://edmonton-cars.ca" target="_blank" rel="noopener noreferrer" className="edm-brand">
            <span>Edmonton</span>Cars
          </a>
          <nav className="edm-nav__links">
            {navLinks.map(link => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="edm-nav__cta">
            <span>Talk to an advisor</span>
            <a href="tel:1-780-555-0199">
              <Phone /> 780-555-0199
            </a>
          </div>
        </div>
      </header>

      <section className="edm-hero" aria-labelledby="edm-hero-heading">
        <div className="edm-hero__media" aria-hidden="true">
          <img src={heroImageUrl} alt="" loading="lazy" />
        </div>
        <div className="edm-hero__inner">
          <div className="edm-hero__content">
            <span className="edm-tagline">
              <MapPin />
              Edmonton & Area
            </span>
            <h1 id="edm-hero-heading">Drive home sooner with Edmonton Cars.</h1>
            <p>
              Build a high-converting funnel that mirrors Go Auto’s polished experience while keeping your brand and
              SEO authority. Showcase live inventory, instant financing, and concierge service on one modern page.
            </p>
            <ul className="edm-hero__highlights">
              {heroHighlights.map(item => (
                <li key={item}>
                  <CheckCircle2 />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="edm-leadcard">
            <header>
              <h2>Book your test drive</h2>
              <span>Average reply 47 minutes</span>
            </header>
            <form className="edm-form">
              <label htmlFor="lead-name">Full name</label>
              <input id="lead-name" type="text" placeholder="Jordan Carter" autoComplete="name" />

              <div className="edm-form__row">
                <div>
                  <label htmlFor="lead-phone">Phone</label>
                  <input id="lead-phone" type="tel" placeholder="780-555-0123" autoComplete="tel" />
                </div>
                <div>
                  <label htmlFor="lead-email">Email</label>
                  <input id="lead-email" type="email" placeholder="you@example.com" autoComplete="email" />
                </div>
              </div>

              <label htmlFor="lead-needs">Vehicle goals</label>
              <textarea
                id="lead-needs"
                rows={3}
                placeholder="Crew cab truck under $650 bi-weekly. Open to certified pre-owned."
              />

              <div className="edm-form__row">
                <div className="edm-date-field">
                  <label htmlFor="lead-date">Preferred visit</label>
                  <Calendar className="edm-calendar-icon" />
                  <input id="lead-date" type="date" />
                </div>
                <div>
                  <label htmlFor="lead-credit">Credit profile</label>
                  <select id="lead-credit" defaultValue="">
                    <option value="" disabled>
                      Select one
                    </option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="rebuilding">Rebuilding</option>
                  </select>
                </div>
              </div>

              <button type="button" className="edm-primary-button">
                Submit lead <ArrowRight />
              </button>
              <p className="edm-privacy">By submitting, you agree to dealer contact via phone, SMS, or email. Opt out anytime.</p>
            </form>
          </aside>
        </div>
      </section>

      <section className="edm-section" id="services">
        <div className="edm-section__header">
          <h2>Built for metro Edmonton shoppers</h2>
          <p>Showcase the advantages of your group with clear value props, transparent pricing language, and trust cues.</p>
        </div>
        <div className="edm-feature-grid">
          {highlightItems.map(item => (
            <article key={item.title} className="edm-feature-card">
              <item.icon />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="edm-section edm-section--alt" id="process">
        <div className="edm-section__header">
          <h2>How the funnel works</h2>
          <p>Every touch point mirrors the Go Auto polish with fast follow-up and easy next steps.</p>
        </div>
        <div className="edm-process-grid">
          {steps.map(step => (
            <article key={step.title} className="edm-process-card">
              <span>{step.label}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="edm-section" id="inventory">
        <div className="edm-section__header">
          <h2>Featured Edmonton inventory</h2>
          <p>Swap in your live VINs or current incentives. Each tile is structured for SEO-rich snippets and paid retargeting.</p>
        </div>
        <div className="edm-inventory-grid">
          {inventory.map(vehicle => (
            <article key={vehicle.name} className="edm-inventory-card">
              <div className="edm-inventory-card__meta">
                <span>{vehicle.type}</span>
                <Car />
              </div>
              <h3>{vehicle.name}</h3>
              <p className="edm-inventory-card__payment">{vehicle.payment}</p>
              <ul>
                {vehicle.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button type="button" className="edm-secondary-button">
                View details
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="edm-section edm-section--alt" id="proof">
        <div className="edm-proof-grid">
          <div className="edm-proof-grid__left">
            <h2>Why this layout wins</h2>
            <ul>
              {benefits.map(benefit => (
                <li key={benefit}>
                  <CheckCircle2 />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="edm-proof-grid__right">
            {testimonials.map(testimonial => (
              <article key={testimonial.name} className="edm-testimonial-card">
                <div className="edm-stars" aria-hidden="true">
                  {[...Array(testimonial.rating)].map((_, index) => (
                    <Star key={index} />
                  ))}
                </div>
                <p>“{testimonial.quote}”</p>
                <span>{testimonial.name}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="edm-section edm-seo" id="seo">
        <div className="edm-section__header">
          <h2>SEO pillars across the Capital Region</h2>
          <p>Layer in localized CTAs and heat-map coverage to capture “near me” search volume without duplicate content.</p>
        </div>
        <div className="edm-seo-tags">
          {seoPillars.map(city => (
            <span key={city}>{city}</span>
          ))}
        </div>
      </section>

      <section className="edm-section edm-footer-cta" id="contact">
        <h2>Launch Edmonton Cars on its own domain</h2>
        <p>
          Duplicate this template to your CMS or host it as the dedicated Edmonton Cars experience. Hand it to your BDC
          and start booking more drives with the same polish local buyers expect from Go Auto.
        </p>
        <div className="edm-footer-cta__actions">
          <a href="https://edmonton-cars.ca" target="_blank" rel="noopener noreferrer" className="edm-primary-button">
            Launch site <ArrowRight />
          </a>
          <a href="tel:1-780-555-0199" className="edm-secondary-button edm-secondary-button--outline">
            Call the lead desk • 780-555-0199
          </a>
        </div>
      </section>
    </main>
  )
}
