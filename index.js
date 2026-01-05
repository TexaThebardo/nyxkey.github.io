/* Reset y configuración base */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #6c63ff;
    --primary-dark: #5a52e0;
    --secondary-color: #ff6584;
    --accent-color: #00d4aa;
    --dark-bg: #0a0a14;
    --darker-bg: #05050a;
    --card-bg: #141424;
    --card-border: #2a2a3a;
    --text-primary: #ffffff;
    --text-secondary: #b8b8d1;
    --text-muted: #8a8aa3;
    --success: #00d4aa;
    --warning: #ffb74d;
    --danger: #ff6b6b;
    --info: #4fc3f7;
    --discord: #5865f2;
    --transition: all 0.3s ease;
    --shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    --glow: 0 0 20px rgba(108, 99, 255, 0.3);
}

body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background-color: var(--dark-bg);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
    background-image: 
        radial-gradient(circle at 10% 20%, rgba(108, 99, 255, 0.1) 0%, transparent 30%),
        radial-gradient(circle at 90% 80%, rgba(255, 101, 132, 0.05) 0%, transparent 30%),
        linear-gradient(135deg, var(--darker-bg) 0%, var(--dark-bg) 100%);
}

/* ===== PANTALLA DE CARGA ===== */
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--darker-bg) 0%, #0c0c1c 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}

.loading-screen.fade-out {
    opacity: 0;
    visibility: hidden;
}

.loading-content {
    text-align: center;
    max-width: 600px;
    padding: 40px;
    animation: fadeIn 0.8s ease;
}

.loading-logo {
    font-size: 5rem;
    font-weight: 900;
    letter-spacing: 15px;
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
    gap: 10px;
    text-shadow: 0 0 30px rgba(108, 99, 255, 0.7);
}

.loading-logo .logo-n {
    color: #ffffff;
    animation: logoGlow 2s ease-in-out infinite alternate;
}

.loading-logo .logo-y {
    color: var(--primary-color);
    animation: logoGlow 2s ease-in-out infinite alternate 0.2s;
}

.loading-logo .logo-x {
    color: #ffffff;
    animation: logoGlow 2s ease-in-out infinite alternate 0.4s;
}

.loading-title {
    font-size: 1.8rem;
    margin-bottom: 15px;
    color: var(--text-primary);
    background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.loading-subtitle {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin-bottom: 40px;
    max-width: 500px;
    line-height: 1.6;
}

/* Spinner de carga */
.spinner {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 30px;
}

.spinner-circle {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 4px solid transparent;
    border-radius: 50%;
    animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-circle:nth-child(1) {
    border-top-color: var(--primary-color);
    animation-delay: -0.45s;
}

.spinner-circle:nth-child(2) {
    border-top-color: var(--accent-color);
    animation-delay: -0.3s;
}

.spinner-circle:nth-child(3) {
    border-top-color: var(--secondary-color);
    animation-delay: -0.15s;
}

.spinner-circle:nth-child(4) {
    border-top-color: var(--discord);
}

.loading-progress {
    width: 300px;
    margin: 0 auto;
    position: relative;
}

.progress-bar {
    width: 0%;
    height: 8px;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    border-radius: 4px;
    transition: width 0.3s ease;
    box-shadow: var(--glow);
}

.progress-text {
    position: absolute;
    right: 0;
    top: -25px;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.loading-tip {
    margin-top: 40px;
    padding: 15px;
    background-color: rgba(108, 99, 255, 0.1);
    border-radius: 10px;
    border-left: 4px solid var(--primary-color);
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--text-secondary);
}

.loading-tip i {
    color: var(--accent-color);
}

/* ===== CONTENIDO PRINCIPAL ===== */
.container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 20px;
}

.main-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: var(--card-bg);
    border-radius: 20px;
    margin-bottom: 30px;
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow);
    animation: slideDown 0.6s ease;
}

.logo-container {
    display: flex;
    align-items: center;
    gap: 20px;
}

.main-logo {
    font-size: 3rem;
    font-weight: 900;
    letter-spacing: 10px;
    display: flex;
    gap: 5px;
    text-shadow: 0 0 20px rgba(108, 99, 255, 0.5);
}

.main-logo .logo-n {
    color: #ffffff;
}

.main-logo .logo-y {
    color: var(--primary-color);
}

.main-logo .logo-x {
    color: #ffffff;
}

.logo-subtitle {
    color: var(--text-secondary);
    font-size: 0.9rem;
    letter-spacing: 3px;
    text-transform: uppercase;
}

.header-info {
    display: flex;
    gap: 20px;
    align-items: center;
}

.status-badge {
    padding: 10px 20px;
    border-radius: 50px;
    font-weight: 700;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.status-badge.online {
    background-color: rgba(0, 212, 170, 0.1);
    color: var(--success);
    border: 2px solid var(--success);
}

.status-badge i {
    font-size: 0.7rem;
}

.keys-today {
    color: var(--text-secondary);
    font-size: 0.95rem;
}

.keys-today i {
    color: var(--primary-color);
    margin-right: 5px;
}

/* ===== LAYOUT GRID ===== */
.content-grid {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 30px;
    margin-bottom: 30px;
}

@media (max-width: 1100px) {
    .content-grid {
        grid-template-columns: 1fr;
    }
}

/* ===== PANEL GENERADOR ===== */
.generator-panel {
    animation: slideLeft 0.6s ease;
}

.panel-header {
    margin-bottom: 25px;
}

.panel-header h1 {
    font-size: 2.2rem;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 15px;
    color: var(--text-primary);
}

.panel-header h1 i {
    color: var(--primary-color);
}

.panel-subtitle {
    color: var(--text-secondary);
    font-size: 1.1rem;
}

.generator-card {
    background-color: var(--card-bg);
    border-radius: 20px;
    padding: 30px;
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow);
    margin-bottom: 25px;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-primary);
    font-size: 1.4rem;
}

.card-header h3 i {
    color: var(--accent-color);
}

.generator-settings {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
    margin-bottom: 30px;
}

.setting-group label {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
    color: var(--text-primary);
    font-weight: 600;
    font-size: 1rem;
}

.setting-group label i {
    color: var(--primary-color);
}

.form-select, .form-input {
    width: 100%;
    padding: 14px 18px;
    background-color: rgba(255, 255, 255, 0.05);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    color: var(--text-primary);
    font-size: 1rem;
    transition: var(--transition);
}

.form-select:focus, .form-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.08);
}

.range-slider {
    width: 100%;
    height: 8px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    outline: none;
}

.range-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--primary-color);
    cursor: pointer;
    box-shadow: 0 0 10px rgba(108, 99, 255, 0.5);
}

.range-value {
    text-align: center;
    margin-top: 10px;
    color: var(--text-secondary);
    font-size: 0.95rem;
}

.range-value span {
    color: var(--primary-color);
    font-weight: 700;
    font-size: 1.2rem;
}

.format-options {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.radio-option {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    padding: 12px;
    border-radius: 10px;
    transition: var(--transition);
    border: 2px solid transparent;
}

.radio-option:hover {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
}

.radio-option input[type="radio"] {
    display: none;
}

.radio-custom {
    width: 20px;
    height: 20px;
    border: 2px solid var(--text-muted);
    border-radius: 50%;
    position: relative;
    transition: var(--transition);
}

.radio-option input[type="radio"]:checked + .radio-custom {
    border-color: var(--primary-color);
    background-color: var(--primary-color);
    box-shadow: 0 0 10px rgba(108, 99, 255, 0.5);
}

.radio-option input[type="radio"]:checked + .radio-custom::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    background-color: white;
    border-radius: 50%;
}

/* Botones del generador */
.generator-actions {
    display: flex;
    gap: 20px;
    margin-top: 40px;
}

.generate-btn, .reset-btn {
    flex: 1;
    padding: 18px;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.generate-btn {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
    color: white;
    box-shadow: 0 5px 20px rgba(108, 99, 255, 0.3);
}

.generate-btn:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(108, 99, 255, 0.4);
}

.generate-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.reset-btn {
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--text-secondary);
    border: 2px solid rgba(255, 255, 255, 0.1);
}

.reset-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
}

/* Contador de generación */
.countdown-container {
    margin-top: 40px;
    padding: 30px;
    background: linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(0, 212, 170, 0.1));
    border-radius: 15px;
    text-align: center;
    border: 2px solid rgba(108, 99, 255, 0.3);
    animation: pulse 2s infinite;
}

.countdown-header {
    font-size: 1.2rem;
    color: var(--text-primary);
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.countdown-header i {
    color: var(--accent-color);
}

.countdown-timer {
    font-size: 4rem;
    font-weight: 900;
    color: var(--primary-color);
    margin: 20px 0;
    text-shadow: 0 0 20px rgba(108, 99, 255, 0.5);
    font-family: 'Courier New', monospace;
}

.countdown-text {
    color: var(--text-secondary);
    font-size: 1rem;
    margin-bottom: 20px;
}

.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    color: var(--text-secondary);
}

.loading-dots {
    display: flex;
    gap: 6px;
}

.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--primary-color);
    animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

/* Resultados de generación */
.results-container {
    margin-top: 40px;
    animation: fadeIn 0.5s ease;
}

.results-header {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 25px;
    font-size: 1.3rem;
    font-weight: 700;
}

.results-header.success {
    background-color: rgba(0, 212, 170, 0.1);
    color: var(--success);
    border-left: 5px solid var(--success);
}

.results-header i {
    font-size: 1.8rem;
}

.generated-keys {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 25px;
}

.key-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    border: 2px solid rgba(255, 255, 255, 0.05);
    transition: var(--transition);
}

.key-item:hover {
    border-color: rgba(108, 99, 255, 0.3);
    background-color: rgba(108, 99, 255, 0.05);
}

.key-value {
    font-family: 'Courier New', monospace;
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: var(--primary-color);
}

.key-actions {
    display: flex;
    gap: 10px;
}

.copy-btn, .delete-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 8px;
}

.copy-btn {
    background-color: rgba(108, 99, 255, 0.1);
    color: var(--primary-color);
    border: 2px solid rgba(108, 99, 255, 0.3);
}

.copy-btn:hover {
    background-color: rgba(108, 99, 255, 0.2);
    border-color: rgba(108, 99, 255, 0.5);
}

.delete-btn {
    background-color: rgba(255, 107, 107, 0.1);
    color: var(--danger);
    border: 2px solid rgba(255, 107, 107, 0.3);
}

.delete-btn:hover {
    background-color: rgba(255, 107, 107, 0.2);
    border-color: rgba(255, 107, 107, 0.5);
}

.results-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
}

.info-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-secondary);
}

.info-item i {
    color: var(--primary-color);
    font-size: 1.2rem;
}

.info-item strong {
    color: var(--text-primary);
    margin-left: 5px;
}

.results-actions {
    display: flex;
    gap: 20px;
}

.copy-all-btn, .save-btn {
    flex: 1;
    padding: 16px;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.copy-all-btn {
    background-color: rgba(108, 99, 255, 0.1);
    color: var(--primary-color);
    border: 2px solid rgba(108, 99, 255, 0.3);
}

.copy-all-btn:hover {
    background-color: rgba(108, 99, 255, 0.2);
    border-color: rgba(108, 99, 255, 0.5);
}

.save-btn {
    background-color: rgba(0, 212, 170, 0.1);
    color: var(--success);
    border: 2px solid rgba(0, 212, 170, 0.3);
}

.save-btn:hover {
    background-color: rgba(0, 212, 170, 0.2);
    border-color: rgba(0, 212, 170, 0.5);
}

/* Instrucciones */
.instructions-card {
    background-color: var(--card-bg);
    border-radius: 20px;
    padding: 30px;
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow);
}

.instructions-card h3 {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 25px;
    color: var(--text-primary);
    font-size: 1.4rem;
}

.instructions-card h3 i {
    color: var(--info);
}

.instructions-list {
    margin-left: 20px;
    margin-bottom: 25px;
}

.instructions-list li {
    margin-bottom: 12px;
    color: var(--text-secondary);
    line-height: 1.6;
}

.warning-note {
    display: flex;
    gap: 15px;
    padding: 20px;
    background-color: rgba(255, 183, 77, 0.1);
    border-radius: 12px;
    border-left: 5px solid var(--warning);
    color: var(--text-secondary);
}

.warning-note i {
    color: var(--warning);
    font-size: 1.5rem;
    flex-shrink: 0;
}

.warning-note p {
    line-height: 1.6;
}

/* ===== PANEL DISCORD ===== */
.discord-panel {
    animation: slideRight 0.6s ease;
}

.discord-card {
    background-color: var(--card-bg);
    border-radius: 20px;
    padding: 25px;
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow);
    margin-bottom: 25px;
}

.discord-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.discord-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--discord), #4752c4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: white;
}

.discord-title h3 {
    color: var(--text-primary);
    font-size: 1.5rem;
    margin-bottom: 5px;
}

.discord-subtitle {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.discord-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 25px;
}

.stat-card {
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 15px;
    transition: var(--transition);
}

.stat-card:hover {
    background-color: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
}

.stat-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
}

.stat-icon.online {
    background-color: rgba(0, 212, 170, 0.1);
    color: var(--success);
}

.stat-icon.offline {
    background-color: rgba(255, 107, 107, 0.1);
    color: var(--danger);
}

.stat-content {
    flex: 1;
}

.stat-label {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin-bottom: 5px;
}

.stat-value {
    color: var(--text-primary);
    font-size: 1.8rem;
    font-weight: 700;
}

.discord-info {
    margin-bottom: 25px;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-row:last-child {
    border-bottom: none;
}

.info-label {
    color: var(--text-secondary);
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.info-label i {
    color: var(--primary-color);
}

.info-value {
    color: var(--text-primary);
    font-weight: 600;
}

.discord-activity {
    margin-bottom: 25px;
}

.discord-activity h4 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    color: var(--text-primary);
    font-size: 1.1rem;
}

.discord-activity h4 i {
    color: var(--secondary-color);
}

.activity-list {
    list-style: none;
}

.activity-list li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 8px;
    background-color: rgba(255, 255, 255, 0.02);
    transition: var(--transition);
}

.activity-list li:hover {
    background-color: rgba(255, 255, 255, 0.05);
}

.activity-icon {
    font-size: 0.9rem;
    flex-shrink: 0;
}

.activity-icon.key-gen { color: var(--success); }
.activity-icon.join { color: var(--info); }
.activity-icon.update { color: var(--primary-color); }

.activity-list li span:first-of-type {
    flex: 1;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

.activity-list li strong {
    color: var(--text-primary);
    font-weight: 600;
}

.activity-time {
    color: var(--text-muted);
    font-size: 0.8rem;
    flex-shrink: 0;
}

.discord-join-btn {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, var(--discord), #4752c4);
    border: none;
    border-radius: 12px;
    color: white;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 20px;
}

.discord-join-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(88, 101, 242, 0.3);
}

.discord-footer {
    color: var(--text-secondary);
    font-size: 0.9rem;
    line-height: 1.6;
}

.discord-footer p {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
}

.discord-footer i {
    color: var(--accent-color);
}

/* Estadísticas */
.stats-card {
    background-color: var(--card-bg);
    border-radius: 20px;
    padding: 25px;
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow);
}

.stats-card h4 {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    color: var(--text-primary);
    font-size: 1.2rem;
}

.stats-card h4 i {
    color: var(--accent-color);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
    margin-bottom: 20px;
}

.mini-stat {
    background-color: rgba(255, 255, 255, 0.03);
    border-radius: 10px;
    padding: 15px;
    text-align: center;
    transition: var(--transition);
}

.mini-stat:hover {
    background-color: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
}

.mini-stat-icon {
    width: 40px;
    height: 40px;
    background-color: rgba(108, 99, 255, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10px;
    color: var(--primary-color);
    font-size: 1.2rem;
}

.mini-stat-value {
    color: var(--text-primary);
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 5px;
}

.mini-stat-label {
    color: var(--text-secondary);
    font-size: 0.8rem;
}

.stats-update {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--text-muted);
    font-size: 0.85rem;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.stats-update i {
    color: var(--accent-color);
}

/* Footer */
.main-footer {
    background-color: var(--card-bg);
    border-radius: 20px;
    padding: 30px;
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow);
    animation: fadeIn 0.8s ease;
}

.footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

.footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
}

.logo-small {
    font-size: 2rem;
    font-weight: 900;
    color: var(--primary-color);
    letter-spacing: 5px;
}

.footer-version {
    color: var(--text-secondary);
    font-size: 0.9rem;
    background-color: rgba(108, 99, 255, 0.1);
    padding: 5px 15px;
    border-radius: 20px;
}

.footer-links {
    display: flex;
    gap: 25px;
    margin-bottom: 25px;
    flex-wrap: wrap;
    justify-content: center;
}

.footer-links a {
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: var(--transition);
}

.footer-links a:hover {
    color: var(--primary-color);
}

.footer-copyright {
    color: var(--text-muted);
    font-size: 0.9rem;
    line-height: 1.6;
    max-width: 600px;
}

.footer-note {
    margin-top: 10px;
    font-size: 0.85rem;
    color: var(--text-muted);
    opacity: 0.8;
}

/* ===== NOTIFICACIONES TOAST ===== */
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.toast {
    background-color: var(--card-bg);
    border-left: 5px solid;
    padding: 18px 25px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    display: flex;
    align-items: center;
    gap: 15px;
    animation: slideLeft 0.3s ease;
    max-width: 350px;
    border: 1px solid var(--card-border);
}

.toast.success {
    border-left-color: var(--success);
}

.toast.error {
    border-left-color: var(--danger);
}

.toast.warning {
    border-left-color: var(--warning);
}

.toast.info {
    border-left-color: var(--info);
}

.toast i {
    font-size: 1.5rem;
}

.toast-content {
    flex: 1;
}

.toast-title {
    font-weight: 700;
    margin-bottom: 5px;
    color: var(--text-primary);
}

.toast-message {
    color: var(--text-secondary);
    font-size: 0.9rem;
}

/* ===== MODAL ===== */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
    opacity: 0;
    visibility: hidden;
    transition: var(--transition);
    backdrop-filter: blur(5px);
}

.modal.active {
    opacity: 1;
    visibility: visible;
}

.modal-content {
    background-color: var(--card-bg);
    border-radius: 20px;
    width: 90%;
    max-width: 500px;
    overflow: hidden;
    transform: translateY(-30px);
    transition: var(--transition);
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow);
}

.modal.active .modal-content {
    transform: translateY(0);
}

.modal-header {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 25px 30px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header.success {
    background-color: rgba(0, 212, 170, 0.1);
    color: var(--success);
}

.modal-header i {
    font-size: 2rem;
}

.modal-header h3 {
    flex: 1;
    color: var(--text-primary);
    font-size: 1.4rem;
}

.close-modal {
    background: none;
    border: none;
    color: var(--text-secondary);
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
    transition: var(--transition);
}

.close-modal:hover {
    color: var(--danger);
}

.modal-body {
    padding: 30px;
}

.modal-body p {
    margin-bottom: 20px;
    color: var(--text-secondary);
    line-height: 1.6;
}

.modal-keys {
    background-color: rgba(255, 255, 255, 0.03);
    padding: 20px;
    border-radius: 12px;
    margin: 20px 0;
    font-family: 'Courier New', monospace;
    font-size: 1.1rem;
    color: var(--primary-color);
    text-align: center;
    letter-spacing: 1px;
    border: 2px dashed rgba(108, 99, 255, 0.3);
}

.modal-note {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-secondary);
    font-size: 0.95rem;
}

.modal-note i {
    color: var(--warning);
}

.modal-footer {
    padding: 20px 30px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: flex-end;
    gap: 15px;
}

.modal-btn {
    padding: 12px 25px;
    border: none;
    border-radius: 10px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    gap: 8px;
}

.modal-btn.primary {
    background-color: var(--primary-color);
    color: white;
}

.modal-btn.primary:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
}

.modal-btn.secondary {
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text-secondary);
}

.modal-btn.secondary:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

/* ===== ANIMACIONES ===== */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideLeft {
    from {
        opacity: 0;
        transform: translateX(30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes slideRight {
    from {
        opacity: 0;
        transform: translateX(-30px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1.0); }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
}

@keyframes logoGlow {
    from {
        text-shadow: 0 0 10px rgba(108, 99, 255, 0.5);
    }
    to {
        text-shadow: 0 0 20px rgba(108, 99, 255, 0.8), 0 0 30px rgba(108, 99, 255, 0.4);
    }
}

/* ===== RESPONSIVE ===== */
@media (max-width: 768px) {
    .container {
        padding: 15px;
    }
    
    .main-header {
        flex-direction: column;
        gap: 20px;
        text-align: center;
    }
    
    .loading-logo {
        font-size: 3.5rem;
        letter-spacing: 10px;
    }
    
    .loading-title {
        font-size: 1.4rem;
    }
    
    .main-logo {
        font-size: 2.5rem;
        letter-spacing: 5px;
    }
    
    .panel-header h1 {
        font-size: 1.8rem;
    }
    
    .generator-actions {
        flex-direction: column;
    }
    
    .results-actions {
        flex-direction: column;
    }
    
    .discord-stats {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .footer-links {
        flex-direction: column;
        gap: 15px;
    }
}
