import React from 'react';
import logoImg from '../assets/logo.png';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="5"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.117 1.526 5.845L0 24l6.335-1.502A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.785 9.785 0 01-4.99-1.37l-.358-.213-3.76.891.938-3.658-.233-.375A9.786 9.786 0 012.182 12c0-5.42 4.398-9.818 9.818-9.818 5.42 0 9.818 4.398 9.818 9.818 0 5.42-4.398 9.818-9.818 9.818z"/>
  </svg>
);

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4180ab] text-white py-8 border-t border-[#346b91]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div className="flex items-center gap-4">
          <img src={logoImg} alt="Logo" className="w-[70px] h-[70px] object-contain bg-white/10 rounded-full p-1" />
          <div>
            <h4 className="text-base font-black tracking-widest uppercase">Caraguatatuba</h4>
            <p className="text-xs font-bold text-sky-100 tracking-wider">GOVERNO MUNICIPAL</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 font-bold tracking-widest text-sm uppercase">
          <a href="https://www.caraguatatuba.sp.gov.br" target="_blank" rel="noopener noreferrer" className="hover:underline text-sky-100">
            SITE DA PREFEITURA
          </a>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <span className="text-xs font-black tracking-widest uppercase">FEEDBACK</span>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/caraguatatuba_oficial/" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
              <InstagramIcon />
            </a>
            <a href="https://www.facebook.com/prefeituradecaraguatatuba" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
              <FacebookIcon />
            </a>
            <a href="https://wa.me" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all">
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
