import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react'; // Usamos íconos lucide-react

// La URL de tu endpoint de Node.js, donde se procesará la solicitud de Gemini
const NODE_API_ENDPOINT = 'http://localhost:3001/api/chat'; 
// NOTA: Asegúrate de que este endpoint coincida con la URL de tu servidor Node.js/Express.

// Componente principal de la aplicación
const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Función para desplazar automáticamente al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Función para manejar el envío de la pregunta al backend de Node.js
  const sendMessage = async () => {
    if (input.trim() === '' || loading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 1. Llamar al endpoint de Node.js (proxy)
      const response = await fetch(NODE_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input, history: messages.slice(-5) }), // Enviamos la pregunta y el historial reciente
      });

      if (!response.ok) {
        throw new Error(`Error en el backend: ${response.statusText}`);
      }

      // 2. Recibir la respuesta de Gemini (a través de Node.js)
      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.response };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error al comunicarse con el chatbot:", error);
      const errorMessage = { sender: 'bot', text: 'Lo siento, hubo un error de conexión con el servicio de IA.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Componente para renderizar un mensaje individual
  const Message = ({ message }) => (
    <div 
      className={`flex mb-4 ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md ${
          message.sender === 'user'
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        <p className="whitespace-pre-wrap text-sm">{message.text}</p>
      </div>
    </div>
  );

  return (
    // CAMBIO 1: Eliminamos min-h-screen y usamos flex para centrar verticalmente si es necesario, pero mantenemos p-4
    // Usamos h-full en el contenedor principal para que se ajuste al menú o al componente padre.
    <div className="flex justify-center items-start w-full bg-gray-50 p-4">
      
      {/* CAMBIO 2: Reducimos la altura máxima del chatbox. Usaremos h-[600px] para una altura fija controlada
          o max-h-[85vh] y h-full para que se ajuste al tamaño de la ventana. */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col h-[600px] max-h-[85vh]">
        
        {/* Encabezado */}
        <div className="p-4 border-b bg-indigo-600 text-white rounded-t-2xl flex items-center">
          {/* <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16l3-3m0 0l3 3m-3-3v8m0 0H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-3 3z"></path>
          </svg> */}
          <h1 className="text-xl font-semibold">ESPACito</h1>
        </div>

        {/* Área de Mensajes */}
        {/* h-full: Ocupa toda la altura restante del contenedor (600px) */}
        <div className="flex-grow p-5 overflow-y-auto space-y-3">
          {messages.length === 0 && (
             <div className="text-center text-gray-400 mt-10 p-4 border-2 border-dashed border-gray-200 rounded-lg">
                <p>Hola, soy el asistente de tu ERP. Puedo ayudarte con consultas sobre facturas, saldos, y procesos internos. ¡Pregúntame algo!</p>
             </div>
          )}
          {messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Caja de Entrada */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
              placeholder="Escribe tu pregunta..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className={`p-3 rounded-lg text-white transition duration-200 flex items-center justify-center ${
                loading || input.trim() === ''
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-md'
              }`}
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
