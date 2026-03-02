import React, { useState } from 'react';
import { Send, Bot, User, Paperclip, Smile, MoreHorizontal, Sparkles, Plus, History } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
}

interface ChatModuleProps {
  onSwitchToAutomation: () => void;
}

export const ChatModule: React.FC<ChatModuleProps> = ({ onSwitchToAutomation }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: '您好！我是您的招聘助手。请问今天有什么可以帮您？我可以帮您筛选简历、安排面试或回答关于候选人的问题。', time: '09:00' },
    { id: '2', role: 'user', content: '帮我找一下最近申请高级前端工程师职位的候选人。', time: '09:05' },
    { id: '3', role: 'assistant', content: '好的，正在为您查找。最近一周共有 15 位候选人申请了“高级前端工程师”职位。其中有 3 位匹配度超过 90%。您想先查看这几位高匹配度的候选人吗？', time: '09:06' },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setInputValue('');
    
    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '收到，正在处理您的请求...',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="p-4 border-b border-slate-200 bg-white shadow-sm flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-lg font-bold text-slate-800">新会话</h2>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <Plus size={20} />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
            <History size={20} />
          </button>
          <button 
            onClick={onSwitchToAutomation}
            className="p-2 hover:bg-violet-50 rounded-lg text-violet-600 transition-colors"
            title="自动化任务"
          >
            <Bot size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${
              msg.role === 'assistant' ? 'bg-white border-slate-100 text-indigo-600' : 'bg-indigo-600 border-indigo-600 text-white'
            }`}>
              {msg.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
            </div>
            
            <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-3 text-sm leading-relaxed shadow-sm ${
                msg.role === 'assistant' 
                  ? 'bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-tl-none' 
                  : 'bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-indigo-200'
              }`}>
                {msg.content}
              </div>
              <span className="text-[10px] text-slate-400 mt-1.5 px-1 font-medium">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="flex flex-col gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all">
          <textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="输入消息与助手对话..." 
            className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-700 placeholder-slate-400 resize-none min-h-[40px] max-h-[120px]"
            rows={1}
          />
          <div className="flex justify-between items-center px-1">
             <div className="flex items-center gap-1 text-slate-400">
              <button className="hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors"><Paperclip size={18} /></button>
              <button className="hover:text-indigo-600 hover:bg-indigo-50 p-1.5 rounded-lg transition-colors"><Smile size={18} /></button>
            </div>
            <button 
              onClick={handleSendMessage}
              className={`p-2 rounded-lg transition-all shadow-sm flex items-center gap-2 ${
                inputValue.trim() 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200' 
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              disabled={!inputValue.trim()}
            >
              <span className="text-xs font-bold pl-1">发送</span>
              <Send size={14} />
            </button>
          </div>
        </div>
        <div className="text-center mt-2">
            <span className="text-[10px] text-slate-400">AI 助手生成的内容可能不准确，请核实重要信息。</span>
        </div>
      </div>
    </div>
  );
};
