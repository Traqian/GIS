import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserInteraction.css';
import { useSpeechRecognition } from 'react-speech-recognition';

const UserInteraction = () => {
    const [feedback, setFeedback] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [voiceCommands, setVoiceCommands] = useState([]);
    const [commandHistory, setCommandHistory] = useState([]);
    const { transcript, listening, resetTranscript } = useSpeechRecognition();
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        // Set predefined voice commands
        setVoiceCommands([
            { trigger: '导航', action: 'navigate' },
            { trigger: '搜索', action: 'search' },
            { trigger: '分享位置', action: 'share' }
        ]);
    }, []);

    const handleSubmitFeedback = (e) => {
        e.preventDefault();
        // Store feedback locally since we don't have a backend
        console.log('Feedback submitted:', feedback);
        setFeedback('');
        setFeedbackSubmitted(true);
        setTimeout(() => setFeedbackSubmitted(false), 3000);
    };

    useEffect(() => {
        if (transcript) {
            const timestamp = new Date().toLocaleTimeString();
            setCommandHistory(prev => [
                ...prev,
                { command: transcript, timestamp }
            ]);
            
            // Process voice command
            if (voiceCommands.some(cmd => cmd.trigger === transcript)) {
                const action = voiceCommands.find(cmd => cmd.trigger === transcript).action;
                // Execute action based on command
                switch (action) {
                    case 'navigate':
                        // Trigger navigation
                        window.location.href = '/navigation';
                        break;
                    case 'search':
                        // Trigger search
                        window.location.href = '/search';
                        break;
                    case 'share':
                        // Trigger location sharing
                        navigator.share({
                            title: '我的位置',
                            text: '这是我的位置',
                            url: window.location.href
                        });
                        break;
                    default:
                        console.log('Unknown command action:', action);
                }
            }
            resetTranscript();
        }
    }, [transcript, voiceCommands, resetTranscript]);

    const handleToggleListening = () => {
        if (!isListening) {
            // Start listening
            setIsListening(true);
        } else {
            // Stop listening
            setIsListening(false);
            resetTranscript();
        }
    };

    const formatTime = (time) => {
        return new Date(time).toLocaleTimeString();
    };

    return (
        <div className="interaction-container">
            <div className="voice-control">
                <button 
                    onClick={handleToggleListening}
                    className={`voice-button ${isListening ? 'listening' : ''}`}
                >
                    {isListening ? '停止语音' : '开始语音'}
                </button>
                {isListening && (
                    <div className="voice-status">
                        <p>正在监听语音命令...</p>
                        <p>最后识别: {lastCommand || '无'}</p>
                    </div>
                )}
            </div>

            <div className="command-history">
                <h3>命令历史</h3>
                <ul>
                    {commandHistory.map((cmd, index) => (
                        <li key={index}>
                            <span className="command">{cmd.command}</span>
                            <span className="timestamp">{formatTime(cmd.timestamp)}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <ReactVoiceRecognition
                onResult={handleVoiceCommand}
                onListening={setIsListening}
                commands={voiceCommands.map(cmd => cmd.trigger)}
            />

            <div className="feedback-section">
                <h3>用户反馈</h3>
                <form onSubmit={handleSubmitFeedback}>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="请输入您的反馈..."
                        rows={4}
                    />
                    <button type="submit">提交反馈</button>
                </form>
                {feedbackSubmitted && (
                    <div className="success-message">
                        感谢您的反馈！
                    </div>
                )}
            </div>

            <div className="quick-actions">
                <h3>快捷操作</h3>
                <div className="action-buttons">
                    <button onClick={() => window.location.href = '/navigation'}>
                        导航
                    </button>
                    <button onClick={() => window.location.href = '/search'}>
                        搜索
                    </button>
                    <button onClick={() => navigator.share({
                        title: '我的位置',
                        text: '这是我的位置',
                        url: window.location.href
                    })}>
                        分享位置
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserInteraction;
