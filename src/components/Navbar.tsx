import React from 'react';
import { ArrowDown, FileDown, Plus, Shield } from 'lucide-react';
import { UserProfileMenu } from './UserProfileMenu';

interface NavbarProps {
  activeTab: 'dashboard' | 'rcsa' | 'kri' | 'academy';
  setActiveTab: (tab: 'dashboard' | 'rcsa' | 'kri' | 'academy') => void;
  onOpenNewRisk: () => void;
  onOpenReport: () => void;
  onOpenTemplates: () => void;
  onOpenCertificateModal: () => void;
  totalRisks: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewRisk,
  onOpenReport,
  onOpenTemplates,
  onOpenCertificateModal,
  totalRisks,
}) => {
  const showWorkspace = (tab: 'dashboard' | 'rcsa' | 'kri') => {
    setActiveTab(tab);
    window.setTimeout(() => document.getElementById('workspace-section')?.scrollIntoView({ behavior: 'smooth' }), 0);
  };

  return (
    <header className="site-nav">
      <nav className="site-nav__inner" aria-label="Navigasi utama">
        <button className="site-brand" type="button" onClick={() => { setActiveTab('academy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} aria-label="Resilia, kembali ke awal">
          <span className="site-brand__mark"><Shield aria-hidden="true" size={21} /></span>
          <span><strong>Resilia</strong><small>Belajar manajemen risiko</small></span>
        </button>
        <div className="site-nav__links">
          <button className={activeTab === 'academy' ? 'is-active' : ''} onClick={() => { setActiveTab('academy'); window.setTimeout(() => document.getElementById('academy-section')?.scrollIntoView({ behavior: 'smooth' }), 0); }}>Belajar</button>
          <button className={activeTab === 'dashboard' ? 'is-active' : ''} onClick={() => showWorkspace('dashboard')}><span className="site-nav__long">Studio risiko</span><span className="site-nav__short">Studio</span></button>
          <details className="site-nav__more">
            <summary><span className="site-nav__long">Perangkat</span><span className="site-nav__short">Alat</span><ArrowDown aria-hidden="true" size={14} /></summary>
            <div className="site-nav__menu">
              <button onClick={(event) => { event.currentTarget.closest('details')?.removeAttribute('open'); showWorkspace('rcsa'); }}>RCSA <span>{totalRisks} risiko</span></button>
              <button onClick={(event) => { event.currentTarget.closest('details')?.removeAttribute('open'); showWorkspace('kri'); }}>Indikator risiko (KRI)</button>
              <button onClick={(event) => { event.currentTarget.closest('details')?.removeAttribute('open'); onOpenTemplates(); }}>Contoh industri</button>
              <button onClick={(event) => { event.currentTarget.closest('details')?.removeAttribute('open'); onOpenReport(); }}>Ekspor laporan</button>
            </div>
          </details>
        </div>
        <div className="site-nav__actions">
          {activeTab !== 'academy' && <button className="site-nav__tool" onClick={onOpenNewRisk}><Plus aria-hidden="true" size={16} /> <span>Tambah RCSA</span></button>}
          <UserProfileMenu
            onOpenCertificate={onOpenCertificateModal}
            onOpenAcademy={() => { setActiveTab('academy'); window.setTimeout(() => document.getElementById('academy-section')?.scrollIntoView({ behavior: 'smooth' }), 0); }}
          />
        </div>
      </nav>
    </header>
  );
};
