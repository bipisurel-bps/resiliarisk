import React, { useState, useEffect } from 'react';
import { RiskItem, KRIItem, RiskStatus, IndustryTemplate, KRIStatus } from './types/risk';
import { INITIAL_RISKS, INITIAL_KRIS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { HeroHeader } from './components/HeroHeader';
import { StatsOverview } from './components/StatsOverview';
import { HeatmapMatrix } from './components/HeatmapMatrix';
import { RcsaWorkspace } from './components/RcsaWorkspace';
import { KriTracker } from './components/KriTracker';
import { IsoAcademy } from './components/IsoAcademy';
import { RiskModal } from './components/RiskModal';
import { AuditReportModal } from './components/AuditReportModal';
import { TemplateSelector } from './components/TemplateSelector';

export const App: React.FC = () => {
  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rcsa' | 'kri' | 'academy'>('dashboard');

  // Risks Data with LocalStorage Persistence
  const [risks, setRisks] = useState<RiskItem[]>(() => {
    const saved = localStorage.getItem('resilia_risks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_RISKS;
      }
    }
    return INITIAL_RISKS;
  });

  // KRIs Data with LocalStorage Persistence
  const [kris, setKris] = useState<KRIItem[]>(() => {
    const saved = localStorage.getItem('resilia_kris');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_KRIS;
      }
    }
    return INITIAL_KRIS;
  });

  // Modals state
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<RiskItem | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedRiskId, setSelectedRiskId] = useState<string | undefined>(undefined);
  const [selectedFilterLevel, setSelectedFilterLevel] = useState<string | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('resilia_risks', JSON.stringify(risks));
  }, [risks]);

  useEffect(() => {
    localStorage.setItem('resilia_kris', JSON.stringify(kris));
  }, [kris]);

  // Force pure warm cream light theme permanently & purge stale dark settings
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('resilia_theme', 'light');
  }, []);

  // Risk Handlers
  const handleOpenNewRisk = () => {
    setEditingRisk(null);
    setIsRiskModalOpen(true);
  };

  const handleEditRisk = (risk: RiskItem) => {
    setEditingRisk(risk);
    setIsRiskModalOpen(true);
  };

  const handleSaveRisk = (
    riskData: Omit<RiskItem, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    const now = new Date().toISOString();
    if (editId) {
      setRisks(prev =>
        prev.map(r =>
          r.id === editId
            ? { ...r, ...riskData, updatedAt: now }
            : r
        )
      );
    } else {
      const newRisk: RiskItem = {
        ...riskData,
        id: `rsk-${Date.now()}`,
        createdAt: now,
        updatedAt: now,
      };
      setRisks(prev => [newRisk, ...prev]);
    }
  };

  const handleDeleteRisk = (id: string) => {
    setRisks(prev => prev.filter(r => r.id !== id));
    if (selectedRiskId === id) {
      setSelectedRiskId(undefined);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: RiskStatus) => {
    const now = new Date().toISOString();
    setRisks(prev =>
      prev.map(r => (r.id === id ? { ...r, status: newStatus, updatedAt: now } : r))
    );
  };

  // KRI Handlers
  const handleUpdateKriValue = (id: string, newValue: number) => {
    setKris(prev =>
      prev.map(kri => {
        if (kri.id !== id) return kri;

        let newStatus: KRIStatus = 'GREEN';
        if (kri.comparator === '>') {
          if (newValue < kri.redThreshold) newStatus = 'RED';
          else if (newValue < kri.amberThreshold) newStatus = 'AMBER';
        } else {
          if (newValue > kri.redThreshold) newStatus = 'RED';
          else if (newValue > kri.amberThreshold) newStatus = 'AMBER';
        }

        return {
          ...kri,
          currentValue: newValue,
          status: newStatus,
          lastUpdated: 'Baru saja',
        };
      })
    );
  };

  const handleAddNewKri = (kriData: Omit<KRIItem, 'id' | 'lastUpdated'>) => {
    const newKri: KRIItem = {
      ...kriData,
      id: `kri-${Date.now()}`,
      lastUpdated: 'Baru saja',
    };
    setKris(prev => [newKri, ...prev]);
  };

  // Template Handlers
  const handleSelectTemplate = (template: IndustryTemplate) => {
    const now = new Date().toISOString();
    const newRisks: RiskItem[] = template.risks.map((r, idx) => ({
      ...r,
      id: `rsk-${Date.now()}-${idx}`,
      createdAt: now,
      updatedAt: now,
    }));

    const newKris: KRIItem[] = template.kris.map((k, idx) => ({
      ...k,
      id: `kri-${Date.now()}-${idx}`,
      lastUpdated: 'Baru saja',
    }));

    setRisks(newRisks);
    setKris(newKris);
    setSelectedRiskId(undefined);
  };

  const handleResetData = () => {
    if (window.confirm('Reset data kembali ke contoh awal?')) {
      setRisks(INITIAL_RISKS);
      setKris(INITIAL_KRIS);
      setSelectedRiskId(undefined);
    }
  };

  const handleImportJson = (importedRisks: RiskItem[]) => {
    setRisks(importedRisks);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] transition-colors duration-300">
      
      {/* Floating Glass Pill Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewRisk={handleOpenNewRisk}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        totalRisks={risks.length}
      />

      {/* Hero Header Section */}
      <HeroHeader
        onOpenNewRisk={handleOpenNewRisk}
        onOpenAcademy={() => {
          setActiveTab('academy');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onOpenReport={() => setIsReportModalOpen(true)}
        onSwitchTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        totalRisks={risks.length}
      />

      {/* Main Content Workspace */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 pb-16">
        
        {/* Executive Stats Bar */}
        <StatsOverview
          risks={risks}
          kris={kris}
          onFilterLevel={setSelectedFilterLevel}
          selectedLevel={selectedFilterLevel}
        />

        {/* Dynamic Tab Switcher Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <HeatmapMatrix
              risks={risks}
              onSelectRisk={(risk) => {
                setSelectedRiskId(risk.id);
                // Also scroll down or highlight
              }}
              selectedRiskId={selectedRiskId}
            />

            <RcsaWorkspace
              risks={risks}
              onEditRisk={handleEditRisk}
              onDeleteRisk={handleDeleteRisk}
              onSelectRisk={(risk) => setSelectedRiskId(risk.id)}
              onUpdateStatus={handleUpdateStatus}
              selectedRiskId={selectedRiskId}
            />
          </div>
        )}

        {activeTab === 'rcsa' && (
          <RcsaWorkspace
            risks={risks}
            onEditRisk={handleEditRisk}
            onDeleteRisk={handleDeleteRisk}
            onSelectRisk={(risk) => setSelectedRiskId(risk.id)}
            onUpdateStatus={handleUpdateStatus}
            selectedRiskId={selectedRiskId}
          />
        )}

        {activeTab === 'kri' && (
          <KriTracker
            kris={kris}
            onUpdateKriValue={handleUpdateKriValue}
            onAddNewKri={handleAddNewKri}
          />
        )}

        {activeTab === 'academy' && (
          <IsoAcademy />
        )}

      </main>

      {/* Modals */}
      <RiskModal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        onSave={handleSaveRisk}
        editingRisk={editingRisk}
        existingCount={risks.length}
      />

      <AuditReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        risks={risks}
        kris={kris}
        onImportJson={handleImportJson}
      />

      <TemplateSelector
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Persistent Footer */}
      <footer className="border-t border-stone-200/90 dark:border-slate-800/60 py-8 text-center text-xs text-slate-500 font-medium">
        <p>
          Resilia — Enterprise Operational Risk &amp; RCSA Studio | Sesuai Standar ISO 31000:2018 &amp; Basel II
        </p>
      </footer>

    </div>
  );
};

export default App;
