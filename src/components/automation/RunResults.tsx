import React, { useState } from 'react';
import { Download, RefreshCw, ChevronLeft, Filter, Zap, DollarSign, Briefcase, Clock, CheckCircle2, XCircle } from 'lucide-react';

export interface RunLog {
  id: string;
  candidate: {
    name: string;
    avatar: string;
    company: string;
    verified: boolean;
  };
  task: {
    name: string;
    successRate: number;
  };
  runTime: string;
  duration: string;
  status: 'success' | 'failure' | 'running';
}

export const mockLogs: RunLog[] = [
  {
    id: '1',
    candidate: { name: 'Mina Tan', avatar: 'MT', company: 'Ex-Shopify', verified: true },
    task: { name: '任务 #1', successRate: 95 },
    runTime: '2024-02-25 10:30',
    duration: '2m 15s',
    status: 'success'
  },
  {
    id: '2',
    candidate: { name: 'Alex Rivera', avatar: 'AR', company: 'Freelance', verified: false },
    task: { name: '任务 #2', successRate: 85 },
    runTime: '2024-02-25 10:25',
    duration: '1m 45s',
    status: 'success'
  },
  {
    id: '3',
    candidate: { name: 'Rafiq H.', avatar: 'RH', company: 'Velocity Labs', verified: true },
    task: { name: '任务 #3', successRate: 80 },
    runTime: '2024-02-25 10:20',
    duration: '3m 10s',
    status: 'failure'
  },
  {
    id: '4',
    candidate: { name: 'Juno Park', avatar: 'JP', company: 'TalentAsia', verified: true },
    task: { name: '任务 #4', successRate: 90 },
    runTime: '2024-02-25 10:15',
    duration: '2m 00s',
    status: 'success'
  },
  {
    id: '5',
    candidate: { name: 'Siti A.', avatar: 'SA', company: 'TikTok', verified: false },
    task: { name: '任务 #5', successRate: 88 },
    runTime: '2024-02-25 10:10',
    duration: '2m 30s',
    status: 'success'
  },
  {
    id: '6',
    candidate: { name: 'Kai Chen', avatar: 'KC', company: 'Toptal', verified: false },
    task: { name: '任务 #6', successRate: 82 },
    runTime: '2024-02-25 10:05',
    duration: '1m 55s',
    status: 'success'
  }
];

export const RunResults: React.FC<{ automationName: string; onBack?: () => void; embedded?: boolean; logs?: RunLog[] }> = ({ automationName, onBack, embedded = false, logs: propLogs }) => {
  const [logs] = useState<RunLog[]>(propLogs || mockLogs);
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failure' | 'running'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = logs.filter(log => {
    const matchesStatus = filterStatus === 'all' || log.status === filterStatus;
    const matchesSearch = log.candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          log.task.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Section - Only show if not embedded */}
      {!embedded && (
        <div className="bg-white border-b border-slate-100 px-8 py-5 flex justify-between items-center z-10">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wide mb-1">
              <button 
                onClick={onBack}
                className="hover:text-violet-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft size={12} strokeWidth={3} />
                返回
              </button>
              <span className="text-slate-200">/</span>
              <span>执行结果</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              {automationName}
              <span className="px-2.5 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-bold border border-violet-100">
                运行中
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <Download size={16} className="text-slate-400" />
              导出
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 border border-transparent rounded-lg text-sm font-bold text-white hover:bg-violet-700 shadow-lg shadow-violet-200 transition-all">
              <RefreshCw size={16} strokeWidth={2.5} />
              重新运行
            </button>
          </div>
        </div>
      )}

      {/* Filter Section (Added) */}
      <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center gap-4">
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-500 appearance-none cursor-pointer"
          >
            <option value="all">所有状态</option>
            <option value="success">成功</option>
            <option value="failure">失败</option>
            <option value="running">运行中</option>
          </select>
        </div>
        <div className="relative flex-1 max-w-sm">
          <input 
            type="text" 
            placeholder="搜索候选人或任务..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-4 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:ring-2 focus:ring-violet-100 focus:border-violet-500"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-auto bg-slate-50/50">
        <div className="min-w-full inline-block align-middle">
          <table className="min-w-full divide-y divide-slate-200/60">
            <thead className="bg-slate-50 sticky top-0 z-10">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  候选人 (Candidate)
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  执行任务名 (Task Name)
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  运行时间 (Run Time)
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                  耗时 (Duration)
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                  状态 (Status)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-50 flex items-center justify-center text-violet-700 font-bold text-sm border border-violet-100 shadow-sm">
                          {log.candidate.avatar}
                        </div>
                        {log.candidate.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                            <CheckCircle2 size={12} className="text-emerald-500 fill-current" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                          {log.candidate.name}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          {log.candidate.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-slate-700">{log.task.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                      <Clock size={14} className="text-slate-400" />
                      {log.runTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded inline-block">
                      {log.duration}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {log.status === 'success' ? (
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                         <CheckCircle2 size={12} strokeWidth={2.5} />
                         成功
                       </span>
                    ) : log.status === 'failure' ? (
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                         <XCircle size={12} strokeWidth={2.5} />
                         失败
                       </span>
                    ) : (
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                         <Zap size={12} strokeWidth={2.5} />
                         运行中
                       </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Footer / Pagination */}
      <div className="bg-white border-t border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="text-xs font-medium text-slate-500">
          显示 <span className="font-bold text-slate-800">1</span> 到 <span className="font-bold text-slate-800">{filteredLogs.length}</span> 条，共 <span className="font-bold text-slate-800">{logs.length}</span> 条结果
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50">
            上一页
          </button>
          <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
            下一页
          </button>
        </div>
      </div>
    </div>
  );
};