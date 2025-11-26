import React, { useState, useRef, useEffect, memo, useMemo } from 'react'; // Agregamos 'memo' y 'useMemo'
import Draggable from 'react-draggable';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  IconButton,
  Collapse,
  TextField,
  Paper,
  Typography,
  useTheme,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Minimize as MinimizeIcon,
  ChatBubbleOutline as ChatIcon,
  Send as SendIcon
} from '@mui/icons-material';

// --- CONFIGURATION ---
const NODE_API_ENDPOINT = `${import.meta.env.VITE_URL_ENVIRONMENT}/api/chat`

// Function to clean up citation markers
const cleanupResponseText = (text) => {
  let cleanedText = text.replace(/\[cite_start\]/g, '');
  cleanedText = cleanedText.replace(/\[cite_end\]/g, '');
  return cleanedText;
};

// =========================================================================
// 2. Componente Memoizado para CADA MENSAJE (Optimización de Lista)
// Esto evita que todos los mensajes se re-rendericen cuando se añade uno nuevo.
// =========================================================================
const Message = memo(({ msg, theme }) => {
    const isUser = msg.sender === 'user';
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                mb: 1.5
            }}
        >
            <Paper
                elevation={2}
                sx={{
                    p: 1.5,
                    maxWidth: '85%',
                    bgcolor: isUser ? 'primary.lighter' : theme.palette.background.default,
                    color: isUser ? 'primary.darker' : theme.palette.text.primary,
                    borderRadius: isUser ? '12px 12px 0 12px' : '12px 12px 12px 0'
                }}
            >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                </Typography>
            </Paper>
        </Box>
    );
});


// =========================================================================
// 1. Componente Principal Memoizado (Optimización de re-renderizado global)
// =========================================================================
const ChatWindow = memo(({ isOpen, onClose }) => { // Envolvemos con memo
  const theme = useTheme();

  // --- State and Refs ---
  const [isMinimized, setIsMinimized] = useState(false);
  const nodeRef = useRef(null); 
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null); 

  // --- Handlers ---
  const handleMinimize = () => {
    // Si se está abriendo, hacemos scroll al final
    if (isMinimized) {
        // Pequeño timeout para esperar que el collapse termine
        setTimeout(scrollToBottom, 300);
    }
    setIsMinimized(!isMinimized);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '' || loading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(NODE_API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages.slice(-5) 
        })
      });

      if (!response.ok) {
        throw new Error(`Backend Error: ${response.statusText}`);
      }

      const data = await response.json();
      const cleanedText = cleanupResponseText(data.response);
      
      const botMessage = { sender: 'bot', text: cleanedText };

      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error communicating with the chatbot:', error);
      const errorMessage = {
        sender: 'bot',
        text: 'Lo siento, hubo un error de conexión con el servicio de IA.'
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // 3. Memoización de Estilos Fijos
  // Esto evita re-crear los objetos de estilo en cada renderizado
  const cardSx = useMemo(() => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: '12px',
    overflow: 'hidden',
  }), [theme.palette.divider]);

  const boxWrapperSx = useMemo(() => ({
    position: 'fixed',
    top: '50px',
    left: '50px',
    width: 380,
    zIndex: 1302,
  }), []);


  // Si el componente está cerrado, retornamos null
  if (!isOpen) {
    return null;
  }
  
  // =========================================================================
  // Render
  // =========================================================================
  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".chat-header-handle"
      bounds="body"
    >
      <Box
        ref={nodeRef}
        sx={boxWrapperSx}
      >
        <Card
          elevation={16}
          sx={cardSx}
        >
          {/* 1. Header (Drag Handle) */}
          <CardHeader
            className="chat-header-handle"
            avatar={<ChatIcon />}
            title="Space Connect"
            action={
              <>
                <IconButton onClick={handleMinimize} aria-label="Minimizar">
                  <MinimizeIcon />
                </IconButton>
                <IconButton onClick={onClose} aria-label="Cerrar">
                  <CloseIcon />
                </IconButton>
              </>
            }
            sx={{
              cursor: 'move',
              userSelect: 'none',
              backgroundColor: theme.palette.background.default,
              borderBottom: `1px solid ${theme.palette.divider}`
            }}
          />

          {/* 2. Collapsible Chat Body */}
          <Collapse in={!isMinimized} timeout="auto" unmountOnExit>
            <CardContent
              sx={{
                height: 450,
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                backgroundColor: theme.palette.background.paper
              }}
            >
              {/* --- Messages Area --- */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  mb: 2,
                  p: 1
                }}
              >
                {/* Initial message */}
                {messages.length === 0 && (
                  <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                    <Typography variant="body2">Soy tu asistente. Puedo ayudarte con consultas sobre facturas, pedimentos, y pólizas.</Typography>
                    <Typography variant="body2">¡Pregúntame algo!</Typography>
                  </Box>
                )}

                {/* Message mapping using the memoized component */}
                {messages.map((msg, index) => (
                    <Message key={index} msg={msg} theme={theme} />
                ))}
                <div ref={messagesEndRef} />
              </Box>

              {/* --- Text Input --- */}
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Escribe tu mensaje..."
                size="small"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !loading) sendMessage();
                }}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={sendMessage}
                        disabled={loading || input.trim() === ''}
                        color="primary"
                      >
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          <SendIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </CardContent>
          </Collapse>
        </Card>
      </Box>
    </Draggable>
  );
});

export default ChatWindow;
