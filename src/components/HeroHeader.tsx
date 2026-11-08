import React from 'react';
import { ArrowDown, ArrowUpRight, BookOpen, Mail } from 'lucide-react';

interface HeroHeaderProps {
  onOpenAcademy: () => void;
  onOpenStudio: () => void;
}

export const HeroHeader: React.FC<HeroHeaderProps> = ({ onOpenAcademy, onOpenStudio }) => (
  <>
    <section className="learning-hero">
      <div className="learning-hero__copy">
        <h1 data-reveal>Pahami risiko. Pilih arah.</h1>
        <p className="learning-hero__intro" data-reveal data-reveal-delay="1">
          Pelajari cara mengenali ketidakpastian, menilai dampaknya, dan memilih tindakan yang masuk akal—dengan konsep yang runtut dan contoh yang dekat dengan pekerjaan.
        </p>
        <div className="learning-hero__actions" data-reveal data-reveal-delay="2">
          <button type="button" className="button-primary" onClick={onOpenAcademy}>
            <BookOpen aria-hidden="true" size={18} /> Mulai jalur belajar <ArrowUpRight aria-hidden="true" size={17} />
          </button>
          <a className="button-text" href="#jalur-belajar">Lihat yang akan dipelajari <ArrowDown aria-hidden="true" size={16} /></a>
        </div>
        <p className="learning-hero__note" data-reveal data-reveal-delay="3">Konsep dasar · Studi kasus · Simulasi keputusan</p>
      </div>

      <figure className="risk-illustration" role="group" aria-labelledby="risk-example-title" data-reveal data-reveal-delay="1">
        <h2 className="risk-illustration__heading" id="risk-example-title">Mulai dari tujuan yang ingin dijaga</h2>
        <div className="risk-chain">
          <div className="risk-chain__item">
            <span className="risk-chain__number">A</span>
            <span className="risk-chain__label">Penyebab</span>
            <strong>Proses kerja belum diuji</strong>
          </div>
          <span className="risk-chain__connector" aria-hidden="true">→</span>
          <div className="risk-chain__item risk-chain__item--event">
            <span className="risk-chain__number">B</span>
            <span className="risk-chain__label">Peristiwa</span>
            <strong>Data tidak tersinkron</strong>
          </div>
          <span className="risk-chain__connector" aria-hidden="true">→</span>
          <div className="risk-chain__item risk-chain__item--impact">
            <span className="risk-chain__number">C</span>
            <span className="risk-chain__label">Dampak</span>
            <strong>Layanan terlambat</strong>
          </div>
        </div>
        <div className="risk-illustration__question">
          <span className="risk-illustration__dot" aria-hidden="true" />
          <p><strong>Pertanyaan manajerial</strong><br />Tindakan mana yang paling melindungi tujuan?</p>
          <span className="risk-illustration__arrow" aria-hidden="true">↗</span>
        </div>
        <figcaption className="risk-illustration__caption">Contoh sederhana untuk latihan, bukan penilaian risiko organisasi.</figcaption>
      </figure>
    </section>

    <section id="jalur-belajar" className="learning-intro" aria-labelledby="learning-intro-title">
      <div className="learning-intro__heading">
        <h2 id="learning-intro-title" data-reveal>Dari memahami konsep ke memilih tindakan.</h2>
        <p data-reveal data-reveal-delay="1">Belajar manajemen risiko seharusnya membantu kita berpikir lebih jernih, bukan sekadar mengisi formulir.</p>
      </div>
      <div className="learning-steps">
        <article data-reveal><h3>Pahami konteks</h3><p>Kenali tujuan, lingkungan, dan hal yang dapat menghambat hasil.</p></article>
        <article data-reveal data-reveal-delay="1"><h3>Uraikan risiko</h3><p>Hubungkan penyebab, peristiwa, dan dampak dengan bahasa yang jelas.</p></article>
        <article data-reveal data-reveal-delay="2"><h3>Nilai pilihan</h3><p>Bandingkan kemungkinan, konsekuensi, dan kecukupan pengendalian.</p></article>
        <article data-reveal data-reveal-delay="3"><h3>Tentukan respons</h3><p>Pilih tindakan, tetapkan pemiliknya, lalu pantau apakah hasilnya tercapai.</p></article>
      </div>
    </section>

    <section className="learning-invite" aria-labelledby="learning-invite-title">
      <div data-reveal>
        <h2 id="learning-invite-title">Bawa diskusi risiko ke dalam pekerjaan sehari-hari.</h2>
        <p>Resilia dikembangkan oleh Bipi Surel untuk membahas dasar manajemen risiko, penerapan ISO 31000, analisis risiko, RCSA, dan indikator risiko. Hubungi pengelola untuk membicarakan sesi belajar atau training bagi tim Anda.</p>
      </div>
      <div className="learning-invite__actions" data-reveal data-reveal-delay="1">
        <a className="button-primary button-primary--light" href="mailto:bipi.surel@gmail.com?subject=Diskusi%20Training%20Manajemen%20Risiko&body=Halo%2C%20saya%20ingin%20membicarakan%20kebutuhan%20belajar%20atau%20training%20manajemen%20risiko%20untuk%20tim%20kami.">
          <Mail aria-hidden="true" size={17} /> Diskusikan training
        </a>
        <button type="button" className="learning-invite__secondary" onClick={onOpenStudio}>Jelajahi alat praktik <ArrowUpRight aria-hidden="true" size={16} /></button>
      </div>
    </section>
  </>
);
