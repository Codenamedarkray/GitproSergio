import React, { useState, useEffect } from 'react';

export default function TripModule() {
  const [screen, setScreen] = useState('splash');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Estados do formulário de cálculo
  const [form, setForm] = useState({ origin: '', destination: '', km: '', autonomy: '', gasPrice: '5.50', alcPrice: '3.80' });
  const [results, setResults] = useState(null);

  // 1. Splash Screen Timeout
  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(() => setScreen('login'), 2500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  // 2. Login Fixo
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      setScreen('dashboard');
    } else {
      alert('Usuário ou senha incorretos!');
    }
  };

  // 3. Simulação de consumo da API mockada no front (ou chame seu fetch/axios aqui)
  const handleCalculate = (e) => {
    e.preventDefault();
    const km = parseFloat(form.km);
    const aut = parseFloat(form.autonomy);
    
    // Cálculos equivalentes aos endpoints do Node
    const liters = km / aut;
    const gasCost = liters * parseFloat(form.gasPrice);
    const alcCost = (km / (aut * 0.7)) * parseFloat(form.alcPrice);
    const tolls = km > 0 ? Math.max(1, Math.floor(km / 80)) : 0;
    const tollCost = tolls * 12;
    const hours = Math.floor(km / 90);
    const mins = Math.round(((km / 90) - hours) * 60);

    setResults({ liters, gasCost, alcCost, tolls, tollCost, time: `${hours}h ${mins}min` });
  };

  // Estilos simples inline para garantir que funcione em qualquer projeto sem quebrar CSS externo
  const styles = {
    container: { padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', background: '#f4f4f9', borderRadius: '8px' },
    nav: { display: 'flex', gap: '10px', marginBottom: '20px' },
    button: { padding: '8px 12px', cursor: 'pointer', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' },
    input: { display: 'block', width: '100%', padding: '8px', margin: '10px 0', borderRadius: '4px', border: '1px solid #ccc' }
  };

  if (screen === 'splash') {
    return (
      <div style={{ ...styles.container, textAlign: 'center', padding: '100px 20px' }}>
        <h1 style={{ fontSize: '3rem', color: '#007bff' }}>TRIP ✨</h1>
        <p>Travel Routing & Cost Predictor</p>
        <p style={{ color: '#888' }}>Carregando módulo...</p>
      </div>
    );
  }

  if (screen === 'login') {
    return (
      <div style={styles.container}>
        <h2>Login - Módulo TRIP</h2>
        <form onSubmit={handleLogin}>
          <input style={styles.input} type="text" placeholder="Usuário (admin)" onChange={e => setUsername(e.target.value)} />
          <input style={styles.input} type="password" placeholder="Senha (1234)" onChange={e => setPassword(e.target.value)} />
          <button style={styles.button} type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <button style={styles.button} onClick={() => setScreen('dashboard')}>Calculadora</button>
        <button style={styles.button} onClick={() => setScreen('about')}>Sobre a Equipe</button>
        <button style={styles.button} onClick={() => setScreen('help')}>Ajuda</button>
        <button style={{ ...styles.button, background: '#dc3545' }} onClick={() => setScreen('login')}>Sair</button>
      </nav>

      {screen === 'dashboard' && (
        <div>
          <h3>📍 Planejar Nova Viagem</h3>
          <form onSubmit={handleCalculate}>
            <input style={styles.input} type="text" placeholder="Origem" required />
            <input style={styles.input} type="text" placeholder="Destino" required />
            <input style={styles.input} type="number" placeholder="Distância (Km)" onChange={e => setForm({...form, km: e.target.value})} required />
            <input style={styles.input} type="number" placeholder="Consumo do Carro (Km/L)" onChange={e => setForm({...form, autonomy: e.target.value})} required />
            <button style={styles.button} type="submit">Calcular Custos</button>
          </form>

          {results && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#fff', borderRadius: '5px', borderLeft: '5px solid #28a745' }}>
              <h4>📊 Resumo da Viagem:</h4>
              <p>⛽ <b>Gasto Gasolina:</b> R$ {results.gasCost.toFixed(2)} ({results.liters.toFixed(1)} L)</p>
              <p>🪵 <b>Gasto Álcool:</b> R$ {results.alcCost.toFixed(2)}</p>
              <p>🛣️ <b>Pedágios:</b> {results.tolls} passagens (Total: R$ {results.tollCost.toFixed(2)})</p>
              <p>⏱️ <b>Tempo Estimado:</b> {results.time} (a 90km/h)</p>
            </div>
          )}
        </div>
      )}

      {screen === 'about' && (
        <div>
          <h3>👥 Nossa Equipe</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' }}>
            {/* Repita esse bloco para cada aluno do seu grupo */}
            <div style={{ background: '#fff', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#ccc', margin: '0 auto 10px' }}>📸</div>
              <b>Nome do Aluno 1</b>
              <p style={{ fontSize: '12px', color: '#666' }}>Função: Desenvolvedor API Cost</p>
            </div>
          </div>
        </div>
      )}

      {screen === 'help' && (
        <div>
          <h3>💡 Central de Ajuda</h3>
          <p><b>Como funciona o cálculo de pedágios?</b></p>
          <p style={{ color: '#555' }}>O sistema estima automaticamente um pedágio fixo de R$ 12,00 a cada 80km rodados.</p>
          <p><b>Por que o valor do álcool é diferente?</b></p>
          <p style={{ color: '#555' }}>O cálculo leva em conta que o rendimento do etanol é de 70% comparado ao da gasolina.</p>
        </div>
      )}
    </div>
  );
}