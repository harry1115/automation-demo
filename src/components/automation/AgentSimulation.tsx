import React, { useState } from 'react';
import { 
  Activity, Zap, Play, CheckCircle2, Plus, Trash2, 
  ChevronDown, Calendar, User, Mail, Link, Monitor, X,
  FileText, Users, Settings, CheckSquare, Square
} from 'lucide-react';
import { RunLog } from './RunResults';
import { CandidateList, mockCandidates } from '../candidates/CandidateList';
import { mockTasks } from '../tasks/TaskList';

export const ProjectCandidateList: React.FC<{
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}> = ({ selectedIds, onSelectionChange }) => {
  
  const grouped = React.useMemo(() => {
    const groups: Record<string, typeof mockCandidates> = {};
    mockCandidates.forEach(c => {
      // Filter out hired/rejected
      if (['hired', 'rejected'].includes(c.status)) return;
      
      if (!groups[c.role]) groups[c.role] = [];
      groups[c.role].push(c);
    });
    return groups;
  }, []);

  const [expandedRoles, setExpandedRoles] = useState<string[]>(Object.keys(grouped));

  const toggleRole = (role: string) => {
    setExpandedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const toggleSelectRole = (role: string) => {
    const roleIds = grouped[role].map(c => c.id);
    const allSelected = roleIds.every(id => selectedIds.includes(id));
    
    if (allSelected) {
      onSelectionChange(selectedIds.filter(id => !roleIds.includes(id)));
    } else {
      // Add missing ones
      const newIds = [...selectedIds];
      roleIds.forEach(id => {
        if (!newIds.includes(id)) newIds.push(id);
      });
      onSelectionChange(newIds);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <h3 className="font-bold text-slate-700">项目/职位列表</h3>
        <span className="text-xs text-slate-500">共 {Object.keys(grouped).length} 个职位，{Object.values(grouped).flat().length} 位候选人</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(grouped).map(([role, candidates]) => {
          const isExpanded = expandedRoles.includes(role);
          const isAllSelected = candidates.every(c => selectedIds.includes(c.id));
          const isPartialSelected = candidates.some(c => selectedIds.includes(c.id)) && !isAllSelected;

          return (
            <div key={role} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <div className="flex items-center p-3 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleRole(role)}>
                 <button 
                   onClick={(e) => { e.stopPropagation(); toggleSelectRole(role); }}
                   className={`mr-3 p-1 rounded hover:bg-slate-200 ${isAllSelected ? 'text-violet-600' : isPartialSelected ? 'text-violet-400' : 'text-slate-300'}`}
                 >
                   {isAllSelected ? <CheckSquare size={18} /> : isPartialSelected ? <div className="w-[18px] h-[18px] border-2 border-current rounded flex items-center justify-center"><div className="w-2.5 h-2.5 bg-current rounded-sm" /></div> : <Square size={18} />}
                 </button>
                 <div className="flex-1 font-bold text-slate-700 flex items-center gap-2">
                   {role}
                   <span className="px-2 py-0.5 bg-white border border-slate-200 rounded-full text-xs text-slate-500 font-medium">{candidates.length}</span>
                 </div>
                 <ChevronDown size={16} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </div>
              
              {isExpanded && (
                <div className="divide-y divide-slate-100 border-t border-slate-100">
                  {candidates.map(c => (
                    <div key={c.id} className="flex items-center p-3 pl-10 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => toggleSelect(c.id)}>
                      <button className={`mr-3 ${selectedIds.includes(c.id) ? 'text-violet-600' : 'text-slate-300'}`}>
                        {selectedIds.includes(c.id) ? <CheckSquare size={16} /> : <Square size={16} />}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-700 text-sm">{c.name}</span>
                          <span className={`px-1.5 py-0.5 text-[10px] rounded border ${
                            c.status === 'new' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                            c.status === 'interviewing' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                            'bg-emerald-50 text-emerald-600 border-emerald-100'
                          }`}>
                            {c.status === 'new' ? '新候选人' : c.status === 'interviewing' ? '面试中' : '已发Offer'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 flex gap-3">
                           <span>匹配度: <span className={`font-bold ${c.matchScore >= 90 ? 'text-emerald-600' : 'text-slate-700'}`}>{c.matchScore}%</span></span>
                           <span>更新于 {c.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AgentSimulation: React.FC<{ logs?: RunLog[], isCreating?: boolean }> = ({ logs, isCreating = false }) => {
  // --- Bot Analysis State ---
  
  // --- Bot Settings State ---
  // Trigger
  const [triggerMode, setTriggerMode] = useState<'event' | 'manual'>('event'); // 'event' = Trigger, 'manual' = Batch
  const [triggerEvent, setTriggerEvent] = useState('创建任务');
  const [creator, setCreator] = useState('');
  const [conditions, setConditions] = useState<{field: string, operator: string, value: string}[]>([]);
  
  // Batch Mode State
  const [selectedSource, setSelectedSource] = useState<'candidates' | 'tasks'>('candidates');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  
  // Action State
  const [actionType, setActionType] = useState<'email' | 'report' | 'matching'>('email');

  // Email Action
  const [notifyTarget, setNotifyTarget] = useState('candidate');
  const [senderEmail, setSenderEmail] = useState('hr_tip@mesoor.com');
  const [senderName, setSenderName] = useState('麦穗TIP人才智能平台');
  const [emailSubject, setEmailSubject] = useState('来自麦穗TIP人才智能平台的邮件');
  const [emailUsername, setEmailUsername] = useState('hr_tip@mesoor.com');
  const [emailPort, setEmailPort] = useState('465');
  const [emailSSL, setEmailSSL] = useState(true);
  const [emailContent, setEmailContent] = useState(
    '# 简历名称 你好，\n\n恭喜你通过我司 # 职位名称 的简历筛选阶段，现邀请你参加我司一面，\n\n面试时间：\n面试地点：\n\n期待你的到来。'
  );

  // Stats Calculation & Mock Data Generation
  const generateMockData = () => {
    const data = [];
    const today = new Date();
    let totalCount = 0;
    let totalDuration = 0;
    let weightedSuccessSum = 0;

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = `${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
      
      // Random realistic values with some variance
      const baseCount = 150 + Math.floor(Math.random() * 100); 
      const count = baseCount;
      const successRate = 92 + Math.random() * 8; // 92-100%
      const duration = 45 + Math.floor(Math.random() * 30); // 45-75s

      data.push({
        date: dateStr,
        count,
        success: Math.min(100, Math.floor(successRate)),
        duration
      });

      totalCount += count;
      totalDuration += duration * count;
      weightedSuccessSum += successRate * count;
    }

    const avgSuccess = Math.round(weightedSuccessSum / totalCount);
    const avgDur = Math.round(totalDuration / totalCount);

    return { 
      data, 
      stats: { 
        total: totalCount, 
        successRate: avgSuccess, 
        avgDuration: avgDur 
      } 
    };
  };

  const { data: mockChartData, stats: mockStats } = React.useMemo(() => generateMockData(), []);

  const parseDuration = (dur: string) => {
    const parts = dur.match(/(\d+)m\s*(\d+)s/);
    if (parts) return parseInt(parts[1]) * 60 + parseInt(parts[2]);
    return 0;
  };

  const stats = logs && logs.length > 0 && false ? { // Force using mockStats for demo
    total: logs!.length,
    successRate: Math.round((logs!.filter(l => l.status === 'success').length / logs!.length) * 100),
    avgDuration: Math.round(logs!.reduce((acc, curr) => acc + parseDuration(curr.duration), 0) / logs!.length),
  } : mockStats;

  const chartData = mockChartData; // In a real app, we'd aggregate logs by date here
  const maxCount = Math.max(...chartData.map(d => d.count), 1);
  const maxDuration = Math.max(...chartData.map(d => d.duration), 1);

  const addCondition = () => {
    setConditions([...conditions, { field: '', operator: '', value: '' }]);
  };

  const removeCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    setConditions(newConditions);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
        {/* --- Top Section: Bot Analysis --- */}
        {!isCreating && (
        <div className="p-6 pb-2 flex-none">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-violet-100 text-violet-600 rounded-lg">
                <Activity size={16} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Bot 分析</h3>
            </div>
            
            {/* Date Filter */}
            <div className="relative">
              <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                <Calendar size={14} />
                <span>最近7天</span>
                <ChevronDown size={12} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Chart 1: Run Count */}
            <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-100">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-xs text-slate-500 font-semibold mb-1">运行次数趋势</div>
                  <div className="text-2xl font-bold text-slate-800">{stats.total} <span className="text-xs font-normal text-slate-400">次</span></div>
                </div>
              </div>
              <div className="h-32 flex justify-between gap-2">
                {chartData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                    <div className="w-full flex-1 flex items-end justify-center relative">
                      <div 
                        className="w-full bg-violet-200 rounded-t-sm hover:bg-violet-400 transition-all relative group shadow-[0_4px_0_0_rgba(139,92,246,0.1)]"
                        style={{ height: `${(d.count / maxCount) * 100}%` }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                          {d.count}次
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 transform scale-90 font-medium">{d.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Success Rate */}
            <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-100">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-xs text-slate-500 font-semibold mb-1">成功占比</div>
                  <div className="text-2xl font-bold text-emerald-600">{stats.successRate}%</div>
                </div>
              </div>
              <div className="h-32 flex justify-between gap-2">
                {chartData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                    <div className="w-full flex-1 flex items-end justify-center relative">
                      <div 
                        className="w-full bg-emerald-200 rounded-t-sm hover:bg-emerald-400 transition-all relative group shadow-[0_4px_0_0_rgba(16,185,129,0.1)]"
                        style={{ height: `${d.success}%` }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                          {d.success}%
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 transform scale-90 font-medium">{d.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 3: Duration */}
            <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-100">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <div className="text-xs text-slate-500 font-semibold mb-1">平均耗时 (秒)</div>
                  <div className="text-2xl font-bold text-slate-800">{stats.avgDuration} <span className="text-xs font-normal text-slate-400">s</span></div>
                </div>
              </div>
              <div className="h-32 flex justify-between gap-2">
                {chartData.map((d, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                    <div className="w-full flex-1 flex items-end justify-center relative">
                      <div 
                        className="w-full bg-blue-200 rounded-t-sm hover:bg-blue-400 transition-all relative group shadow-[0_4px_0_0_rgba(59,130,246,0.1)]"
                        style={{ height: `${(d.duration / maxDuration) * 100}%` }}
                      >
                         <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-lg">
                          {d.duration}s
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 transform scale-90 font-medium">{d.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* --- Middle Section: Bot Settings --- */}
      <div className="px-6 pb-6 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-4 mt-4 flex-none">
           <div className="p-1 bg-slate-200/50 text-slate-500 rounded-md">
             <Settings size={14} />
           </div>
           <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Bot 设置</h2>
        </div>
        
        <div className="flex gap-6 flex-1 min-h-[600px]">
          {/* Left Column: Trigger */}
          <div className="w-1/3 flex flex-col gap-4 h-full">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
               {/* Trigger Header with Mode Toggle */}
               <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between flex-none">
                 <div className="flex items-center gap-2">
                   <div className={`p-1.5 rounded-md ${triggerMode === 'event' ? 'bg-blue-100 text-blue-600' : 'bg-fuchsia-100 text-fuchsia-600'}`}>
                     {triggerMode === 'event' ? <Zap size={16} /> : <Activity size={16} />}
                   </div>
                   <h3 className="font-bold text-slate-800 text-sm">
                     {triggerMode === 'event' ? '自动触发' : '手动触发'}
                   </h3>
                 </div>
                 
                 {/* Mode Toggle */}
                 <div className="flex bg-slate-200/80 rounded-lg p-1 gap-1">
                   <button 
                     onClick={() => setTriggerMode('event')}
                     className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${triggerMode === 'event' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                   >
                     <Zap size={12} className={triggerMode === 'event' ? 'fill-current' : 'opacity-50'} />
                     自动
                   </button>
                   <button 
                     onClick={() => setTriggerMode('manual')}
                     className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${triggerMode === 'manual' ? 'bg-white text-fuchsia-600 shadow-sm ring-1 ring-black/5' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                   >
                     <Activity size={12} className={triggerMode === 'manual' ? 'fill-current' : 'opacity-50'} />
                     手动
                   </button>
                 </div>
               </div>
               
               <div className="p-5 space-y-6 overflow-y-auto flex-1">
                 {triggerMode === 'event' ? (
                   <>
                     {/* Existing Trigger Content */}
                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">当下列事件发生时</label>
                       <div className="relative">
                         <select 
                           value={triggerEvent}
                           onChange={(e) => setTriggerEvent(e.target.value)}
                           className="w-full p-2.5 pl-9 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-violet-500 appearance-none"
                         >
                           <option>创建任务</option>
                           <option>更新任务</option>
                           <option>删除任务</option>
                         </select>
                         <Zap size={14} className="absolute left-3 top-3 text-slate-400" />
                         <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                       </div>
                     </div>

                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">创建人</label>
                       <div className="relative">
                         <input 
                           type="text"
                           value={creator}
                           onChange={(e) => setCreator(e.target.value)}
                           placeholder="(任意创建人)"
                           className="w-full p-2.5 pl-9 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-violet-500 placeholder:text-slate-400"
                         />
                         <User size={14} className="absolute left-3 top-3 text-slate-400" />
                       </div>
                     </div>

                     <div>
                       <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">满足条件</label>
                       <div className="space-y-2 mb-3">
                         {conditions.map((_, idx) => (
                           <div key={idx} className="flex gap-2 items-center">
                             <div className="h-8 bg-slate-100 rounded flex-1 border border-slate-200"></div>
                             <button onClick={() => removeCondition(idx)} className="text-red-400 hover:text-red-600">
                               <Trash2 size={14} />
                             </button>
                           </div>
                         ))}
                       </div>
                       <button 
                         onClick={addCondition}
                         className="w-full py-2 border border-dashed border-violet-300 bg-violet-50 text-violet-600 rounded-lg text-sm font-medium hover:bg-violet-100 transition-colors flex items-center justify-center gap-1"
                       >
                         <Plus size={14} /> 增加条件
                       </button>
                     </div>
                   </>
                 ) : (
                   /* Batch Mode Content */
                  <div className="space-y-6">
                    {/* Source Selection */}
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">选择数据源</label>
                      <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                          onClick={() => {
                            if (isCreating) {
                              setSelectedSource('candidates');
                              setSelectedItems([]);
                            }
                          }}
                          disabled={!isCreating}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                            selectedSource === 'candidates' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                          } ${!isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          人才列表
                        </button>
                        <button
                          onClick={() => {
                            if (isCreating) {
                              setSelectedSource('tasks');
                              setSelectedItems([]);
                            }
                          }}
                          disabled={!isCreating}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
                            selectedSource === 'tasks' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                          } ${!isCreating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          任务列表
                        </button>
                      </div>
                    </div>

                    {/* List Selection Summary */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block">
                          {selectedSource === 'candidates' ? '已选候选人' : '已选任务'}
                        </label>
                        <span className="text-xs font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded-full">
                          已选: {selectedItems.length}
                        </span>
                      </div>
                      
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                        {selectedItems.length > 0 ? (
                          <div className="space-y-2 mb-4">
                            {selectedItems.slice(0, 3).map(id => {
                              const item = selectedSource === 'candidates' || selectedSource === 'tasks'
                                ? mockCandidates.find(c => c.id === id) 
                                : mockTasks.find(t => t.id === id);
                              return (
                                <div key={id} className="flex items-center gap-2 text-sm text-slate-700 bg-white px-3 py-2 rounded border border-slate-100 shadow-sm">
                                  <CheckCircle2 size={14} className="text-emerald-500" />
                                  <span className="font-medium truncate flex-1">
                                    {selectedSource === 'candidates' || selectedSource === 'tasks'
                                      ? (item as any)?.name 
                                      : (item as any)?.title}
                                  </span>
                                </div>
                              );
                            })}
                            {selectedItems.length > 3 && (
                              <div className="text-xs text-slate-500 text-center pt-1">
                                ... 还有 {selectedItems.length - 3} 个项目
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-slate-400 text-sm">
                            暂无选择
                          </div>
                        )}
                        
                        <button 
                          onClick={() => setShowSelectionModal(true)}
                          className="w-full py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          {selectedItems.length > 0 ? '追加/编辑选择' : (selectedSource === 'candidates' ? '选择人才' : '选择任务')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
           </div>
         </div>

         {/* Right Column: Action Selection */}
         <div className="w-2/3 flex flex-col gap-4 h-full">
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
             <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white flex-none">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${
                    actionType === 'email' ? 'bg-violet-100 text-violet-600' :
                    actionType === 'report' ? 'bg-orange-100 text-orange-600' :
                    'bg-cyan-100 text-cyan-600'
                  }`}>
                    {actionType === 'email' ? <Mail size={16} /> : 
                     actionType === 'report' ? <FileText size={16} /> : 
                     <Users size={16} />}
                  </div>
                  {isCreating ? (
                    <div className="relative group">
                      <select 
                        value={actionType}
                        onChange={(e) => setActionType(e.target.value as any)}
                        className="appearance-none bg-transparent font-bold text-slate-800 text-sm pr-6 outline-none cursor-pointer z-10 relative"
                      >
                        <option value="email">发送邮件</option>
                        <option value="report">推荐报告Agent</option>
                        <option value="matching">人才匹配Agent</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-violet-500 transition-colors" />
                    </div>
                  ) : (
                    <h3 className="font-bold text-slate-800 text-sm">
                      {actionType === 'email' ? '发送邮件' : 
                       actionType === 'report' ? '推荐报告Agent' : 
                       '人才匹配Agent'}
                    </h3>
                  )}
                </div>
                <div className="flex items-center gap-3">
                   <button className="px-3 py-1.5 border border-violet-200 text-violet-600 rounded-lg text-xs font-bold hover:bg-violet-50 transition-colors flex items-center gap-1">
                     <Play size={12} /> 模拟运行
                   </button>
                   <button className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-bold hover:bg-violet-700 transition-colors flex items-center gap-1 shadow-sm shadow-violet-200">
                     <CheckCircle2 size={12} /> 保存并开始运行
                   </button>
                </div>
              </div>

              {/* Content Area based on Action Type */}
              {actionType === 'email' ? (
              <div className="flex flex-1 overflow-hidden">
                {/* Left Pane: Configuration (Form + Content Editor) */}
                <div className="w-7/12 p-6 border-r border-slate-100 overflow-y-auto space-y-8">
                    {/* Section 1: Basic Config */}
                    <div className="space-y-5">
                      <div>
                        <label className="text-xs font-bold text-slate-500 mb-3 block">通知对象</label>
                        <div className="flex flex-wrap gap-4">
                          {['候选人', '负责人', '项目负责人', '指定邮箱'].map((opt) => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer group">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                (notifyTarget === opt || (opt === '候选人' && notifyTarget === 'candidate')) 
                                  ? 'border-violet-600 bg-violet-600' 
                                  : 'border-slate-300 group-hover:border-violet-400'
                              }`}>
                                {(notifyTarget === opt || (opt === '候选人' && notifyTarget === 'candidate')) && (
                                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                                )}
                              </div>
                              <input 
                                type="radio" 
                                name="notifyTarget"
                                className="hidden"
                                checked={notifyTarget === opt || (opt === '候选人' && notifyTarget === 'candidate')}
                                onChange={() => setNotifyTarget(opt === '候选人' ? 'candidate' : opt)}
                              />
                              <span className={`text-sm ${
                                (notifyTarget === opt || (opt === '候选人' && notifyTarget === 'candidate'))
                                  ? 'text-slate-800 font-medium'
                                  : 'text-slate-600'
                              }`}>{opt}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1.5 block">发件人邮箱</label>
                          <input type="text" value={senderEmail} onChange={e => setSenderEmail(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1.5 block">发件人名称</label>
                          <input type="text" value={senderName} onChange={e => setSenderName(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-slate-500 mb-1.5 block">用户名</label>
                          <input type="text" value={emailUsername} onChange={e => setEmailUsername(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all" />
                        </div>
                        <div className="flex gap-4 items-end">
                          <div className="flex-1">
                            <label className="text-xs font-medium text-slate-500 mb-1.5 block">端口</label>
                            <input type="text" value={emailPort} onChange={e => setEmailPort(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all" />
                          </div>
                          <div className="flex items-center justify-end h-[42px] pb-1">
                            <label className="flex items-center gap-3 cursor-pointer group">
                              <span className="text-sm font-bold text-slate-700 group-hover:text-violet-600 transition-colors">SSL</span>
                              <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${emailSSL ? 'bg-violet-600' : 'bg-slate-200'}`} onClick={() => setEmailSSL(!emailSSL)}>
                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${emailSSL ? 'translate-x-5' : ''}`}></div>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-500 mb-1.5 block">邮件主题</label>
                        <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all" />
                      </div>
                    </div>

                    {/* Section 2: Content Editor */}
                    <div className="pt-2">
                       <div className="flex items-center justify-between mb-3">
                         <label className="text-xs font-bold text-slate-500 block">邮件内容</label>
                         {/* Toolbar */}
                         <div className="flex items-center gap-2">
                           <div className="flex items-center p-1 bg-slate-50 border border-slate-200 rounded-lg">
                             {['H1', 'H2', 'B', 'I', 'U', 'Link', 'Monitor'].map((item, i) => (
                               <button key={i} className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-white rounded-md transition-all text-xs font-bold">
                                 {item === 'Link' ? <Link size={14}/> : item === 'Monitor' ? <Monitor size={14}/> : item}
                               </button>
                             ))}
                           </div>
                           <div className="w-px h-4 bg-slate-200"></div>
                           <button className="px-2 py-1 bg-violet-50 text-violet-600 border border-violet-100 rounded-md text-xs font-bold hover:bg-violet-100 transition-colors">
                             # 变量
                           </button>
                         </div>
                       </div>

                       <textarea 
                         className="w-full h-64 p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-violet-100 focus:border-violet-500 outline-none resize-none font-mono leading-relaxed transition-all"
                         value={emailContent}
                         onChange={(e) => setEmailContent(e.target.value)}
                         placeholder="在此输入邮件内容..."
                       ></textarea>
                    </div>
                 </div>

                 {/* Right Pane: Live Preview */}
                 <div className="w-5/12 bg-slate-50/30 p-6 flex flex-col">
                   <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                     <Monitor size={14} />
                     实时预览 (Preview)
                   </div>
                   <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-sm p-6 overflow-y-auto">
                     <div className="border-b border-slate-100 pb-4 mb-4">
                       <div className="text-sm font-bold text-slate-800 mb-1.5">{emailSubject}</div>
                       <div className="text-xs text-slate-500">From: <span className="text-slate-700 font-medium">{senderName}</span> &lt;{senderEmail}&gt;</div>
                     </div>
                     <div className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                       {emailContent}
                     </div>
                   </div>
                 </div>
               </div>
               ) : actionType === 'report' ? (
                 <div className="flex-1 p-6 flex flex-col h-full">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center shadow-sm border border-orange-100">
                       <FileText size={24} />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-slate-800">推荐报告生成 Agent</h3>
                       <p className="text-xs text-slate-500">自动分析候选人简历，生成专业推荐报告</p>
                     </div>
                   </div>

                   <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
                     {/* Configuration Panel */}
                     <div className="border border-slate-200 rounded-xl p-5 space-y-6 overflow-y-auto">
                       <div className="space-y-3">
                         <label className="text-sm font-bold text-slate-700 block">选择模板</label>
                         <div className="grid grid-cols-1 gap-3">
                           <div className="p-3 border-2 border-orange-500 bg-orange-50 rounded-lg cursor-pointer relative">
                             <div className="font-bold text-slate-800 text-sm mb-1">标准推荐模板</div>
                             <div className="text-xs text-slate-600">包含核心优势、匹配度分析及面试建议</div>
                             <div className="absolute top-3 right-3 text-orange-600"><CheckCircle2 size={16} /></div>
                           </div>
                           <div className="p-3 border border-slate-200 hover:border-orange-300 bg-white rounded-lg cursor-pointer transition-colors">
                             <div className="font-bold text-slate-700 text-sm mb-1">高管推荐模板</div>
                             <div className="text-xs text-slate-500">强调领导力与战略思维的深度分析</div>
                           </div>
                         </div>
                       </div>

                       <div className="space-y-3">
                         <label className="text-sm font-bold text-slate-700 block">包含模块</label>
                         <div className="space-y-2">
                           {['核心优势总结', '职位匹配度分析', '面试建议问题', '薪资期望分析', '过往项目经历摘要'].map((item, i) => (
                             <label key={i} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded cursor-pointer">
                               <input type="checkbox" defaultChecked className="rounded text-orange-500 focus:ring-orange-500" />
                               <span className="text-sm text-slate-600">{item}</span>
                             </label>
                           ))}
                         </div>
                       </div>

                       <div className="space-y-3">
                         <label className="text-sm font-bold text-slate-700 block">输出格式</label>
                         <div className="flex gap-3">
                           <label className="flex-1 flex items-center justify-center gap-2 p-2 border border-orange-200 bg-orange-50 text-orange-700 rounded-lg cursor-pointer font-medium text-sm">
                             <input type="radio" name="format" defaultChecked className="hidden" />
                             PDF 文档
                           </label>
                           <label className="flex-1 flex items-center justify-center gap-2 p-2 border border-slate-200 text-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 font-medium text-sm">
                             <input type="radio" name="format" className="hidden" />
                             Word 文档
                           </label>
                         </div>
                       </div>
                     </div>

                     {/* Preview Panel */}
                     <div className="border border-slate-200 rounded-xl bg-slate-50 flex flex-col overflow-hidden">
                       <div className="px-4 py-3 border-b border-slate-200 bg-white flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-500 uppercase">效果预览</span>
                         <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">PDF</span>
                       </div>
                       <div className="flex-1 p-6 overflow-y-auto bg-slate-100">
                         <div className="bg-white shadow-sm p-6 min-h-[400px] w-full mx-auto max-w-[90%] text-[10px] text-slate-300 space-y-4 select-none">
                           <div className="h-4 w-1/3 bg-slate-200 rounded mb-6"></div>
                           <div className="space-y-2">
                             <div className="h-2 w-full bg-slate-100 rounded"></div>
                             <div className="h-2 w-5/6 bg-slate-100 rounded"></div>
                             <div className="h-2 w-4/5 bg-slate-100 rounded"></div>
                           </div>
                           <div className="h-20 w-full bg-slate-50 rounded border border-slate-100 p-2">
                             <div className="h-2 w-1/4 bg-slate-200 rounded mb-2"></div>
                             <div className="h-1.5 w-full bg-slate-100 rounded mb-1"></div>
                             <div className="h-1.5 w-full bg-slate-100 rounded mb-1"></div>
                           </div>
                           <div className="grid grid-cols-2 gap-2">
                             <div className="h-16 bg-slate-50 rounded border border-slate-100"></div>
                             <div className="h-16 bg-slate-50 rounded border border-slate-100"></div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="flex-1 p-6 flex flex-col h-full">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="w-12 h-12 bg-cyan-50 text-cyan-500 rounded-xl flex items-center justify-center shadow-sm border border-cyan-100">
                       <Users size={24} />
                     </div>
                     <div>
                       <h3 className="text-lg font-bold text-slate-800">人才匹配 Agent</h3>
                       <p className="text-xs text-slate-500">基于职位 JD 深度扫描，筛选高匹配度候选人</p>
                     </div>
                   </div>

                   <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
                     {/* Configuration Panel */}
                     <div className="border border-slate-200 rounded-xl p-5 space-y-6 overflow-y-auto">
                       <div className="space-y-3">
                         <div className="flex justify-between items-center">
                           <label className="text-sm font-bold text-slate-700">匹配阈值设置</label>
                           <span className="text-sm font-bold text-cyan-600">80%</span>
                         </div>
                         <input type="range" className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500" min="0" max="100" defaultValue="80" />
                         <div className="flex justify-between text-xs text-slate-400">
                           <span>宽松 (60%)</span>
                           <span>严格 (90%)</span>
                         </div>
                       </div>

                       <div className="space-y-3">
                         <label className="text-sm font-bold text-slate-700 block">权重配置</label>
                         <div className="space-y-3">
                           {[
                             { label: '技能匹配', val: 40 },
                             { label: '工作经验', val: 30 },
                             { label: '学历背景', val: 20 },
                             { label: '项目经历', val: 10 }
                           ].map((item, i) => (
                             <div key={i} className="flex items-center gap-3">
                               <span className="text-xs font-medium text-slate-600 w-16">{item.label}</span>
                               <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${item.val}%` }}></div>
                               </div>
                               <span className="text-xs text-slate-400 w-8 text-right">{item.val}%</span>
                             </div>
                           ))}
                         </div>
                       </div>

                       <div className="space-y-3">
                         <label className="text-sm font-bold text-slate-700 block">核心技能要求</label>
                         <div className="flex flex-wrap gap-2">
                           {['React', 'TypeScript', 'Node.js', '架构设计', '性能优化'].map((tag, i) => (
                             <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200 flex items-center gap-1 group cursor-pointer hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors">
                               {tag}
                               <X size={10} className="opacity-0 group-hover:opacity-100" />
                             </span>
                           ))}
                           <button className="px-2 py-1 bg-white border border-dashed border-slate-300 text-slate-400 text-xs rounded-md hover:text-cyan-600 hover:border-cyan-300 transition-colors flex items-center gap-1">
                             <Plus size={10} /> 添加
                           </button>
                         </div>
                       </div>
                     </div>

                     {/* Preview Panel */}
                     <div className="border border-slate-200 rounded-xl bg-slate-50 flex flex-col overflow-hidden">
                       <div className="px-4 py-3 border-b border-slate-200 bg-white flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-500 uppercase">匹配结果预览</span>
                         <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Top 3</span>
                       </div>
                       <div className="flex-1 p-4 overflow-y-auto space-y-3">
                         {[
                           { name: '张伟', score: 92, tags: ['React', 'TypeScript'] },
                           { name: '王强', score: 88, tags: ['Vue', 'Node.js'] },
                           { name: '李娜', score: 85, tags: ['Angular', 'Java'] }
                         ].map((c, i) => (
                           <div key={i} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3">
                             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                               {i + 1}
                             </div>
                             <div className="flex-1">
                               <div className="flex justify-between mb-1">
                                 <span className="font-bold text-slate-700 text-sm">{c.name}</span>
                                 <span className="font-bold text-cyan-600 text-sm">{c.score}%</span>
                               </div>
                               <div className="flex gap-1">
                                 {c.tags.map(t => (
                                   <span key={t} className="text-[10px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded">{t}</span>
                                 ))}
                               </div>
                             </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Selection */}
      {showSelectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-6">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${selectedSource === 'candidates' ? 'bg-violet-100 text-violet-600' : 'bg-blue-100 text-blue-600'}`}>
                  {selectedSource === 'candidates' ? <User size={18} /> : <CheckCircle2 size={18} />}
                </div>
                <h3 className="font-bold text-slate-800 text-lg">
                  选择{selectedSource === 'candidates' ? '候选人' : '任务'}
                </h3>
              </div>
              <button 
                onClick={() => setShowSelectionModal(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-hidden bg-slate-50 p-6">
              <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                 {selectedSource === 'candidates' ? (
                   <CandidateList 
                     selectable={true}
                     selectedIds={selectedItems}
                     onSelectionChange={setSelectedItems}
                     embedded={true}
                   />
                 ) : (
                   <ProjectCandidateList
                     selectedIds={selectedItems}
                     onSelectionChange={setSelectedItems}
                   />
                 )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3">
              <div className="flex-1 flex items-center text-sm text-slate-600">
                已选择 <span className="font-bold text-fuchsia-600 mx-1">{selectedItems.length}</span> 项
              </div>
              <button 
                onClick={() => setShowSelectionModal(false)}
                className="px-6 py-2 bg-violet-600 text-white font-bold rounded-lg hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all"
              >
                完成选择
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
