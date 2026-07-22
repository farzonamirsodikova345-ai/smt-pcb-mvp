import React, { useState, useEffect } from "react";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const API_URL = "http://localhost:5000/api/auth/login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Заполните email и пароль");
      return;
    }
    setLoading(true);

    // Демо-режим: вход без сервера
    if (email === "admin@test.com" && password === "admin") {
      localStorage.setItem("token", "demo-token");
      window.location.href = "/dashboard";
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || data.message || "Неверный email или пароль");
      } else {
  localStorage.setItem("token", data.token);
  localStorage.setItem("role", data.user.role);
  localStorage.setItem("user", JSON.stringify(data.user));
  window.location.href = "/dashboard";
}
    } catch (err) {
      setError("Сервер недоступен. Демо: admin@test.com / admin");
    } finally {
      setLoading(false);
    }
  };

  // Генератор случайных позиций для компонентов
  const randomPos = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min);

  // SMD резисторы (много)
  const RESISTORS = Array.from({ length: 35 }, (_, i) => ({
    id: `R${200 + i}`,
    x: randomPos(110, 560),
    y: randomPos(140, 580),
    w: [10, 12, 14][i % 3],
    h: [4, 5][i % 2],
    rotation: [0, 90][i % 2],
    delay: 0.5 + i * 0.04,
  }));

  // SMD конденсаторы (много)
  const CAPACITORS_SMD = Array.from({ length: 40 }, (_, i) => ({
    id: `C${100 + i}`,
    x: randomPos(110, 560),
    y: randomPos(140, 580),
    w: [6, 8, 10][i % 3],
    h: [4, 5, 6][i % 3],
    rotation: [0, 90][i % 2],
    delay: 0.3 + i * 0.03,
  }));

  // Керамические конденсаторы (таблетки)
  const CERAMIC_CAPS = [
    { id: 'C150', x: 140, y: 180, r: 7 },
    { id: 'C151', x: 160, y: 180, r: 6 },
    { id: 'C152', x: 180, y: 180, r: 8 },
    { id: 'C153', x: 520, y: 200, r: 7 },
    { id: 'C154', x: 540, y: 200, r: 6 },
    { id: 'C155', x: 140, y: 520, r: 9 },
    { id: 'C156', x: 520, y: 540, r: 8 },
    { id: 'C157', x: 540, y: 540, r: 7 },
    { id: 'C158', x: 300, y: 560, r: 6 },
    { id: 'C159', x: 320, y: 560, r: 7 },
  ];

  // Диоды
  const DIODES = Array.from({ length: 12 }, (_, i) => ({
    id: `D${i + 1}`,
    x: randomPos(120, 550),
    y: randomPos(150, 570),
    delay: 1.2 + i * 0.08,
  }));

  // Дроссели / индукторы
  const INDUCTORS = [
    { id: 'L1', x: 160, y: 320, w: 14, h: 14 },
    { id: 'L2', x: 180, y: 320, w: 12, h: 12 },
    { id: 'L3', x: 500, y: 340, w: 14, h: 14 },
    { id: 'L4', x: 520, y: 340, w: 12, h: 12 },
    { id: 'L5', x: 200, y: 480, w: 16, h: 16 },
    { id: 'L6', x: 480, y: 500, w: 14, h: 14 },
  ];

  // MOSFET
  const MOSFETS = [
    { id: 'Q1', x: 150, y: 380, w: 10, h: 10 },
    { id: 'Q2', x: 170, y: 380, w: 10, h: 10 },
    { id: 'Q3', x: 530, y: 400, w: 10, h: 10 },
    { id: 'Q4', x: 550, y: 400, w: 10, h: 10 },
  ];

  // Кварцевые генераторы
  const CRYSTALS = [
    { id: 'Y1', x: 250, y: 160, w: 16, h: 8 },
    { id: 'Y2', x: 450, y: 160, w: 14, h: 6 },
  ];

  // Предохранители
  const FUSES = [
    { id: 'F1', x: 130, y: 220, w: 12, h: 4 },
    { id: 'F2', x: 550, y: 240, w: 12, h: 4 },
  ];

  // Светодиоды-индикаторы
  const LEDS = [
    { id: 'LED1', x: 130, y: 580, color: '#ff6b35' },
    { id: 'LED2', x: 145, y: 580, color: '#52e39a' },
    { id: 'LED3', x: 160, y: 580, color: '#ff9d3d' },
  ];

  // Тестовые площадки
  const TEST_POINTS = Array.from({ length: 15 }, (_, i) => ({
    id: `TP${i + 1}`,
    x: randomPos(120, 560),
    y: randomPos(140, 580),
  }));

  // Дорожки PCB
  const TRACES = [
    // Питание CPU
    "M200,290 L200,350 L240,350 L240,380",
    "M310,290 L310,330 L350,330 L350,380",
    "M240,235 L240,180 L180,180 L180,220",
    "M270,235 L270,200 L320,200 L320,180",
    // DDR линии
    "M400,178 L400,150 L350,150 L350,130",
    "M430,178 L430,140 L380,140",
    "M460,178 L460,160 L500,160 L500,130",
    "M480,210 L480,250 L520,250 L520,290",
    // Tuner
    "M480,308 L480,350 L450,350 L450,380",
    "M520,308 L520,340 L550,340",
    "M560,264 L580,264 L580,350 L560,350",
    // HDMI/USB
    "M163,530 L163,480 L200,480 L200,450",
    "M196,530 L196,490 L240,490",
    "M303,530 L303,480 L340,480 L340,450",
    "M336,530 L336,500 L380,500",
    // LVDS
    "M483,492 L483,450 L460,450 L460,420",
    "M516,492 L516,460 L500,460",
    // Питание общее
    "M120,300 L160,300 L160,280 L200,280",
    "M120,400 L140,400 L140,380",
    "M580,300 L540,300 L540,280",
    "M580,450 L560,450 L560,420",
    // Земля
    "M120,500 L180,500 L180,480 L220,480",
    "M580,500 L520,500 L520,480",
    // Сигнальные
    "M280,350 L280,420 L320,420 L320,450",
    "M350,290 L350,250 L400,250 L400,220",
    "M420,350 L420,400 L460,400",
    "M380,420 L380,480 L420,480",
    "M250,450 L250,500 L290,500",
    "M450,350 L450,300 L500,300",
    "M300,500 L300,540 L340,540",
    "M480,400 L480,350 L520,350",
  ];

  // Vias (переходные отверстия)
  const VIAS = [
    [200, 300], [240, 320], [280, 280], [320, 310],
    [350, 250], [380, 350], [420, 280], [460, 320],
    [500, 260], [520, 340], [480, 380], [450, 420],
    [300, 400], [260, 450], [340, 480], [400, 450],
    [180, 350], [160, 400], [540, 300], [560, 380],
    [220, 500], [380, 500], [500, 450], [300, 520],
  ];

  return (
    <div className="login-page">
      {/* ================= ЛЕВАЯ ПАНЕЛЬ — ФОРМА ================= */}
      <div className="form-panel">
        <div className={`form-inner ${mounted ? "fade-up" : ""}`}>

          <div className="logo-row">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#52e39a" strokeWidth={1.6}>
              <rect x="7" y="7" width="10" height="10" rx="2" />
              <circle cx="12" cy="12" r="2" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
            </svg>
            <div>
              <div className="logo-text">PCB<span className="logo-accent">Flow</span></div>
              <div className="logo-sub">Manufacturing Execution System</div>
            </div>
          </div>

          <div className="tagline">
            Каждая плата — это чья-то надёжность. Мы делаем её без права на ошибку.
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6b35" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <div className="field">
              <label className="field-label">Email</label>
              <div className={`input-wrap ${focusedField === "email" ? "focused" : ""}`}>
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
                  <path d="M3 6h18v12H3z" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
                <input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label">Пароль</label>
              <div className={`input-wrap ${focusedField === "password" ? "focused" : ""}`}>
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Показать пароль"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
                    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06140d" strokeWidth={2}>
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              ) : (
                <>
                  ACCESS PRODUCTION
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#06140d" strokeWidth={2}>
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ================= ПРАВАЯ ПАНЕЛЬ — ПЛАТА В СБОРКЕ ================= */}
      <div className="pcb-panel">
        <svg
          className="pcb-svg pcb-glow"
          viewBox="0 0 700 700"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="boardFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#123a2c" />
              <stop offset="100%" stopColor="#0a2318" />
            </linearGradient>
            <linearGradient id="copperBand" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#3fbd7f" stopOpacity={0} />
              <stop offset="45%" stopColor="#d8b46a" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#3fbd7f" stopOpacity={0} />
            </linearGradient>
            <radialGradient id="sparkGlow">
              <stop offset="0%" stopColor="#fff3c4" stopOpacity="1" />
              <stop offset="40%" stopColor="#ff9d3f" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ff9d3f" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="strong-glow">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a4a35" strokeWidth="0.3" opacity="0.3" />
            </pattern>
          </defs>

          {/* ---------- РЕЛЬСА гантри-станка ---------- */}
          <line x1="150" y1="18" x2="550" y2="18" stroke="#e6c96e" strokeWidth={3} strokeLinecap="round" opacity={0.85} />
          <circle cx="150" cy="18" r="4" fill="#e6c96e" />
          <circle cx="550" cy="18" r="4" fill="#e6c96e" />

          {/* ---------- РОБОТ 1 ---------- */}
          <g>
            <rect x="235" y="10" width="28" height="16" rx="3" fill="#0d1410" stroke="#3fbd7f" strokeWidth={2} />
            <g className="robot-descend robot-1">
              <line x1="242" y1="26" x2="242" y2="58" stroke="#3fbd7f" strokeWidth={2} />
              <line x1="256" y1="26" x2="256" y2="58" stroke="#3fbd7f" strokeWidth={2} />
              <rect x="228" y="58" width="42" height="28" rx="4" fill="#0d1410" stroke="#3fbd7f" strokeWidth={2.4} />
              <line x1="228" y1="69" x2="270" y2="69" stroke="#e6c96e" strokeWidth={1.4} strokeDasharray="4 3" />
              <line x1="249" y1="86" x2="249" y2="150" stroke="#3fbd7f" strokeWidth={2.4} />
              <circle cx="249" cy="154" r="6" fill="none" stroke="#3fbd7f" strokeWidth={2} />
            </g>
            <circle className="solder-spark spark-1" cx="249" cy="192" r="14" fill="url(#sparkGlow)" />
          </g>

          {/* ---------- РОБОТ 2 ---------- */}
          <g>
            <rect x="435" y="10" width="28" height="16" rx="3" fill="#0d1410" stroke="#3fbd7f" strokeWidth={2} />
            <g className="robot-descend robot-2">
              <line x1="442" y1="26" x2="442" y2="52" stroke="#3fbd7f" strokeWidth={2} />
              <line x1="456" y1="26" x2="456" y2="52" stroke="#3fbd7f" strokeWidth={2} />
              <rect x="430" y="52" width="42" height="26" rx="4" fill="#0d1410" stroke="#3fbd7f" strokeWidth={2.4} />
              <line x1="430" y1="63" x2="472" y2="63" stroke="#e6c96e" strokeWidth={1.4} strokeDasharray="4 3" />
              <line x1="449" y1="78" x2="449" y2="132" stroke="#3fbd7f" strokeWidth={2.4} />
              <circle cx="449" cy="136" r="6" fill="none" stroke="#3fbd7f" strokeWidth={2} />
            </g>
            <circle className="solder-spark spark-2" cx="449" cy="172" r="14" fill="url(#sparkGlow)" />
          </g>

          {/* Камера контроля качества */}
          <g className="signal-pulse">
            <line x1="600" y1="18" x2="600" y2="55" stroke="#3fbd7f" strokeWidth={2} />
            <circle cx="600" cy="63" r="11" fill="none" stroke="#3fbd7f" strokeWidth={2} />
            <circle cx="600" cy="63" r="3" fill="#ff6b35" />
          </g>

          {/* ========== КОРПУС ПЛАТЫ ========== */}
          <rect x="90" y="110" width="520" height="520" rx="24"
            fill="url(#boardFill)" stroke="#3fbd7f" strokeWidth={1.6} />
          
          {/* Фоновая сетка платы */}
          <rect x="90" y="110" width="520" height="520" rx="24" fill="url(#grid)" opacity="0.5" />

          {/* Reflow зона */}
          <g className="reflow-bar">
            <polygon points="370,110 450,110 240,630 160,630" fill="url(#copperBand)" />
          </g>

          {/* Сканер */}
          <line className="scan-line" x1="106" y1="130" x2="106" y2="610"
            stroke="#52e39a" strokeWidth={1} opacity={0.25} />

          {/* ========== МОНТАЖНЫЕ ОТВЕРСТИЯ С МЕТАЛЛИЧЕСКИМИ КОЛЬЦАМИ ========== */}
          {[[112,132],[588,132],[112,608],[588,608]].map(([x,y],i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="10" fill="none" stroke="#7a9a8a" strokeWidth="2" opacity="0.6" />
              <circle cx={x} cy={y} r="6" fill="#1a3a2a" stroke="#5a8a6a" strokeWidth="1.5" />
              <circle cx={x} cy={y} r="2.5" fill="#3fbd7f" opacity="0.8" />
            </g>
          ))}

          {/* ========== ШЁЛКОГРАФИЯ / ПРОИЗВОДСТВЕННАЯ ИНФОРМАЦИЯ ========== */}
          <text x="106" y="152" fill="#7fe8c4" fontSize="10" fontFamily="monospace" letterSpacing="1">TV-MAIN-PCB V2.1</text>
          <text x="106" y="164" fill="#4f8f78" fontSize="8" fontFamily="monospace" letterSpacing="1">SMT REV A</text>
          <text x="106" y="176" fill="#4f8f78" fontSize="7" fontFamily="monospace">PCBFLOW ELECTRONICS</text>
          <text x="106" y="186" fill="#4f8f78" fontSize="6" fontFamily="monospace">ROHS | LEAD FREE</text>
          <text x="106" y="196" fill="#3f7f68" fontSize="6" fontFamily="monospace">MADE IN UZBEKISTAN</text>
          
          <text x="480" y="152" fill="#4f8f78" fontSize="7" fontFamily="monospace">SN: UZ20250721001</text>
          <text x="480" y="164" fill="#4f8f78" fontSize="7" fontFamily="monospace">DATE: 2025.07.21</text>

          {/* QR Code placeholder */}
          <g transform="translate(520, 172)">
            <rect x="0" y="0" width="24" height="24" fill="none" stroke="#4f8f78" strokeWidth="0.8" opacity="0.5" />
            <rect x="4" y="4" width="6" height="6" fill="#4f8f78" opacity="0.4" />
            <rect x="14" y="4" width="6" height="6" fill="#4f8f78" opacity="0.4" />
            <rect x="4" y="14" width="6" height="6" fill="#4f8f78" opacity="0.4" />
            <rect x="12" y="12" width="4" height="4" fill="#4f8f78" opacity="0.3" />
            <rect x="18" y="14" width="2" height="2" fill="#4f8f78" opacity="0.3" />
            <rect x="14" y="18" width="4" height="2" fill="#4f8f78" opacity="0.3" />
          </g>

          {/* Разделительная линия */}
          <line x1="350" y1="132" x2="350" y2="600" stroke="#3fbd7f" strokeWidth={1} strokeDasharray="2 6" opacity={0.3} />

          {/* ========== ОСНОВНЫЕ МИКРОСХЕМЫ ========== */}

          {/* --- U1: SoC (Main Processor) — BGA корпус --- */}
          <g className="component-place" style={{ animationDelay: "0.8s" }}>
            <rect x="200" y="180" width="120" height="120" rx="4" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.8} />
            <text x="260" y="242" textAnchor="middle" fill="#bff4dd" fontSize="14" fontFamily="monospace" fontWeight="bold">U1</text>
            <text x="260" y="258" textAnchor="middle" fill="#7fe8c4" fontSize="8" fontFamily="monospace">SoC</text>
            {/* BGA шарики (сетка) */}
            {Array.from({length:6}).map((_,r) => 
              Array.from({length:6}).map((_,c) => (
                <circle key={`${r}-${c}`} cx={210 + c*17} cy={190 + r*17} r="2.5" fill="#d8b46a" opacity="0.7" />
              ))
            )}
            <circle cx="204" cy="186" r="3" fill="#e6c96e" />
            {/* Экранирующая рамка */}
            <rect x="195" y="175" width="130" height="130" rx="6" fill="none" stroke="#5a8a6a" strokeWidth="0.8" opacity="0.4" strokeDasharray="4 2" />
          </g>

          {/* --- U2: DDR3 Memory x2 --- */}
          <g className="component-place" style={{ animationDelay: "0.4s" }}>
            <rect x="380" y="130" width="80" height="14" rx="2" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.4} />
            <text x="420" y="140" textAnchor="middle" fill="#bff4dd" fontSize="7" fontFamily="monospace">U2 DDR3</text>
            {[0,1,2,3,4].map(i => (
              <line key={i} x1={388 + i*14} y1="126" x2={388 + i*14} y2="130" stroke="#e6c96e" strokeWidth={1.4} />
            ))}
            <circle cx="382" cy="132" r="2" fill="#e6c96e" />
          </g>
          <g className="component-place" style={{ animationDelay: "0.6s" }}>
            <rect x="380" y="152" width="80" height="14" rx="2" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.4} />
            <text x="420" y="162" textAnchor="middle" fill="#bff4dd" fontSize="7" fontFamily="monospace">U3 DDR3</text>
            {[0,1,2,3,4].map(i => (
              <line key={i} x1={388 + i*14} y1="148" x2={388 + i*14} y2="152" stroke="#e6c96e" strokeWidth={1.4} />
            ))}
            <circle cx="382" cy="154" r="2" fill="#e6c96e" />
          </g>
          <g className="component-place" style={{ animationDelay: "1.0s" }}>
            <rect x="380" y="174" width="80" height="14" rx="2" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.4} />
            <text x="420" y="184" textAnchor="middle" fill="#bff4dd" fontSize="7" fontFamily="monospace">U4 DDR3</text>
            {[0,1,2,3,4].map(i => (
              <line key={i} x1={388 + i*14} y1="170" x2={388 + i*14} y2="174" stroke="#e6c96e" strokeWidth={1.4} />
            ))}
            <circle cx="382" cy="176" r="2" fill="#e6c96e" />
          </g>
          <g className="component-place" style={{ animationDelay: "1.2s" }}>
            <rect x="380" y="196" width="80" height="14" rx="2" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.4} />
            <text x="420" y="206" textAnchor="middle" fill="#bff4dd" fontSize="7" fontFamily="monospace">U5 DDR3</text>
            {[0,1,2,3,4].map(i => (
              <line key={i} x1={388 + i*14} y1="192" x2={388 + i*14} y2="196" stroke="#e6c96e" strokeWidth={1.4} />
            ))}
            <circle cx="382" cy="198" r="2" fill="#e6c96e" />
          </g>

          {/* --- U6: eMMC Flash --- */}
          <g className="component-place" style={{ animationDelay: "1.4s" }}>
            <rect x="340" y="230" width="30" height="30" rx="2" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.4} />
            <text x="355" y="248" textAnchor="middle" fill="#bff4dd" fontSize="6" fontFamily="monospace">U6</text>
            <text x="355" y="256" textAnchor="middle" fill="#7fe8c4" fontSize="5" fontFamily="monospace">eMMC</text>
            <circle cx="342" cy="232" r="2" fill="#e6c96e" />
          </g>

          {/* --- U7: EEPROM --- */}
          <g className="component-place" style={{ animationDelay: "1.5s" }}>
            <rect x="380" y="230" width="20" height="14" rx="1" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.2} />
            <text x="390" y="240" textAnchor="middle" fill="#bff4dd" fontSize="5" fontFamily="monospace">U7</text>
            <circle cx="382" cy="232" r="1.5" fill="#e6c96e" />
          </g>

          {/* --- U8: Audio Codec --- */}
          <g className="component-place" style={{ animationDelay: "1.3s" }}>
            <rect x="180" y="320" width="40" height="40" rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.4} />
            <text x="200" y="342" textAnchor="middle" fill="#bff4dd" fontSize="7" fontFamily="monospace">U8</text>
            <text x="200" y="352" textAnchor="middle" fill="#7fe8c4" fontSize="6" fontFamily="monospace">AUDIO</text>
            <circle cx="184" cy="324" r="2" fill="#e6c96e" />
          </g>

          {/* --- U9: PMIC (Power Management) --- */}
          <g className="component-place" style={{ animationDelay: "1.1s" }}>
            <rect x="480" y="220" width="50" height="50" rx="4" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.6} />
            <text x="505" y="248" textAnchor="middle" fill="#bff4dd" fontSize="9" fontFamily="monospace">U9</text>
            <text x="505" y="262" textAnchor="middle" fill="#7fe8c4" fontSize="7" fontFamily="monospace">PMIC</text>
            <circle cx="486" cy="226" r="2.5" fill="#e6c96e" />
            {/* Теплоотвод/экран */}
            <rect x="475" y="215" width="60" height="60" rx="6" fill="none" stroke="#5a8a6a" strokeWidth="0.8" opacity="0.5" strokeDasharray="3 2" />
          </g>

          {/* --- U10: HDMI Switch --- */}
          <g className="component-place" style={{ animationDelay: "1.6s" }}>
            <rect x="280" y="320" width="50" height="35" rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.4} />
            <text x="305" y="338" textAnchor="middle" fill="#bff4dd" fontSize="7" fontFamily="monospace">U10</text>
            <text x="305" y="348" textAnchor="middle" fill="#7fe8c4" fontSize="6" fontFamily="monospace">HDMI SW</text>
            <circle cx="284" cy="324" r="2" fill="#e6c96e" />
          </g>

          {/* --- U11: USB Controller --- */}
          <g className="component-place" style={{ animationDelay: "1.7s" }}>
            <rect x="350" y="320" width="40" height="30" rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.4} />
            <text x="370" y="336" textAnchor="middle" fill="#bff4dd" fontSize="6" fontFamily="monospace">U11</text>
            <text x="370" y="344" textAnchor="middle" fill="#7fe8c4" fontSize="5" fontFamily="monospace">USB</text>
            <circle cx="354" cy="324" r="2" fill="#e6c96e" />
          </g>

          {/* --- U12: Ethernet PHY --- */}
          <g className="component-place" style={{ animationDelay: "1.8s" }}>
            <rect x="420" y="320" width="35" height="35" rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.4} />
            <text x="437" y="338" textAnchor="middle" fill="#bff4dd" fontSize="6" fontFamily="monospace">U12</text>
            <text x="437" y="346" textAnchor="middle" fill="#7fe8c4" fontSize="5" fontFamily="monospace">ETH</text>
            <circle cx="424" cy="324" r="2" fill="#e6c96e" />
          </g>

          {/* --- U13: Wi-Fi/BT Module --- */}
          <g className="component-place" style={{ animationDelay: "1.9s" }}>
            <rect x="500" y="320" width="45" height="30" rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.4} />
            <text x="522" y="335" textAnchor="middle" fill="#bff4dd" fontSize="6" fontFamily="monospace">U13</text>
            <text x="522" y="343" textAnchor="middle" fill="#7fe8c4" fontSize="5" fontFamily="monospace">WIFI/BT</text>
            <circle cx="504" cy="324" r="2" fill="#e6c96e" />
            {/* Антенна */}
            <path d="M545,335 L555,325 M545,340 L558,340 M545,345 L555,355" stroke="#3fbd7f" strokeWidth="0.8" opacity="0.6" />
          </g>

          {/* --- U14: Tuner/RF --- */}
          <g className="component-place" style={{ animationDelay: "2.0s" }}>
            <rect x="480" y="130" width="90" height="70" rx="4" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.6} />
            <text x="525" y="165" textAnchor="middle" fill="#bff4dd" fontSize="10" fontFamily="monospace">U14</text>
            <text x="525" y="180" textAnchor="middle" fill="#7fe8c4" fontSize="8" fontFamily="monospace">TUNER</text>
            <circle cx="486" cy="136" r="2.5" fill="#e6c96e" />
            {/* Металлический экран */}
            <rect x="475" y="125" width="100" height="80" rx="6" fill="none" stroke="#7a9a8a" strokeWidth="1.5" opacity="0.6" />
            <line x1="475" y1="145" x2="575" y2="145" stroke="#7a9a8a" strokeWidth="0.8" opacity="0.4" />
            <line x1="475" y1="165" x2="575" y2="165" stroke="#7a9a8a" strokeWidth="0.8" opacity="0.4" />
            <line x1="475" y1="185" x2="575" y2="185" stroke="#7a9a8a" strokeWidth="0.8" opacity="0.4" />
            <line x1="510" y1="125" x2="510" y2="205" stroke="#7a9a8a" strokeWidth="0.8" opacity="0.4" />
            <line x1="540" y1="125" x2="540" y2="205" stroke="#7a9a8a" strokeWidth="0.8" opacity="0.4" />
          </g>

          {/* ========== РАЗЪЁМЫ (J) ========== */}

          {/* J1-J4: HDMI x4 */}
          {[
            {id:'J1',x:130,y:420,w:70,h:22,label:'HDMI1'},
            {id:'J2',x:130,y:450,w:70,h:22,label:'HDMI2'},
            {id:'J3',x:130,y:480,w:70,h:22,label:'HDMI3'},
            {id:'J4',x:130,y:510,w:70,h:22,label:'HDMI4'},
          ].map((j,i) => (
            <g key={j.id} className="component-place" style={{animationDelay:`${2.2+i*0.1}s`}}>
              <rect x={j.x} y={j.y} width={j.w} height={j.h} rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth="1.4" />
              <rect x={j.x+4} y={j.y+4} width={j.w-8} height={j.h-8} rx="2" fill="none" stroke="#5a8a6a" strokeWidth="0.8" opacity="0.5" />
              <text x={j.x+8} y={j.y+15} fill="#bff4dd" fontSize="7" fontFamily="monospace">{j.label}</text>
              <circle cx={j.x+4} cy={j.y+4} r="2" fill="#e6c96e" />
              {/* Золотые контакты */}
              {[0,1,2,3,4,5,6,7].map(k => (
                <rect key={k} x={j.x+12+k*6} y={j.y+18} width="3" height="3" fill="#d8b46a" opacity="0.8" />
              ))}
            </g>
          ))}

          {/* J5-J6: USB x2 */}
          <g className="component-place" style={{animationDelay:"2.6s"}}>
            <rect x="220" y="530" width="50" height="30" rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth="1.4" />
            <rect x="224" y="534" width="42" height="22" rx="2" fill="none" stroke="#5a8a6a" strokeWidth="0.8" opacity="0.5" />
            <text x="228" y="548" fill="#bff4dd" fontSize="7" fontFamily="monospace">J5 USB2.0</text>
            <circle cx="224" cy="534" r="2" fill="#e6c96e" />
          </g>
          <g className="component-place" style={{animationDelay:"2.7s"}}>
            <rect x="280" y="530" width="50" height="30" rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth="1.4" />
            <rect x="284" y="534" width="42" height="22" rx="2" fill="none" stroke="#5a8a6a" strokeWidth="0.8" opacity="0.5" />
            <text x="288" y="548" fill="#bff4dd" fontSize="7" fontFamily="monospace">J6 USB3.0</text>
            <circle cx="284" cy="534" r="2" fill="#e6c96e" />
          </g>

          {/* J7: LAN RJ45 */}
          <g className="component-place" style={{animationDelay:"2.8s"}}>
            <rect x="350" y="530" width="55" height="38" rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth="1.4" />
            <rect x="354" y="534" width="47" height="30" rx="2" fill="none" stroke="#5a8a6a" strokeWidth="0.8" opacity="0.5" />
            <text x="358" y="552" fill="#bff4dd" fontSize="7" fontFamily="monospace">J7 LAN</text>
            <circle cx="354" cy="534" r="2" fill="#e6c96e" />
            {/* Светодиоды LAN */}
            <circle cx="395" cy="540" r="2" fill="#52e39a" opacity="0.6" filter="url(#glow)" />
            <circle cx="395" cy="548" r="2" fill="#ff9d3d" opacity="0.6" />
          </g>

          {/* J8: AV Input */}
          <g className="component-place" style={{animationDelay:"2.9s"}}>
            <rect x="420" y="530" width="40" height="28" rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth="1.4" />
            <text x="425" y="548" fill="#bff4dd" fontSize="6" fontFamily="monospace">J8 AV</text>
            <circle cx="424" cy="534" r="2" fill="#e6c96e" />
          </g>

          {/* J9: Optical Audio */}
          <g className="component-place" style={{animationDelay:"3.0s"}}>
            <rect x="470" y="530" width="35" height="22" rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth="1.4" />
            <text x="473" y="544" fill="#bff4dd" fontSize="5" fontFamily="monospace">J9 OPT</text>
            <circle cx="474" cy="534" r="2" fill="#e6c96e" />
          </g>

          {/* J10: RF Antenna */}
          <g className="component-place" style={{animationDelay:"3.1s"}}>
            <rect x="520" y="530" width="50" height="25" rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth="1.4" />
            <text x="525" y="545" fill="#bff4dd" fontSize="6" fontFamily="monospace">J10 RF</text>
            <circle cx="524" cy="534" r="2" fill="#e6c96e" />
            {/* Разъём антенны */}
            <circle cx="555" cy="542" r="8" fill="none" stroke="#7a9a8a" strokeWidth="1.5" opacity="0.6" />
            <circle cx="555" cy="542" r="4" fill="#1a3a2a" stroke="#7a9a8a" strokeWidth="1" />
          </g>

          {/* CN1: LVDS/eDP */}
          <g className="component-place" style={{animationDelay:"3.2s"}}>
            <rect x="480" y="420" width="80" height="20" rx="2" fill="#0e2a20" stroke="#3fbd7f" strokeWidth="1.4" />
            <text x="490" y="433" fill="#bff4dd" fontSize="7" fontFamily="monospace">CN1 LVDS</text>
            <circle cx="484" cy="424" r="2" fill="#e6c96e" />
            {/* Пины */}
            {[0,1,2,3,4,5,6,7,8,9].map(k => (
              <rect key={k} x={500+k*5} y="436" width="3" height="3" fill="#d8b46a" opacity="0.7" />
            ))}
          </g>

          {/* CN2: Power Connector */}
          <g className="component-place" style={{animationDelay:"3.3s"}}>
            <rect x="480" y="450" width="50" height="30" rx="3" fill="#0e2a20" stroke="#3fbd7f" strokeWidth="1.6" />
            <text x="490" y="468" fill="#bff4dd" fontSize="7" fontFamily="monospace">CN2 PWR</text>
            <circle cx="484" cy="454" r="2" fill="#e6c96e" />
            {/* Силовые контакты */}
            <rect x="500" y="470" width="8" height="6" fill="#d8b46a" opacity="0.8" />
            <rect x="515" y="470" width="8" height="6" fill="#d8b46a" opacity="0.8" />
          </g>

          {/* CN3-CN4: Speaker Connectors */}
          <g className="component-place" style={{animationDelay:"3.4s"}}>
            <rect x="130" y="320" width="30" height="18" rx="2" fill="#0e2a20" stroke="#3fbd7f" strokeWidth="1.2" />
            <text x="134" y="332" fill="#bff4dd" fontSize="5" fontFamily="monospace">CN3 SPK</text>
            <circle cx="134" cy="324" r="1.5" fill="#e6c96e" />
          </g>
          <g className="component-place" style={{animationDelay:"3.5s"}}>
            <rect x="130" y="345" width="30" height="18" rx="2" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.2} />
            <text x="134" y="357" fill="#bff4dd" fontSize="5" fontFamily="monospace">CN4 SPK</text>
            <circle cx="134" cy="349" r="1.5" fill="#e6c96e" />
          </g>

          {/* CN5: IR Receiver */}
          <g className="component-place" style={{animationDelay:"3.6s"}}>
            <rect x="130" y="280" width="25" height="14" rx="2" fill="#0e2a20" stroke="#3fbd7f" strokeWidth={1.2} />
            <text x="134" y="290" fill="#bff4dd" fontSize="5" fontFamily="monospace">CN5 IR</text>
            <circle cx="134" cy="284" r="1.5" fill="#e6c96e" />
          </g>

          {/* CN6: Keypad */}
          <g className="component-place" style={{animationDelay:"3.7s"}}>
            <rect x="130" y="250" width="28" height="16" rx="2" fill="#0e2a20" stroke="#3fbd7f" strokeWidth="1.2" />
            <text x="134" y="261" fill="#bff4dd" fontSize="5" fontFamily="monospace">CN6 KEY</text>
            <circle cx="134" cy="254" r="1.5" fill="#e6c96e" />
          </g>

          {/* ========== SMD РЕЗИСТОРЫ (R) ========== */}
          {RESISTORS.map(r => (
            <g key={r.id} className="component-place" style={{animationDelay:`${r.delay}s`}}>
              <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="1" fill="#1a2a1a" stroke="#a9a96e" strokeWidth="0.8" opacity="0.85"
                transform={r.rotation === 90 ? `rotate(90 ${r.x+r.w/2} ${r.y+r.h/2})` : ''} />
              {/* Пады */}
              <rect x={r.x-2} y={r.y-1} width="3" height={r.h+2} fill="none" stroke="#5a7a5a" strokeWidth="0.5" opacity="0.6"
                transform={r.rotation === 90 ? `rotate(90 ${r.x+r.w/2} ${r.y+r.h/2})` : ''} />
              <rect x={r.x+r.w-1} y={r.y-1} width="3" height={r.h+2} fill="none" stroke="#5a7a5a" strokeWidth="0.5" opacity="0.6"
                transform={r.rotation === 90 ? `rotate(90 ${r.x+r.w/2} ${r.y+r.h/2})` : ''} />
            </g>
          ))}

          {/* ========== SMD КОНДЕНСАТОРЫ (C) ========== */}
          {CAPACITORS_SMD.map(c => (
            <g key={c.id} className="component-place" style={{animationDelay:`${c.delay}s`}}>
              <rect x={c.x} y={c.y} width={c.w} height={c.h} rx="1" fill="#1a2a1a" stroke="#6e9a6e" strokeWidth="0.8" opacity="0.85"
                transform={c.rotation === 90 ? `rotate(90 ${c.x+c.w/2} ${c.y+c.h/2})` : ''} />
            </g>
          ))}

          {/* ========== КЕРАМИЧЕСКИЕ КОНДЕНСАТОРЫ ========== */}
          {CERAMIC_CAPS.map(c => (
            <g key={c.id} className="component-place" style={{animationDelay:`${1.5+c.r*0.1}s`}}>
              <circle cx={c.x} cy={c.y} r={c.r} fill="#0e2a20" stroke="#d8b46a" strokeWidth="1.2" />
              <circle cx={c.x} cy={c.y} r={c.r-2} fill="none" stroke="#a9c96e" strokeWidth="0.6" opacity="0.5" />
              <line x1={c.x-c.r+2} y1={c.y} x2={c.x+c.r-2} y2={c.y} stroke="#e6c96e" strokeWidth="0.8" opacity="0.7" />
              <text x={c.x} y={c.y-c.r-3} textAnchor="middle" fill="#5a8a6a" fontSize="5" fontFamily="monospace">{c.id}</text>
            </g>
          ))}

          {/* ========== ДИОДЫ (D) ========== */}
          {DIODES.map(d => (
            <g key={d.id} className="component-place" style={{animationDelay:`${d.delay}s`}}>
              <rect x={d.x} y={d.y} width="10" height="5" rx="1" fill="#1a2a1a" stroke="#ff9d3d" strokeWidth="0.9" />
              <line x1={d.x+2} y1={d.y+1} x2={d.x+7} y2={d.y+4} stroke="#ff9d3d" strokeWidth="0.6" />
              <text x={d.x+5} y={d.y-2} textAnchor="middle" fill="#5a8a6a" fontSize="4" fontFamily="monospace">{d.id}</text>
            </g>
          ))}

          {/* ========== ДРОССЕЛИ / ИНДУКТОРЫ (L) ========== */}
          {INDUCTORS.map(l => (
            <g key={l.id} className="component-place" style={{animationDelay:"1.6s"}}>
              <rect x={l.x} y={l.y} width={l.w} height={l.h} rx="2" fill="#1a2a1a" stroke="#c9a96e" strokeWidth="1.2" />
              <rect x={l.x+2} y={l.y+2} width={l.w-4} height={l.h-4} rx="1" fill="none" stroke="#e6c96e" strokeWidth="0.6" opacity="0.6" />
              <text x={l.x+l.w/2} y={l.y+l.h/2+2} textAnchor="middle" fill="#8a9a7a" fontSize="5" fontFamily="monospace">{l.id}</text>
            </g>
          ))}

          {/* ========== MOSFET (Q) ========== */}
          {MOSFETS.map(q => (
            <g key={q.id} className="component-place" style={{animationDelay:"1.7s"}}>
              <rect x={q.x} y={q.y} width={q.w} height={q.h} rx="1" fill="#1a2a1a" stroke="#7a9aaa" strokeWidth="1" />
              <line x1={q.x+2} y1={q.y+q.h} x2={q.x+2} y2={q.y+q.h+4} stroke="#5a7a7a" strokeWidth="1" />
              <line x1={q.x+q.w-2} y1={q.y+q.h} x2={q.x+q.w-2} y2={q.y+q.h+4} stroke="#5a7a7a" strokeWidth="1" />
              <line x1={q.x+q.w/2} y1={q.y+q.h} x2={q.x+q.w/2} y2={q.y+q.h+4} stroke="#5a7a7a" strokeWidth="1" />
              <text x={q.x+q.w/2} y={q.y-2} textAnchor="middle" fill="#5a8a6a" fontSize="4" fontFamily="monospace">{q.id}</text>
            </g>
          ))}

          {/* ========== КВАРЦЕВЫЕ ГЕНЕРАТОРЫ (Y) ========== */}
          {CRYSTALS.map(y => (
            <g key={y.id} className="component-place" style={{animationDelay:"1.8s"}}>
              <rect x={y.x} y={y.y} width={y.w} height={y.h} rx="1" fill="#1a2a1a" stroke="#9a9a9a" strokeWidth="1" />
              <rect x={y.x+3} y={y.y+1} width={y.w-6} height={y.h-2} fill="none" stroke="#7a7a7a" strokeWidth="0.5" opacity="0.6" />
              <text x={y.x+y.w/2} y={y.y-2} textAnchor="middle" fill="#5a8a6a" fontSize="5" fontFamily="monospace">{y.id}</text>
            </g>
          ))}

          {/* ========== ПРЕДОХРАНИТЕЛИ (F) ========== */}
          {FUSES.map(f => (
            <g key={f.id} className="component-place" style={{animationDelay:"1.9s"}}>
              <rect x={f.x} y={f.y} width={f.w} height={f.h} rx="1" fill="#1a2a1a" stroke="#c9a96e" strokeWidth="1" />
              <line x1={f.x+3} y1={f.y+f.h/2} x2={f.x+f.w-3} y2={f.y+f.h/2} stroke="#e6c96e" strokeWidth="1" />
              <text x={f.x+f.w/2} y={f.y-2} textAnchor="middle" fill="#5a8a6a" fontSize="4" fontFamily="monospace">{f.id}</text>
            </g>
          ))}

          {/* ========== СВЕТОДИОДЫ-ИНДИКАТОРЫ ========== */}
          {LEDS.map(led => (
            <g key={led.id} className="component-place" style={{animationDelay:"2.0s"}}>
              <circle cx={led.x} cy={led.y} r="4" fill="#0e2a20" stroke={led.color} strokeWidth="1" />
              <circle cx={led.x} cy={led.y} r="2" fill={led.color} opacity="0.8" filter="url(#glow)">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/>
              </circle>
            </g>
          ))}

          {/* ========== ТЕСТОВЫЕ ПЛОЩАДКИ (TP) ========== */}
          {TEST_POINTS.map(tp => (
            <g key={tp.id} className="component-place" style={{animationDelay:"2.1s"}}>
              <circle cx={tp.x} cy={tp.y} r="3" fill="#1a3a2a" stroke="#5a8a6a" strokeWidth="0.8" />
              <circle cx={tp.x} cy={tp.y} r="1.5" fill="#3fbd7f" opacity="0.6" />
              <text x={tp.x} y={tp.y-5} textAnchor="middle" fill="#4a7a5a" fontSize="4" fontFamily="monospace">{tp.id}</text>
            </g>
          ))}

          {/* ========== ДОРОЖКИ PCB ========== */}
          <g fill="none" stroke="#2a6a4a" strokeWidth="1" opacity="0.6">
            {TRACES.map((d,i) => (
              <path key={i} d={d} />
            ))}
          </g>
          {/* Активные дорожки с glow */}
          <g fill="none" stroke="#3fbd7f" strokeWidth="0.8" opacity="0.4" className="trace-flow">
            {TRACES.slice(0,12).map((d,i) => (
              <path key={i} d={d} style={{animationDelay:`-${i*0.3}s`}} />
            ))}
          </g>

          {/* ========== VIAS (переходные отверстия) ========== */}
          {VIAS.map(([x,y],i) => (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#1a3a2a" stroke="#4a8a6a" strokeWidth="0.8" />
              <circle cx={x} cy={y} r="2" fill="#2a5a3a"/>
              <circle cx={x} cy={y} r="1" fill="#3fbd7f" opacity="0.7" className="signal-pulse"/>
            </g>
          ))}

          {/* ========== ЗОНЫ ПИТАНИЯ / ЗЕМЛИ ========== */}
          <polygon points="110,140 180,140 180,280 140,280 140,400 110,400" fill="#1a5c3d" opacity="0.15"/>
          <polygon points="520,140 580,140 580,300 540,300 540,400 520,400" fill="#1a5c3d" opacity="0.15"/>
          <text x="120" y="155" fill="#3f7f5f" fontSize="6" fontFamily="monospace" opacity="0.5">+3.3V</text>
          <text x="120" y="170" fill="#3f7f5f" fontSize="6" fontFamily="monospace" opacity="0.5">+5V</text>
          <text x="120" y="185" fill="#3f7f5f" fontSize="6" fontFamily="monospace" opacity="0.5">+12V</text>
          <text x="530" y="155" fill="#3f7f5f" fontSize="6" fontFamily="monospace" opacity="0.5">GND</text>

          {/* ========== ДОПОЛНИТЕЛЬНЫЕ НАДПИСИ КОМПОНЕНТОВ ========== */}
          <text x="200" y="170" fill="#4f8f78" fontSize="5" fontFamily="monospace" opacity="0.6">MT5891</text>
          <text x="390" y="128" fill="#4f8f78" fontSize="5" fontFamily="monospace" opacity="0.6">K4B4G16</text>
          <text x="490" y="128" fill="#4f8f78" fontSize="5" fontFamily="monospace" opacity="0.6">MXL608</text>
          <text x="490" y="218" fill="#4f8f78" fontSize="5" fontFamily="monospace" opacity="0.6">MP8862</text>

        </svg>
      </div>
    </div>
  );
};

export default Login;