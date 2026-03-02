import React, { useState } from 'react';
import { Plus, Pause, AlertCircle, CheckCircle, ChevronLeft, Clock, Activity, Zap, Layers } from 'lucide-react';

interface RunLog {
  id: string;
  status: 'success' | 'failure';
  timestamp: string;
  message: string;
}

interface Automation {
  id: string;
  name: string;
  type: 'trigger' | 'batch';
  status: 'normal' | 'abnormal' | 'paused' | 'running';
  lastRun?: string;
  description: string;
  logs: RunLog[];
}

const mockAutomations: Automation[] = [
  { 
    id: '1', 
    name: '简历推荐邮件通知', 
    type: 'trigger', 
    status: 'normal', 
    lastRun: '2分钟前',
    description: '当候选人状态变更为“简历推荐”时发送邮件',
    logs: []
  },
  { 
    id: '2', 
    name: '批量拒绝初级候选人', 
    type: 'batch', 
    status: 'paused', 
    lastRun: '1天前',
    description: '拒绝所有“新申请”阶段且经验少于2年的候选人',
    logs: []
  },
  { 
    id: '3', 
    name: '周报生成', 
    type: 'trigger', 
    status: 'running', 
    lastRun: '运行中...',
    description: '每周五下午5点生成招聘周报',
    logs: []
  },
];

interface AutomationModuleProps {
  onSelectAutomation: (id: string, name: string) => void;
  onCreateAutomation: () => void;
  onBack: () => void;
}

export const AutomationModule: React.FC<AutomationModuleProps> = ({ onSelectAutomation, onCreateAutomation, onBack }) => {
  const [automations] = useState<Automation[]>(mockAutomations);

  const getStatusIcon = (status: Automation['status']) => {
    switch (status) {
      case 'normal': return <CheckCircle className="text-emerald-500 w-4 h-4" />;
      case 'abnormal': return <AlertCircle className="text-rose-500 w-4 h-4" />;
      case 'paused': return <Pause className="text-slate-400 w-4 h-4" />;
      case 'running': return <Activity className="text-violet-500 w-4 h-4 animate-spin" />;
    }
  };

  const getStatusText = (status: Automation['status']) => {
    switch (status) {
      case 'normal': return <span className="text-emerald-600">正常运行</span>;
      case 'abnormal': return <span className="text-rose-600">异常</span>;
      case 'paused': return <span className="text-slate-500">已暂停</span>;
      case 'running': return <span className="text-violet-600">运行中</span>;
    }
  };

  const renderList = () => (
    <div className="space-y-4 p-4 h-full overflow-y-auto bg-slate-50/50">
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
            <ChevronLeft size={20} />
          </button>
          <h3 className="font-bold text-slate-800 text-lg tracking-tight">自动化任务</h3>
        </div>
        <button 
          onClick={onCreateAutomation}
          className="flex items-center gap-1.5 text-xs bg-violet-600 text-white px-3 py-2 rounded-lg hover:bg-violet-700 transition-all shadow-lg shadow-violet-200 font-bold uppercase tracking-wide"
        >
          <Plus size={14} strokeWidth={3} /> 新建任务
        </button>
      </div>
      
      {automations.map(auto => (
        <div 
          key={auto.id} 
          onClick={() => onSelectAutomation(auto.id, auto.name)}
          className="group relative p-5 border border-transparent rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer bg-white hover:border-violet-100 overflow-hidden"
        >
          {/* Left accent bar */}
          <div className="absolute top-0 left-0 w-1 h-full bg-violet-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div className="pl-1">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-800 group-hover:text-violet-700 transition-colors text-base flex items-center gap-2">
                {auto.name}
              </h3>
              <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wide flex items-center gap-1 ${
                auto.type === 'trigger' ? 'bg-sky-50 text-sky-600' : 'bg-fuchsia-50 text-fuchsia-600'
              }`}>
                {auto.type === 'trigger' ? <Zap size={10} fill="currentColor" /> : <Layers size={10} fill="currentColor" />}
                {auto.type === 'trigger' ? 'TRIGGER' : 'BATCH'}
              </span>
            </div>
            
            <p className="text-xs text-slate-500 mb-5 line-clamp-2 leading-relaxed font-medium">{auto.description}</p>
            
            <div className="flex items-center justify-between text-xs pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2">
                  {getStatusIcon(auto.status)}
                  <span className="font-bold text-slate-600">{getStatusText(auto.status)}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400 font-medium">
                <Clock size={12} />
                <span>{auto.lastRun || '从未运行'}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-full bg-slate-50 border-r border-slate-200">
      {renderList()}
    </div>
  );
};
