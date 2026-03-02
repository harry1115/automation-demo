import React, { useState } from 'react';
import { AgentSimulation } from './AgentSimulation';
import { RunResults, RunLog, mockLogs } from './RunResults';
import { LayoutDashboard, List, ArrowLeft, Download, RefreshCw, Power } from 'lucide-react';

interface AutomationDetailProps {
  automationName: string;
  onBack: () => void;
}

export const AutomationDetail: React.FC<AutomationDetailProps> = ({ automationName, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs'>('overview');
  const [logs] = useState<RunLog[]>(mockLogs);
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              {automationName}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                isEnabled 
                  ? 'bg-violet-50 text-violet-600 border-violet-100' 
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {isEnabled ? '运行中' : '已暂停'}
              </span>
            </h2>
            <p className="text-xs text-slate-500">上次运行: 2 分钟前</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Toggle Switch */}
           <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
             <span className="text-xs font-medium text-slate-600">自动化开关</span>
             <button 
               onClick={() => setIsEnabled(!isEnabled)}
               className={`relative w-10 h-5 rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                 isEnabled ? 'bg-violet-600' : 'bg-slate-300'
               }`}
             >
               <span 
                 className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${
                   isEnabled ? 'translate-x-5' : 'translate-x-0'
                 }`}
               />
             </button>
           </div>

           <div className="flex bg-slate-100 p-1 rounded-lg">
             <button
               onClick={() => setActiveTab('overview')}
               className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                 activeTab === 'overview' 
                   ? 'bg-white text-violet-600 shadow-sm' 
                   : 'text-slate-500 hover:text-slate-700'
               }`}
             >
               <LayoutDashboard size={16} />
               概览
             </button>
             <button
               onClick={() => setActiveTab('logs')}
               className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                 activeTab === 'logs' 
                   ? 'bg-white text-violet-600 shadow-sm' 
                   : 'text-slate-500 hover:text-slate-700'
               }`}
             >
               <List size={16} />
               日志
             </button>
           </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'overview' && <AgentSimulation logs={logs} />}
        {activeTab === 'logs' && <RunResults automationName={automationName} embedded={true} logs={logs} />}
      </div>
    </div>
  );
};
