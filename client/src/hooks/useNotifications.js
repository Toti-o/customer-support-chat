import { useEffect } from 'react';

const playNotificationSound = () => {
  // Simple notification sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 100);
  } catch (error) {
    console.log('Audio context not supported');
  }
};

export const useNotifications = (messages, user, socket) => {
  useEffect(() => {
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }, []);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage && 
        lastMessage.userId !== socket.id && 
        lastMessage.type !== 'system' &&
        document.hidden) {
      
      // Play sound notification
      playNotificationSound();
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        const notification = new Notification(`New message from ${lastMessage.username}`, {
          body: lastMessage.type === 'text' 
            ? lastMessage.message 
            : `Sent a file: ${lastMessage.fileName}`,
          icon: '/vite.svg',
          tag: 'chat-message'
        });
        
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    }
  }, [messages, user, socket]);
};