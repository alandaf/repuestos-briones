import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader } from 'lucide-react';
import { motion } from 'motion/react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy tu Asistente Técnico Inteligente de Repuestos Briones. ¿En qué puedo ayudarte hoy? Puedo buscar repuestos por ti, diagnosticar fallas básicas o responder dudas sobre compatibilidad.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    '¿Qué aceite recomiendas para un motor diésel?',
    'Pastillas de freno compatibles con Hyundai Accent 2018',
    '¿Cómo identifico el código VIN de mi auto?',
    'Diagnóstico: Silbido al presionar el embrague'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(msg => ({ role: msg.role, text: msg.content }))
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: `Error: ${data.error || 'No se pudo conectar con el asistente.'}` }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error de red. Asegúrate de configurar la clave de Gemini API en tu archivo .env' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 md:px-8 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 bg-gray-900 border border-gray-800 p-4 rounded-xl">
        <div className="w-10 h-10 rounded-lg bg-orange-600/20 flex items-center justify-center border border-orange-500/30">
          <Sparkles className="text-orange-500 animate-pulse" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-white">Asistente Técnico Repuestos Briones</h3>
          <p className="text-xs text-green-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block"></span>
            Gemini AI - Soporte en Línea 24/7
          </p>
        </div>
      </div>

      {/* Messages Window */}
      <div className="flex-1 overflow-y-auto bg-gray-950 border border-gray-800/80 rounded-xl p-4 md:p-6 space-y-4 mb-4">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${msg.role === 'user' ? 'bg-orange-600 border-orange-500 text-white' : 'bg-gray-800 border-gray-700 text-orange-500'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`p-4 rounded-xl leading-relaxed text-sm ${msg.role === 'user' ? 'bg-orange-600/10 border border-orange-500/20 text-orange-100' : 'bg-gray-900 border border-gray-800 text-gray-200'}`}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {loading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 text-orange-500 flex items-center justify-center">
              <Loader size={16} className="animate-spin" />
            </div>
            <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex items-center gap-2">
              <span className="text-sm text-gray-400">Analizando base de datos técnica...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && !loading && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">Consultas frecuentes:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="text-left bg-gray-900 hover:bg-gray-800 border border-gray-800 text-xs py-2 px-3 rounded-lg text-gray-300 transition-colors truncate cursor-pointer hover:border-orange-500/30"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="flex gap-2 bg-gray-900 border border-gray-800 p-2 rounded-xl"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Haz una consulta técnica o consulta stock de piezas..."
          className="flex-1 bg-transparent px-4 text-sm text-white focus:outline-none placeholder-gray-500"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-orange-600 hover:bg-orange-500 disabled:bg-gray-800 text-white p-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
