import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CLUBS, STYLES, FORMATS, TEMOIGNAGES } from './lib/constants';
import { generateAdContent, modifyAdWithClaude, generateLandingPage, chatAssistant } from './lib/claude';
import { saveCreation, loadCreations, saveLanding, loadLandings } from './lib/supabase';
import {
  IMG_EMS_TRAINING, IMG_BODYHIT_AI1, IMG_BODYHIT_AI2,
  IMG_BODYHIT_REAL1, IMG_BODYHIT_REAL2, IMG_SYMBIONT_MAIN,
  IMG_EMS_MOBILE, IMG_BENEFIT1
} from './images';

const DEFAULT_IMGS = [
  { src: IMG_BODYHIT_AI1,   name: 'Bodyhit Hero 1',   sel: true,  tag: '⭐ Hero',     type: 'image' },
  { src: IMG_BODYHIT_AI2,   name: 'Bodyhit Hero 2',   sel: false, tag: '⭐ Hero',     type: 'image' },
  { src: IMG_EMS_TRAINING,  name: 'Séance EMS',       sel: false, tag: '💪 Action',   type: 'image' },
  { src: IMG_BODYHIT_REAL1, name: 'Bodyhit Réel 1',   sel: false, tag: '📸 Réel',     type: 'image' },
  { src: IMG_BODYHIT_REAL2, name: 'Bodyhit Réel 2',   sel: false, tag: '📸 Réel',     type: 'image' },
  { src: IMG_SYMBIONT_MAIN, name: 'SYMBIONT Tech',    sel: false, tag: '🔬 SYMBIONT', type: 'image' },
  { src: IMG_EMS_MOBILE,    name: 'EMS Premium',      sel: false, tag: '✨ Premium',  type: 'image' },
  { src: IMG_BENEFIT1,      name: 'Résultats',        sel: false, tag: '🏆 Résultats', type: 'image' },
];

// ── CSS GLOBAL ──
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;600;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#080c14;--bg2:#0d1320;--bg3:#111827;--gold:#C9A96E;--gold2:#f5d990;--text:#f1f5f9;--muted:#64748b;--muted2:#334155;--green:#4ade80;--red:#FF3366;--blue:#38bdf8;}
body{font-family:'Montserrat',sans-serif;background:var(--bg);color:var(--text);height:100vh;overflow:hidden}
.app{display:grid;grid-template-columns:290px 1fr;grid-template-rows:52px 1fr;height:100vh}

/* TOPBAR */
.topbar{grid-column:1/-1;background:rgba(13,19,32,0.98);border-bottom:1px solid rgba(201,169,110,0.15);display:flex;align-items:center;padding:0 16px;gap:10px}
.logo{font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--gold);letter-spacing:2px;flex-shrink:0}
.logo span{color:var(--text)}
.badge{background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.25);border-radius:20px;padding:3px 9px;font-size:8px;color:var(--gold);letter-spacing:1.5px;font-weight:700}
.tabs{flex:1;display:flex;justify-content:center;gap:4px}
.tab{padding:5px 12px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;border:1px solid rgba(255,255,255,0.06);background:transparent;color:var(--muted);font-family:'Montserrat',sans-serif;letter-spacing:1px;transition:all 0.2s}
.tab.on,.tab:hover{background:rgba(201,169,110,0.1);border-color:rgba(201,169,110,0.3);color:var(--gold)}
.topbar-r{display:flex;gap:5px;align-items:center}
.ib{width:28px;height:28px;border-radius:7px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;transition:all 0.2s}
.ib:hover,.ib.on{background:rgba(201,169,110,0.1);color:var(--gold);border-color:rgba(201,169,110,0.35)}

/* SIDEBAR */
.sb{background:var(--bg2);border-right:1px solid rgba(255,255,255,0.04);overflow-y:auto;padding:12px 10px;display:flex;flex-direction:column;gap:0}
.sb::-webkit-scrollbar{width:3px}
.sb::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:2px}
.sl{font-size:7.5px;font-weight:700;letter-spacing:2.5px;color:var(--muted2);text-transform:uppercase;margin:10px 0 6px}
.sl:first-child{margin-top:0}

/* Club selector */
.clubs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px}
.clu{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:7px;padding:6px 3px;text-align:center;cursor:pointer;transition:all 0.2s;font-size:7.5px;color:var(--muted);font-weight:700;letter-spacing:0.5px;line-height:1.3}
.clu.on{border-color:rgba(201,169,110,0.45);background:rgba(201,169,110,0.09);color:var(--gold)}
.clu-addr{font-size:6px;color:var(--muted2);margin-top:2px;font-weight:400;letter-spacing:0}

/* Prompt */
textarea{width:100%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:9px;color:var(--text);font-family:'Montserrat',sans-serif;font-size:11px;padding:9px 10px;resize:none;line-height:1.6;outline:none;transition:border 0.2s}
textarea:focus{border-color:rgba(201,169,110,0.35)}
textarea::placeholder{color:var(--muted2)}
.pa{display:flex;gap:4px;margin-top:5px}
.aab{flex:1;background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.22);border-radius:7px;color:var(--gold);font-size:8.5px;font-weight:700;padding:5px 6px;cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;text-align:center}
.aab:hover{background:rgba(201,169,110,0.2)}
.aab.s{background:rgba(56,189,248,0.08);border-color:rgba(56,189,248,0.2);color:var(--blue)}
.aab.s:hover{background:rgba(56,189,248,0.15)}

/* Format */
.fmts{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px}
.fmb{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:6px 3px;text-align:center;cursor:pointer;transition:all 0.2s}
.fmb.on,.fmb:hover{border-color:rgba(201,169,110,0.4);background:rgba(201,169,110,0.06)}
.fmi{font-size:14px;display:block;margin-bottom:2px}
.fmn{font-size:7.5px;color:var(--muted);font-weight:700;letter-spacing:1px}
.fmb.on .fmn{color:var(--gold)}

/* Styles */
.stls{display:flex;flex-direction:column;gap:4px}
.stb{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:7px 9px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all 0.2s}
.stb:hover{border-color:rgba(255,255,255,0.1)}
.stb.on{border-color:var(--gold);background:rgba(201,169,110,0.05)}
.dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.stn{font-size:9.5px;font-weight:700;color:var(--text)}
.std{font-size:7.5px;color:var(--muted);margin-top:1px}

/* Medias */
.mz{border:1.5px dashed rgba(255,255,255,0.08);border-radius:9px;padding:9px;text-align:center;cursor:pointer;transition:all 0.2s;background:rgba(255,255,255,0.01)}
.mz:hover{border-color:rgba(201,169,110,0.35);background:rgba(201,169,110,0.03)}
.mz-t{font-size:8.5px;color:var(--muted)}
.mz-t span{color:var(--gold);font-weight:700}
.mg{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:6px}
.mt{aspect-ratio:1;border-radius:6px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all 0.2s;position:relative;background:var(--bg3)}
.mt:hover{border-color:rgba(201,169,110,0.4)}
.mt.on{border-color:var(--gold)}
.mt img,.mt video{width:100%;height:100%;object-fit:cover;display:block}
.mt-tag{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.7);font-size:5.5px;color:rgba(255,255,255,0.7);padding:2px 3px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mt-del{position:absolute;top:2px;right:2px;width:13px;height:13px;background:rgba(0,0,0,0.8);border-radius:50%;display:none;align-items:center;justify-content:center;font-size:7px;color:#fff;cursor:pointer}
.mt:hover .mt-del{display:flex}
.vid-badge{position:absolute;top:2px;left:2px;background:rgba(0,0,0,0.7);border-radius:3px;font-size:6px;color:var(--blue);padding:1px 4px;font-weight:700}

/* Urgence/créneaux */
.urgence-row{display:flex;align-items:center;gap:6px;padding:7px 10px;background:rgba(255,51,102,0.06);border:1px solid rgba(255,51,102,0.15);border-radius:8px;margin-top:4px}
.urgence-dot{width:7px;height:7px;border-radius:50%;background:#FF3366;animation:blink 1.2s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
.urgence-txt{font-size:8.5px;color:var(--red);font-weight:700;letter-spacing:0.5px}
.urgence-ctrl{display:flex;gap:4px;margin-left:auto}
.urgence-btn{width:18px;height:18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:4px;color:var(--text);font-size:10px;cursor:pointer;display:flex;align-items:center;justify-content:center}

/* Logo upload */
.logo-zone{border:1.5px dashed rgba(201,169,110,0.2);border-radius:9px;padding:8px;text-align:center;cursor:pointer;transition:all 0.2s;background:rgba(201,169,110,0.02);display:flex;align-items:center;gap:8px}
.logo-zone:hover{border-color:rgba(201,169,110,0.4)}
.logo-preview{width:40px;height:40px;object-fit:contain;border-radius:4px}
.logo-placeholder{width:40px;height:40px;background:linear-gradient(135deg,rgba(201,169,110,0.2),rgba(201,169,110,0.05));border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:16px}
.logo-info{flex:1;text-align:left}
.logo-name{font-size:9px;color:var(--text);font-weight:700}
.logo-sub{font-size:7.5px;color:var(--muted)}

/* Gen buttons */
.gen-btn{width:100%;padding:11px;background:linear-gradient(135deg,#C9A96E,#8B6914);border-radius:9px;color:#0a0a0a;font-size:10.5px;font-weight:900;letter-spacing:2px;cursor:pointer;border:none;font-family:'Montserrat',sans-serif;transition:all 0.2s;margin-top:8px;position:relative;overflow:hidden}
.gen-btn:hover{opacity:0.9;transform:translateY(-1px)}
.gen-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none}
.shimmer{position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);animation:shimmer 2s infinite}
@keyframes shimmer{to{left:100%}}
.var-btn{width:100%;padding:7px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;color:var(--muted);font-size:9.5px;font-weight:700;cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;margin-top:4px}
.var-btn:hover{border-color:rgba(201,169,110,0.3);color:var(--gold);background:rgba(201,169,110,0.05)}
.var-btn:disabled{opacity:0.3;cursor:not-allowed}

/* CANVAS */
.cv{display:flex;flex-direction:column;overflow:hidden;background:var(--bg);position:relative}
.ctb{display:flex;align-items:center;gap:8px;padding:7px 14px;border-bottom:1px solid rgba(255,255,255,0.04);background:var(--bg2);flex-shrink:0}
.ctl{font-size:8.5px;color:var(--muted);letter-spacing:2px;font-weight:700;text-transform:uppercase}
.ctf{font-size:9.5px;color:var(--gold);font-weight:700;margin-left:2px}
.cm{flex:1;display:flex;align-items:center;justify-content:center;overflow:auto;gap:16px;padding:16px;background:repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(255,255,255,0.008) 8px,rgba(255,255,255,0.008) 16px)}
.cm.multi{flex-wrap:wrap;align-items:flex-start;align-content:flex-start}

/* PREVIEW CARD */
.preview-card{border-radius:16px;overflow:hidden;flex-shrink:0;cursor:pointer;box-shadow:0 20px 60px rgba(0,0,0,0.6)}
.preview-card.story{width:200px;height:355px}
.preview-card.post{width:290px;height:290px}
.preview-card.landscape{width:390px;height:219px}
.ci{position:relative;width:100%;height:100%;overflow:hidden}
.cb{position:absolute;inset:0;background-size:cover;background-position:center;transition:opacity 0.8s ease}
.cb.ken{animation:kb 12s ease-in-out infinite alternate}
@keyframes kb{from{transform:scale(1)}to{transform:scale(1.09) translate(-2%,-1%)}}
.cot{position:absolute;top:0;left:0;right:0;height:40%;background:linear-gradient(to bottom,rgba(0,0,0,0.8),transparent);z-index:2}
.cob{position:absolute;bottom:0;left:0;right:0;height:75%;background:linear-gradient(to top,rgba(0,0,0,0.97),transparent);z-index:2}
.cos{position:absolute;inset:0;background:linear-gradient(100deg,rgba(0,0,0,0.5) 0%,transparent 65%);z-index:2}
.cgb{position:absolute;top:0;left:0;right:0;height:3px;z-index:10}
.chd{position:absolute;top:10px;left:10px;right:10px;z-index:10;display:flex;align-items:center;justify-content:space-between}
.clog{font-size:7px;font-weight:900;letter-spacing:2px;border-radius:20px;padding:3px 8px;border:1px solid;display:inline-flex;align-items:center;gap:4px}
.clog img{width:14px;height:14px;object-fit:contain;border-radius:2px}
.ctag{font-size:6.5px;font-weight:800;letter-spacing:1.5px;padding:3px 7px;border-radius:20px;border:1px solid}
.cprog{position:absolute;bottom:0;left:0;right:0;height:2.5px;z-index:10;overflow:hidden}
.cprog-i{height:100%;animation:prog 8s linear infinite}
@keyframes prog{from{width:0}to{width:100%}}
.cbody{position:absolute;bottom:0;left:0;right:0;z-index:10;padding:0 12px 10px}
.cpt{font-size:6.5px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.4);margin-bottom:3px;text-transform:uppercase}
.ctit{font-family:'Bebas Neue',sans-serif;color:#fff;line-height:0.9;margin-bottom:6px}
.cstats{display:flex;gap:5px;margin-bottom:6px}
.cst{flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.06);border-radius:5px;padding:4px 3px;text-align:center}
.cstv{font-family:'Bebas Neue',sans-serif;font-size:14px;line-height:1;display:block}
.cstl{font-size:5.5px;letter-spacing:1px;color:rgba(255,255,255,0.3);display:block;margin-top:1px}
.ctemo{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);border-radius:7px;padding:6px 8px;display:flex;gap:6px;align-items:center;margin-bottom:6px}
.cav{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;flex-shrink:0}
.ctn{font-size:6.5px;font-weight:900;letter-spacing:1px;margin-bottom:1px}
.ctq{font-size:6.5px;line-height:1.4;color:rgba(255,255,255,0.5);font-style:italic}
.cts{font-size:7px;margin-top:1px}
.curg{background:rgba(255,51,102,0.15);border:1px solid rgba(255,51,102,0.3);border-radius:5px;padding:4px 7px;margin-bottom:5px;display:flex;align-items:center;gap:5px}
.curg-dot{width:5px;height:5px;border-radius:50%;background:#FF3366;animation:blink 1s infinite;flex-shrink:0}
.curg-txt{font-size:6px;color:#FF3366;font-weight:800;letter-spacing:0.5px}
.ccta{border-radius:6px;padding:7px;text-align:center}
.cctam{font-size:7.5px;font-weight:900;letter-spacing:1.5px;display:block}
.cctas{font-size:5.5px;letter-spacing:1px;display:block;margin-top:2px;opacity:0.55}
.caddr{font-size:5.5px;color:rgba(255,255,255,0.3);text-align:center;margin-top:4px;letter-spacing:0.5px}

/* QR code dans card */
.cqr{position:absolute;bottom:8px;right:8px;width:32px;height:32px;background:rgba(255,255,255,0.9);border-radius:4px;padding:2px;z-index:15}
.cqr canvas{width:100%!important;height:100%!important}

/* Closing logo frame */
.closing-frame{position:absolute;inset:0;background:#080c14;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;animation:fadeInClosing 0.5s ease 3s both}
@keyframes fadeInClosing{from{opacity:0}to{opacity:1}}
.closing-logo{max-width:80%;max-height:50px;object-fit:contain}
.closing-name{font-family:'Bebas Neue',sans-serif;font-size:18px;color:var(--gold);letter-spacing:4px}
.closing-addr{font-size:7px;color:var(--muted);text-align:center;letter-spacing:1px;margin-top:2px}

/* Card label */
.card-label{font-size:7.5px;color:var(--muted);font-weight:700;letter-spacing:1px;text-align:center;margin-top:5px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* Export bar */
.expb{display:flex;align-items:center;gap:5px;padding:8px 14px;border-top:1px solid rgba(255,255,255,0.04);background:var(--bg2);flex-shrink:0;flex-wrap:wrap}
.expl{font-size:8px;color:var(--muted);letter-spacing:2px;font-weight:700;text-transform:uppercase;margin-right:2px}
.exp{padding:5px 12px;border-radius:6px;font-size:9px;font-weight:800;cursor:pointer;font-family:'Montserrat',sans-serif;letter-spacing:1px;border:1px solid;transition:all 0.2s;background:transparent}
.exp:hover{transform:translateY(-1px)}
.exp-h{color:#38bdf8;border-color:rgba(56,189,248,0.25);background:rgba(56,189,248,0.1)}
.exp-j{color:#f59e0b;border-color:rgba(245,158,11,0.25);background:rgba(245,158,11,0.1)}
.exp-c{color:#a78bfa;border-color:rgba(167,139,250,0.25);background:rgba(167,139,250,0.1)}

/* Caption panel */
.caption-panel{background:var(--bg3);border-top:1px solid rgba(255,255,255,0.04);padding:10px 14px;flex-shrink:0;max-height:120px;overflow-y:auto}
.caption-label{font-size:7.5px;color:var(--muted);letter-spacing:2px;font-weight:700;text-transform:uppercase;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center}
.caption-copy{background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.2);border-radius:5px;padding:3px 8px;font-size:8px;color:var(--gold);cursor:pointer;font-family:'Montserrat',sans-serif}
.caption-text{font-size:9px;color:var(--muted);line-height:1.6;white-space:pre-wrap}
.hashtags{display:flex;flex-wrap:wrap;gap:3px;margin-top:4px}
.ht{background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.15);border-radius:20px;padding:2px 8px;font-size:8px;color:var(--blue);cursor:pointer}
.ht:hover{background:rgba(56,189,248,0.15)}

/* AI PANEL */
.aip{position:absolute;right:14px;top:62px;width:310px;background:var(--bg2);border:1px solid rgba(201,169,110,0.2);border-radius:16px;display:none;flex-direction:column;z-index:50;max-height:500px;box-shadow:0 24px 70px rgba(0,0,0,0.7)}
.aip.on{display:flex}
.aiph{padding:11px 14px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.aipt{font-size:10.5px;font-weight:800;color:var(--gold);letter-spacing:1.5px}
.aips{font-size:7.5px;color:var(--muted);margin-top:2px}
.aipc{cursor:pointer;color:var(--muted);font-size:15px}
.ai-sc{display:flex;flex-wrap:wrap;gap:4px;padding:9px 14px;border-bottom:1px solid rgba(255,255,255,0.04);flex-shrink:0}
.sc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:4px 10px;font-size:7.5px;color:var(--muted);cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;white-space:nowrap}
.sc:hover{border-color:rgba(201,169,110,0.3);color:var(--gold);background:rgba(201,169,110,0.06)}
.sc.mod{border-color:rgba(167,139,250,0.3);color:#a78bfa;background:rgba(167,139,250,0.06)}
.sc.mod:hover{background:rgba(167,139,250,0.12)}
.aim{flex:1;overflow-y:auto;padding:10px 14px;display:flex;flex-direction:column;gap:7px;min-height:0}
.aim::-webkit-scrollbar{width:2px}
.aim::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06)}
.am{padding:8px 11px;border-radius:10px;font-size:9.5px;line-height:1.6;white-space:pre-wrap}
.am.user{background:rgba(201,169,110,0.1);color:var(--text);border:1px solid rgba(201,169,110,0.2);margin-left:16px}
.am.ai{background:rgba(255,255,255,0.04);color:var(--text);border:1px solid rgba(255,255,255,0.06)}
.am.load{color:var(--muted);font-style:italic}
.am.act{background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.15);color:#4ade80;font-weight:700;font-size:8.5px;cursor:pointer;text-align:center}
.am.act:hover{background:rgba(74,222,128,0.12)}
.ai-ir{padding:9px 12px;border-top:1px solid rgba(255,255,255,0.05);display:flex;gap:5px;flex-shrink:0}
.aii{flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;color:var(--text);font-size:9.5px;padding:7px 10px;outline:none;font-family:'Montserrat',sans-serif}
.aii:focus{border-color:rgba(201,169,110,0.3)}
.ais{background:var(--gold);color:#0a0a0a;border:none;border-radius:7px;width:29px;height:29px;cursor:pointer;font-size:13px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0}

/* LANDING PAGE TAB */
.lp-panel{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px}
.lp-section{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:10px}
.lp-stitle{font-size:9.5px;font-weight:800;color:var(--gold);letter-spacing:2px;text-transform:uppercase}
.lp-field{display:flex;flex-direction:column;gap:5px}
.lp-field label{font-size:8px;font-weight:700;letter-spacing:2px;color:var(--muted2);text-transform:uppercase}
.lp-field input,.lp-field select,.lp-field textarea{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;color:var(--text);font-family:'Montserrat',sans-serif;font-size:11px;padding:8px 10px;outline:none;transition:border 0.2s;width:100%}
.lp-field input:focus,.lp-field select:focus,.lp-field textarea:focus{border-color:rgba(201,169,110,0.35)}
.lp-field select option{background:var(--bg2)}
.lp-gen-btn{padding:12px 24px;background:linear-gradient(135deg,#C9A96E,#8B6914);border-radius:9px;color:#0a0a0a;font-size:11px;font-weight:900;letter-spacing:2px;cursor:pointer;border:none;font-family:'Montserrat',sans-serif;transition:all 0.2s;align-self:flex-start}
.lp-gen-btn:hover{opacity:0.9}
.lp-gen-btn:disabled{opacity:0.4;cursor:not-allowed}
.lp-preview{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:12px;overflow:hidden}
.lp-preview iframe{width:100%;height:400px;border:none}
.lp-actions{display:flex;gap:8px;flex-wrap:wrap}

/* SETTINGS */
.set-panel{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px}
.s-sec{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:10px}
.s-stitle{font-size:9.5px;font-weight:800;color:var(--gold);letter-spacing:2px;text-transform:uppercase}
.sf{display:flex;flex-direction:column;gap:5px}
.sf label{font-size:8px;font-weight:700;letter-spacing:2px;color:var(--muted2);text-transform:uppercase}
.sf input{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:9px;color:var(--text);font-family:'Montserrat',sans-serif;font-size:11px;padding:9px 10px;outline:none;transition:border 0.2s;width:100%}
.sf input:focus{border-color:rgba(201,169,110,0.35)}
.sbtn{padding:10px 20px;background:linear-gradient(135deg,#C9A96E,#8B6914);border-radius:9px;color:#0a0a0a;font-size:10.5px;font-weight:900;letter-spacing:2px;cursor:pointer;border:none;font-family:'Montserrat',sans-serif;align-self:flex-start}
.pill{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:8.5px;font-weight:700}
.pill.ok{background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);color:#4ade80}
.pill.ko{background:rgba(255,51,102,0.1);border:1px solid rgba(255,51,102,0.25);color:#FF3366}
.pill.warn{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);color:#f59e0b}

/* GALERIE */
.gal-panel{flex:1;overflow:auto;padding:16px;display:flex;flex-wrap:wrap;gap:12px;align-content:flex-start}

/* TOAST */
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--bg2);border:1px solid rgba(74,222,128,0.3);border-radius:9px;padding:8px 18px;font-size:10.5px;color:#4ade80;font-weight:700;z-index:9999;white-space:nowrap;pointer-events:none}

/* EMPTY */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;opacity:0.45;width:100%}
.empty-ico{font-size:48px}
.empty-t{font-size:12px;font-weight:700;color:var(--muted)}
.empty-s{font-size:10px;color:var(--muted2);text-align:center;line-height:1.6}

/* SPINNER */
.spin{display:inline-block;animation:spin 0.8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
.anim{animation:fadeUp 0.45s ease both}
.a1{animation-delay:0.08s}.a2{animation-delay:0.2s}.a3{animation-delay:0.34s}.a4{animation-delay:0.48s}
`;

// ── COMPOSANT CARTE ──
function AdCard({ adData, style, format, medias, logoSrc, showClosing, clubData }) {
  const st = STYLES[style] || STYLES.or;
  const fmt = FORMATS[format] || FORMATS.story;
  const isStory = fmt.cls === 'story';
  const imgs = medias.filter(m => m.sel && m.type === 'image');
  const [bgIdx, setBgIdx] = useState(0);
  const bgSrc = imgs[bgIdx]?.src || imgs[0]?.src || '';

  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(() => setBgIdx(i => (i + 1) % imgs.length), 3500);
    return () => clearInterval(t);
  }, [imgs.length]);

  const qrRef = useRef(null);
  useEffect(() => {
    if (!qrRef.current || !clubData?.reservation) return;
    const QRCode = window.QRCode;
    if (!QRCode) return;
    qrRef.current.innerHTML = '';
    new QRCode(qrRef.current, {
      text: clubData.reservation,
      width: 32, height: 32,
      colorDark: '#000', colorLight: '#fff',
      correctLevel: QRCode.CorrectLevel.L,
    });
  }, [clubData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
      <div className={`preview-card ${fmt.cls} anim`} id="mainCard">
        <div className="ci" style={{ background: st.bg }}>
          {bgSrc && <div className="cb ken" style={{ backgroundImage: `url('${bgSrc}')` }} />}
          <div className="cot" /><div className="cob" /><div className="cos" style={{ background: `linear-gradient(100deg,${st.overlay} 0%,transparent 65%)` }} />
          <div className="cgb" style={{ background: `linear-gradient(90deg,${st.accent},${st.accent2},${st.accent})` }} />
          <div className="chd">
            <div className="clog" style={{ color: st.tagColor, background: st.tagBg, borderColor: st.tagBorder }}>
              {logoSrc && <img src={logoSrc} alt="logo" />}
              {adData.tag || 'BODYHIT'}
            </div>
            <div className="ctag" style={{ color: st.tagColor, background: st.tagBg, borderColor: st.tagBorder }}>EMS SYMBIONT</div>
          </div>
          {isStory && <div className="cprog"><div className="cprog-i" style={{ background: `linear-gradient(90deg,${st.accent},${st.accent2})` }} /></div>}
          <div className="cbody">
            <div className="cpt a1">{adData.pretitle || `BODYHIT · ${clubData?.ville?.toUpperCase()}`}</div>
            <div className="ctit a2" style={{ fontSize: fmt.ts }}>
              {adData.hook || '20 MINUTES.'}<br />
              <em style={{ color: st.accent, fontStyle: 'normal' }}>{adData.sub || 'TOUT CHANGE.'}</em>
            </div>
            <div className="cstats a3">
              {(adData.stats || []).map((s, i) => (
                <div className="cst" key={i}>
                  <span className="cstv" style={{ color: st.accent }}>{s.v}</span>
                  <span className="cstl">{s.l}</span>
                </div>
              ))}
            </div>
            {isStory && adData.urgence && (
              <div className="curg a4">
                <div className="curg-dot" />
                <span className="curg-txt">{adData.urgence}</span>
              </div>
            )}
            {isStory && adData.temo && (
              <div className="ctemo a4">
                <div className="cav" style={{ background: st.avBg, color: st.avColor }}>{adData.temo.initial}</div>
                <div>
                  <div className="ctn" style={{ color: st.accent }}>{adData.temo.name}</div>
                  <div className="ctq">{adData.temo.quote}</div>
                  <div className="cts" style={{ color: st.accent }}>★★★★★</div>
                </div>
              </div>
            )}
            <div className="ccta a4" style={{ background: st.ctaBg }}>
              <span className="cctam" style={{ color: st.ctaColor }}>{adData.cta || 'RÉSERVER'}</span>
              <span className="cctas" style={{ color: st.ctaColor }}>{!isStory && adData.urgence ? adData.urgence : 'SÉANCE D\'ESSAI GRATUITE'}</span>
            </div>
            {adData.adresse && <div className="caddr">{adData.adresse}</div>}
          </div>
          {clubData?.reservation && <div className="cqr" ref={qrRef} title={`Réserver: ${clubData.reservation}`} />}
          {showClosing && (
            <div className="closing-frame">
              {logoSrc ? <img src={logoSrc} alt="logo" className="closing-logo" /> : <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: '28px', color: '#C9A96E', letterSpacing: '4px' }}>BODYHIT</div>}
              <div className="closing-name">{clubData?.ville?.toUpperCase()}</div>
              {clubData && <div className="closing-addr">{clubData.adresse} · {clubData.cp} {clubData.ville}<br />{clubData.tel}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── APP ──
export default function App() {
  const [tab, setTab] = useState('create');
  const [clubId, setClubId] = useState('RUEIL');
  const [style, setStyle] = useState('or');
  const [format, setFormat] = useState('story');
  const [prompt, setPrompt] = useState('');
  const [creneaux, setCreneaux] = useState(3);
  const [medias, setMedias] = useState([...DEFAULT_IMGS]);
  const [logoSrc, setLogoSrc] = useState(null);
  const [cards, setCards] = useState([]);
  const [genIdx, setGenIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Prêt');
  const [aiOpen, setAiOpen] = useState(false);
  const [aiMsgs, setAiMsgs] = useState([{
    type: 'ai',
    text: '✦ Bonjour ! Je suis l\'assistant créatif ILflyer.\n\nJe connais Bodyhit en profondeur : la combinaison SYMBIONT, les 3 clubs IDF, les cibles CSP+, les arguments EMS.\n\nJe peux :\n• Rédiger ton brief\n• Modifier la pub en temps réel\n• Générer captions + hashtags\n• Superviser la qualité\n\nClique un raccourci ou pose ta question !'
  }]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ilflyer_api_key') || '');
  const [apiKeyInput, setApiKeyInput] = useState(() => localStorage.getItem('ilflyer_api_key') || '');
  const [supaUrl, setSupaUrl] = useState(() => localStorage.getItem('ilflyer_supa_url') || '');
  const [supaKey, setSupaKey] = useState(() => localStorage.getItem('ilflyer_supa_key') || '');
  const [galerie, setGalerie] = useState([]);
  const [lpClub, setLpClub] = useState('RUEIL');
  const [lpObjectif, setLpObjectif] = useState('Séance d\'essai gratuite');
  const [lpPromo, setLpPromo] = useState('1ère séance offerte sans engagement');
  const [lpHtml, setLpHtml] = useState('');
  const [lpLoading, setLpLoading] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const aiMsgsRef = useRef(null);

  const club = CLUBS[clubId];

  const showToast = useCallback((msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); }, []);

  // ── Générer 1 pub ──
  const generate = async () => {
    const selImgs = medias.filter(m => m.sel && m.type === 'image');
    setLoading(true); setStatus('⚡ Claude génère votre pub...');
    const data = await generateAdContent({ prompt, clubId, variationIndex: genIdx });
    // Override créneaux
    data.urgence = `IL RESTE ${creneaux} CRÉNEAUX CETTE SEMAINE`;
    const card = { data, medias: [...medias], style, format, clubId };
    setCards([card]);
    setGenIdx(i => i + 1);
    setLoading(false); setStatus('✅ Pub générée');
    setShowCaption(true);
    setGalerie(g => [{ ...card, date: new Date().toLocaleTimeString(), prompt }, ...g].slice(0, 30));
    await saveCreation({ clubId, prompt, style, format, adData: data });
    showToast('✅ Pub Bodyhit créée !');
  };

  // ── Générer 3 variantes ──
  const generateVariants = async () => {
    setLoading(true); setStatus('⚡ Claude génère 3 variantes...');
    const results = await Promise.all([
      generateAdContent({ prompt, clubId, variationIndex: genIdx }),
      generateAdContent({ prompt, clubId, variationIndex: genIdx + 1 }),
      generateAdContent({ prompt, clubId, variationIndex: genIdx + 2 }),
    ]);
    results.forEach(d => { d.urgence = `IL RESTE ${creneaux} CRÉNEAUX CETTE SEMAINE`; });
    const newCards = results.map((data, i) => ({ data, medias: [...medias], style, format, clubId, label: `VARIANTE ${i + 1}` }));
    setCards(newCards); setGenIdx(i => i + 3);
    setLoading(false); setStatus('✅ 3 variantes générées');
    setShowCaption(true);
    setGalerie(g => [...newCards.map(c => ({ ...c, date: new Date().toLocaleTimeString(), prompt })), ...g].slice(0, 30));
    showToast('✅ 3 variantes Bodyhit créées !');
  };

  // ── Export HTML ──
  const exportHTML = () => {
    if (!cards.length) { showToast('⚠️ Génère d\'abord une pub'); return; }
    const el = document.getElementById('mainCard');
    if (!el) return;
    const a = document.createElement('a');
    a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(`<!DOCTYPE html><html><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet"><style>body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#060c14;margin:0}</style></head><body>${el.outerHTML}</body></html>`);
    a.download = `bodyhit-${clubId.toLowerCase()}-pub.html`;
    a.click(); showToast('✅ HTML exporté !');
  };

  // ── Export JPEG ──
  const exportJPEG = async () => {
    if (!cards.length) { showToast('⚠️ Génère d\'abord une pub'); return; }
    showToast('⏳ Export JPEG en cours...');
    try {
      const { default: html2canvas } = await import('html2canvas');
      const el = document.getElementById('mainCard');
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 3, useCORS: true, backgroundColor: null });
      canvas.toBlob(blob => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `bodyhit-${clubId.toLowerCase()}-pub.jpg`;
        a.click();
        showToast('✅ JPEG exporté !');
      }, 'image/jpeg', 0.95);
    } catch (e) {
      showToast('⚠️ Erreur export: ' + e.message);
    }
  };

  // ── Upload medias ──
  const uploadMedias = (type) => {
    const input = document.createElement('input');
    input.type = 'file'; input.multiple = true;
    input.accept = type === 'video' ? 'video/*' : 'image/*';
    input.onchange = (e) => Array.from(e.target.files).forEach(file => {
      const fr = new FileReader();
      fr.onload = ev => setMedias(p => [...p, {
        src: ev.target.result, name: file.name, sel: true,
        tag: type === 'video' ? '🎬 Vidéo' : '📁 Upload',
        type: type === 'video' ? 'video' : 'image'
      }]);
      fr.readAsDataURL(file);
    });
    input.click();
  };

  // ── Upload logo ──
  const uploadLogo = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = (e) => {
      const fr = new FileReader();
      fr.onload = ev => { setLogoSrc(ev.target.result); showToast('✅ Logo uploadé !'); };
      fr.readAsDataURL(e.target.files[0]);
    };
    input.click();
  };

  // ── Chat IA ──
  const sendAI = async (msgOverride) => {
    const msg = msgOverride || aiInput.trim();
    if (!msg || aiLoading) return;
    setAiInput(''); setAiLoading(true);
    setAiMsgs(m => [...m, { type: 'user', text: msg }]);
    setAiMsgs(m => [...m, { type: 'load', text: '⚡ Je réfléchis...' }]);

    // Si c'est une demande de modification de la pub
    const isModify = /modifi|change|remplace|met|ajoute|supprime|améliore/i.test(msg) && cards.length > 0;
    let response;
    if (isModify && cards[0]) {
      const modified = await modifyAdWithClaude({ instruction: msg, currentAdData: cards[0].data, clubId });
      modified.urgence = `IL RESTE ${creneaux} CRÉNEAUX CETTE SEMAINE`;
      setCards(c => [{ ...c[0], data: modified }, ...c.slice(1)]);
      response = '✅ Pub modifiée selon ta demande ! Voici ce que j\'ai changé :\n' + msg;
      showToast('✅ Pub modifiée par l\'IA !');
    } else {
      response = await chatAssistant({ message: msg, clubId, context: cards[0]?.data });
    }

    setAiLoading(false);
    setAiMsgs(m => { const u = [...m]; u[u.length - 1] = { type: 'ai', text: response }; return u; });

    // Suggérer insertion si texte pub détecté
    const extracted = response.match(/"([^"]{25,})"/)? .[1];
    if (extracted) {
      setAiMsgs(m => [...m, { type: 'act', text: '→ Utiliser ce texte comme brief', action: () => { setPrompt(extracted); showToast('✅ Texte inséré !'); } }]);
    }
  };

  useEffect(() => { if (aiMsgsRef.current) aiMsgsRef.current.scrollTop = aiMsgsRef.current.scrollHeight; }, [aiMsgs]);

  // ── Générer landing page ──
  const genLanding = async () => {
    setLpLoading(true);
    showToast('⚡ Claude génère votre landing page...');
    const html = await generateLandingPage({ clubId: lpClub, objectif: lpObjectif, style, promoText: lpPromo });
    setLpHtml(html);
    setLpLoading(false);
    await saveLanding({ clubId: lpClub, titre: lpObjectif, htmlOutput: html });
    showToast('✅ Landing page générée !');
  };

  const exportLanding = () => {
    if (!lpHtml) return;
    const a = document.createElement('a');
    a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(lpHtml);
    a.download = `bodyhit-${lpClub.toLowerCase()}-landing.html`;
    a.click(); showToast('✅ Landing page exportée !');
  };

  const AI_SHORTCUTS = [
    { label: '✍️ Rédige le brief', msg: `Rédige un texte pub percutant pour la séance coaching EMS Bodyhit ${club.ville}. Utilise le vocabulaire officiel SYMBIONT.` },
    { label: '🎁 Séance offerte', msg: `Crée un texte pub pour la 1ère séance coaching EMS gratuite à Bodyhit ${club.ville}. Maximum 2 clients par séance, coach diplômé d'État.` },
    { label: '💪 Cible femmes CSP+', msg: `Message pub pour femmes CSP+ 30-50 ans à Bodyhit ${club.ville}. Tonification, perte de cellulite, résultats visibles.` },
    { label: '📱 Hook Reels 3s', msg: `Crée le meilleur hook viral (3 secondes max) pour un Reels Instagram sur la séance coaching EMS Bodyhit ${club.ville}.` },
    { label: '🔧 Modifie la pub', msg: 'Améliore le hook de la pub actuelle pour le rendre plus percutant et émotionnel.', mod: true },
    { label: '📊 Génère caption', msg: `Génère une caption Instagram complète pour Bodyhit ${club.ville} avec emojis, hashtags et call-to-action fort.` },
    { label: '⚡ Rends la pub parfaite', msg: 'Analyse la pub actuelle et dis-moi exactement ce que tu modifierais pour la rendre parfaite. Applique ensuite les modifications.', mod: true },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="logo">IL<span>flyer</span></div>
          <div className="badge">PRO · AVANCE HUB</div>
          <div className="tabs">
            {[['create', '⚡ Créer'], ['landing', '🌐 Landing'], ['galerie', '🖼 Galerie'], ['settings', '⚙️ Réglages']].map(([t, l]) => (
              <button key={t} className={`tab${tab === t ? ' on' : ''}`} onClick={() => setTab(t)}>{l}</button>
            ))}
          </div>
          <div className="topbar-r">
            <button className={`ib${aiOpen ? ' on' : ''}`} onClick={() => setAiOpen(!aiOpen)} title="Assistant IA Claude">✦</button>
            <button className="ib" onClick={() => { setPrompt(''); setCards([]); setStatus('Prêt'); setShowCaption(false); }} title="Nouveau">↺</button>
          </div>
        </div>

        {/* ── ONGLET CRÉER ── */}
        {tab === 'create' && (<>
          <div className="sb">
            {/* Club */}
            <div className="sl">Club Bodyhit</div>
            <div className="clubs">
              {Object.values(CLUBS).map(c => (
                <div key={c.id} className={`clu${clubId === c.id ? ' on' : ''}`} onClick={() => setClubId(c.id)}>
                  {c.label}
                  <div className="clu-addr">{c.ville}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '7.5px', color: 'var(--muted)', padding: '5px 2px', lineHeight: 1.5 }}>
              📍 {club.adresse}, {club.cp} {club.ville}<br />
              📞 {club.tel}
            </div>

            {/* Prompt */}
            <div className="sl">Brief publicitaire</div>
            <textarea rows="4" value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder={`Ex: 1ère séance coaching EMS gratuite Bodyhit ${club.ville} — 20 min = 4h de sport. Combinaison SYMBIONT certifiée médicale...`} />
            <div className="pa">
              <button className="aab" onClick={() => setAiOpen(true)}>✦ Aide IA</button>
              <button className="aab s" onClick={() => { setPrompt(''); setAiOpen(true); setAiInput(`Génère un brief pub pour Bodyhit ${club.ville}`); }}>↻ Brief auto</button>
            </div>

            {/* Urgence/créneaux */}
            <div className="sl">Urgence — créneaux restants</div>
            <div className="urgence-row">
              <div className="urgence-dot" />
              <span className="urgence-txt">IL RESTE {creneaux} CRÉNEAUX</span>
              <div className="urgence-ctrl">
                <button className="urgence-btn" onClick={() => setCreneaux(c => Math.max(1, c - 1))}>−</button>
                <button className="urgence-btn" onClick={() => setCreneaux(c => Math.min(10, c + 1))}>+</button>
              </div>
            </div>

            {/* Format */}
            <div className="sl">Format</div>
            <div className="fmts">
              {Object.entries(FORMATS).map(([k, f]) => (
                <div key={k} className={`fmb${format === k ? ' on' : ''}`} onClick={() => setFormat(k)}>
                  <span className="fmi">{k === 'story' ? '▯' : k === 'post' ? '◻' : '▭'}</span>
                  <span className="fmn">{k === 'landscape' ? 'PAYSAGE' : k.toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* Style */}
            <div className="sl">Style visuel</div>
            <div className="stls">
              {Object.entries(STYLES).map(([k, s]) => (
                <div key={k} className={`stb${style === k ? ' on' : ''}`} onClick={() => setStyle(k)}>
                  <div className="dot" style={{ background: s.dot }} />
                  <div><div className="stn">{s.label}</div><div className="std">{s.desc}</div></div>
                </div>
              ))}
            </div>

            {/* Logo */}
            <div className="sl">Logo (closing frame)</div>
            <div className="logo-zone" onClick={uploadLogo}>
              {logoSrc ? <img src={logoSrc} alt="logo" className="logo-preview" /> : <div className="logo-placeholder">🏷</div>}
              <div className="logo-info">
                <div className="logo-name">{logoSrc ? 'Logo uploadé ✅' : 'Uploader le logo'}</div>
                <div className="logo-sub">{logoSrc ? 'Cliquer pour changer' : 'Apparaît en fin de pub'}</div>
              </div>
            </div>

            {/* Photos & Vidéos */}
            <div className="sl">Photos & Vidéos</div>
            <div style={{ display: 'flex', gap: 4 }}>
              <div className="mz" style={{ flex: 1 }} onClick={() => uploadMedias('image')}>
                <div style={{ fontSize: 14, marginBottom: 2 }}>🖼</div>
                <div className="mz-t"><span>Photos</span></div>
              </div>
              <div className="mz" style={{ flex: 1 }} onClick={() => uploadMedias('video')}>
                <div style={{ fontSize: 14, marginBottom: 2 }}>🎬</div>
                <div className="mz-t"><span>Vidéos</span></div>
              </div>
            </div>
            <div className="mg">
              {medias.map((m, i) => (
                <div key={i} className={`mt${m.sel ? ' on' : ''}`} onClick={() => setMedias(p => p.map((x, j) => j === i ? { ...x, sel: !x.sel } : x))}>
                  {m.type === 'video' ? <video src={m.src} muted /> : <img src={m.src} alt={m.name} loading="lazy" />}
                  {m.type === 'video' && <div className="vid-badge">▶</div>}
                  <div className="mt-tag">{m.tag}</div>
                  {i >= DEFAULT_IMGS.length && <div className="mt-del" onClick={e => { e.stopPropagation(); setMedias(p => p.filter((_, j) => j !== i)); }}>✕</div>}
                </div>
              ))}
            </div>

            {/* Boutons générer */}
            <button className="gen-btn" disabled={loading} onClick={generate}>
              <span className="shimmer" />
              {loading ? <span>⚡ <span className="spin">◌</span> GÉNÉRATION IA...</span> : '⚡ GÉNÉRER LA PUB'}
            </button>
            <button className="var-btn" disabled={loading} onClick={generateVariants}>
              {loading ? '...' : '⊞ 3 VARIANTES UNIQUES'}
            </button>
          </div>

          {/* CANVAS */}
          <div className="cv">
            <div className="ctb">
              <span className="ctl">Aperçu</span>
              <span className="ctf">{FORMATS[format].label}</span>
              {cards.length > 0 && <span style={{ fontSize: '8px', color: 'var(--gold)', marginLeft: 4 }}>{cards.length > 1 ? `${cards.length} variantes` : '1 pub'}</span>}
              <div style={{ marginLeft: 'auto', fontSize: '8.5px', color: 'var(--muted2)' }}>{status}</div>
            </div>

            <div className={`cm${cards.length > 1 ? ' multi' : ''}`}>
              {cards.length > 0 ? cards.map((card, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <AdCard
                    adData={card.data}
                    style={card.style}
                    format={card.format}
                    medias={card.medias}
                    logoSrc={logoSrc}
                    showClosing={true}
                    clubData={CLUBS[card.clubId]}
                  />
                  {card.label && <div className="card-label">{card.label}</div>}
                </div>
              )) : (
                <div className="empty">
                  <div className="empty-ico">⚡</div>
                  <div className="empty-t">ILflyer Pro</div>
                  <div className="empty-s">Choisis le club Bodyhit<br />Écris ton brief<br />Génère 1 pub ou 3 variantes</div>
                </div>
              )}
            </div>

            {/* Export bar */}
            <div className="expb">
              <span className="expl">Exporter</span>
              <button className="exp exp-h" onClick={exportHTML}>⬇ HTML</button>
              <button className="exp exp-j" onClick={exportJPEG}>⬇ JPEG</button>
              <button className="exp exp-c" onClick={() => showToast('Caption copiée !')}>📋 Caption</button>
              <div style={{ marginLeft: 'auto', fontSize: '8px', color: 'var(--muted2)' }}>Avance Hub © 2026</div>
            </div>

            {/* Caption & Hashtags */}
            {showCaption && cards[0]?.data?.caption && (
              <div className="caption-panel">
                <div className="caption-label">
                  <span>CAPTION & HASHTAGS</span>
                  <button className="caption-copy" onClick={() => { navigator.clipboard.writeText(cards[0].data.caption); showToast('✅ Caption copiée !'); }}>📋 Copier</button>
                </div>
                <div className="caption-text">{cards[0].data.caption}</div>
                <div className="hashtags">
                  {(cards[0].data.hashtags || []).map((h, i) => (
                    <span key={i} className="ht" onClick={() => { navigator.clipboard.writeText(h); showToast(`Copié: ${h}`); }}>{h}</span>
                  ))}
                </div>
              </div>
            )}

            {/* AI PANEL */}
            <div className={`aip${aiOpen ? ' on' : ''}`}>
              <div className="aiph">
                <div>
                  <div className="aipt">✦ CLAUDE — SUPERVISION IA</div>
                  <div className="aips">{apiKey ? '● Claude Haiku — Actif · Plein pouvoir' : '○ Clé API requise → Réglages'}</div>
                </div>
                <span className="aipc" onClick={() => setAiOpen(false)}>✕</span>
              </div>
              <div className="ai-sc">
                {AI_SHORTCUTS.map((s, i) => (
                  <div key={i} className={`sc${s.mod ? ' mod' : ''}`} onClick={() => sendAI(s.msg)}>{s.label}</div>
                ))}
              </div>
              <div className="aim" ref={aiMsgsRef}>
                {aiMsgs.map((m, i) => (
                  <div key={i} className={`am ${m.type}`} onClick={m.type === 'act' ? m.action : undefined}>{m.text}</div>
                ))}
              </div>
              <div className="ai-ir">
                <input className="aii" value={aiInput} onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendAI()}
                  placeholder="Modifie la pub, demande une idée, supervise..." />
                <button className="ais" onClick={() => sendAI()} disabled={aiLoading}>
                  {aiLoading ? <span className="spin" style={{ fontSize: 10 }}>◌</span> : '→'}
                </button>
              </div>
            </div>
          </div>
        </>)}

        {/* ── ONGLET LANDING PAGES ── */}
        {tab === 'landing' && (<>
          <div className="sb">
            <div className="sl">Club</div>
            <div className="clubs">
              {Object.values(CLUBS).map(c => (
                <div key={c.id} className={`clu${lpClub === c.id ? ' on' : ''}`} onClick={() => setLpClub(c.id)}>
                  {c.label}<div className="clu-addr">{c.ville}</div>
                </div>
              ))}
            </div>
            <div className="sl">Configuration</div>
            <div className="lp-field">
              <label>Objectif</label>
              <input value={lpObjectif} onChange={e => setLpObjectif(e.target.value)} placeholder="Séance d'essai gratuite" />
            </div>
            <div className="lp-field" style={{ marginTop: 6 }}>
              <label>Texte promo</label>
              <input value={lpPromo} onChange={e => setLpPromo(e.target.value)} placeholder="1ère séance offerte sans engagement" />
            </div>
            <button className="gen-btn" style={{ marginTop: 10 }} disabled={lpLoading} onClick={genLanding}>
              {lpLoading ? <span>⚡ <span className="spin">◌</span> GÉNÉRATION...</span> : '🌐 GÉNÉRER LA LANDING PAGE'}
            </button>
          </div>

          <div className="cv">
            <div className="ctb">
              <span className="ctl">Landing Page</span>
              <span className="ctf">{CLUBS[lpClub]?.ville}</span>
            </div>
            <div className="lp-panel">
              {lpHtml ? (<>
                <div className="lp-actions">
                  <button className="exp exp-h" onClick={exportLanding}>⬇ Exporter HTML</button>
                  <button className="exp exp-j" onClick={() => { navigator.clipboard.writeText(lpHtml); showToast('✅ HTML copié !'); }}>📋 Copier HTML</button>
                </div>
                <div className="lp-preview">
                  <iframe srcDoc={lpHtml} title="landing preview" sandbox="allow-same-origin" />
                </div>
              </>) : (
                <div className="empty" style={{ flex: 1 }}>
                  <div className="empty-ico">🌐</div>
                  <div className="empty-t">Landing Page Premium</div>
                  <div className="empty-s">Configure le club et l'objectif<br />Claude génère une landing page<br />ultra-premium pour Bodyhit</div>
                </div>
              )}
            </div>
          </div>
        </>)}

        {/* ── GALERIE ── */}
        {tab === 'galerie' && (<>
          <div className="sb">
            <div className="sl" style={{ marginTop: 0 }}>Historique</div>
            <div style={{ fontSize: '9.5px', color: 'var(--muted)', padding: '6px 0' }}>{galerie.length} création(s)</div>
            {galerie.length > 0 && <button className="var-btn" onClick={() => setGalerie([])}>🗑 Vider</button>}
          </div>
          <div className="cv">
            <div className="ctb"><span className="ctl">Galerie</span></div>
            <div className="gal-panel">
              {galerie.length === 0 ? (
                <div className="empty"><div className="empty-ico">🖼</div><div className="empty-t">Tes créations apparaîtront ici</div></div>
              ) : galerie.map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <AdCard adData={item.data} style={item.style} format={item.format} medias={item.medias || DEFAULT_IMGS} logoSrc={logoSrc} showClosing={false} clubData={CLUBS[item.clubId]} />
                  <div className="card-label">{item.date} · {CLUBS[item.clubId]?.label}</div>
                </div>
              ))}
            </div>
          </div>
        </>)}

        {/* ── RÉGLAGES ── */}
        {tab === 'settings' && (<>
          <div className="sb">
            <div className="sl" style={{ marginTop: 0 }}>Config</div>
          </div>
          <div className="cv">
            <div className="ctb"><span className="ctl">Réglages</span></div>
            <div className="set-panel">
              <div className="s-sec">
                <div className="s-stitle">🔑 API Anthropic (Claude IA)</div>
                <div className="sf"><label>Clé API</label>
                  <input type="password" value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} placeholder="sk-ant-api03-..." />
                </div>
                <button className="sbtn" onClick={() => { localStorage.setItem('ilflyer_api_key', apiKeyInput); setApiKey(apiKeyInput); showToast('✅ Clé API sauvegardée !'); }}>💾 SAUVEGARDER</button>
                <div className={`pill ${apiKey ? 'ok' : 'ko'}`}>{apiKey ? '● Claude actif — Supervision IA totale' : '○ Clé manquante — Mode local'}</div>
                <div style={{ fontSize: '8.5px', color: 'var(--muted2)', lineHeight: 1.7 }}>
                  Sans clé: variations locales prédéfinies.<br />
                  Avec clé: contenu 100% unique, modification en temps réel, supervision Claude totale.<br />
                  <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>→ console.anthropic.com</a>
                </div>
              </div>
              <div className="s-sec">
                <div className="s-stitle">🗄️ Supabase (Sauvegarde cloud)</div>
                <div className="sf"><label>URL Supabase</label>
                  <input value={supaUrl} onChange={e => setSupaUrl(e.target.value)} placeholder="https://xxx.supabase.co" />
                </div>
                <div className="sf"><label>Clé Anon</label>
                  <input type="password" value={supaKey} onChange={e => setSupaKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." />
                </div>
                <button className="sbtn" onClick={() => {
                  localStorage.setItem('ilflyer_supa_url', supaUrl);
                  localStorage.setItem('ilflyer_supa_key', supaKey);
                  showToast('✅ Supabase configuré !');
                }}>💾 SAUVEGARDER</button>
                <div className={`pill ${supaUrl && supaKey ? 'ok' : 'warn'}`}>{supaUrl && supaKey ? '● Supabase connecté' : '○ Non configuré — Historique en session seulement'}</div>
                <div style={{ fontSize: '8.5px', color: 'var(--muted2)', lineHeight: 1.7 }}>
                  Tables requises: <code style={{ color: 'var(--gold)' }}>ilflyer_creations</code>, <code style={{ color: 'var(--gold)' }}>ilflyer_landings</code><br />
                  <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>→ supabase.com</a>
                </div>
              </div>
              <div className="s-sec">
                <div className="s-stitle">📋 Clubs Bodyhit</div>
                {Object.values(CLUBS).map(c => (
                  <div key={c.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '9px', color: 'var(--muted)', lineHeight: 1.7 }}>
                    <strong style={{ color: 'var(--text)' }}>{c.nom}</strong><br />
                    📍 {c.adresse}, {c.cp} {c.ville}<br />
                    📞 {c.tel} · ✉️ {c.email}
                  </div>
                ))}
              </div>
              <div className="s-sec">
                <div className="s-stitle">📋 À propos</div>
                <div style={{ fontSize: '9px', color: 'var(--muted)', lineHeight: 1.9 }}>
                  <strong style={{ color: 'var(--gold)' }}>ILflyer Pro</strong> — v3.0 Web Edition<br />
                  By <strong style={{ color: 'var(--text)' }}>Avance Hub</strong> © 2026<br /><br />
                  <span style={{ color: 'var(--muted2)' }}>
                    Modèle IA: claude-haiku-4-5-20251001<br />
                    7 styles · 3 formats · QR code auto · Export JPEG<br />
                    Logo closing frame · Compteur créneaux urgence<br />
                    Caption + Hashtags générés par Claude<br />
                    Landing pages premium · Supabase intégré
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>)}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
