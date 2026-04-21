import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CLUBS, STYLES, FORMATS, TEMOS, LOGO_SVG } from './lib/data';
import { generateAd, modifyAd, chat, generateLanding, fallbackAd, dbSave, dbLoad } from './lib/api';
import {
  IMG_EMS_TRAINING, IMG_BODYHIT_AI1, IMG_BODYHIT_AI2,
  IMG_BODYHIT_REAL1, IMG_BODYHIT_REAL2, IMG_SYMBIONT_MAIN,
  IMG_EMS_MOBILE, IMG_BENEFIT1
} from './images';

const DEFAULT_IMGS = [
  { src:IMG_BODYHIT_AI1,   name:'Bodyhit Hero 1',  sel:true,  tag:'⭐ Hero',      type:'image' },
  { src:IMG_BODYHIT_AI2,   name:'Bodyhit Hero 2',  sel:false, tag:'⭐ Hero',      type:'image' },
  { src:IMG_EMS_TRAINING,  name:'Séance EMS',      sel:false, tag:'💪 Action',    type:'image' },
  { src:IMG_BODYHIT_REAL1, name:'Studio Réel 1',   sel:false, tag:'📸 Réel',      type:'image' },
  { src:IMG_BODYHIT_REAL2, name:'Studio Réel 2',   sel:false, tag:'📸 Réel',      type:'image' },
  { src:IMG_SYMBIONT_MAIN, name:'SYMBIONT Tech',   sel:false, tag:'🔬 SYMBIONT',  type:'image' },
  { src:IMG_EMS_MOBILE,    name:'EMS Premium',     sel:false, tag:'✨ Premium',   type:'image' },
  { src:IMG_BENEFIT1,      name:'Résultats',       sel:false, tag:'🏆 Résultats', type:'image' },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;600;700;900&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{--bg:#080c14;--bg2:#0d1320;--bg3:#111827;--gold:#C9A96E;--text:#f1f5f9;--muted:#64748b;--muted2:#334155;--green:#4ade80;--red:#FF3366;--blue:#38bdf8;}
body{font-family:'Montserrat',sans-serif;background:var(--bg);color:var(--text);height:100vh;overflow:hidden}
.app{display:grid;grid-template-columns:285px 1fr;grid-template-rows:50px 1fr;height:100vh}

/* TOPBAR */
.topbar{grid-column:1/-1;background:rgba(13,19,32,0.98);border-bottom:1px solid rgba(201,169,110,0.15);display:flex;align-items:center;padding:0 14px;gap:10px}
.logo{font-family:'Bebas Neue',sans-serif;font-size:19px;color:var(--gold);letter-spacing:2px;flex-shrink:0}
.logo span{color:var(--text)}
.badge{background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.2);border-radius:20px;padding:2px 8px;font-size:7.5px;color:var(--gold);letter-spacing:1.5px;font-weight:700}
.tabs{flex:1;display:flex;justify-content:center;gap:4px}
.tab{padding:5px 11px;border-radius:6px;font-size:9.5px;font-weight:700;cursor:pointer;border:1px solid rgba(255,255,255,0.06);background:transparent;color:var(--muted);font-family:'Montserrat',sans-serif;letter-spacing:0.5px;transition:all 0.2s}
.tab.on,.tab:hover{background:rgba(201,169,110,0.1);border-color:rgba(201,169,110,0.3);color:var(--gold)}
.tr{display:flex;gap:5px}
.ib{width:28px;height:28px;border-radius:6px;border:1px solid rgba(255,255,255,0.07);background:transparent;color:var(--muted);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:13px;transition:all 0.2s}
.ib:hover,.ib.on{background:rgba(201,169,110,0.1);color:var(--gold);border-color:rgba(201,169,110,0.3)}

/* SIDEBAR */
.sb{background:var(--bg2);border-right:1px solid rgba(255,255,255,0.04);overflow-y:auto;padding:11px 10px;display:flex;flex-direction:column;gap:0}
.sb::-webkit-scrollbar{width:3px}
.sb::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.07);border-radius:2px}
.sl{font-size:7.5px;font-weight:700;letter-spacing:2.5px;color:var(--muted2);text-transform:uppercase;margin:10px 0 6px}
.sl:first-child{margin-top:0}

/* Clubs */
.clubs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px}
.cb{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:7px;padding:5px 3px;text-align:center;cursor:pointer;transition:all 0.2s}
.cb.on{border-color:rgba(201,169,110,0.5);background:rgba(201,169,110,0.09);color:var(--gold)}
.cb-n{font-size:8px;font-weight:700;color:var(--muted);letter-spacing:0.5px}
.cb.on .cb-n{color:var(--gold)}
.cb-a{font-size:6px;color:var(--muted2);margin-top:1px}
.club-info{font-size:7px;color:var(--muted);padding:4px 2px;line-height:1.6;border-bottom:1px solid rgba(255,255,255,0.04);margin-bottom:2px}

/* Textarea */
textarea{width:100%;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;color:var(--text);font-family:'Montserrat',sans-serif;font-size:10.5px;padding:8px 10px;resize:none;line-height:1.6;outline:none;transition:border 0.2s}
textarea:focus{border-color:rgba(201,169,110,0.35)}
textarea::placeholder{color:var(--muted2)}
.pa{display:flex;gap:4px;margin-top:5px}
.ab{flex:1;border-radius:7px;padding:5px 6px;cursor:pointer;font-family:'Montserrat',sans-serif;font-size:8.5px;font-weight:700;text-align:center;border:1px solid;transition:all 0.2s}
.ab.gold{background:rgba(201,169,110,0.1);border-color:rgba(201,169,110,0.22);color:var(--gold)}
.ab.gold:hover{background:rgba(201,169,110,0.2)}
.ab.blue{background:rgba(56,189,248,0.08);border-color:rgba(56,189,248,0.2);color:var(--blue)}
.ab.blue:hover{background:rgba(56,189,248,0.16)}

/* Urgence */
.urg{display:flex;align-items:center;gap:6px;padding:7px 9px;background:rgba(255,51,102,0.07);border:1px solid rgba(255,51,102,0.18);border-radius:8px;margin-top:4px}
.urg-d{width:6px;height:6px;border-radius:50%;background:#FF3366;flex-shrink:0;animation:blink 1.2s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:0.2}}
.urg-t{font-size:8px;font-weight:700;color:var(--red);letter-spacing:0.5px;flex:1}
.urg-c{display:flex;gap:3px}
.urg-b{width:18px;height:18px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:4px;color:var(--text);font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1}

/* Formats */
.fmts{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px}
.fm{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:7px;padding:6px 3px;text-align:center;cursor:pointer;transition:all 0.2s}
.fm.on,.fm:hover{border-color:rgba(201,169,110,0.45);background:rgba(201,169,110,0.07)}
.fm-i{font-size:14px;display:block;margin-bottom:2px}
.fm-n{font-size:7.5px;color:var(--muted);font-weight:700;letter-spacing:1px}
.fm.on .fm-n{color:var(--gold)}

/* Styles */
.stls{display:flex;flex-direction:column;gap:4px}
.st{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:8px;padding:7px 9px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all 0.2s}
.st:hover{border-color:rgba(255,255,255,0.1)}
.st.on{border-color:var(--gold);background:rgba(201,169,110,0.05)}
.st-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0}
.st-n{font-size:9.5px;font-weight:700;color:var(--text)}
.st-d{font-size:7.5px;color:var(--muted);margin-top:1px}

/* Logo upload */
.logo-zone{border:1.5px dashed rgba(201,169,110,0.22);border-radius:8px;padding:7px 9px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:8px}
.logo-zone:hover{border-color:rgba(201,169,110,0.45)}
.logo-img{width:36px;height:36px;object-fit:contain;border-radius:4px;background:rgba(255,255,255,0.03)}
.logo-ph{width:36px;height:36px;background:rgba(201,169,110,0.1);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.logo-info .ln{font-size:9px;font-weight:700;color:var(--text)}
.logo-info .ld{font-size:7.5px;color:var(--muted)}

/* Medias */
.mz-row{display:flex;gap:4px}
.mz{flex:1;border:1.5px dashed rgba(255,255,255,0.08);border-radius:8px;padding:8px 4px;text-align:center;cursor:pointer;transition:all 0.2s}
.mz:hover{border-color:rgba(201,169,110,0.35);background:rgba(201,169,110,0.03)}
.mz-i{font-size:16px;margin-bottom:2px}
.mz-t{font-size:8px;color:var(--gold);font-weight:700}
.mg{display:grid;grid-template-columns:repeat(4,1fr);gap:3px;margin-top:6px}
.mt{aspect-ratio:1;border-radius:5px;overflow:hidden;cursor:pointer;border:2px solid transparent;position:relative;background:var(--bg3)}
.mt.on{border-color:var(--gold)}
.mt:hover{border-color:rgba(201,169,110,0.4)}
.mt img,.mt video{width:100%;height:100%;object-fit:cover;display:block}
.mt-tag{position:absolute;bottom:0;left:0;right:0;background:rgba(0,0,0,0.72);font-size:5.5px;color:rgba(255,255,255,0.75);padding:2px 3px;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mt-del{position:absolute;top:1px;right:1px;width:13px;height:13px;background:rgba(0,0,0,0.8);border-radius:50%;display:none;align-items:center;justify-content:center;font-size:7px;color:#fff;cursor:pointer;font-weight:900}
.mt:hover .mt-del{display:flex}
.vbadge{position:absolute;top:2px;left:2px;background:rgba(56,189,248,0.85);border-radius:3px;font-size:6px;color:#000;padding:1px 3px;font-weight:900}

/* Gen buttons */
.gen{width:100%;padding:11px;background:linear-gradient(135deg,#C9A96E,#8B6914);border-radius:8px;color:#0a0a0a;font-size:10.5px;font-weight:900;letter-spacing:2px;cursor:pointer;border:none;font-family:'Montserrat',sans-serif;transition:all 0.2s;margin-top:8px;position:relative;overflow:hidden}
.gen:hover{opacity:0.9;transform:translateY(-1px)}
.gen:disabled{opacity:0.4;cursor:not-allowed;transform:none}
.shimmer{position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent);animation:shimmer 2s infinite}
@keyframes shimmer{to{left:100%}}
.var{width:100%;padding:7px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;color:var(--muted);font-size:9.5px;font-weight:700;cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;margin-top:4px}
.var:hover{border-color:rgba(201,169,110,0.3);color:var(--gold);background:rgba(201,169,110,0.05)}
.var:disabled{opacity:0.3;cursor:not-allowed}

/* CANVAS */
.cv{display:flex;flex-direction:column;overflow:hidden;background:var(--bg);position:relative}
.ctb{display:flex;align-items:center;gap:8px;padding:7px 14px;border-bottom:1px solid rgba(255,255,255,0.04);background:var(--bg2);flex-shrink:0}
.ctl{font-size:8.5px;color:var(--muted);letter-spacing:2px;font-weight:700;text-transform:uppercase}
.ctf{font-size:9.5px;color:var(--gold);font-weight:700}
.cm{flex:1;display:flex;align-items:center;justify-content:center;overflow:auto;gap:16px;padding:16px;background:repeating-linear-gradient(45deg,transparent,transparent 8px,rgba(255,255,255,0.008) 8px,rgba(255,255,255,0.008) 16px)}
.cm.multi{flex-wrap:wrap;align-items:flex-start;align-content:flex-start}

/* PREVIEW CARD */
.preview-card{border-radius:14px;overflow:hidden;flex-shrink:0;box-shadow:0 20px 60px rgba(0,0,0,0.6)}
.preview-card.story{width:198px;height:352px}
.preview-card.post{width:285px;height:285px}
.preview-card.landscape{width:385px;height:217px}
.ci{position:relative;width:100%;height:100%;overflow:hidden}
/* BG avec crossfade fluide */
.bg-layer{position:absolute;inset:0;background-size:cover;background-position:center;transition:opacity 1s ease}
.c-ot{position:absolute;top:0;left:0;right:0;height:45%;background:linear-gradient(to bottom,rgba(0,0,0,0.82),transparent);z-index:2}
.c-ob{position:absolute;bottom:0;left:0;right:0;height:78%;background:linear-gradient(to top,rgba(0,0,0,0.97),transparent);z-index:2}
.c-os{position:absolute;inset:0;background:linear-gradient(110deg,rgba(0,0,0,0.5) 0%,transparent 60%);z-index:2}
.c-bar{position:absolute;top:0;left:0;right:0;height:3px;z-index:10}
.c-hdr{position:absolute;top:9px;left:9px;right:9px;z-index:10;display:flex;align-items:center;justify-content:space-between}
.c-logo{font-size:7px;font-weight:900;letter-spacing:1.5px;border-radius:20px;padding:3px 8px;border:1px solid;display:inline-flex;align-items:center;gap:3px}
.c-logo img{width:12px;height:12px;object-fit:contain;border-radius:2px}
.c-tag{font-size:6.5px;font-weight:800;letter-spacing:1.5px;padding:2px 7px;border-radius:20px;border:1px solid}
.c-prog{position:absolute;bottom:0;left:0;right:0;height:2.5px;z-index:10;overflow:hidden}
.c-prog-i{height:100%;animation:prog 8s linear infinite}
@keyframes prog{from{width:0}to{width:100%}}
.c-body{position:absolute;bottom:0;left:0;right:0;z-index:10;padding:0 11px 9px}
.c-pre{font-size:6.5px;font-weight:700;letter-spacing:1.5px;color:rgba(255,255,255,0.4);margin-bottom:3px;text-transform:uppercase}
.c-title{font-family:'Bebas Neue',sans-serif;color:#fff;line-height:0.88;margin-bottom:6px}
.c-stats{display:flex;gap:5px;margin-bottom:6px}
.c-stat{flex:1;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.06);border-radius:5px;padding:4px 3px;text-align:center}
.c-sv{font-family:'Bebas Neue',sans-serif;font-size:14px;line-height:1;display:block}
.c-sl{font-size:5.5px;letter-spacing:1px;color:rgba(255,255,255,0.3);display:block;margin-top:1px}
.c-urg{background:rgba(255,51,102,0.15);border:1px solid rgba(255,51,102,0.3);border-radius:5px;padding:3px 7px;margin-bottom:5px;display:flex;align-items:center;gap:4px}
.c-urg-d{width:5px;height:5px;border-radius:50%;background:#FF3366;animation:blink 1s infinite;flex-shrink:0}
.c-urg-t{font-size:6px;color:#FF3366;font-weight:800;letter-spacing:0.5px}
.c-temo{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.09);border-radius:7px;padding:6px 8px;display:flex;gap:6px;align-items:center;margin-bottom:6px}
.c-av{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:900;flex-shrink:0}
.c-tn{font-size:6.5px;font-weight:900;letter-spacing:1px;margin-bottom:1px}
.c-tq{font-size:6.5px;line-height:1.4;color:rgba(255,255,255,0.5);font-style:italic}
.c-ts{font-size:7px;margin-top:1px}
.c-cta{border-radius:6px;padding:7px;text-align:center}
.c-ctam{font-size:7.5px;font-weight:900;letter-spacing:1.5px;display:block}
.c-ctas{font-size:5.5px;letter-spacing:1px;display:block;margin-top:2px;opacity:0.55}
.c-addr{font-size:5.5px;color:rgba(255,255,255,0.28);text-align:center;margin-top:4px;letter-spacing:0.5px;line-height:1.4}
/* Closing frame logo */
.c-close{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;opacity:0;animation:fadeClose 0.6s ease 3.5s forwards}
@keyframes fadeClose{from{opacity:0;background:transparent}to{opacity:1;background:#080c14}}
.c-close-logo{max-width:75%;max-height:45px;object-fit:contain}
.c-close-name{font-family:'Bebas Neue',sans-serif;font-size:18px;color:#C9A96E;letter-spacing:3px;text-align:center}
.c-close-addr{font-size:6.5px;color:var(--muted);text-align:center;line-height:1.6}
.card-lbl{font-size:7.5px;color:var(--muted);font-weight:700;text-align:center;margin-top:5px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}

/* EXPORT BAR */
.expb{display:flex;align-items:center;gap:5px;padding:7px 14px;border-top:1px solid rgba(255,255,255,0.04);background:var(--bg2);flex-shrink:0;flex-wrap:wrap}
.expl{font-size:8px;color:var(--muted);letter-spacing:2px;font-weight:700;text-transform:uppercase;margin-right:2px}
.ex{padding:5px 12px;border-radius:6px;font-size:9px;font-weight:800;cursor:pointer;font-family:'Montserrat',sans-serif;letter-spacing:1px;border:1px solid;transition:all 0.2s;background:transparent}
.ex:hover{transform:translateY(-1px)}
.ex-h{color:#38bdf8;border-color:rgba(56,189,248,0.3);background:rgba(56,189,248,0.08)}
.ex-j{color:#f59e0b;border-color:rgba(245,158,11,0.3);background:rgba(245,158,11,0.08)}
.ex-c{color:#a78bfa;border-color:rgba(167,139,250,0.3);background:rgba(167,139,250,0.08)}

/* CAPTION PANEL */
.cap-panel{background:var(--bg3);border-top:1px solid rgba(255,255,255,0.05);padding:9px 14px;flex-shrink:0;max-height:130px;overflow-y:auto}
.cap-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
.cap-lbl{font-size:7.5px;color:var(--muted);letter-spacing:2px;font-weight:700;text-transform:uppercase}
.cap-copy{background:rgba(201,169,110,0.1);border:1px solid rgba(201,169,110,0.2);border-radius:5px;padding:3px 9px;font-size:7.5px;color:var(--gold);cursor:pointer;font-family:'Montserrat',sans-serif}
.cap-copy:hover{background:rgba(201,169,110,0.2)}
.cap-txt{font-size:9px;color:var(--muted);line-height:1.6;white-space:pre-wrap}
.tags{display:flex;flex-wrap:wrap;gap:3px;margin-top:5px}
.ht{background:rgba(56,189,248,0.07);border:1px solid rgba(56,189,248,0.15);border-radius:20px;padding:2px 8px;font-size:8px;color:var(--blue);cursor:pointer;transition:all 0.2s}
.ht:hover{background:rgba(56,189,248,0.15)}

/* AI PANEL */
.aip{position:absolute;right:12px;top:60px;width:305px;background:var(--bg2);border:1px solid rgba(201,169,110,0.22);border-radius:14px;display:none;flex-direction:column;z-index:100;max-height:490px;box-shadow:0 24px 70px rgba(0,0,0,0.75)}
.aip.on{display:flex}
.aip-hdr{padding:11px 13px;border-bottom:1px solid rgba(255,255,255,0.05);display:flex;align-items:flex-start;justify-content:space-between;flex-shrink:0}
.aip-t{font-size:10.5px;font-weight:800;color:var(--gold);letter-spacing:1.5px}
.aip-s{font-size:7.5px;color:var(--muted);margin-top:2px}
.aip-x{cursor:pointer;color:var(--muted);font-size:15px;line-height:1;flex-shrink:0;margin-top:2px}
.aip-sc{display:flex;flex-wrap:wrap;gap:4px;padding:8px 13px;border-bottom:1px solid rgba(255,255,255,0.04);flex-shrink:0}
.sc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:20px;padding:4px 9px;font-size:7.5px;color:var(--muted);cursor:pointer;font-family:'Montserrat',sans-serif;transition:all 0.2s;white-space:nowrap}
.sc:hover{border-color:rgba(201,169,110,0.3);color:var(--gold);background:rgba(201,169,110,0.06)}
.sc.mod{border-color:rgba(167,139,250,0.3);color:#a78bfa;background:rgba(167,139,250,0.05)}
.sc.mod:hover{background:rgba(167,139,250,0.12)}
.aip-msgs{flex:1;overflow-y:auto;padding:9px 13px;display:flex;flex-direction:column;gap:7px;min-height:0}
.aip-msgs::-webkit-scrollbar{width:2px}
.aip-msgs::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.07)}
.msg{padding:8px 10px;border-radius:9px;font-size:9.5px;line-height:1.6;white-space:pre-wrap}
.msg.user{background:rgba(201,169,110,0.1);color:var(--text);border:1px solid rgba(201,169,110,0.2);margin-left:14px}
.msg.ai{background:rgba(255,255,255,0.04);color:var(--text);border:1px solid rgba(255,255,255,0.06)}
.msg.load{color:var(--muted);font-style:italic}
.msg.act{background:rgba(74,222,128,0.06);border:1px solid rgba(74,222,128,0.15);color:#4ade80;font-weight:700;font-size:8.5px;cursor:pointer;text-align:center}
.msg.act:hover{background:rgba(74,222,128,0.12)}
.aip-ir{padding:9px 11px;border-top:1px solid rgba(255,255,255,0.05);display:flex;gap:5px;flex-shrink:0}
.aip-in{flex:1;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:7px;color:var(--text);font-size:9.5px;padding:7px 10px;outline:none;font-family:'Montserrat',sans-serif}
.aip-in:focus{border-color:rgba(201,169,110,0.3)}
.aip-send{background:var(--gold);color:#0a0a0a;border:none;border-radius:7px;width:29px;height:29px;cursor:pointer;font-size:14px;font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.aip-send:disabled{opacity:0.5;cursor:not-allowed}

/* LANDING TAB */
.lp-wrap{display:flex;height:100%;overflow:hidden}
.lp-sb{background:var(--bg2);border-right:1px solid rgba(255,255,255,0.04);padding:12px 10px;display:flex;flex-direction:column;gap:8px;width:280px;flex-shrink:0;overflow-y:auto}
.lp-cv{flex:1;display:flex;flex-direction:column;overflow:hidden}
.lp-field{display:flex;flex-direction:column;gap:5px}
.lp-field label{font-size:7.5px;font-weight:700;letter-spacing:2px;color:var(--muted2);text-transform:uppercase}
.lp-field input,.lp-field textarea{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;color:var(--text);font-family:'Montserrat',sans-serif;font-size:11px;padding:8px 10px;outline:none;width:100%}
.lp-field input:focus,.lp-field textarea:focus{border-color:rgba(201,169,110,0.35)}
.lp-preview{flex:1;border:none;background:#fff}
.lp-actions{display:flex;gap:6px;padding:8px 14px;border-top:1px solid rgba(255,255,255,0.04);background:var(--bg2);flex-shrink:0}

/* SETTINGS */
.set-wrap{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:14px}
.s-sec{background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:12px;padding:14px;display:flex;flex-direction:column;gap:10px}
.s-t{font-size:9.5px;font-weight:800;color:var(--gold);letter-spacing:2px;text-transform:uppercase}
.sf{display:flex;flex-direction:column;gap:5px}
.sf label{font-size:7.5px;font-weight:700;letter-spacing:2px;color:var(--muted2);text-transform:uppercase}
.sf input{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:8px;color:var(--text);font-family:'Montserrat',sans-serif;font-size:11px;padding:8px 10px;outline:none;width:100%}
.sf input:focus{border-color:rgba(201,169,110,0.35)}
.sbtn{padding:9px 18px;background:linear-gradient(135deg,#C9A96E,#8B6914);border-radius:8px;color:#0a0a0a;font-size:10px;font-weight:900;letter-spacing:2px;cursor:pointer;border:none;font-family:'Montserrat',sans-serif;align-self:flex-start}
.pill{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:8px;font-weight:700}
.pill.ok{background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.25);color:#4ade80}
.pill.ko{background:rgba(255,51,102,0.1);border:1px solid rgba(255,51,102,0.25);color:#FF3366}
.pill.warn{background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);color:#f59e0b}

/* GALERIE */
.gal{flex:1;overflow:auto;padding:14px;display:flex;flex-wrap:wrap;gap:10px;align-content:flex-start}

/* TOAST */
.toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);background:var(--bg2);border:1px solid rgba(74,222,128,0.3);border-radius:9px;padding:8px 18px;font-size:10px;color:#4ade80;font-weight:700;z-index:9999;white-space:nowrap;pointer-events:none}

/* EMPTY */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;opacity:0.45;flex:1;min-height:200px}
.ei{font-size:46px}
.et{font-size:12px;font-weight:700;color:var(--muted)}
.es{font-size:10px;color:var(--muted2);text-align:center;line-height:1.7}

.spin{display:inline-block;animation:spin 0.8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.anim{animation:fadeUp 0.4s ease both}
.a1{animation-delay:0.07s}.a2{animation-delay:0.18s}.a3{animation-delay:0.3s}.a4{animation-delay:0.42s}
`;

// ── CARTE PUB ──
function AdCard({ ad, style, format, medias, logo, club, showClose }) {
  const st = STYLES[style] || STYLES.or;
  const fmt = FORMATS[format] || FORMATS.story;
  const isStory = fmt.cls === 'story';
  const imgs = medias.filter(m => m.sel && m.type === 'image');
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (imgs.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % imgs.length), 3500);
    return () => clearInterval(t);
  }, [imgs.length]);

  const bgSrc = imgs[idx]?.src || imgs[0]?.src || '';
  const prevSrc = imgs[(idx - 1 + imgs.length) % imgs.length]?.src || '';

  return (
    <div className={`preview-card ${fmt.cls}`} id="mainCard">
      <div className="ci" style={{ background: st.bg }}>
        {/* Crossfade fluide */}
        {prevSrc && <div className="bg-layer" style={{ backgroundImage:`url('${prevSrc}')`, opacity: 1 }} />}
        <div className="bg-layer" key={idx} style={{ backgroundImage:`url('${bgSrc}')`, opacity: 1, animation:'fadeUp 1s ease' }} />
        <div className="c-ot" />
        <div className="c-ob" />
        <div className="c-os" />
        <div className="c-bar" style={{ background:`linear-gradient(90deg,${st.accent},${st.accent2},${st.accent})` }} />
        <div className="c-hdr">
          <div className="c-logo" style={{ color:st.tagColor, background:st.tagBg, borderColor:st.tagBorder }}>
            {logo && <img src={logo} alt="logo" />}
            {ad.tag || 'BODYHIT'}
          </div>
          <div className="c-tag" style={{ color:st.tagColor, background:st.tagBg, borderColor:st.tagBorder }}>EMS SYMBIONT</div>
        </div>
        {isStory && <div className="c-prog"><div className="c-prog-i" style={{ background:`linear-gradient(90deg,${st.accent},${st.accent2})` }} /></div>}
        <div className="c-body">
          <div className="c-pre a1">{ad.pretitle || `BODYHIT · ${club?.ville?.toUpperCase()}`}</div>
          <div className="c-title a2" style={{ fontSize:fmt.ts }}>
            {ad.hook || '20 MINUTES.'}<br/>
            <em style={{ color:st.accent, fontStyle:'normal' }}>{ad.sub || 'TOUT CHANGE.'}</em>
          </div>
          <div className="c-stats a3">
            {(ad.stats||[]).map((s,i) => (
              <div className="c-stat" key={i}>
                <span className="c-sv" style={{ color:st.accent }}>{s.v}</span>
                <span className="c-sl">{s.l}</span>
              </div>
            ))}
          </div>
          {ad.urgence && (
            <div className="c-urg a4">
              <div className="c-urg-d" /><span className="c-urg-t">{ad.urgence}</span>
            </div>
          )}
          {isStory && ad.temo && (
            <div className="c-temo a4">
              <div className="c-av" style={{ background:st.avBg, color:st.avColor }}>{ad.temo.i||ad.temo.initial}</div>
              <div>
                <div className="c-tn" style={{ color:st.accent }}>{ad.temo.name}</div>
                <div className="c-tq">{ad.temo.quote}</div>
                <div className="c-ts" style={{ color:st.accent }}>★★★★★</div>
              </div>
            </div>
          )}
          <div className="c-cta a4" style={{ background:st.ctaBg }}>
            <span className="c-ctam" style={{ color:st.ctaColor }}>{ad.cta || 'RÉSERVER'}</span>
            <span className="c-ctas" style={{ color:st.ctaColor }}>{isStory ? "SÉANCE D'ESSAI GRATUITE" : (ad.urgence || "SANS ENGAGEMENT")}</span>
          </div>
          {ad.adresse && <div className="c-addr">{ad.adresse}<br/>{ad.tel && ad.tel !== '—' ? `📞 ${ad.tel}` : ''}</div>}
        </div>
        {showClose && (
          <div className="c-close">
            {logo
              ? <img src={logo} alt="logo" className="c-close-logo" />
              : <img src={LOGO_SVG} alt="Bodyhit" className="c-close-logo" />
            }
            <div className="c-close-name">{club?.ville?.toUpperCase()}</div>
            <div className="c-close-addr">{club?.adresse}<br/>{club?.cp} {club?.ville}<br/>{club?.tel !== '—' ? `📞 ${club?.tel}` : ''}</div>
          </div>
        )}
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
  const [logo, setLogo] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genIdx, setGenIdx] = useState(0);
  const [status, setStatus] = useState('Prêt');
  const [showCap, setShowCap] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ type:'ai', text:'✦ Bonjour ! Je suis ton assistant créatif ILflyer.\n\nJe connais Bodyhit en profondeur : combinaison SYMBIONT, 3 clubs IDF, cibles CSP+, vocabulaire officiel EMS.\n\nJe peux :\n• Rédiger ton brief pub\n• Modifier la pub en temps réel\n• Générer captions + hashtags Bodyhit\n• Superviser et perfectionner chaque détail\n\nClique un raccourci ou pose ta question !' }]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoad, setAiLoad] = useState(false);
  const [toast, setToast] = useState('');
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('ilflyer_api_key') || '');
  const [apiKeyI, setApiKeyI] = useState(() => localStorage.getItem('ilflyer_api_key') || '');
  const [supaUrl, setSupaUrl] = useState(() => localStorage.getItem('ilflyer_supa_url') || '');
  const [supaKey, setSupaKey] = useState(() => localStorage.getItem('ilflyer_supa_key') || '');
  const [galerie, setGalerie] = useState([]);
  const [lpObjectif, setLpObjectif] = useState("Séance d'essai gratuite");
  const [lpPromo, setLpPromo] = useState('1ère séance offerte sans engagement');
  const [lpHtml, setLpHtml] = useState('');
  const [lpLoad, setLpLoad] = useState(false);
  const [lpClub, setLpClub] = useState('RUEIL');
  const msgsRef = useRef(null);
  const club = CLUBS[clubId];

  const toast_ = useCallback((m) => { setToast(m); setTimeout(() => setToast(''), 3000); }, []);

  // ── Générer 1 pub ──
  const gen = async () => {
    setLoading(true); setStatus('⚡ Claude génère votre pub...');
    const ad = await generateAd({ prompt, clubId, idx: genIdx, creneaux });
    const card = { ad, medias:[...medias], style, format, clubId };
    setCards([card]); setGenIdx(i => i+1); setLoading(false);
    setStatus('✅ Pub générée'); setShowCap(true);
    setGalerie(g => [{ ...card, date: new Date().toLocaleTimeString(), prompt }, ...g].slice(0,30));
    dbSave('ilflyer_creations', { club_id:clubId, prompt, style, format, ad_data:ad });
    toast_('✅ Pub Bodyhit créée !');
  };

  // ── 3 Variantes ──
  const genVariants = async () => {
    setLoading(true); setStatus('⚡ Claude génère 3 variantes uniques...');
    const [a, b, c] = await Promise.all([
      generateAd({ prompt, clubId, idx:genIdx,   creneaux }),
      generateAd({ prompt, clubId, idx:genIdx+1, creneaux }),
      generateAd({ prompt, clubId, idx:genIdx+2, creneaux }),
    ]);
    const newCards = [
      { ad:a, medias:[...medias], style, format, clubId, label:'VARIANTE 1' },
      { ad:b, medias:[...medias], style, format, clubId, label:'VARIANTE 2' },
      { ad:c, medias:[...medias], style, format, clubId, label:'VARIANTE 3' },
    ];
    setCards(newCards); setGenIdx(i => i+3); setLoading(false);
    setStatus('✅ 3 variantes générées'); setShowCap(true);
    setGalerie(g => [...newCards.map(x => ({ ...x, date:new Date().toLocaleTimeString(), prompt })), ...g].slice(0,30));
    toast_('✅ 3 variantes créées !');
  };

  // ── Export HTML ──
  const exportHTML = () => {
    if (!cards.length) { toast_('⚠️ Génère d\'abord une pub'); return; }
    const el = document.getElementById('mainCard');
    if (!el) { toast_('⚠️ Aucune carte visible'); return; }
    const styles = Array.from(document.styleSheets).map(s => {
      try { return Array.from(s.cssRules).map(r => r.cssText).join('\n'); } catch { return ''; }
    }).join('\n');
    const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@400;700;900&display=swap" rel="stylesheet"><style>body{display:flex;align-items:center;justify-content:center;min-height:100vh;background:#060c14;margin:0;font-family:Montserrat,sans-serif}${styles}</style></head><body>${el.outerHTML}</body></html>`;
    const a = document.createElement('a');
    a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
    a.download = `bodyhit-${clubId.toLowerCase()}-pub.html`;
    a.click(); toast_('✅ HTML exporté !');
  };

  // ── Export JPEG ──
  const exportJPEG = async () => {
    if (!cards.length) { toast_('⚠️ Génère d\'abord une pub'); return; }
    toast_('⏳ Export JPEG...');
    try {
      const { default: html2canvas } = await import('html2canvas');
      const el = document.getElementById('mainCard');
      if (!el) { toast_('⚠️ Carte non trouvée'); return; }
      const canvas = await html2canvas(el, { scale: 3, useCORS: true, allowTaint: true, backgroundColor: null, logging: false });
      canvas.toBlob(blob => {
        if (!blob) { toast_('⚠️ Erreur JPEG'); return; }
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `bodyhit-${clubId.toLowerCase()}-pub.jpg`;
        a.click(); URL.revokeObjectURL(a.href);
        toast_('✅ JPEG exporté !');
      }, 'image/jpeg', 0.95);
    } catch (e) { toast_('⚠️ ' + e.message); }
  };

  // ── Copier caption ──
  const copyCaption = () => {
    if (!cards[0]?.ad?.caption) return;
    navigator.clipboard.writeText(cards[0].ad.caption).then(() => toast_('✅ Caption copiée !'));
  };

  // ── Upload medias ──
  const upload = (type) => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.multiple = true;
    inp.accept = type === 'video' ? 'video/*' : 'image/*';
    inp.onchange = e => Array.from(e.target.files).forEach(f => {
      const fr = new FileReader();
      fr.onload = ev => setMedias(p => [...p, { src:ev.target.result, name:f.name, sel:true, tag: type==='video'?'🎬 Vidéo':'📁 Upload', type }]);
      fr.readAsDataURL(f);
    });
    inp.click();
  };

  const uploadLogo = () => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = e => { const fr = new FileReader(); fr.onload = ev => { setLogo(ev.target.result); toast_('✅ Logo uploadé !'); }; fr.readAsDataURL(e.target.files[0]); };
    inp.click();
  };

  // ── Chat IA ──
  const sendMsg = async (override) => {
    const m = override || aiInput.trim();
    if (!m || aiLoad) return;
    setAiInput(''); setAiLoad(true);
    setMsgs(ms => [...ms, { type:'user', text:m }, { type:'load', text:'⚡ Rédaction en cours...' }]);

    const isModify = /modifi|change|remplace|améliore|rends|mets|ajoute|supprime/i.test(m) && cards.length > 0;
    let response;
    if (isModify && cards[0]) {
      const modified = await modifyAd({ instruction:m, current:cards[0].ad, clubId });
      setCards(c => [{ ...c[0], ad:modified }, ...c.slice(1)]);
      response = `✅ Pub modifiée !\nInstruction appliquée: "${m}"`;
      toast_('✅ Pub modifiée par Claude !');
    } else {
      response = await chat({ message:m, clubId, currentAd:cards[0]?.ad });
    }

    setAiLoad(false);
    setMsgs(ms => { const u=[...ms]; u[u.length-1]={ type:'ai', text:response }; return u; });
    const extracted = response.match(/"([^"]{25,})"/)? .[1];
    if (extracted) {
      setMsgs(ms => [...ms, { type:'act', text:'→ Utiliser ce texte comme brief', action:() => { setPrompt(extracted); toast_('✅ Texte inséré !'); } }]);
    }
  };

  useEffect(() => { if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight; }, [msgs]);

  // ── Générer landing ──
  const genLanding = async () => {
    setLpLoad(true); toast_('⚡ Claude génère la landing page...');
    const html = await generateLanding({ clubId:lpClub, objectif:lpObjectif, promo:lpPromo });
    setLpHtml(html); setLpLoad(false);
    dbSave('ilflyer_landings', { club_id:lpClub, titre:lpObjectif, html_output:html });
    toast_('✅ Landing page générée !');
  };

  const exportLanding = () => {
    if (!lpHtml) return;
    const a = document.createElement('a');
    a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(lpHtml);
    a.download = `bodyhit-${lpClub.toLowerCase()}-landing.html`;
    a.click(); toast_('✅ Landing exportée !');
  };

  const AI_SC = [
    { l:'✍️ Rédige le brief',   m:`Rédige un texte pub percutant pour la séance coaching EMS Bodyhit ${club.ville}. Vocabulaire officiel SYMBIONT.` },
    { l:'🎁 Séance offerte',     m:`Texte pub 1ère séance coaching EMS gratuite Bodyhit ${club.ville}. Max 2 clients, coach diplômé d'État.` },
    { l:'💪 Cibler femmes CSP+', m:`Pub femmes CSP+ 30-50 ans Bodyhit ${club.ville}. Tonification, cellulite, résultats visibles.` },
    { l:'📱 Hook Reels 3s',      m:`Meilleur hook viral 3 secondes pour Reels Instagram séance EMS Bodyhit ${club.ville}.` },
    { l:'🔧 Améliore la pub',    m:'Analyse et améliore le hook de la pub actuelle pour la rendre plus percutante.', mod:true },
    { l:'⚡ Rends parfaite',     m:'Supervise la pub actuelle et applique toutes les modifications pour la rendre parfaite.', mod:true },
    { l:'📊 Caption + hashtags', m:`Caption Instagram complète + hashtags pour Bodyhit ${club.ville} avec emojis et CTA fort.` },
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
            {[['create','⚡ Créer'],['landing','🌐 Landing'],['galerie','🖼 Galerie'],['settings','⚙️ Réglages']].map(([t,l]) => (
              <button key={t} className={`tab${tab===t?' on':''}`} onClick={() => setTab(t)}>{l}</button>
            ))}
          </div>
          <div className="tr">
            <button className={`ib${aiOpen?' on':''}`} onClick={() => setAiOpen(!aiOpen)} title="Assistant IA Claude">✦</button>
            <button className="ib" onClick={() => { setPrompt(''); setCards([]); setStatus('Prêt'); setShowCap(false); }} title="Nouveau">↺</button>
          </div>
        </div>

        {/* ══ ONGLET CRÉER ══ */}
        {tab === 'create' && (<>
          <div className="sb">
            {/* Club */}
            <div className="sl">Club Bodyhit</div>
            <div className="clubs">
              {Object.values(CLUBS).map(c => (
                <div key={c.id} className={`cb${clubId===c.id?' on':''}`} onClick={() => setClubId(c.id)}>
                  <div className="cb-n">{c.label}</div>
                  <div className="cb-a">{c.labelFull}</div>
                </div>
              ))}
            </div>
            <div className="club-info">
              📍 {club.adresse}, {club.cp} {club.ville}<br/>
              {club.tel !== '—' && <>📞 {club.tel}</>}
            </div>

            {/* Brief */}
            <div className="sl">Brief publicitaire</div>
            <textarea rows="4" value={prompt} onChange={e => setPrompt(e.target.value)}
              placeholder={`Ex: 1ère séance coaching EMS gratuite Bodyhit ${club.ville} — combinaison SYMBIONT, coach diplômé d'État, résultats dès la 4ème séance...`} />
            <div className="pa">
              <button className="ab gold" onClick={() => setAiOpen(true)}>✦ Aide IA</button>
              <button className="ab blue" onClick={() => { setPrompt(fallbackAd(prompt, clubId, genIdx, creneaux).hook + ' ' + fallbackAd(prompt, clubId, genIdx, creneaux).sub); }}>↻ Suggestion</button>
            </div>

            {/* Urgence créneaux */}
            <div className="sl">Créneaux restants (urgence)</div>
            <div className="urg">
              <div className="urg-d" />
              <span className="urg-t">IL RESTE {creneaux} CRÉNEAUX CETTE SEMAINE</span>
              <div className="urg-c">
                <button className="urg-b" onClick={() => setCreneaux(c => Math.max(1,c-1))}>−</button>
                <button className="urg-b" onClick={() => setCreneaux(c => Math.min(10,c+1))}>+</button>
              </div>
            </div>

            {/* Format */}
            <div className="sl">Format</div>
            <div className="fmts">
              {Object.entries(FORMATS).map(([k,f]) => (
                <div key={k} className={`fm${format===k?' on':''}`} onClick={() => setFormat(k)}>
                  <span className="fm-i">{k==='story'?'▯':k==='post'?'◻':'▭'}</span>
                  <span className="fm-n">{k==='landscape'?'PAYSAGE':k.toUpperCase()}</span>
                </div>
              ))}
            </div>

            {/* Style */}
            <div className="sl">Style visuel</div>
            <div className="stls">
              {Object.entries(STYLES).map(([k,s]) => (
                <div key={k} className={`st${style===k?' on':''}`} onClick={() => setStyle(k)}>
                  <div className="st-dot" style={{ background:s.dot }} />
                  <div><div className="st-n">{s.label}</div><div className="st-d">{s.desc}</div></div>
                </div>
              ))}
            </div>

            {/* Logo */}
            <div className="sl">Logo Bodyhit (closing frame)</div>
            <div className="logo-zone" onClick={uploadLogo}>
              {logo
                ? <img src={logo} alt="logo" className="logo-img" />
                : <img src={LOGO_SVG} alt="placeholder" className="logo-img" />
              }
              <div className="logo-info">
                <div className="ln">{logo ? 'Logo uploadé ✅' : 'Logo placeholder auto'}</div>
                <div className="ld">{logo ? 'Cliquer pour changer' : 'Cliquer pour uploader ton logo'}</div>
              </div>
            </div>

            {/* Médias */}
            <div className="sl">Photos & Vidéos</div>
            <div className="mz-row">
              <div className="mz" onClick={() => upload('image')}><div className="mz-i">🖼</div><div className="mz-t">Photos</div></div>
              <div className="mz" onClick={() => upload('video')}><div className="mz-i">🎬</div><div className="mz-t">Vidéos</div></div>
            </div>
            <div className="mg">
              {medias.map((m,i) => (
                <div key={i} className={`mt${m.sel?' on':''}`} onClick={() => setMedias(p => p.map((x,j) => j===i?{...x,sel:!x.sel}:x))}>
                  {m.type==='video'
                    ? <><video src={m.src} muted /><div className="vbadge">▶</div></>
                    : <img src={m.src} alt={m.name} loading="lazy" />
                  }
                  <div className="mt-tag">{m.tag}</div>
                  {i >= DEFAULT_IMGS.length && <div className="mt-del" onClick={e => { e.stopPropagation(); setMedias(p => p.filter((_,j) => j!==i)); }}>✕</div>}
                </div>
              ))}
            </div>

            {/* Boutons */}
            <button className="gen" disabled={loading} onClick={gen}>
              <span className="shimmer" />
              {loading ? <span>⚡ <span className="spin">◌</span> GÉNÉRATION IA...</span> : '⚡ GÉNÉRER LA PUBLICITÉ'}
            </button>
            <button className="var" disabled={loading} onClick={genVariants}>
              {loading ? '...' : '⊞ GÉNÉRER 3 VARIANTES UNIQUES'}
            </button>
          </div>

          {/* CANVAS */}
          <div className="cv">
            <div className="ctb">
              <span className="ctl">Aperçu</span>
              <span className="ctf">{FORMATS[format].label}</span>
              {cards.length > 0 && <span style={{ fontSize:'8px', color:'var(--gold)', marginLeft:4 }}>{cards.length > 1 ? `${cards.length} variantes` : '1 pub'}</span>}
              <div style={{ marginLeft:'auto', fontSize:'8.5px', color:'var(--muted2)' }}>{status}</div>
            </div>
            <div className={`cm${cards.length > 1 ? ' multi' : ''}`}>
              {cards.length > 0 ? cards.map((card,i) => (
                <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                  <AdCard ad={card.ad} style={card.style} format={card.format} medias={card.medias} logo={logo} club={CLUBS[card.clubId]} showClose={true} />
                  {card.label && <div className="card-lbl">{card.label}</div>}
                </div>
              )) : (
                <div className="empty">
                  <div className="ei">⚡</div>
                  <div className="et">ILflyer Pro v3</div>
                  <div className="es">Choisis le club Bodyhit<br/>Écris ton brief<br/>Génère 1 pub ou 3 variantes uniques</div>
                </div>
              )}
            </div>

            {/* Export bar */}
            <div className="expb">
              <span className="expl">Exporter</span>
              <button className="ex ex-h" onClick={exportHTML}>⬇ HTML</button>
              <button className="ex ex-j" onClick={exportJPEG}>⬇ JPEG</button>
              <button className="ex ex-c" onClick={copyCaption}>📋 Caption</button>
              <div style={{ marginLeft:'auto', fontSize:'8px', color:'var(--muted2)' }}>Avance Hub © 2026</div>
            </div>

            {/* Caption & Hashtags */}
            {showCap && cards[0]?.ad?.caption && (
              <div className="cap-panel">
                <div className="cap-hdr">
                  <span className="cap-lbl">Caption + Hashtags</span>
                  <button className="cap-copy" onClick={copyCaption}>📋 Copier tout</button>
                </div>
                <div className="cap-txt">{cards[0].ad.caption}</div>
                <div className="tags">
                  {(cards[0].ad.hashtags||[]).map((h,i) => (
                    <span key={i} className="ht" onClick={() => { navigator.clipboard.writeText(h); toast_(`Copié: ${h}`); }}>{h}</span>
                  ))}
                </div>
              </div>
            )}

            {/* AI PANEL */}
            <div className={`aip${aiOpen?' on':''}`}>
              <div className="aip-hdr">
                <div>
                  <div className="aip-t">✦ CLAUDE — SUPERVISION IA</div>
                  <div className="aip-s">{apiKey ? '● Claude Haiku actif · Plein pouvoir sur la pub' : '○ Clé API manquante → Réglages'}</div>
                </div>
                <span className="aip-x" onClick={() => setAiOpen(false)}>✕</span>
              </div>
              <div className="aip-sc">
                {AI_SC.map((s,i) => <div key={i} className={`sc${s.mod?' mod':''}`} onClick={() => sendMsg(s.m)}>{s.l}</div>)}
              </div>
              <div className="aip-msgs" ref={msgsRef}>
                {msgs.map((m,i) => (
                  <div key={i} className={`msg ${m.type}`} onClick={m.type==='act'?m.action:undefined}>{m.text}</div>
                ))}
              </div>
              <div className="aip-ir">
                <input className="aip-in" value={aiInput} onChange={e => setAiInput(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && sendMsg()}
                  placeholder="Modifie la pub, demande un brief, supervise..." />
                <button className="aip-send" onClick={() => sendMsg()} disabled={aiLoad}>
                  {aiLoad ? <span className="spin" style={{ fontSize:10 }}>◌</span> : '→'}
                </button>
              </div>
            </div>
          </div>
        </>)}

        {/* ══ ONGLET LANDING PAGES ══ */}
        {tab === 'landing' && (
          <div className="lp-wrap" style={{ gridColumn:'1/-1', gridRow:2 }}>
            <div className="lp-sb">
              <div className="sl" style={{ marginTop:0 }}>Club</div>
              <div className="clubs">
                {Object.values(CLUBS).map(c => (
                  <div key={c.id} className={`cb${lpClub===c.id?' on':''}`} onClick={() => setLpClub(c.id)}>
                    <div className="cb-n">{c.label}</div><div className="cb-a">{c.labelFull}</div>
                  </div>
                ))}
              </div>
              <div className="sl">Objectif</div>
              <div className="lp-field">
                <input value={lpObjectif} onChange={e => setLpObjectif(e.target.value)} placeholder="Séance d'essai gratuite" />
              </div>
              <div className="sl">Texte promo</div>
              <div className="lp-field">
                <textarea rows="2" value={lpPromo} onChange={e => setLpPromo(e.target.value)} placeholder="1ère séance offerte sans engagement" style={{ resize:'none' }} />
              </div>
              <button className="gen" style={{ marginTop:10 }} disabled={lpLoad} onClick={genLanding}>
                <span className="shimmer" />
                {lpLoad ? <span>⚡ <span className="spin">◌</span> GÉNÉRATION...</span> : '🌐 GÉNÉRER LA LANDING PAGE'}
              </button>
              {lpHtml && <div style={{ fontSize:'8.5px', color:'var(--green)', marginTop:4, textAlign:'center' }}>✅ Landing prête</div>}
            </div>
            <div className="lp-cv">
              <div className="ctb"><span className="ctl">Aperçu Landing Page</span><span className="ctf">{CLUBS[lpClub]?.ville}</span></div>
              {lpHtml
                ? <iframe className="lp-preview" srcDoc={lpHtml} title="landing" sandbox="allow-same-origin allow-scripts" />
                : <div className="empty"><div className="ei">🌐</div><div className="et">Landing Page Premium</div><div className="es">Configure le club et l'objectif<br/>Claude génère une landing page<br/>ultra-premium prête à publier</div></div>
              }
              {lpHtml && (
                <div className="lp-actions">
                  <button className="ex ex-h" onClick={exportLanding}>⬇ Exporter HTML</button>
                  <button className="ex ex-c" onClick={() => { navigator.clipboard.writeText(lpHtml); toast_('✅ HTML copié !'); }}>📋 Copier HTML</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ GALERIE ══ */}
        {tab === 'galerie' && (<>
          <div className="sb">
            <div className="sl" style={{ marginTop:0 }}>Historique</div>
            <div style={{ fontSize:'9px', color:'var(--muted)', padding:'4px 0' }}>{galerie.length} création(s)</div>
            {galerie.length > 0 && <button className="var" onClick={() => setGalerie([])}>🗑 Vider la galerie</button>}
          </div>
          <div className="cv">
            <div className="ctb"><span className="ctl">Galerie des créations</span></div>
            <div className="gal">
              {galerie.length === 0
                ? <div className="empty"><div className="ei">🖼</div><div className="et">Vide pour l'instant</div><div className="es">Tes créations apparaîtront ici</div></div>
                : galerie.map((item,i) => (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center' }}>
                    <AdCard ad={item.ad} style={item.style} format={item.format} medias={item.medias||DEFAULT_IMGS} logo={logo} club={CLUBS[item.clubId]} showClose={false} />
                    <div className="card-lbl">{item.date} · {CLUBS[item.clubId]?.label}</div>
                  </div>
                ))
              }
            </div>
          </div>
        </>)}

        {/* ══ RÉGLAGES ══ */}
        {tab === 'settings' && (<>
          <div className="sb"><div className="sl" style={{ marginTop:0 }}>Config</div></div>
          <div className="cv">
            <div className="ctb"><span className="ctl">Réglages</span></div>
            <div className="set-wrap">
              <div className="s-sec">
                <div className="s-t">🔑 API Anthropic (Claude IA)</div>
                <div className="sf"><label>Clé API</label><input type="password" value={apiKeyI} onChange={e => setApiKeyI(e.target.value)} placeholder="sk-ant-api03-..." /></div>
                <button className="sbtn" onClick={() => { localStorage.setItem('ilflyer_api_key', apiKeyI); setApiKey(apiKeyI); toast_('✅ Clé API sauvegardée !'); }}>💾 SAUVEGARDER</button>
                <div className={`pill ${apiKey?'ok':'ko'}`}>{apiKey ? '● Claude actif — Supervision totale' : '○ Clé manquante — Mode local'}</div>
                <div style={{ fontSize:'8.5px', color:'var(--muted2)', lineHeight:1.7 }}>
                  Sans clé: variations locales prédéfinies.<br/>
                  Avec clé: contenu 100% unique, modification en temps réel par Claude.<br/>
                  <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color:'var(--gold)' }}>→ console.anthropic.com</a>
                </div>
              </div>
              <div className="s-sec">
                <div className="s-t">🗄️ Supabase (Sauvegarde cloud)</div>
                <div className="sf"><label>URL Supabase</label><input value={supaUrl} onChange={e => setSupaUrl(e.target.value)} placeholder="https://xxx.supabase.co" /></div>
                <div className="sf"><label>Clé Anon</label><input type="password" value={supaKey} onChange={e => setSupaKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." /></div>
                <button className="sbtn" onClick={() => { localStorage.setItem('ilflyer_supa_url',supaUrl); localStorage.setItem('ilflyer_supa_key',supaKey); toast_('✅ Supabase configuré !'); }}>💾 SAUVEGARDER</button>
                <div className={`pill ${supaUrl&&supaKey?'ok':'warn'}`}>{supaUrl&&supaKey ? '● Supabase connecté' : '○ Non configuré'}</div>
                <div style={{ fontSize:'8.5px', color:'var(--muted2)', lineHeight:1.7 }}>
                  Tables SQL à créer:<br/>
                  <code style={{ color:'var(--gold)', fontSize:'8px' }}>ilflyer_creations (id, club_id, prompt, style, format, ad_data, created_at)</code><br/>
                  <code style={{ color:'var(--gold)', fontSize:'8px' }}>ilflyer_landings (id, club_id, titre, html_output, created_at)</code>
                </div>
              </div>
              <div className="s-sec">
                <div className="s-t">📍 Clubs Bodyhit (données réelles)</div>
                {Object.values(CLUBS).map(c => (
                  <div key={c.id} style={{ padding:'7px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'8.5px', color:'var(--muted)', lineHeight:1.8 }}>
                    <strong style={{ color:'var(--text)' }}>{c.nom}</strong><br/>
                    📍 {c.adresse}, {c.cp} {c.ville}<br/>
                    {c.tel !== '—' && <>📞 {c.tel} · </>}✉️ {c.email}
                  </div>
                ))}
              </div>
              <div className="s-sec">
                <div className="s-t">📋 À propos ILflyer Pro v3</div>
                <div style={{ fontSize:'9px', color:'var(--muted)', lineHeight:1.9 }}>
                  <strong style={{ color:'var(--gold)' }}>ILflyer Pro</strong> — v3.0 Web Edition<br/>
                  By <strong style={{ color:'var(--text)' }}>Avance Hub</strong> © 2026<br/><br/>
                  <span style={{ color:'var(--muted2)' }}>
                    Modèle IA: claude-haiku-4-5-20251001<br/>
                    7 styles · 3 formats · Export HTML + JPEG<br/>
                    Logo upload + closing frame animé<br/>
                    Compteur créneaux urgence · Caption + Hashtags<br/>
                    Landing pages premium · Supabase cloud<br/>
                    Claude supervision totale en temps réel
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
