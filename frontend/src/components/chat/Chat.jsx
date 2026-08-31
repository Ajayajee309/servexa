import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Send, X } from 'lucide-react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import api from '../../services/api';

const Chat = ({ bookingId, receiverId, receiverName, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [stompClient, setStompClient] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Fetch previous messages
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/${bookingId}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages', error);
      }
    };
    
    fetchMessages();

    // Connect to WebSocket
    const socket = new SockJS('http://localhost:8088/ws');
    const client = Stomp.over(socket);
    client.debug = () => {}; // Disable debug logging
    
    client.connect({}, () => {
      setStompClient(client);
      
      client.subscribe(`/topic/messages/${bookingId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      });
    });

    return () => {
      if (client) {
        client.disconnect();
      }
    };
  }, [bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && stompClient) {
      const messageObj = {
        senderId: user.id,
        receiverId: receiverId,
        bookingId: bookingId,
        content: newMessage,
      };
      
      stompClient.send('/app/chat', {}, JSON.stringify(messageObj));
      setNewMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col h-[500px] z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600 rounded-t-2xl text-white">
        <div>
          <h3 className="font-semibold text-sm">Chat with {receiverName}</h3>
          <p className="text-xs text-blue-100">Booking #{bookingId}</p>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200 focus:outline-none">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                msg.senderId === user.id
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none'
              }`}
            >
              <p>{msg.content}</p>
              <span className={`text-[10px] block mt-1 ${msg.senderId === user.id ? 'text-blue-100' : 'text-gray-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-2xl">
        <form onSubmit={sendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-blue-500 rounded-full px-4 py-2 text-sm text-gray-900 dark:text-white outline-none"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
