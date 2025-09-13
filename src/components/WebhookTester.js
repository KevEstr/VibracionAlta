import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';

const WebhookTester = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [testUrl, setTestUrl] = useState('');

  const testWebhook = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const url = testUrl || process.env.REACT_APP_N8N_WEBHOOK_URL;
      
      if (!url) {
        throw new Error('No hay URL configurada');
      }

      console.log('🔍 Probando webhook:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors'
      });

      console.log('📡 Response:', response);

      const text = await response.text();
      console.log('📦 Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`No es JSON válido: ${text.substring(0, 200)}...`);
      }

      setResult({
        success: true,
        status: response.status,
        data: data,
        rawText: text
      });

    } catch (error) {
      console.error('❌ Error:', error);
      setResult({
        success: false,
        error: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openInNewTab = () => {
    const url = testUrl || process.env.REACT_APP_N8N_WEBHOOK_URL;
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="webhook-tester">
      <div className="tester-header">
        <h3>🧪 Probador de Webhook</h3>
        <div className="tester-actions">
          <button 
            className="btn btn-outline btn-sm"
            onClick={openInNewTab}
            disabled={!testUrl && !process.env.REACT_APP_N8N_WEBHOOK_URL}
          >
            <ExternalLink size={14} />
            Abrir en nueva pestaña
          </button>
          <button 
            className="btn btn-primary"
            onClick={testWebhook}
            disabled={isLoading}
          >
            <RefreshCw size={16} className={isLoading ? 'spinning' : ''} />
            {isLoading ? 'Probando...' : 'Probar Webhook'}
          </button>
        </div>
      </div>

      <div className="url-input">
        <label>URL del Webhook:</label>
        <input
          type="text"
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          placeholder={process.env.REACT_APP_N8N_WEBHOOK_URL || 'Ingresa la URL del webhook'}
          className="url-field"
        />
      </div>

      {result && (
        <motion.div
          className={`test-result ${result.success ? 'success' : 'error'}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="result-icon">
            {result.success ? <CheckCircle size={24} /> : <XCircle size={24} />}
          </div>
          <div className="result-content">
            <h4>{result.success ? '✅ Webhook Funciona' : '❌ Error en Webhook'}</h4>
            
            {result.success ? (
              <div className="success-info">
                <p><strong>Status:</strong> {result.status}</p>
                <p><strong>Datos recibidos:</strong></p>
                <pre className="data-preview">{JSON.stringify(result.data, null, 2)}</pre>
              </div>
            ) : (
              <div className="error-info">
                <p><strong>Error:</strong> {result.error}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="tester-info">
        <h4>ℹ️ Instrucciones:</h4>
        <ol>
          <li>Verifica que la URL del webhook sea correcta</li>
          <li>Haz clic en "Probar Webhook"</li>
          <li>Si hay error de CORS, prueba abriendo la URL en nueva pestaña</li>
          <li>Revisa la consola del navegador para más detalles</li>
        </ol>
      </div>
    </div>
  );
};

export default WebhookTester;
