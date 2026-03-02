import React, { useState } from 'react';
import { Mail, Phone, MapPin, MoreHorizontal, Filter, Download, Plus, Search, ChevronDown, CheckSquare, Square } from 'lucide-react';

export interface Candidate {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  status: 'new' | 'interviewing' | 'offer' | 'hired' | 'rejected';
  matchScore: number;
  updatedAt: string;
  tags: string[];
}

export const mockCandidates: Candidate[] = [
  { id: '1', name: '张伟', role: '高级前端工程师', email: 'zhang.wei@example.com', phone: '138-1234-5678', location: '北京', status: 'new', matchScore: 92, updatedAt: '2023-10-24', tags: ['React', 'TypeScript', '架构'] },
  { id: '2', name: '李娜', role: '产品经理', email: 'li.na@example.com', phone: '139-8765-4321', location: '上海', status: 'interviewing', matchScore: 88, updatedAt: '2023-10-23', tags: ['SaaS', '数据驱动'] },
  { id: '3', name: '王强', role: 'UI设计师', email: 'wang.qiang@example.com', phone: '136-5555-6666', location: '深圳', status: 'offer', matchScore: 95, updatedAt: '2023-10-22', tags: ['Figma', 'AntDesign'] },
  { id: '4', name: '刘芳', role: '后端开发工程师', email: 'liu.fang@example.com', phone: '137-7777-8888', location: '杭州', status: 'hired', matchScore: 90, updatedAt: '2023-10-20', tags: ['Java', 'Spring', '微服务'] },
  { id: '5', name: '陈明', role: '数据分析师', email: 'chen.ming@example.com', phone: '135-9999-0000', location: '成都', status: 'rejected', matchScore: 75, updatedAt: '2023-10-18', tags: ['Python', 'SQL'] },
  { id: '6', name: '赵云', role: '全栈工程师', email: 'zhao.yun@example.com', phone: '150-1111-2222', location: '武汉', status: 'new', matchScore: 85, updatedAt: '2023-10-25', tags: ['Node.js', 'Vue'] },
  { id: '7', name: '孙悟空', role: '算法工程师', email: 'sun.wukong@example.com', phone: '188-8888-8888', location: '北京', status: 'interviewing', matchScore: 98, updatedAt: '2023-10-25', tags: ['AI', 'PyTorch'] },
];

interface CandidateListProps {
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  embedded?: boolean;
}

export const CandidateList: React.FC<CandidateListProps> = ({ 
  selectable = false, 
  selectedIds, 
  onSelectionChange,
  embedded = false
}) => {
  const [internalSelectedRows, setInternalSelectedRows] = useState<string[]>([]);

  // Use controlled or uncontrolled state
  const selectedRows = selectable && selectedIds ? selectedIds : internalSelectedRows;
  
  const handleSelectionChange = (newSelection: string[]) => {
    if (selectable && onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setInternalSelectedRows(newSelection);
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === mockCandidates.length) {
      handleSelectionChange([]);
    } else {
      handleSelectionChange(mockCandidates.map(c => c.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      handleSelectionChange(selectedRows.filter(rowId => rowId !== id));
    } else {
      handleSelectionChange([...selectedRows, id]);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm";
    switch (status) {
      case 'new': return <span className={`${baseClasses} bg-blue-50 text-blue-700 border-blue-200`}>新候选人</span>;
      case 'interviewing': return <span className={`${baseClasses} bg-amber-50 text-amber-700 border-amber-200`}>面试中</span>;
      case 'offer': return <span className={`${baseClasses} bg-emerald-50 text-emerald-700 border-emerald-200`}>已发Offer</span>;
      case 'hired': return <span className={`${baseClasses} bg-purple-50 text-purple-700 border-purple-200`}>已入职</span>;
      case 'rejected': return <span className={`${baseClasses} bg-slate-50 text-slate-600 border-slate-200`}>已淘汰</span>;
      default: return <span className={`${baseClasses} bg-gray-50 text-gray-700 border-gray-200`}>{status}</span>;
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white rounded-xl overflow-hidden ${embedded ? 'border-0 shadow-none' : ''}`}>
      {/* Header Toolbar */}
      {!embedded && (
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">候选人管理</h2>
            <p className="text-xs text-slate-500 mt-1 font-medium">共找到 <span className="text-indigo-600">{mockCandidates.length}</span> 位候选人</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="搜索姓名、职位..." 
                className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-64 transition-all"
              />
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
              <Filter size={16} /> 筛选
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
              <Download size={16} /> 导出
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200">
              <Plus size={16} /> 添加候选人
            </button>
          </div>
        </div>
      )}
      
      {/* Search Bar for Embedded Mode */}
      {embedded && (
        <div className="px-4 py-3 border-b border-slate-100 flex gap-3 bg-white">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索姓名、职位..." 
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
            <Filter size={16} /> 筛选
          </button>
        </div>
      )}

      {/* Data Grid */}
      <div className="flex-1 overflow-auto bg-slate-50/30">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 w-14 text-center">
                <div 
                  className="cursor-pointer text-slate-400 hover:text-indigo-600 transition-colors"
                  onClick={toggleSelectAll}
                >
                  {selectedRows.length === mockCandidates.length && mockCandidates.length > 0 ? (
                    <CheckSquare size={18} className="text-indigo-600" />
                  ) : (
                    <Square size={18} />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 font-medium tracking-wide">姓名</th>
              <th className="px-4 py-3 font-medium tracking-wide">应聘职位</th>
              <th className="px-4 py-3 font-medium tracking-wide">状态</th>
              <th className="px-4 py-3 font-medium tracking-wide text-center">匹配度</th>
              <th className="px-4 py-3 font-medium tracking-wide">技能标签</th>
              <th className="px-4 py-3 font-medium tracking-wide">联系方式</th>
              <th className="px-4 py-3 font-medium tracking-wide w-32">更新时间</th>
              <th className="px-4 py-3 font-medium tracking-wide w-16 text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {mockCandidates.map((candidate) => (
              <tr 
                key={candidate.id} 
                className={`group transition-all hover:bg-indigo-50/30 ${selectedRows.includes(candidate.id) ? 'bg-indigo-50/40' : ''}`}
              >
                <td className="px-6 py-4 text-center border-r border-transparent group-hover:border-slate-100">
                  <div 
                    className="cursor-pointer text-slate-300 hover:text-indigo-600 transition-colors inline-block"
                    onClick={() => toggleSelectRow(candidate.id)}
                  >
                    {selectedRows.includes(candidate.id) ? (
                      <CheckSquare size={18} className="text-indigo-600" />
                    ) : (
                      <Square size={18} />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 font-medium text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 border border-slate-200">
                      {candidate.name.charAt(0)}
                    </div>
                    {candidate.name}
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-600">{candidate.role}</td>
                <td className="px-4 py-4">
                  {getStatusBadge(candidate.status)}
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          candidate.matchScore >= 90 ? 'bg-emerald-500' : 
                          candidate.matchScore >= 80 ? 'bg-indigo-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${candidate.matchScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-700">{candidate.matchScore}%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1">
                    {candidate.tags.map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4 text-xs text-slate-500">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1.5 hover:text-slate-800 transition-colors cursor-pointer">
                      <Mail size={12} /> {candidate.email}
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-slate-800 transition-colors cursor-pointer">
                      <Phone size={12} /> {candidate.phone}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-400 text-xs font-mono">{candidate.updatedAt}</td>
                <td className="px-4 py-4 text-center">
                  <button className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-md hover:bg-indigo-50 transition-colors">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-between items-center text-sm text-slate-500">
        <div>
          显示 <span className="font-medium text-slate-900">1</span> 到 <span className="font-medium text-slate-900">{mockCandidates.length}</span> 条，共 <span className="font-medium text-slate-900">{mockCandidates.length}</span> 条
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
            上一页
          </button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-indigo-50 text-indigo-600 font-medium border border-indigo-200">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-50 text-slate-600 border border-transparent hover:border-slate-200 transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-slate-50 text-slate-600 border border-transparent hover:border-slate-200 transition-colors">3</button>
          </div>
          <button className="px-3 py-1.5 border border-slate-200 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            下一页
          </button>
        </div>
      </div>
    </div>
  );
};
