import React, { useState } from 'react';
import { 
  Zap, Plus, ChevronDown, User, Mail, Globe, Lock, Bold, Italic, Underline, 
  Code, Link, Image, Hash, AlignLeft, AlignCenter, AlignRight, AlignJustify, 
  List, ListOrdered, Indent, Settings, Bot
} from 'lucide-react';

export const TriggerWorkflow: React.FC = () => {
  const [emailContent, setEmailContent] = useState('');

  return (
    <div className="flex gap-6 h-full p-6 bg-slate-50/50 overflow-auto">
      {/* Left Column: Trigger */}
      <div className="flex-1 flex flex-col gap-6 max-w-xl">
        {/* Trigger Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
            <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">触发器</h3>
              <p className="text-xs text-slate-500">当下述事件发生时</p>
            </div>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="relative">
              <div className="flex items-center justify-between w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-violet-300 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                  <span className="font-medium">创建任务</span>
                </div>
                <ChevronDown size={16} className="text-slate-400 group-hover:text-violet-500" />
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-500 px-1">
              <span>创建人：</span>
              <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-full">
                <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <User size={12} />
                </div>
                <span className="text-xs">(任意创建人)</span>
              </div>
            </div>
          </div>

          <div className="px-5 pb-5 pt-0">
            <div className="border-t border-dashed border-slate-200 my-4"></div>
            <h4 className="text-sm font-semibold text-slate-700 mb-3">满足条件</h4>
            <button className="w-full py-2.5 bg-violet-50 text-violet-600 rounded-lg border border-dashed border-violet-200 hover:bg-violet-100 hover:border-violet-300 transition-all flex items-center justify-center gap-2 text-sm font-medium">
              <Plus size={16} />
              增加条件
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Action */}
      <div className="flex-1 flex flex-col gap-6 max-w-xl">
        {/* Action Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-white">
            <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">任务</h3>
              <p className="text-xs text-slate-500">自动完成下列操作</p>
            </div>
          </div>
          
          <div className="p-5 space-y-6">
             <div className="relative">
              <div className="flex items-center justify-between w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-700 hover:border-violet-300 transition-colors cursor-pointer group">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-violet-500" />
                  <span className="font-medium">发送邮件</span>
                </div>
                <ChevronDown size={16} className="text-slate-400 group-hover:text-violet-500" />
              </div>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-slate-500 text-right">通知对象</label>
                <div className="col-span-9 flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="target" className="text-violet-600 focus:ring-violet-500" defaultChecked />
                    <span className="text-sm text-slate-700">负责人</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="target" className="text-violet-600 focus:ring-violet-500" />
                    <span className="text-sm text-slate-700">项目负责人</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="target" className="text-violet-600 focus:ring-violet-500" />
                    <span className="text-sm text-slate-700">指定邮箱</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-slate-500 text-right">发件人邮箱</label>
                <div className="col-span-9">
                  <input type="text" defaultValue="hr_tip@mesoor.com" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-slate-500 text-right">发件人名称</label>
                <div className="col-span-9">
                  <input type="text" defaultValue="麦穗TIP人才智能平台" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-slate-500 text-right">邮件主题</label>
                <div className="col-span-9">
                  <input type="text" defaultValue="来自麦穗TIP人才智能平台的邮件" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-slate-500 text-right">用户名</label>
                <div className="col-span-9">
                  <input type="text" defaultValue="hr_tip@mesoor.com" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center">
                <label className="col-span-3 text-sm font-medium text-slate-500 text-right">端口</label>
                <div className="col-span-9">
                  <input type="text" defaultValue="465" className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-violet-500 transition-colors" />
                </div>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-bold text-slate-700">SSL</span>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-violet-600 cursor-pointer">
                  <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition" />
                </div>
              </div>
            </div>

            {/* Email Content Editor */}
            <div>
              <h4 className="text-sm font-bold text-slate-700 mb-3">邮件内容</h4>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 p-2 flex flex-wrap gap-1">
                  <EditorButton icon={<Settings size={14} />} label="H1" />
                  <EditorButton icon={<Settings size={14} />} label="H2" />
                  <div className="w-px h-4 bg-slate-300 mx-1 self-center"></div>
                  <EditorButton icon={<Bold size={14} />} />
                  <EditorButton icon={<Italic size={14} />} />
                  <EditorButton icon={<Underline size={14} />} />
                  <div className="w-px h-4 bg-slate-300 mx-1 self-center"></div>
                  <EditorButton icon={<Code size={14} />} />
                  <EditorButton icon={<Link size={14} />} />
                  <EditorButton icon={<Image size={14} />} />
                  <div className="w-px h-4 bg-slate-300 mx-1 self-center"></div>
                  <EditorButton icon={<AlignLeft size={14} />} />
                  <EditorButton icon={<AlignCenter size={14} />} />
                  <EditorButton icon={<AlignRight size={14} />} />
                  <div className="w-px h-4 bg-slate-300 mx-1 self-center"></div>
                  <EditorButton icon={<List size={14} />} />
                  <EditorButton icon={<ListOrdered size={14} />} />
                </div>
                <textarea 
                  className="w-full h-32 p-3 text-sm focus:outline-none resize-none" 
                  placeholder="请输入内容"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                ></textarea>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const EditorButton: React.FC<{ icon: React.ReactNode; label?: string }> = ({ icon, label }) => (
  <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded transition-colors text-xs font-medium flex items-center gap-1">
    {label && <span>{label}</span>}
    {!label && icon}
  </button>
);
