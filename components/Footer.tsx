import React from 'react'

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-navy border-t border-white/5">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-copper/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-copper to-copper-dark flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-lg font-bold text-cream tracking-tight">KOPI JALES</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Premium canned coffee crafted with the finest Arabica beans and a hint of Ceylon cinnamon. Experience coffee like never before.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-copper uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Product', 'Features', 'About Us'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-white/50 hover:text-copper-light transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-copper uppercase tracking-wider mb-5">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="text-sm text-white/50">
                <span className="text-white/30">Email: </span>
                <a href="mailto:hello@kopijales.com" className="hover:text-copper-light transition-colors">hello@kopijales.com</a>
              </li>
              <li className="text-sm text-white/50">
                <span className="text-white/30">Phone: </span>
                <a href="tel:+62812345678" className="hover:text-copper-light transition-colors">+62 812-345-678</a>
              </li>
              <li className="text-sm text-white/50">
                <span className="text-white/30">Location: </span>
                Indonesia
              </li>
            </ul>
            {/* Social Icons */}
            <div className="flex gap-3 mt-6">
              {/* Instagram */}
              <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-copper/20 hover:border-copper/30 transition-all duration-300 group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50 group-hover:text-copper-light transition-colors">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* TikTok */}
              <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-copper/20 hover:border-copper/30 transition-all duration-300 group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/50 group-hover:text-copper-light transition-colors">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.48a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.17a8.16 8.16 0 004.76 1.53v-3.45a4.85 4.85 0 01-1-.56z"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="#" className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-copper/20 hover:border-copper/30 transition-all duration-300 group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-white/50 group-hover:text-copper-light transition-colors">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            © 2026 Kopi Jales. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Crafted with ☕ in Indonesia
          </p>
        </div>
      </div>
    </footer>
  )
}
