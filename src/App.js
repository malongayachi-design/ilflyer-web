import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  IMG_EMS_TRAINING, IMG_BODYHIT_AI1, IMG_BODYHIT_AI2,
  IMG_BODYHIT_REAL1, IMG_BODYHIT_REAL2, IMG_SYMBIONT_MAIN,
  IMG_EMS_MOBILE, IMG_BENEFIT1
} from './images';

const BODYHIT_IMGS = [
  { src: IMG_BODYHIT_AI1,    name: 'Bodyhit Studio 1',  sel: true,  tag: '⭐ Hero' },
  { src: IMG_BODYHIT_AI2,    name: 'Bodyhit Studio 2',  sel: false, tag: '⭐ Hero' },
  { src: IMG_EMS_TRAINING,   name: 'Séance EMS',        sel: false, tag: '💪 Action' },
  { src: IMG_BODYHIT_REAL1,  name: 'Bodyhit Réel 1',    sel: false, tag: '📸 Réel' },
  { src: IMG_BODYHIT_REAL2,  name: 'Bodyhit Réel 2',    sel: false, tag: '📸 Réel' },
  { src: IMG_SYMBIONT_MAIN,  name: 'Symbiont EMS',      sel: false, tag: '🔬 Tech' },
  { src: IMG_EMS_MOBILE,     name: 'EMS Experience',    sel: false, tag: '✨ Premium' },
  { src: IMG_BENEFIT1,       name: 'Résultats',         sel: false, tag: '🏆 Results' },
];

const STYLES = {
  or:        { accent:'#C9A96E', accent2:'#f5d990', bg:'#0a0a0a', tagBg:'rgba(201,169,110,0.12)', tagColor:'#C9A96E', tagBorder:'rgba(201,169,110,0.35)', ctaBg:'#C9A96E', ctaColor:'#0a0a0a', avBg:'linear-gradient(135deg,#C9A96E,#8B6914)', avColor:'#0a0a0a', label:'Noir & Or', desc:'Premium · Luxe · CSP+', dot:'linear-gradient(135deg,#C9A96E,#8B6914)' },
  jaune:     { accent:'#E8F542', accent2:'#f0ff70', bg:'#0d0d0d', tagBg:'rgba(232,245,66,0.08)', tagColor:'#E8F542', tagBorder:'rgba(232,245,66,0.35)', ctaBg:'#E8F542', ctaColor:'#000', avBg:'linear-gradient(135deg,#E8F542,#a8b010)', avColor:'#000', label:'Noir & Jaune', desc:'Énergie · Impact · Viral', dot:'#E8F542' },
  rose:      { accent:'#FF3366', accent2:'#ff6688', bg:'#140008', tagBg:'rgba(255,51,102,0.08)', tagColor:'#FF3366', tagBorder:'rgba(255,51,102,0.35)', ctaBg:'#FF3366', ctaColor:'#fff', avBg:'linear-gradient(135deg,#FF3366,#cc1144)', avColor:'#fff', label:'Rose Bold', desc:'Féminin · Émotionnel', dot:'#FF3366' },
  editorial: { accent:'#e2e8f0', accent2:'#f8fafc', bg:'#0a0f1a', tagBg:'rgba(255,255,255,0.05)', tagColor:'rgba(255,255,255,0.75)', tagBorder:'rgba(255,255,255,0.15)', ctaBg:'#fff', ctaColor:'#0a0a0a', avBg:'linear-gradient(135deg,#e2e8f0,#94a3b8)', avColor:'#0a0a0a', label:'Éditorial', desc:'Magazine · Épuré', dot:'linear-gradient(135deg,#e2e8f0,#94a3b8)' },
  neon:      { accent:'#00f5ff', accent2:'#7b2fff', bg:'#05001a', tagBg:'rgba(0,245,255,0.08)', tagColor:'#00f5ff', tagBorder:'rgba(0,245,255,0.35)', ctaBg:'linear-gradient(135deg,#7b2fff,#00f5ff)', ctaColor:'#fff', avBg:'linear-gradient(135deg,#00f5ff,#7b2fff)', avColor:'#fff', label:'Neon Cyber', desc:'Futuriste · Tech · Digital', dot:'linear-gradient(135deg,#00f5ff,#7b2fff)' },
  fire:      { accent:'#FF6B00', accent2:'#ff3300', bg:'#0a0200', tagBg:'rgba(255,107,0,0.08)', tagColor:'#FF6B00', tagBorder:'rgba(255,107,0,0.35)', ctaBg:'#FF6B00', ctaColor:'#fff', avBg:'linear-gradient(135deg,#FF6B00,#ff3300)', avColor:'#fff', label:'Fire Red', desc:'Intense · Force · Dépassement', dot:'linear-gradient(135deg,#FF6B00,#ff3300)' },
};

const FORMATS = {
  story:     { label:'Story 9:16', cls:'story', ts:'44px', ss:'30px' },
  post:      { label:'Post 1:1',   cls:'post',  ts:'36px', ss:'24px' },
  landscape: { label:'Paysage 16:9', cls:'landscape', ts:'28px', ss:'20px' },
};

const TEMOIGNAGES = [
  { initial:'S', name:'SOPHIE M. · RUEIL · 3 MOIS', quote:'"En 6 séances, ma silhouette a changé."' },
  { initial:'T', name:'THOMAS K. · ISSY · 5 MOIS', quote:'"20 min = plus efficace qu\'1h de salle."' },
  { initial:'A', name:'AMÉLIE D. · ST-CYR · 4 MOIS', quote:'"Je n\'aurais jamais cru des résultats si vite."' },
  { initial:'M', name:'MARC L. · RUEIL · 6 MOIS', quote:'"Mon dos ne m\'a jamais autant remercié."' },
  { initial:'C', name:'CLAIRE B. · ISSY · 2 MOIS', quote:'"Les résultats dès la 4ème séance, incroyable."' },
  { initial:'J', name:'JULIEN R. · ST-CYR · 8 MOIS', quote:'"Perdu 8kg en 2 mois. Je recommande."' },
  { initial:'L', name:'LAURA V. · RUEIL · 3 MOIS', quote:'"Muscles renforcés, stress évacué en 20min."' },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;600;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#080c14;--bg2:#0d1320;--gold:#C9A96E;--gold2:#f5d990;--text:#f1f5f9;--muted:#64748b;--muted2:#334155;--green:#4ade80;}
body{font-family:'Montserrat',sans-serif;background:var(--bg);color:var(--text);height:100vh;overflow:hidden}
.app{display:grid;grid-template-columns:300px 1fr;grid-template-rows:52px 1fr;height:100vh}
.topbar{grid-column:1/-1;background:rgba(13,19,32,0.98);border-bottom:1px solid rgba(201,169,110,0.12);display:flex;align-items:center;padding:0 16px;gap:12px}
.logo{font-family:'Bebas Neue',sans-serif;font-size:20px;color:var(--gold);letter-spacing:2px}
.logo span{color:var(--text)}
.version-badge{background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.25);border-radius:20px;padding:3px 9px;font-size:9px;color:var(--gold);letter-spacing:1.5px;font-weight:700}
.topbar-center{flex:1;display:flex;justify-content:center;gap:6px}
.tab-btn{padding:5px 14px;border-radius:6px;font-size:10px;font-weight:700;cursor:pointer;border:1px solid rgba(255,255,255,0.06);background:transparent;color:var(--muted);font-family:'Montserrat',sans-serif;letter-spacing:1px;transition:all 0.2s}
.tab-btn.active,.tab-btn:hover{background:rgba(201,169,110,0.1);border-color:rgba(201,169,110,0.3);color:var(--gold)}
.topbar-right{display:flex;gap:6px;align-items:center}
.icon-btn{width:30px;height:30px;border-radius:7px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:14px;transition:all 0.2s}
.icon-btn:hover,.icon-btn.on{background:rgba(201,169,110,0.1);color:var(--gold);border-color:rgba(201,169,110,0.4)}
.sidebar{background:var(--bg2);border-right:1px solid rgba(255,255,255,0.04);overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:0}
.sidebar::-webkit-scrollbar{width:3px}
.sidebar::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06);border-radius:2px}
.slabel{font-size:8px;font-weight:700;letter-spacing:2.5px;color:var(--muted2);text-transform:uppercase;margin:12px 0 7px}
.slabel:first-child{margin-top:0}
.club-selector{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px}
.club-btn{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:7px;padding:6px 4px;text-align:center;cursor:pointer;transition:all 0.2s;font-size:8px;color:var(--muted);font-weight:700;letter-spacing:0.5px}
.club-btn.active{border-color:rgba(201,169,110,0.4);background:rgba(201,169,110,0.08);color:var(--gold)}
.prompt-wrap{position:relative}
textarea{width:100%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:9px;color:var(--text);font-family:'Montserrat',sans-serif;font-size:11px;padding:9px 10px;resize:none;line-height:1.6;outline:none;transition:border 0.2s}
textarea:focus{border-color:rgba(201,169,110,0.35)}
textarea::placeholder{color:var(--muted2)}
.prompt-actions{display:flex;gap:5px;margin-top:6px}
.ai-assist-btn{flex:1;background:rgba(201,169,110,0.12);border:1px solid rgba(201,169,110,0.25);border-radius:7px;color:var(--gold);font-size:9px;font-weight:700;padding:6px 8px;cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;text-align:center}
.ai-assist-btn:hover{background:rgba(201,169,110,0.22)}
.ai-assist-btn.secondary{background:rgba(56,189,248,0.08);border-color:rgba(56,189,248,0.2);color:#38bdf8}
.ai-assist-btn.secondary:hover{background:rgba(56,189,248,0.16)}
.format-row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:5px}
.fmt-btn{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:7px 4px;text-align:center;cursor:pointer;transition:all 0.2s}
.fmt-btn.active,.fmt-btn:hover{border-color:rgba(201,169,110,0.4);background:rgba(201,169,110,0.06)}
.fmt-icon{font-size:16px;display:block;margin-bottom:2px}
.fmt-name{font-size:8px;color:var(--muted);font-weight:700;letter-spacing:1px}
.fmt-btn.active .fmt-name{color:var(--gold)}
.style-list{display:flex;flex-direction:column;gap:5px}
.sty-btn{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:9px;padding:8px 10px;cursor:pointer;display:flex;align-items:center;gap:9px;transition:all 0.2s}
.sty-btn:hover{border-color:rgba(255,255,255,0.12)}
.sty-btn.active{border-color:var(--gold);background:rgba(201,169,110,0.05)}
.sty-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.sty-name{font-size:10px;font-weight:700;color:var(--text)}
.sty-desc{font-size:8px;color:var(--muted);margin-top:1px}
.imgs-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-top:7px}
.img-th{aspect-ratio:1;border-radius:6px;overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all 0.2s;position:relative}
.img-th:hover{border-color:rgba(201,169,110,0.4)}
.img-th.sel{border-color:var(--gold)}
.img-th img{width:100%;height:100%;object-fit:cover;display:block}
.img-tag{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.65);font-size:6px;color:rgba(255,255,255,0.7);padding:2px 3px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.img-del{position:absolute;top:2px;right:2px;width:14px;height:14px;background:rgba(0,0,0,0.75);border-radius:50%;display:none;align-items:center;justify-content:center;font-size:7px;color:#fff;cursor:pointer}
.img-th:hover .img-del{display:flex}
.upload-zone{border:1.5px dashed rgba(255,255,255,0.08);border-radius:9px;padding:9px;text-align:center;cursor:pointer;transition:all 0.2s;background:rgba(255,255,255,0.01)}
.upload-zone:hover{border-color:rgba(201,169,110,0.35);background:rgba(201,169,110,0.03)}
.uz-icon{font-size:16px;margin-bottom:2px;opacity:0.5}
.uz-text{font-size:9px;color:var(--muted)}
.uz-hl{color:var(--gold);font-weight:700}
.gen-btn{width:100%;padding:12px;background:linear-gradient(135deg,#C9A96E,#8B6914);border-radius:9px;color:#0a0a0a;font-size:11px;font-weight:900;letter-spacing:2px;cursor:pointer;border:none;font-family:'Montserrat',sans-serif;transition:all 0.2s;margin-top:10px;position:relative;overflow:hidden}
.gen-btn:hover{opacity:0.9;transform:translateY(-1px)}
.gen-btn:disabled{opacity:0.4;cursor:not-allowed;transform:none}
.shimmer{position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent);animation:shimmer 2s infinite}
@keyframes shimmer{to{left:100%}}
.gen-var-btn{width:100%;padding:8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:9px;color:var(--muted);font-size:10px;font-weight:700;cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;margin-top:5px}
.gen-var-btn:hover{border-color:rgba(201,169,110,0.3);color:var(--gold);background:rgba(201,169,110,0.05)}
.gen-var-btn:disabled{opacity:0.3;cursor:not-allowed}
.canvas-area{display:flex;flex-direction:column;overflow:hidden;background:var(--bg);position:relative}
.canvas-toolbar{display:flex;align-items:center;gap:8px;padding:8px 14px;border-bottom:1px solid rgba(255,255,255,0.04);background:var(--bg2);flex-shrink:0}
.ct-label{font-size:9px;color:var(--muted);letter-spacing:2px;font-weight:700;text-transform:uppercase}
.ct-format{font-size:10px;color:var(--gold);font-weight:700;margin-left:2px}
.canvas-main{flex:1;display:flex;align-items:center;justify-content:center;overflow:auto;gap:20px;padding:16px;background:repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(255,255,255,0.01) 8px,rgba(255,255,255,0.01) 16px)}
.canvas-main.multi{flex-wrap:wrap;align-items:flex-start;align-content:flex-start;gap:16px}
.preview-card{border-radius:16px;overflow:hidden;flex-shrink:0;cursor:pointer;box-shadow:0 20px 60px rgba(0,0,0,0.5)}
.preview-card.story{width:210px;height:373px}
.preview-card.post{width:300px;height:300px}
.preview-card.landscape{width:400px;height:225px}
.card-inner{position:relative;width:100%;height:100%;overflow:hidden}
.c-bg{position:absolute;inset:0;background-size:cover;background-position:center;transition:opacity 0.5s ease}
.c-bg.ken{animation:kb 10s ease-in-out infinite alternate}
@keyframes kb{from{transform:scale(1)}to{transform:scale(1.08) translate(-2%,-1%)}}
.c-ot{position:absolute;top:0;left:0;right:0;height:40%;background:linear-gradient(to bottom,rgba(0,0,0,0.75),transparent);z-index:2}
.c-ob{position:absolute;bottom:0;left:0;right:0;height:70%;background:linear-gradient(to top,rgba(0,0,0,0.95),transparent);z-index:2}
.c-os{position:absolute;inset:0;background:linear-gradient(100deg,rgba(0,0,0,0.45) 0%,transparent 60%);z-index:2}
.c-goldbar{position:absolute;top:0;left:0;right:0;height:3px;z-index:10}
.c-hdr{position:absolute;top:11px;left:11px;right:11px;z-index:10;display:flex;align-items:center;justify-content:space-between}
.c-logo{font-size:8px;font-weight:900;letter-spacing:2px;border-radius:20px;padding:3px 9px;border:1px solid;display:inline-block}
.c-tag{font-size:7px;font-weight:800;letter-spacing:1.5px;padding:3px 8px;border-radius:20px;border:1px solid}
.c-prog{position:absolute;bottom:0;left:0;right:0;height:2.5px;z-index:10;overflow:hidden}
.c-prog-inner{height:100%;animation:prog 8s linear infinite}
@keyframes prog{from{width:0}to{width:100%}}
.c-body{position:absolute;bottom:0;left:0;right:0;z-index:10;padding:0 13px 13px}
.c-pretitle{font-size:7px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.45);margin-bottom:4px;text-transform:uppercase}
.c-title{font-family:'Bebas Neue',sans-serif;color:#fff;line-height:0.88;margin-bottom:8px}
.c-stats{display:flex;gap:6px;margin-bottom:8px}
.c-stat{flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.05);border-radius:6px;padding:5px 4px;text-align:center}
.c-stat-v{font-family:'Bebas Neue',sans-serif;font-size:16px;line-height:1;display:block}
.c-stat-l{font-size:6px;letter-spacing:1px;color:rgba(255,255,255,0.35);display:block;margin-top:1px}
.c-temo{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);border-radius:8px;padding:7px 9px;display:flex;gap:7px;align-items:center;margin-bottom:8px}
.c-av{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;flex-shrink:0}
.c-tn{font-size:7px;font-weight:900;letter-spacing:1px;margin-bottom:2px}
.c-tq{font-size:7px;line-height:1.4;color:rgba(255,255,255,0.5);font-style:italic}
.c-ts{font-size:8px;margin-top:2px}
.c-cta{border-radius:7px;padding:9px;text-align:center}
.c-cta-main{font-size:8px;font-weight:900;letter-spacing:1.5px;display:block}
.c-cta-sub{font-size:6px;letter-spacing:1px;display:block;margin-top:2px;opacity:0.55}
.card-label{font-size:8px;color:var(--muted);font-weight:700;letter-spacing:1px;text-align:center;margin-top:5px;max-width:210px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.export-bar{display:flex;align-items:center;gap:6px;padding:8px 14px;border-top:1px solid rgba(255,255,255,0.04);background:var(--bg2);flex-shrink:0}
.exp-lbl{font-size:9px;color:var(--muted);letter-spacing:2px;font-weight:700;text-transform:uppercase;margin-right:4px}
.exp-btn{padding:6px 14px;border-radius:6px;font-size:10px;font-weight:800;cursor:pointer;font-family:'Montserrat',sans-serif;letter-spacing:1px;border:1px solid;transition:all 0.2s;background:transparent}
.exp-btn:hover{transform:translateY(-1px)}
.exp-html{color:#38bdf8;border-color:rgba(56,189,248,0.25);background:rgba(56,189,248,0.1)}
.exp-gif{color:#a78bfa;border-color:rgba(167,139,250,0.25);background:rgba(167,139,250,0.1)}
.exp-mp4{color:#4ade80;border-color:rgba(74,222,128,0.25);background:rgba(74,222,128,0.1)}
.ai-panel{position:absolute;right:14px;top:70px;width:300px;background:var(--bg2);border:1px solid rgba(201,169,110,0.2);border-radius:16px;display:none;flex-direction:column;z-index:50;max-height:480px;box-shadow:0 20px 60px rgba(0,0,0,0.6)}
.ai-panel.open{display:flex}
.ai-panel-hdr{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.ai-panel-title{font-size:11px;font-weight:800;color:var(--gold);letter-spacing:1.5px}
.ai-panel-sub{font-size:8px;color:var(--muted);margin-top:2px}
.ai-close{cursor:pointer;color:var(--muted);font-size:16px}
.ai-shortcuts{display:flex;flex-wrap:wrap;gap:5px;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.04);flex-shrink:0}
.ai-shortcut{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:4px 10px;font-size:8px;color:var(--muted);cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;white-space:nowrap}
.ai-shortcut:hover{border-color:rgba(201,169,110,0.3);color:var(--gold);background:rgba(201,169,110,0.06)}
.ai-msgs{flex:1;overflow-y:auto;padding:10px 14px;display:flex;flex-direction:column;gap:8px;min-height:0}
.ai-msgs::-webkit-scrollbar{width:2px}
.ai-msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.06)}
.ai-msg{padding:8px 11px;border-radius:10px;font-size:10px;line-height:1.6;white-space:pre-wrap}
.ai-msg.user{background:rgba(201,169,110,0.1);color:var(--text);border:1px solid rgba(201,169,110,0.2);margin-left:20px}
.ai-msg.ai{background:rgba(255,255,255,0.04);color:var(--text);border:1px solid rgba(255,255,255,0.06)}
.ai-msg.loading{color:var(--muted);font-style:italic}
.ai-msg.action{background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.15);color:#4ade80;font-weight:700;font-size:9px;cursor:pointer;text-align:center}
.ai-msg.action:hover{background:rgba(74,222,128,0.12)}
.ai-input-row{padding:10px 12px;border-top:1px solid rgba(255,255,255,0.05);display:flex;gap:6px;flex-shrink:0}
.ai-input{flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:8px;color:var(--text);font-size:10px;padding:7px 10px;outline:none;font-family:'Montserrat',sans-serif}
.ai-input:focus{border-color:rgba(201,169,110,0.3)}
.ai-send{background:var(--gold);color:#0a0a0a;border:none;border-radius:7px;width:30px;height:30px;cursor:pointer;font-size:13px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--bg2);border:1px solid rgba(74,222,128,0.3);border-radius:9px;padding:8px 18px;font-size:11px;color:#4ade80;font-weight:700;z-index:999;white-space:nowrap}
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;opacity:0.5}
.empty-icon{font-size:52px}
.empty-title{font-size:13px;font-weight:700;color:var(--muted)}
.empty-sub{font-size:11px;color:var(--muted2);text-align:center}
.settings-panel{padding:20px;display:flex;flex-direction:column;gap:16px;overflow-y:auto;flex:1}
.s-section{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:12px}
.s-section-title{font-size:10px;font-weight:800;color:var(--gold);letter-spacing:2px;text-transform:uppercase}
.s-field{display:flex;flex-direction:column;gap:6px}
.s-field label{font-size:9px;font-weight:700;letter-spacing:2px;color:var(--muted2);text-transform:uppercase}
.s-field input{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:9px;color:var(--text);font-family:'Montserrat',sans-serif;font-size:11px;padding:9px 10px;outline:none;transition:border 0.2s;width:100%}
.s-field input:focus{border-color:rgba(201,169,110,0.35)}
.save-btn{padding:10px 20px;background:linear-gradient(135deg,#C9A96E,#8B6914);border-radius:9px;color:#0a0a0a;font-size:11px;font-weight:900;letter-spacing:2px;cursor:pointer;border:none;font-family:'Montserrat',sans-serif;align-self:flex-start}
.pill{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:9px;font-weight:700}
.pill.ok{background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);color:#4ade80}
.pill.ko{background:rgba(255,51,102,0.1);border:1px solid rgba(255,51,102,0.25);color:#FF3366}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.anim{animation:fadeUp 0.5s ease both}
.anim-1{animation-delay:0.1s}.anim-2{animation-delay:0.25s}.anim-3{animation-delay:0.4s}.anim-4{animation-delay:0.55s}
.spin{display:inline-block;animation:spin 1s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
`;

function genFallback(prompt, club, idx = 0) {
  const vars = [
    { hook:'20 MINUTES.', sub:'TOUT CHANGE.', cta:'ESSAYER MAINTENANT', urgence:'PLACES LIMITÉES' },
    { hook:'RÉSULTATS.', sub:'DÈS LA 4ÈME SÉANCE.', cta:'1ÈRE SÉANCE OFFERTE', urgence:'SUR RENDEZ-VOUS' },
    { hook:'90% MUSCLES.', sub:'ACTIVÉS EN 20 MIN.', cta:'RÉSERVER MA PLACE', urgence:'OFFRE LIMITÉE' },
    { hook:'×7 EFFICACE.', sub:'VS SALLE CLASSIQUE.', cta:'JE VEUX ESSAYER', urgence:'3 CRÉNEAUX RESTANTS' },
    { hook:'TRANSFORME-TOI.', sub:'EN SEULEMENT 20 MIN.', cta:'COMMENCER AUJOURD\'HUI', urgence:'INSCRIPTION GRATUITE' },
    { hook:'SANS EFFORT.', sub:'AVEC DES RÉSULTATS.', cta:'DÉCOUVRIR L\'EMS', urgence:'DISPONIBLE CE WEEK-END' },
  ];
  const statsVars = [
    [{v:'90%',l:'MUSCLES'},{v:'×7',l:'RÉSULTAT'},{v:"20'",l:'SÉANCE'}],
    [{v:'4X',l:'SÉANCES'},{v:'98%',l:'SATISFAITS'},{v:"20'",l:'SUFFIT'}],
    [{v:'500+',l:'MEMBRES'},{v:'6',l:'SÉANCES'},{v:'80%',l:'MUSCLES'}],
  ];
  const isGratuit = prompt?.toLowerCase().includes('gratuit') || prompt?.toLowerCase().includes('essai');
  const v = vars[idx % vars.length];
  const s = statsVars[idx % statsVars.length];
  const t = TEMOIGNAGES[idx % TEMOIGNAGES.length];
  return {
    hook: v.hook, sub: v.sub,
    cta: isGratuit ? '1ÈRE SÉANCE GRATUITE' : v.cta,
    stats: s, temo: t,
    tag: `BODYHIT · ${club}`, urgence: v.urgence,
    pretitle: 'STUDIO EMS · TECHNOLOGIE MÉDICALE'
  };
}

function AdCard({ adData, style, format, bgSrc, label }) {
  const st = STYLES[style] || STYLES.or;
  const fmt = FORMATS[format] || FORMATS.story;
  const isStory = fmt.cls === 'story';
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'6px' }}>
      <div className={`preview-card ${fmt.cls} anim`} id="mainCard">
        <div className="card-inner" style={{ background: st.bg }}>
          <div className="c-bg ken" style={{ backgroundImage:`url('${bgSrc}')` }}></div>
          <div className="c-ot"></div><div className="c-ob"></div><div className="c-os"></div>
          <div className="c-goldbar" style={{ background:`linear-gradient(90deg,${st.accent},${st.accent2},${st.accent})` }}></div>
          <div className="c-hdr">
            <div className="c-logo" style={{ color:st.tagColor, background:st.tagBg, borderColor:st.tagBorder }}>{adData.tag||'BODYHIT'}</div>
            <div className="c-tag" style={{ color:st.tagColor, background:st.tagBg, borderColor:st.tagBorder }}>EMS PRO</div>
          </div>
          {isStory && <div className="c-prog"><div className="c-prog-inner" style={{ background:`linear-gradient(90deg,${st.accent},${st.accent2})` }}></div></div>}
          <div className="c-body">
            <div className="c-pretitle anim anim-1">{adData.pretitle||'STUDIO EMS · TECHNOLOGIE MÉDICALE'}</div>
            <div className="c-title anim anim-2" style={{ fontSize:fmt.ts }}>
              {adData.hook||'20 MIN.'}<br/>
              <em style={{ color:st.accent, fontStyle:'normal' }}>{adData.sub||'TOUT CHANGE.'}</em>
            </div>
            <div className="c-stats anim anim-3">
              {(adData.stats||[]).map((s,i)=>(
                <div className="c-stat" key={i}>
                  <span className="c-stat-v" style={{ color:st.accent }}>{s.v}</span>
                  <span className="c-stat-l">{s.l}</span>
                </div>
              ))}
            </div>
            {isStory && adData.temo && (
              <div className="c-temo anim anim-4">
                <div className="c-av" style={{ background:st.avBg, color:st.avColor }}>{adData.temo.initial||'S'}</div>
                <div>
                  <div className="c-tn" style={{ color:st.accent }}>{adData.temo.name}</div>
                  <div className="c-tq">{adData.temo.quote}</div>
                  <div className="c-ts" style={{ color:st.accent }}>★★★★★</div>
                </div>
              </div>
            )}
            <div className="c-cta anim anim-4" style={{ background:st.ctaBg }}>
              <span className="c-cta-main" style={{ color:st.ctaColor }}>{adData.cta||'RÉSERVER'}</span>
              <span className="c-cta-sub" style={{ color:st.ctaColor }}>{adData.urgence||'PLACES LIMITÉES'}</span>
            </div>
          </div>
        </div>
      </div>
      {label && <div className="card-label">{label}</div>}
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('create');
  const [curStyle, setCurStyle] = useState('or');
  const [curFormat, setCurFormat] = useState('story');
  const [curClub, setCurClub] = useState('RUEIL');
  const [prompt, setPrompt] = useState('');
  const [imgs, setImgs] = useState([...BODYHIT_IMGS]);
  const [cards, setCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genCount, setGenCount] = useState(0);
  const [status, setStatus] = useState('Prêt');
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([{
    type:'ai',
    text:'✦ Bonjour ! Je suis ton assistant créatif ILflyer.\n\nJe peux :\n• Rédiger ton message pub\n• Générer 3 variantes uniques\n• Adapter le texte selon le club\n• Créer des hooks viraux pour Reels\n\nClique sur un raccourci ou pose ta question !'
  }]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [apiKey, setApiKey] = useState(()=>localStorage.getItem('ilflyer_api_key')||'');
  const [apiKeyInput, setApiKeyInput] = useState(()=>localStorage.getItem('ilflyer_api_key')||'');
  const [galerie, setGalerie] = useState([]);
  const aiMsgsRef = useRef(null);

  const showToast = useCallback((msg) => { setToast(msg); setTimeout(()=>setToast(''),3000); },[]);

  const callClaude = useCallback(async ({ prompt:p, systemPrompt, maxTokens=600 }) => {
    const key = localStorage.getItem('ilflyer_api_key')||'';
    if (!key) return { error:'no_key' };
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'x-api-key':key, 'anthropic-version':'2023-06-01', 'anthropic-dangerous-direct-browser-access':'true' },
        body: JSON.stringify({ model:'claude-haiku-4-5-20251001', max_tokens:maxTokens, system:systemPrompt, messages:[{role:'user',content:p}] })
      });
      const data = await res.json();
      return { text:data.content?.[0]?.text||'', error:data.error?.message };
    } catch(e) { return { error:e.message }; }
  },[]);

  const generateOneCard = useCallback(async (promptText, club, varIdx=0) => {
    const tones = [
      'émotionnel et personnel, transformation de vie',
      'scientifique, technologie EMS et performance',
      'urgent et exclusif, offre limitée',
      'social, coach et communauté',
      'résultats concrets, chiffres et preuves',
    ];
    const tone = tones[varIdx % tones.length];
    const temo = TEMOIGNAGES[(varIdx + Math.floor(Math.random()*3)) % TEMOIGNAGES.length];
    const key = localStorage.getItem('ilflyer_api_key')||'';
    if (key) {
      const res = await callClaude({
        prompt:`Variation ${varIdx+1} — Ton: ${tone}
Brief: "${promptText||'Séance EMS Bodyhit '+club+', résultats garantis'}"
Club: Bodyhit ${club}

Retourne UNIQUEMENT ce JSON (hook/sub UNIQUES pour cette variation):
{"hook":"ACCROCHE 2-4 MOTS MAJUSCULES","sub":"SOUS-TITRE 3-5 MOTS","cta":"BOUTON ACTION","pretitle":"STUDIO EMS · ${club} — ou créatif","stats":[{"v":"CHIFFRE","l":"LABEL"},{"v":"CHIFFRE","l":"LABEL"},{"v":"CHIFFRE","l":"LABEL"}],"temo":{"initial":"${temo.initial}","name":"${temo.name}","quote":"${temo.quote}"},"tag":"BODYHIT · ${club}","urgence":"MESSAGE URGENCE"}`,
        systemPrompt:`Expert copywriting EMS fitness premium. JSON pur uniquement, zéro texte en dehors. Chaque variation = hook+sub TOTALEMENT DIFFÉRENTS.`,
        maxTokens:400
      });
      if (res.text && !res.error) {
        try { return JSON.parse(res.text.replace(/```json|```/g,'').trim()); }
        catch(e) {}
      }
    }
    return genFallback(promptText, club, varIdx);
  },[callClaude]);

  const generateContent = async () => {
    const selImgs = imgs.filter(i=>i.sel);
    const bgSrc = selImgs[0]?.src || imgs[0]?.src || '';
    setIsGenerating(true); setStatus('⚡ Génération IA...');
    const data = await generateOneCard(prompt, curClub, genCount);
    setCards([{ data, bgSrc, style:curStyle, format:curFormat }]);
    setGenCount(c=>c+1); setIsGenerating(false); setStatus('✅ Généré');
    setGalerie(g=>[{ data, bgSrc, style:curStyle, format:curFormat, date:new Date().toLocaleTimeString(), prompt }, ...g].slice(0,20));
    showToast('✅ Publicité créée !');
  };

  const generateVariants = async () => {
    const selImgs = imgs.filter(i=>i.sel);
    setIsGenerating(true); setStatus('⚡ 3 variantes en cours...');
    const bgSrcs = [0,1,2].map(i=>selImgs[i]?.src||imgs[i]?.src||imgs[0]?.src||'');
    const results = await Promise.all([
      generateOneCard(prompt, curClub, genCount),
      generateOneCard(prompt, curClub, genCount+1),
      generateOneCard(prompt, curClub, genCount+2),
    ]);
    const newCards = results.map((data,i)=>({ data, bgSrc:bgSrcs[i], style:curStyle, format:curFormat, label:`VARIANTE ${i+1}` }));
    setCards(newCards); setGenCount(c=>c+3); setIsGenerating(false); setStatus('✅ 3 variantes générées');
    setGalerie(g=>[...newCards.map(c=>({...c,date:new Date().toLocaleTimeString(),prompt})),...g].slice(0,20));
    showToast('✅ 3 variantes créées !');
  };

  const exportHTML = () => {
    if (!cards.length) { showToast('⚠️ Génère d\'abord une publicité'); return; }
    const card = document.getElementById('mainCard');
    if (!card) return;
    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet"><style>*{margin:0;padding:0;box-sizing:border-box}body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#060c14}@keyframes kb{from{transform:scale(1)}to{transform:scale(1.08) translate(-2%,-1%)}}@keyframes prog{from{width:0}to{width:100%}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.ken{animation:kb 10s ease-in-out infinite alternate}.c-prog-inner{animation:prog 8s linear infinite}.anim{animation:fadeUp 0.5s ease both}.anim-1{animation-delay:.1s}.anim-2{animation-delay:.25s}.anim-3{animation-delay:.4s}.anim-4{animation-delay:.55s}.preview-card{border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.6)}.card-inner{position:relative;overflow:hidden}.c-bg{position:absolute;inset:0;background-size:cover;background-position:center}.c-ot{position:absolute;top:0;left:0;right:0;height:40%;background:linear-gradient(to bottom,rgba(0,0,0,.75),transparent);z-index:2}.c-ob{position:absolute;bottom:0;left:0;right:0;height:70%;background:linear-gradient(to top,rgba(0,0,0,.95),transparent);z-index:2}.c-os{position:absolute;inset:0;background:linear-gradient(100deg,rgba(0,0,0,.45),transparent 60%);z-index:2}.c-goldbar{position:absolute;top:0;left:0;right:0;height:3px;z-index:10}.c-hdr{position:absolute;top:11px;left:11px;right:11px;z-index:10;display:flex;align-items:center;justify-content:space-between}.c-logo,.c-tag{font-size:8px;font-weight:900;letter-spacing:2px;border-radius:20px;padding:3px 9px;border:1px solid;font-family:"Montserrat",sans-serif}.c-prog{position:absolute;bottom:0;left:0;right:0;height:2.5px;z-index:10;overflow:hidden}.c-body{position:absolute;bottom:0;left:0;right:0;z-index:10;padding:0 13px 13px;font-family:"Montserrat",sans-serif}.c-pretitle{font-size:7px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,.45);margin-bottom:4px}.c-title{font-family:"Bebas Neue",sans-serif;color:#fff;line-height:.88;margin-bottom:8px}.c-stats{display:flex;gap:6px;margin-bottom:8px}.c-stat{flex:1;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.05);border-radius:6px;padding:5px 4px;text-align:center}.c-stat-v{font-family:"Bebas Neue",sans-serif;font-size:16px;line-height:1;display:block}.c-stat-l{font-size:6px;letter-spacing:1px;color:rgba(255,255,255,.35);display:block;margin-top:1px}.c-temo{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.09);border-radius:8px;padding:7px 9px;display:flex;gap:7px;align-items:center;margin-bottom:8px}.c-av{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;flex-shrink:0}.c-tn{font-size:7px;font-weight:900;letter-spacing:1px;margin-bottom:2px}.c-tq{font-size:7px;line-height:1.4;color:rgba(255,255,255,.5);font-style:italic}.c-ts{font-size:8px;margin-top:2px}.c-cta{border-radius:7px;padding:9px;text-align:center}.c-cta-main{font-size:8px;font-weight:900;letter-spacing:1.5px;display:block}.c-cta-sub{font-size:6px;letter-spacing:1px;display:block;margin-top:2px;opacity:.55}.story{width:390px;height:692px}.post{width:540px;height:540px}.landscape{width:720px;height:405px}</style></head><body>${card.outerHTML}</body></html>`;
    const a = document.createElement('a');
    a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
    a.download = `bodyhit-${curClub.toLowerCase()}-pub.html`;
    a.click(); showToast('✅ HTML téléchargé !');
  };

  const AI_SHORTCUTS = [
    { label:'✍️ Rédige le texte', msg:`Rédige un message pub percutant pour Bodyhit ${curClub}. EMS 20 minutes, résultats garantis. Sois direct.` },
    { label:'🎁 Séance gratuite', msg:`Texte pub 1ère séance gratuite Bodyhit ${curClub}. Urgence + exclusivité.` },
    { label:'💪 Cible femmes', msg:`Pub EMS féminine Bodyhit ${curClub}. Transformation silhouette, résultats en 4 séances.` },
    { label:'👨 Cible hommes', msg:`Pub EMS masculine Bodyhit ${curClub}. Performance, gain musculaire, optimal pour actifs.` },
    { label:'📱 Hook Reels', msg:`Crée un hook viral pour Reels Instagram Bodyhit ${curClub}. Accroche 3 secondes maximum.` },
    { label:'📊 Chiffres clés', msg:`Pub basée sur les preuves: 20min=4h de sport, 90% muscles activés. Bodyhit ${curClub}.` },
  ];

  const sendAIMsg = async (msgOverride) => {
    const msg = msgOverride||aiInput.trim();
    if (!msg||aiLoading) return;
    setAiInput(''); setAiLoading(true);
    setAiMessages(m=>[...m,{type:'user',text:msg}]);
    setAiMessages(m=>[...m,{type:'loading',text:'⚡ Rédaction en cours...'}]);
    const res = await callClaude({
      prompt: msg,
      systemPrompt:`Tu es l'assistant créatif d'ILflyer pour Bodyhit — studios EMS premium en Île-de-France. Club actuel: ${curClub}.
Crée du contenu pub percutant pour Instagram/TikTok/Facebook.
Cible CSP+ 28-54 ans. Arguments: 20min=4h de sport, 90% muscles, résultats dès 4ème séance.
Quand tu génères du texte pub: propose-le directement entre guillemets, prêt à copier.
Max 120 mots. Concis, percutant, sans explication.`,
      maxTokens:350
    });
    setAiLoading(false);
    const txt = res.text || (res.error==='no_key' ? '⚠️ Configure ta clé API dans Réglages pour activer l\'assistant IA.' : 'Erreur de connexion.');
    setAiMessages(m=>{const u=[...m];u[u.length-1]={type:'ai',text:txt};return u;});
    if (res.text && res.text.length>30) {
      const extracted = res.text.match(/"([^"]{25,})"/)?.[1];
      if (extracted) {
        setAiMessages(m=>[...m,{ type:'action', text:'→ Utiliser ce texte comme brief', action:()=>{ setPrompt(extracted); showToast('✅ Texte inséré !'); } }]);
      }
    }
  };

  useEffect(()=>{ if(aiMsgsRef.current) aiMsgsRef.current.scrollTop=aiMsgsRef.current.scrollHeight; },[aiMessages]);

  const openFiles = () => {
    const input = document.createElement('input');
    input.type='file'; input.multiple=true; input.accept='image/*';
    input.onchange=(e)=>Array.from(e.target.files).forEach(file=>{
      const fr=new FileReader();
      fr.onload=ev=>setImgs(p=>[...p,{src:ev.target.result,name:file.name,sel:true,tag:'📁 Upload'}]);
      fr.readAsDataURL(file);
    });
    input.click();
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="topbar">
          <div className="logo">IL<span>flyer</span> <span style={{fontSize:'12px',color:'var(--gold)',marginLeft:'2px'}}>PRO</span></div>
          <div className="version-badge">BY AVANCE HUB</div>
          <div className="topbar-center">
            {[['create','Créer'],['galerie','Galerie'],['settings','Réglages']].map(([t,l])=>(
              <button key={t} className={`tab-btn${activeTab===t?' active':''}`} onClick={()=>setActiveTab(t)}>{l}</button>
            ))}
          </div>
          <div className="topbar-right">
            <button className={`icon-btn${aiPanelOpen?' on':''}`} onClick={()=>setAiPanelOpen(!aiPanelOpen)} title="Assistant IA">✦</button>
            <button className="icon-btn" onClick={()=>{setPrompt('');setCards([]);setStatus('Prêt');}} title="Nouveau">↺</button>
          </div>
        </div>

        {activeTab==='create' && (<>
          <div className="sidebar">
            <div className="slabel">Club Bodyhit</div>
            <div className="club-selector">
              {['RUEIL','ISSY','ST-CYR'].map(c=>(
                <div key={c} className={`club-btn${curClub===c?' active':''}`} onClick={()=>setCurClub(c)}>{c}</div>
              ))}
            </div>
            <div className="slabel">Message publicitaire</div>
            <div className="prompt-wrap">
              <textarea rows="4" value={prompt} onChange={e=>setPrompt(e.target.value)}
                placeholder={`Ex: 1ère séance gratuite Bodyhit ${curClub} — 20 min = 4h de sport...`}/>
            </div>
            <div className="prompt-actions">
              <button className="ai-assist-btn" onClick={()=>setAiPanelOpen(true)}>✦ Aide IA</button>
              <button className="ai-assist-btn secondary" onClick={()=>{ const f=genFallback(prompt,curClub,genCount); setPrompt(`${f.hook} ${f.sub}`); }}>↻ Suggestion</button>
            </div>
            <div className="slabel">Format</div>
            <div className="format-row">
              {Object.entries(FORMATS).map(([k,f])=>(
                <div key={k} className={`fmt-btn${curFormat===k?' active':''}`} onClick={()=>setCurFormat(k)}>
                  <span className="fmt-icon">{k==='story'?'▯':k==='post'?'◻':'▭'}</span>
                  <span className="fmt-name">{k==='landscape'?'PAYSAGE':k.toUpperCase()}</span>
                </div>
              ))}
            </div>
            <div className="slabel">Style visuel</div>
            <div className="style-list">
              {Object.entries(STYLES).map(([k,st])=>(
                <div key={k} className={`sty-btn${curStyle===k?' active':''}`} onClick={()=>setCurStyle(k)}>
                  <div className="sty-dot" style={{background:st.dot}}></div>
                  <div><div className="sty-name">{st.label}</div><div className="sty-desc">{st.desc}</div></div>
                </div>
              ))}
            </div>
            <div className="slabel">Photos Bodyhit</div>
            <div className="upload-zone" onClick={openFiles}>
              <div className="uz-icon">+</div>
              <div className="uz-text"><span className="uz-hl">Ajouter des photos</span></div>
            </div>
            <div className="imgs-grid">
              {imgs.map((img,i)=>(
                <div key={i} className={`img-th${img.sel?' sel':''}`} onClick={()=>setImgs(p=>p.map((im,idx)=>idx===i?{...im,sel:!im.sel}:im))}>
                  <img src={img.src} alt={img.name} loading="lazy"/>
                  <div className="img-tag">{img.tag||img.name}</div>
                  {i>=BODYHIT_IMGS.length && <div className="img-del" onClick={e=>{e.stopPropagation();setImgs(p=>p.filter((_,idx)=>idx!==i));}}>✕</div>}
                </div>
              ))}
            </div>
            <button className="gen-btn" disabled={isGenerating} onClick={generateContent}>
              <span className="shimmer"></span>
              {isGenerating?<span>⚡ <span className="spin">◌</span> GÉNÉRATION...</span>:'⚡ GÉNÉRER LA PUBLICITÉ'}
            </button>
            <button className="gen-var-btn" disabled={isGenerating} onClick={generateVariants}>
              {isGenerating?'...':'⊞ GÉNÉRER 3 VARIANTES UNIQUES'}
            </button>
          </div>

          <div className="canvas-area">
            <div className="canvas-toolbar">
              <span className="ct-label">Aperçu</span>
              <span className="ct-format">{FORMATS[curFormat].label}</span>
              {cards.length>0 && <span style={{fontSize:'9px',color:'var(--gold)',marginLeft:'4px'}}>{cards.length>1?`${cards.length} variantes`:'1 pub'}</span>}
              <div style={{marginLeft:'auto',fontSize:'9px',color:'var(--muted2)'}}>{status}</div>
            </div>
            <div className={`canvas-main${cards.length>1?' multi':''}`}>
              {cards.length>0 ? cards.map((card,i)=>(
                <AdCard key={i} adData={card.data} style={card.style} format={card.format} bgSrc={card.bgSrc} label={card.label}/>
              )) : (
                <div className="empty">
                  <div className="empty-icon">⚡</div>
                  <div className="empty-title">ILflyer Pro</div>
                  <div className="empty-sub">Choisis le club · Écris le brief<br/>Génère 1 pub ou 3 variantes uniques</div>
                </div>
              )}
            </div>
            <div className="export-bar">
              <span className="exp-lbl">Exporter</span>
              <button className="exp-btn exp-html" onClick={exportHTML}>⬇ HTML</button>
              <button className="exp-btn exp-gif" onClick={()=>showToast('GIF — bientôt disponible')}>⬇ GIF</button>
              <button className="exp-btn exp-mp4" onClick={()=>showToast('MP4 — bientôt disponible')}>⬇ MP4</button>
              <div style={{marginLeft:'auto',fontSize:'9px',color:'var(--muted2)'}}>Avance Hub © 2026</div>
            </div>

            <div className={`ai-panel${aiPanelOpen?' open':''}`}>
              <div className="ai-panel-hdr">
                <div>
                  <div className="ai-panel-title">✦ ASSISTANT CRÉATIF IA</div>
                  <div className="ai-panel-sub">{apiKey?'● Claude Haiku — Actif':'○ Clé API requise → Réglages'}</div>
                </div>
                <span className="ai-close" onClick={()=>setAiPanelOpen(false)}>✕</span>
              </div>
              <div className="ai-shortcuts">
                {AI_SHORTCUTS.map((s,i)=>(
                  <div key={i} className="ai-shortcut" onClick={()=>sendAIMsg(s.msg)}>{s.label}</div>
                ))}
              </div>
              <div className="ai-msgs" ref={aiMsgsRef}>
                {aiMessages.map((m,i)=>(
                  <div key={i} className={`ai-msg ${m.type}`} onClick={m.type==='action'?m.action:undefined}>{m.text}</div>
                ))}
              </div>
              <div className="ai-input-row">
                <input className="ai-input" value={aiInput} onChange={e=>setAiInput(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&sendAIMsg()} placeholder="Décris ta pub, demande une idée..."/>
                <button className="ai-send" onClick={()=>sendAIMsg()} disabled={aiLoading}>
                  {aiLoading?<span className="spin" style={{fontSize:'10px'}}>◌</span>:'→'}
                </button>
              </div>
            </div>
          </div>
        </>)}

        {activeTab==='galerie' && (<>
          <div className="sidebar">
            <div className="slabel" style={{marginTop:0}}>Historique</div>
            <div style={{fontSize:'10px',color:'var(--muted)',padding:'8px 0'}}>{galerie.length} création(s)</div>
            {galerie.length>0 && <button className="gen-var-btn" onClick={()=>setGalerie([])}>🗑 Vider</button>}
          </div>
          <div className="canvas-area">
            <div className="canvas-toolbar"><span className="ct-label">Galerie</span></div>
            <div className="canvas-main multi" style={{alignContent:'flex-start'}}>
              {galerie.length===0 ? (
                <div className="empty" style={{width:'100%'}}>
                  <div style={{fontSize:'40px'}}>🖼</div>
                  <div style={{fontSize:'12px',color:'var(--muted)'}}>Tes créations apparaîtront ici</div>
                </div>
              ) : galerie.map((item,i)=>(
                <AdCard key={i} adData={item.data} style={item.style} format={item.format} bgSrc={item.bgSrc}
                  label={`${item.date} · ${(item.prompt||'Sans titre').slice(0,22)}...`}/>
              ))}
            </div>
          </div>
        </>)}

        {activeTab==='settings' && (<>
          <div className="sidebar">
            <div className="slabel" style={{marginTop:0}}>Config</div>
          </div>
          <div className="canvas-area">
            <div className="canvas-toolbar"><span className="ct-label">Réglages</span></div>
            <div className="settings-panel">
              <div className="s-section">
                <div className="s-section-title">🔑 API Anthropic (Claude IA)</div>
                <div className="s-field">
                  <label>Clé API</label>
                  <input type="password" value={apiKeyInput} onChange={e=>setApiKeyInput(e.target.value)} placeholder="sk-ant-api03-..."/>
                </div>
                <button className="save-btn" onClick={()=>{ localStorage.setItem('ilflyer_api_key',apiKeyInput); setApiKey(apiKeyInput); showToast('✅ Clé sauvegardée !'); }}>💾 SAUVEGARDER</button>
                <div className={`pill ${apiKey?'ok':'ko'}`}>{apiKey?'● IA Active — Claude Haiku':'○ Clé manquante — Mode local'}</div>
                <div style={{fontSize:'9px',color:'var(--muted2)',lineHeight:'1.7'}}>
                  Sans clé: variations prédéfinies locales.<br/>
                  Avec clé Claude: contenu 100% unique généré par l'IA à chaque génération.<br/>
                  → <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{color:'var(--gold)'}}>Obtenir une clé sur console.anthropic.com</a>
                </div>
              </div>
              <div className="s-section">
                <div className="s-section-title">📋 À propos</div>
                <div style={{fontSize:'10px',color:'var(--muted)',lineHeight:'1.9'}}>
                  <strong style={{color:'var(--gold)'}}>ILflyer Pro</strong> — v2.0 Web Edition<br/>
                  By <strong style={{color:'var(--text)'}}>Avance Hub</strong> © 2026<br/><br/>
                  Client : <strong style={{color:'var(--text)'}}>Bodyhit EMS</strong><br/>
                  Rueil-Malmaison · Issy-les-Moulineaux · Saint-Cyr-l'École<br/><br/>
                  <span style={{color:'var(--muted2)'}}>
                    Modèle IA : claude-haiku-4-5-20251001<br/>
                    6 styles · 3 formats · 8 photos Bodyhit<br/>
                    1 pub ou 3 variantes uniques simultanées<br/>
                    Assistant créatif IA intégré
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
