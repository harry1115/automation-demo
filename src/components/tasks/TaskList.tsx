import React, { useState } from 'react';
import { CheckSquare, Calendar, Clock, AlertCircle, MoreHorizontal, ChevronRight } from 'lucide-react';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'pending' | 'completed';
}

export const mockTasks: Task[] = [
  { id: '1', title: '筛选新简历', description: '筛选高级前端工程师职位的 20 份新简历', priority: 'high', dueDate: '今天 18:00', status: 'pending' },
  { id: '2', title: '面试确认', description: '与候选人李娜确认明天下午 2 点的面试', priority: 'medium', dueDate: '明天 10:00', status: 'pending' },
  { id: '3', title: '发送 Offer', description: '给候选人王强发送正式 Offer 邮件', priority: 'high', dueDate: '今天 17:00', status: 'pending' },
  { id: '4', title: '招聘需求会议', description: '与产品部门开会确认新的招聘需求', priority: 'low', dueDate: '周五 14:00', status: 'pending' },
];

interface TaskListProps {
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  embedded?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  selectable = false, 
  selectedIds, 
  onSelectionChange,
  embedded = false
}) => {
  const [internalSelectedRows, setInternalSelectedRows] = useState<string[]>([]);

  const selectedRows = selectable && selectedIds ? selectedIds : internalSelectedRows;
  
  const handleSelectionChange = (newSelection: string[]) => {
    if (selectable && onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setInternalSelectedRows(newSelection);
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      handleSelectionChange(selectedRows.filter(rowId => rowId !== id));
    } else {
      handleSelectionChange([...selectedRows, id]);
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${!embedded ? 'border-l border-slate-100' : ''}`}>
      {!embedded && (
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              待办事项
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">您有 {mockTasks.length} 个待处理任务</p>
          </div>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
            <MoreHorizontal size={20} />
          </button>
        </div>
      )}
      
      <div className={`flex-1 overflow-y-auto ${!embedded ? 'p-4' : 'p-0'} space-y-3 bg-white`}>
        {mockTasks.map(task => (
          <div 
            key={task.id} 
            onClick={() => selectable && toggleSelectRow(task.id)}
            className={`group relative bg-white p-4 border rounded-xl transition-all cursor-pointer ${
              selectedRows.includes(task.id) 
                ? 'border-indigo-500 bg-indigo-50/10 shadow-sm' 
                : 'border-slate-200 hover:shadow-md hover:border-indigo-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 transition-colors ${selectedRows.includes(task.id) ? 'text-indigo-600' : 'text-slate-300 group-hover:text-indigo-600'}`}>
                  <CheckSquare size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">{task.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 pl-7">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide border ${
                  task.priority === 'high' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                  task.priority === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                }`}>
                  {task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级'}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-500">
                <Clock size={12} />
                <span className={`${task.priority === 'high' ? 'text-rose-500 font-medium' : ''}`}>{task.dueDate}</span>
              </div>
            </div>

            <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
               <ChevronRight className="text-indigo-400" size={16} />
            </div>
          </div>
        ))}
        
        <div className="pt-2">
          <button className="w-full py-2.5 text-sm text-slate-500 hover:text-indigo-600 font-medium border border-dashed border-slate-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all flex items-center justify-center gap-1">
            <CheckSquare size={14} />
            查看所有任务
          </button>
        </div>
      </div>
    </div>
  );
};
