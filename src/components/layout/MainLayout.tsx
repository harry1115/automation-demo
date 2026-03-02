import React, { useState } from 'react';
import { ChatModule } from '../chat/ChatModule';
import { AutomationModule } from '../automation/AutomationModule';
import { CandidateList } from '../candidates/CandidateList';
import { AutomationDetail } from '../automation/AutomationDetail';
import { AgentSimulation } from '../automation/AgentSimulation';
import { Layout, ListTodo, ChevronRight } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const [activeLeftModule, setActiveLeftModule] = useState<'chat' | 'automation'>('chat');
  const [selectedAutomation, setSelectedAutomation] = useState<string | null>(null);
  const [rightPanelView, setRightPanelView] = useState<'candidates' | 'automation-results' | 'automation-create'>('candidates');

  const handleAutomationSelect = (automationId: string, automationName: string) => {
    setSelectedAutomation(automationName);
    setRightPanelView('automation-results');
  };

  const handleCreateAutomation = () => {
    setSelectedAutomation(null);
    setRightPanelView('automation-create');
  };

  const handleModuleSwitch = (module: 'chat' | 'automation') => {
    setActiveLeftModule(module);
    if (module === 'chat') {
      setSelectedAutomation(null);
      setRightPanelView('candidates');
    }
  };

  const renderRightPanel = () => {
    switch (rightPanelView) {
      case 'automation-results':
        return selectedAutomation ? (
          <AutomationDetail 
            automationName={selectedAutomation} 
            onBack={() => {
              setSelectedAutomation(null);
              setRightPanelView('candidates');
            }} 
          />
        ) : null;
      case 'automation-create':
        return <AgentSimulation isCreating={true} />;
      case 'candidates':
      default:
        return <CandidateList />;
    }
  };


  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Navigation (Left Panel) */}
      <div className="w-[400px] flex flex-col border-r border-slate-200 bg-white shadow-xl z-20">
        
        {/* Module Content Area */}
        <div className="flex-1 overflow-hidden relative bg-slate-50/50">
          {activeLeftModule === 'chat' ? (
            <ChatModule onSwitchToAutomation={() => handleModuleSwitch('automation')} />
          ) : (
            <AutomationModule 
              onSelectAutomation={handleAutomationSelect} 
              onCreateAutomation={handleCreateAutomation}
              onBack={() => handleModuleSwitch('chat')}
            />
          )}
        </div>
      </div>

      {/* Main Content (Right Panel) */}
      <div className="flex-1 flex overflow-hidden bg-slate-50">
        {/* Central Workspace */}
        <div className="flex-1 overflow-hidden flex flex-col relative bg-white m-4 rounded-xl shadow-sm border border-slate-200">
            {renderRightPanel()}
        </div>
      </div>
    </div>
  );
};
