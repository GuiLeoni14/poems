import { BsGithub, BsInstagram, BsLinkedin, BsWhatsapp } from 'react-icons/bs';
export function Footer() {
  return (
    <footer>
      <div className="container mx-auto w-full max-w-6xl border-y-2 border-slate-200 py-20">
        <h2 className="mb-4 text-center font-sans text-3xl font-semibold tracking-tighter text-slate-800 last:mb-0 dark:text-slate-200 md:text-4xl">
          Você é mais forte do que imagina...
        </h2>
        <p className="mx-auto mb-4 block max-w-[600px] text-center text-lg italic text-slate-500 last:mb-0 dark:text-slate-300">
          Projeto desenvolvido em um final de semana mas com palavras e emoções que levarei para a vida toda.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            className="transition-all hover:scale-105"
            href="https://www.linkedin.com/in/guileoni14/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsLinkedin className="dar:text-slate-100 text-slate-500" size={24} />
          </a>
          <a
            className="transition-all hover:scale-105"
            href="https://www.instagram.com/gui_leoni14/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsInstagram className="dar:text-slate-100 text-slate-500" size={24} />
          </a>
          <a className="transition-all hover:scale-105" href="http://" target="_blank" rel="noopener noreferrer">
            <BsWhatsapp className="dar:text-slate-100 text-slate-500" size={24} />
          </a>
          <a
            className="transition-all hover:scale-105"
            href="https://github.com/GuiLeoni14/poems"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsGithub className="dar:text-slate-100 text-slate-500" size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}
