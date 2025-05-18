import React, { useRef, useState } from 'react';

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'zh-CN', label: '中文' },
];

const gradient = 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState(LANGUAGES[0].code);
  const [timer, setTimer] = useState(0);
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  // Timer logic
  React.useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  // Format timer as mm:ss
  const formatTime = (t) => {
    const m = String(Math.floor(t / 60)).padStart(2, '0');
    const s = String(t % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // Start/Stop recording
  const handleRecord = () => {
    if (!isRecording) {
      setTranscript('');
      setTimer(0);
      // Setup recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Speech Recognition not supported in this browser.');
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = 0; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) final += res[0].transcript;
          else interim += res[0].transcript;
        }
        setTranscript(final + interim);
      };
      recognition.onerror = (e) => {
        setIsRecording(false);
        recognition.stop();
        alert('Speech recognition error: ' + e.error);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } else {
      recognitionRef.current && recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Language change
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    if (isRecording) {
      handleRecord(); // stop
      setTimeout(() => handleRecord(), 300); // restart with new lang
    }
  };

  // Evaluation button handlers (placeholders)
  const handleEval = (type) => {
    setOutput(`${type} evaluation coming soon!`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f6fafd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.85)',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(60,60,120,0.08)',
        padding: 36,
        width: 480,
        maxWidth: '95vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h1 style={{ fontWeight: 700, fontSize: 36, margin: 0, color: '#223' }}>Brainwave</h1>
        <div style={{ height: 16 }} />
        <div style={{ fontSize: 20, color: '#444', marginBottom: 8 }}>{formatTime(timer)}</div>
        <button
          onClick={handleRecord}
          style={{
            background: gradient,
            border: 'none',
            borderRadius: '50%',
            width: 80,
            height: 80,
            color: '#223',
            fontWeight: 600,
            fontSize: 20,
            boxShadow: isRecording ? '0 0 0 4px #fda08555' : '0 2px 8px #f6d36533',
            marginBottom: 24,
            cursor: 'pointer',
            transition: 'box-shadow 0.2s',
          }}
        >
          {isRecording ? 'Stop' : 'Start'}
        </button>
        <div style={{ marginBottom: 12, alignSelf: 'flex-end' }}>
          <select
            value={language}
            onChange={handleLanguageChange}
            style={{
              borderRadius: 8,
              border: '1px solid #eee',
              padding: '4px 12px',
              fontSize: 15,
              background: '#f8fafc',
              color: '#223',
              marginRight: 8,
            }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
        </div>
        <div style={{
          background: '#f8fafc',
          borderRadius: 16,
          boxShadow: '0 2px 8px #e0e7ef22',
          padding: 16,
          width: '100%',
          marginBottom: 18,
          position: 'relative',
        }}>
          <textarea
            value={transcript}
            readOnly
            rows={4}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              resize: 'none',
              fontSize: 17,
              color: '#223',
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleCopy(transcript)}
            style={{
              position: 'absolute',
              right: 16,
              top: 16,
              background: '#e0cfff',
              color: '#223',
              border: 'none',
              borderRadius: 8,
              padding: '4px 14px',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 1px 4px #e0e7ef33',
            }}
          >Copy</button>
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 18 }}>
          <button
            onClick={() => handleEval('Readability')}
            style={{
              background: '#e6f2fb',
              color: '#223',
              border: 'none',
              borderRadius: 12,
              padding: '8px 18px',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 1px 4px #e0e7ef22',
            }}
          >Readability</button>
          <button
            onClick={() => handleEval('Correctness')}
            style={{
              background: '#e6f2fb',
              color: '#223',
              border: 'none',
              borderRadius: 12,
              padding: '8px 18px',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 1px 4px #e0e7ef22',
            }}
          >Correctness</button>
          <button
            onClick={() => handleEval('Ask AI')}
            style={{
              background: '#e6f2fb',
              color: '#223',
              border: 'none',
              borderRadius: 12,
              padding: '8px 18px',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 1px 4px #e0e7ef22',
              opacity: 0.7,
            }}
          >Ask AI</button>
        </div>
        <div style={{
          background: '#f8fafc',
          borderRadius: 16,
          boxShadow: '0 2px 8px #e0e7ef22',
          padding: 16,
          width: '100%',
          position: 'relative',
        }}>
          <textarea
            value={output}
            readOnly
            rows={3}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              resize: 'none',
              fontSize: 17,
              color: '#223',
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleCopy(output)}
            style={{
              position: 'absolute',
              right: 16,
              top: 16,
              background: '#e0cfff',
              color: '#223',
              border: 'none',
              borderRadius: 8,
              padding: '4px 14px',
              fontWeight: 600,
              fontSize: 15,
              cursor: 'pointer',
              boxShadow: '0 1px 4px #e0e7ef33',
            }}
          >Copy</button>
        </div>
      </div>
    </div>
  );
}

export default App; 