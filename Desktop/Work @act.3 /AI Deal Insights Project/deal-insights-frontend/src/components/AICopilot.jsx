import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Maximize2, Minimize2, HelpCircle, X, GripVertical } from 'lucide-react';

const AICopilot = ({ isOpen, onClose, onOpen }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'I can help you explore past campaigns, find insights, and answer questions.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 });
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef(null);
  const panelRef = useRef(null);
  const resizeRef = useRef(null);

  const suggestedPrompts = [
    'Show campaigns with highest ROI',
    'What strategies work best for finance?',
    'Compare 2024 vs 2023 results',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle resize and drag
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing && panelRef.current) {
        const rect = panelRef.current.getBoundingClientRect();
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const newWidth = Math.max(300, Math.min(800, dimensions.width + deltaX));
        const newHeight = Math.max(400, Math.min(window.innerHeight - 100, dimensions.height + deltaY));
        setDimensions({ width: newWidth, height: newHeight });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
      if (isDragging) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        const newX = Math.max(0, Math.min(window.innerWidth - dimensions.width, initialPosition.x + deltaX));
        const newY = Math.max(0, Math.min(window.innerHeight - dimensions.height - 50, initialPosition.y + deltaY));
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsDragging(false);
    };

    if (isResizing || isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, isDragging, dragStart, initialPosition, dimensions.width, dimensions.height]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate API call - replace with actual API call later
    setTimeout(() => {
      const aiResponse = {
        role: 'assistant',
        content: `I've analyzed your query: "${input}". Here's what I found based on our project database:\n\n• This is a mock response for now\n• When the backend is connected, I'll provide real insights\n• I'll reference specific projects and data points\n\nWould you like me to explore any specific aspect further?`,
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handlePromptClick = (prompt) => {
    setInput(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleDragStart = (e) => {
    if (e.target.closest('button, input, textarea')) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition({ x: position.x, y: position.y });
  };

  // Floating button to open copilot
  if (!isOpen) {
    return (
      <button
        onClick={onOpen}
        className="fixed bottom-6 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-110 flex items-center gap-2"
        aria-label="Open AI Copilot"
      >
        <Sparkles className="w-6 h-6 transition-transform duration-300" />
        <span className="font-semibold">AI Copilot</span>
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      className={`bg-primary text-white rounded-2xl flex flex-col transition-all duration-300 ease-in-out shadow-2xl ${
        isExpanded ? 'fixed inset-4 z-50' : 'fixed z-50'
      }`}
      style={
        !isExpanded
          ? {
              width: `${dimensions.width}px`,
              height: `${dimensions.height}px`,
              bottom: `${position.y}px`,
              right: `${position.x}px`,
            }
          : {}
      }
    >
      {/* Header - draggable */}
      <div
        className="flex items-center justify-between p-4 border-b border-primary-light/20 cursor-move"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-primary-light" />
          <Sparkles className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">AI Copilot</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-primary-light">Powered by</span>
              <img 
                src="/act3-logo.png" 
                alt="act.3" 
                className="h-3 w-auto object-contain opacity-80"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-primary-light/20 rounded transition-colors"
            title={isExpanded ? 'Minimize' : 'Maximize'}
          >
            {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-primary-light/20 rounded transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-white text-gray-900'
                  : 'bg-primary-dark/50 text-white'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-primary-dark/50 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Resize handle */}
      {!isExpanded && (
        <div
          ref={resizeRef}
          onMouseDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize group"
          title="Drag to resize"
        >
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary-dark/30 group-hover:bg-primary-dark/50 transition-colors"
            style={{
              clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
            }}
          />
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-white/40" />
        </div>
      )}

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary-light" />
            <span className="text-sm text-primary-light">Suggested prompts:</span>
          </div>
          <div className="space-y-2">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptClick(prompt)}
                className="w-full text-left text-sm p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-primary-light/20">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about past campaigns..."
            className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/30 text-white placeholder-white/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2 bg-white text-primary rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-1 mt-2 text-xs text-primary-light">
          <HelpCircle className="w-3 h-3" />
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

export default AICopilot;
