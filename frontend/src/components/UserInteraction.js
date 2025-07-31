import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserInteraction.css';
import { ReactVoiceRecognition } from 'react-voice-recognition';

const UserInteraction = () => {
    const [feedback, setFeedback] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [voiceCommands, setVoiceCommands] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [lastCommand, setLastCommand] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);

    useEffect(() => {
        // Load predefined voice commands
        const loadCommands = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/voice-commands');
                setVoiceCommands(response.data);
            } catch (error) {
                console.error('Error loading voice commands:', error);
            }
        };

        loadCommands();
    }, []);

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/api/feedback', {
                feedback: feedback,
                timestamp: new Date()
            });
            setFeedback('');
            setFeedbackSubmitted(true);
            setTimeout(() => setFeedbackSubmitted(false), 3000);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('提交反馈失败，请稍后重试');
        }
    };

    const handleVoiceCommand = (command) => {
        setLastCommand(command);
        const timestamp = new Date().toLocaleTimeString();
        setCommandHistory(prev => [
            ...prev,
            { command, timestamp }
        ]);

        // Process voice command
        if (voiceCommands.some(cmd => cmd.trigger === command)) {
            const action = voiceCommands.find(cmd => cmd.trigger === command).action;
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
    };

    const handleToggleListening = () => {
        setIsListening(!isListening);
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
