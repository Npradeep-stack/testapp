import { useState, useEffect, useRef, useCallback, createContext, useContext, memo, lazy, Suspense } from "react";

/* ─── GLOBAL STYLES ──────────────────────────────────────────────────────── */
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css');
    :root{
      --gold:#D4A843;--gold2:#B8892A;--gs:rgba(212,168,67,0.1);--gb:rgba(212,168,67,0.2);
      --bg:#060810;--card:#0E1222;--card2:#131828;--card3:#181F30;
      --text:#EDF0FA;--text2:#BDC3D8;--dim:#636D8A;--dim2:#363E55;
      --brd:rgba(255,255,255,0.055);--brd2:rgba(255,255,255,0.1);
      --green:#34C77B;--red:#E05454;--blue:#4F8EF5;
      --fn:'Sora',sans-serif;--dp:'Fraunces',serif;
      --sb:env(safe-area-inset-bottom,0px);--st:env(safe-area-inset-top,14px);
    }
    *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
    html,body,#root{height:100%;background:var(--bg);}
    body{color:var(--text);font-family:var(--fn);overflow-x:hidden;-webkit-font-smoothing:antialiased;}
    input,select,button,textarea{font-family:var(--fn);}
    ::-webkit-scrollbar{display:none;}*{scrollbar-width:none;}

    @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
    @keyframes scaleIn{from{transform:scale(0.88);opacity:0}to{transform:scale(1);opacity:1}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes pdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.5;transform:scale(0.82)}}
    @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
    @keyframes rpl{to{transform:scale(5);opacity:0}}
    @keyframes spop{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
    @keyframes otpSh{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
    @keyframes stg{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
    @keyframes calPop{from{opacity:0;transform:scale(0.94) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}
    @keyframes sglow{0%{box-shadow:0 0 0 0 rgba(52,199,123,0.5)}70%{box-shadow:0 0 0 22px rgba(52,199,123,0)}100%{box-shadow:0 0 0 0 rgba(52,199,123,0)}}
    @keyframes slideDown{from{transform:translateY(-16px);opacity:0}to{transform:translateY(0);opacity:1}}
    @keyframes sheetOut{from{transform:translateY(0)}to{transform:translateY(110%)}}

    .page-enter{animation:fadeUp 0.34s cubic-bezier(0.23,1,0.32,1) both;}
    .stg1{animation:stg 0.38s ease 0.05s both;}
    .stg2{animation:stg 0.38s ease 0.12s both;}
    .stg3{animation:stg 0.38s ease 0.19s both;}
    .stg4{animation:stg 0.38s ease 0.26s both;}
    .stg5{animation:stg 0.38s ease 0.33s both;}

    /* card hover */
    .vcard{transition:transform 0.28s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.28s,border-color 0.28s;}
    .vcard:hover{transform:translateY(-5px) scale(1.01);box-shadow:0 20px 60px rgba(0,0,0,0.6);}
    .vcard:active{transform:scale(0.96);}
    .vcard .vimg img{transition:transform 0.5s ease;}
    .vcard:hover .vimg img{transform:scale(1.05);}

    /* image lazy fade */
    .lazy-img{opacity:0;transition:opacity 0.4s ease;}
    .lazy-img.loaded{opacity:1;}

    /* skeleton */
    .skel{background:linear-gradient(90deg,var(--card) 25%,var(--card2) 50%,var(--card) 75%);background-size:400px 100%;animation:shimmer 1.4s infinite;border-radius:10px;}

    /* ripple */
    .rpl-btn{position:relative;overflow:hidden;}
    .rpl-btn .rpl-s{position:absolute;width:10px;height:10px;background:rgba(0,0,0,0.2);border-radius:50%;transform:scale(0);animation:rpl 0.55s ease;pointer-events:none;}

    /* OTP */
    .otp-i{width:46px;height:54px;border-radius:12px;background:var(--card2);border:2px solid var(--brd);text-align:center;font-size:22px;font-weight:800;color:var(--text);outline:none;caret-color:var(--gold);transition:border-color 0.18s,transform 0.18s,box-shadow 0.18s;font-family:var(--dp);}
    .otp-i:focus{border-color:var(--gold);transform:scale(1.06);box-shadow:0 0 0 3px rgba(212,168,67,0.15);}
    .otp-i.filled{border-color:var(--gb);background:rgba(212,168,67,0.05);}
    .otp-shake{animation:otpSh 0.35s ease;}

    /* calendar */
    .cal-day{aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;transition:all 0.18s cubic-bezier(0.34,1.56,0.64,1);font-size:13px;font-weight:600;user-select:none;}
    .cal-day:hover:not(.booked):not(.past){transform:scale(1.12);background:var(--card3);}
    .cal-day.today{border:1.5px solid var(--gb);color:var(--gold);}
    .cal-day.sel{background:var(--gold);color:#000;transform:scale(1.1);}
    .cal-day.booked{background:rgba(224,84,84,0.1);color:var(--dim2);cursor:not-allowed;}
    .cal-day.past{opacity:0.28;cursor:not-allowed;pointer-events:none;}
    .cal-day.peak{color:var(--gold);}
    .cprice{font-size:7px;font-weight:700;opacity:0.8;}
    .cal-day.sel .cprice{color:#000;}

    /* dock */
    .dock-i{transition:all 0.24s cubic-bezier(0.34,1.56,0.64,1);}
    .dock-i.active{color:var(--gold);}
    .dock-i.active .di{transform:translateY(-3px) scale(1.12);}
    .dock-i:active{transform:scale(0.88);}
    .di{font-size:20px;display:block;transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1);}

    /* menu items */
    .mrow{transition:all 0.18s ease;}
    .mrow:hover{background:var(--card2) !important;}
    .mrow:active{transform:scale(0.98);background:var(--card3) !important;}
    .mrow:hover .micon{transform:scale(1.1) rotate(-4deg);}
    .micon{transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1);}

    /* topbar */
    .topbar{animation:slideDown 0.4s ease;}
    .iBtn{transition:all 0.18s;}
    .iBtn:active{background:var(--gold)!important;color:#000!important;transform:scale(0.9);}

    /* sheet back */
    .sh-back{display:flex;align-items:center;gap:10px;cursor:pointer;padding:6px 20px 0;}
    .sh-back-btn{width:36px;height:36px;background:var(--card2);border:1px solid var(--brd);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--text2);flex-shrink:0;transition:all 0.18s;}
    .sh-back:active .sh-back-btn{background:var(--gold);color:#000;transform:scale(0.9);}

    /* gold btn */
    .gbtn{width:100%;padding:16px;background:var(--gold);color:#000;font-weight:800;font-size:15px;border-radius:16px;border:none;font-family:var(--fn);cursor:pointer;box-shadow:0 6px 24px rgba(212,168,67,0.3);transition:all 0.2s;letter-spacing:0.2px;position:relative;overflow:hidden;}
    .gbtn:hover{box-shadow:0 10px 36px rgba(212,168,67,0.4);}
    .gbtn:active{transform:scale(0.97);background:var(--gold2);}
    .gbtn:disabled{background:var(--dim2);color:var(--dim);box-shadow:none;cursor:not-allowed;}

    /* occ box */
    .occ{background:var(--card);border:1px solid var(--brd);border-radius:18px;padding:15px 5px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;transition:all 0.28s cubic-bezier(0.34,1.56,0.64,1);}
    .occ:hover,.occ:active{transform:scale(1.06);border-color:var(--gb);}
    .occ.active{background:var(--gold);border-color:var(--gold);transform:scale(1.06);}
    .occ.active .oico{background:rgba(0,0,0,0.12);}
    .occ.active .olbl,.occ.active .oico i{color:#000;}
    .oico{width:44px;height:44px;background:var(--gs);border-radius:14px;display:flex;align-items:center;justify-content:center;transition:transform 0.28s cubic-bezier(0.34,1.56,0.64,1);}
    .occ:hover .oico{transform:scale(1.12) rotate(-5deg);}
    .olbl{font-size:10px;font-weight:700;color:var(--dim);text-align:center;}

    /* chip */
    .chip{background:var(--card);border:1px solid var(--brd);border-radius:50px;padding:9px 16px;white-space:nowrap;font-size:12px;font-weight:700;cursor:pointer;flex-shrink:0;color:var(--dim);transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1);}
    .chip.active,.chip:active{background:var(--gold);color:#000;border-color:var(--gold);transform:scale(1.04);}

    /* search */
    .sbar{display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--brd);border-radius:16px;padding:0 16px;height:52px;transition:border-color 0.18s,box-shadow 0.18s;}
    .sbar:focus-within{border-color:var(--gb);box-shadow:0 0 0 3px rgba(212,168,67,0.08);}
    .sbar input{background:none;border:none;color:var(--text);font-family:var(--fn);font-size:15px;width:100%;outline:none;font-weight:500;}
    .sbar input::placeholder{color:var(--dim2);}

    /* venue fav */
    .vfav{position:absolute;top:10px;right:10px;width:30px;height:30px;background:rgba(6,8,16,0.82);backdrop-filter:blur(10px);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform 0.25s cubic-bezier(0.34,1.56,0.64,1);}
    .vfav:active{transform:scale(0.8);}
    .vfav.faved{background:rgba(224,84,84,0.2);}
  `}</style>
);

/* ─── CONSTANTS ────────────────────────────────────────────── */
const VENUES = {
  v1:{id:'v1',name:'Dasapalla Convention',city:'Vijayawada',loc:'M.G. Road, Vijayawada',tag:'ULTRA LUXE',priceRaw:480000,price:'₹4,80,000',rating:4.9,reviews:312,cap:1400,urgency:'Only 2 dates left in June',img:'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80&auto=format',imgThumb:'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=40&q=10',desc:'Vijayawada\'s most iconic five-star convention with 1,400 capacity AC banquets, in-house Andhra catering, valet parking & 10,000 sq ft of landscaped lawns.',amenities:['AC Banquet','Catering','Parking','Decor','DJ Hall','Bridal Suite'],revs:[{n:'Ravi K.',s:5,t:'Absolutely magnificent.'},{n:'Priya M.',s:5,t:'Felt like a 5-star. Highly recommend!'}]},
  v2:{id:'v2',name:'Godavari Riverfront',city:'Rajahmundry',loc:'Innispeta, Rajahmundry',tag:'SCENIC',priceRaw:240000,price:'₹2,40,000',rating:4.7,reviews:189,cap:700,urgency:'Booked 14× this month',img:'https://images.unsplash.com/photo-1519741497674-611481863552?w=900&q=80&auto=format',imgThumb:'https://images.unsplash.com/photo-1519741497674-611481863552?w=40&q=10',desc:'Set on the banks of the Godavari — breathtaking river views, open-air mandapam, floating flower décor and traditional Kuchipudi arrangements.',amenities:['River View','Mandapam','Catering','Boat Ride','Decor','Sound'],revs:[{n:'Lakshmi T.',s:5,t:'Magical setting. Our guests were stunned.'},{n:'Vikram N.',s:4,t:'The river view is unmatched.'}]},
  v3:{id:'v3',name:'Taj Mahal Gardens',city:'Hyderabad',loc:'Jubilee Hills, Hyderabad',tag:'PREMIUM',priceRaw:550000,price:'₹5,50,000',rating:4.8,reviews:428,cap:1800,urgency:'Booked 23× this week',img:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80&auto=format',imgThumb:'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=40&q=10',desc:'Hyderabad\'s grandest wedding garden — 3 acres in Jubilee Hills, crystal ballroom, Mughal lawns, amphitheatre & 18-cuisine catering.',amenities:['Crystal Ballroom','3 Acres','Amphitheatre','18 Cuisines','Valet','Bridal Suite'],revs:[{n:'Sai P.',s:5,t:'Absolutely the best venue in Hyderabad.'},{n:'Kavya R.',s:5,t:'Every rupee well spent!'}]},
  v4:{id:'v4',name:'Sri Tirumala Convention',city:'Tirupati',loc:'TP Area, Tirupati',tag:'DIVINE',priceRaw:195000,price:'₹1,95,000',rating:4.6,reviews:134,cap:500,urgency:'Available — book now!',img:'https://images.unsplash.com/photo-1544161513-0179fe746fd5?w=900&q=80&auto=format',imgThumb:'https://images.unsplash.com/photo-1544161513-0179fe746fd5?w=40&q=10',desc:'Spiritually serene near the sacred hills of Tirupati. Perfect for traditional Brahmin weddings with purohit arrangements and sattvic catering.',amenities:['Purohit','Sattvic Catering','AC Hall','Parking','Decor','Gen Set'],revs:[{n:'Venkateswara R.',s:5,t:'Divine experience. Perfect for our vedic wedding.'}]},
  v5:{id:'v5',name:'Novotel Vizag Bay',city:'Vizag',loc:'Beach Road, Visakhapatnam',tag:'BEACHFRONT',priceRaw:720000,price:'₹7,20,000',rating:4.9,reviews:267,cap:1200,urgency:'Only 1 slot left in July',img:'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=900&q=80&auto=format',imgThumb:'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=40&q=10',desc:'Only beachfront 5-star wedding venue on the Bay of Bengal — sunset ceremonies, infinity pool receptions & Michelin-trained chefs.',amenities:['Private Beach','Infinity Pool','Int\'l Cuisine','Spa','Penthouse','Helipad'],revs:[{n:'Rohit A.',s:5,t:'Sunset wedding on the beach — unforgettable!'},{n:'Deepika V.',s:5,t:'5-star in every sense.'}]},
};

const CITIES = ['All','Hyderabad','Vijayawada','Rajahmundry','Tirupati','Vizag'];
const OCCASIONS = [
  ['fa-rings-wedding','Wedding','wedding'],['fa-champagne-glasses','Reception','reception'],
  ['fa-gem','Engagement','engagement'],['fa-music','Sangeet','sangeet'],
  ['fa-hand-holding-heart','Mehendi','mehendi'],['fa-cake-candles','Birthday','birthday'],
  ['fa-briefcase','Corporate','corporate'],['fa-sun','Haldi','haldi'],
];
const EXPLORE_CHIPS = ['All','Under ₹2L','₹2L–₹5L','5★ Only','Outdoor','AC Hall'];
const ADVANCE=0.30, PLATFORM=0.02;
const fmt = n => '₹'+Math.round(n).toLocaleString('en-IN');

/* ─── CALENDAR HELPERS ──────────────────────────────────────── */
const TODAY = (() => { const d=new Date(); d.setHours(0,0,0,0); return d; })();
const BOOKED = new Set(
  [3,7,14,18,22,28,35,42,50,58,65].map(off => {
    const d=new Date(TODAY); d.setDate(d.getDate()+off); return d.toDateString();
  })
);
const getMult = d => {
  const m=d.getMonth(), dow=d.getDay(), dt=d.getDate();
  if(m>=10||m<=1) return 1.30;
  if(dow>=5||dow===0) return 1.20;
  if([6,11,16,22,27].includes(dt)) return 1.15;
  return 1.0;
};

/* ─── STORAGE ────────────────────────────────────────────────── */
const sGet=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}};
const sSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}};

/* ─── CONTEXT ────────────────────────────────────────────────── */
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);

/* ─── LAZY IMAGE — blur-up technique for fast perceived load ── */
const LazyImg = memo(({ src, thumb, alt, style={}, className='' }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current; if(!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if(e.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{position:'relative',overflow:'hidden',...style,background:'var(--card2)'}}>
      {/* Tiny blurred placeholder — loads instantly */}
      {thumb && !loaded && (
        <img src={thumb} alt="" aria-hidden style={{
          position:'absolute',inset:0,width:'100%',height:'100%',
          objectFit:'cover',filter:'blur(12px)',transform:'scale(1.1)',
          transition:'opacity 0.3s'
        }}/>
      )}
      {inView && (
        <img
          src={src} alt={alt}
          className={`lazy-img${loaded?' loaded':''} ${className}`}
          style={{width:'100%',height:'100%',objectFit:'cover',display:'block',...(loaded?{}:{position:'absolute',inset:0})}}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
});

/* ─── SKELETON LOADER ────────────────────────────────────────── */
const CardSkeleton = () => (
  <div style={{background:'var(--card)',border:'1px solid var(--brd)',borderRadius:18,overflow:'hidden'}}>
    <div className="skel" style={{height:196}}/>
    <div style={{padding:'16px 18px 18px'}}>
      <div className="skel" style={{height:20,width:'70%',marginBottom:10}}/>
      <div className="skel" style={{height:14,width:'50%',marginBottom:14}}/>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        <div className="skel" style={{height:22,width:'40%'}}/>
        <div className="skel" style={{height:22,width:'20%'}}/>
      </div>
    </div>
  </div>
);

/* ─── RIPPLE ─────────────────────────────────────────────────── */
function useRipple() {
  const ref = useRef(null);
  const go = useCallback(e => {
    const btn=ref.current; if(!btn) return;
    const r=document.createElement('span'); r.className='rpl-s';
    const rect=btn.getBoundingClientRect();
    r.style.left=(e.clientX-rect.left-5)+'px';
    r.style.top=(e.clientY-rect.top-5)+'px';
    btn.appendChild(r); r.addEventListener('animationend',()=>r.remove());
  },[]);
  return [ref, go];
}

/* ─── TOAST ──────────────────────────────────────────────────── */
function Toast({msg}) {
  return msg ? (
    <div style={{
      position:'fixed',bottom:96,left:'50%',transform:'translateX(-50%)',
      background:'rgba(18,22,38,0.97)',color:'var(--text)',border:'1px solid var(--brd2)',
      fontWeight:600,fontSize:13,padding:'11px 22px',borderRadius:50,zIndex:3000,
      whiteSpace:'nowrap',boxShadow:'0 8px 32px rgba(0,0,0,0.55)',
      animation:'fadeIn 0.25s ease',pointerEvents:'none'
    }}>{msg}</div>
  ) : null;
}

/* ─── BOTTOM SHEET with swipe-down-to-close ─────────────────── */
function Sheet({open, onClose, children, maxH='92vh'}) {
  const sheetRef = useRef(null);
  const touchY = useRef(0);
  const scrollTop = useRef(0);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const onTouchStart = e => {
    touchY.current = e.touches[0].clientY;
    scrollTop.current = sheetRef.current?.scrollTop || 0;
  };
  const onTouchMove = e => {
    const dy = e.touches[0].clientY - touchY.current;
    const el = sheetRef.current;
    if(dy > 0 && scrollTop.current <= 0 && el) {
      el.style.transform = `translateY(${dy}px)`;
      el.style.transition = 'none';
    }
  };
  const onTouchEnd = e => {
    const dy = e.changedTouches[0].clientY - touchY.current;
    const el = sheetRef.current;
    if(el) { el.style.transform=''; el.style.transition=''; }
    if(dy > 80 && scrollTop.current <= 0) onClose();
  };

  if(!open) return null;
  return (
    <div onClick={onClose} style={{
      position:'fixed',inset:0,background:'rgba(0,0,0,0.72)',zIndex:600,
      display:'flex',alignItems:'flex-end',
      backdropFilter:'blur(8px)',animation:'fadeIn 0.2s ease'
    }}>
      <div
        ref={sheetRef}
        onClick={e=>e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          background:'var(--card)',width:'100%',borderRadius:'24px 24px 0 0',
          maxHeight:maxH,overflowY:'auto',
          animation:'slideUp 0.36s cubic-bezier(0.32,0.72,0,1)',
          boxShadow:'0 -8px 60px rgba(0,0,0,0.7)',
          paddingBottom:`calc(24px + var(--sb))`
        }}>
        <div style={{width:36,height:4,background:'var(--dim2)',borderRadius:2,margin:'14px auto 0',opacity:0.5}}/>
        {children}
      </div>
    </div>
  );
}

/* ─── MODAL ──────────────────────────────────────────────────── */
function Modal({open,onClose,children}) {
  if(!open) return null;
  return (
    <div onClick={onClose} style={{
      position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',zIndex:1200,
      display:'flex',alignItems:'center',justifyContent:'center',padding:20,
      backdropFilter:'blur(14px)',animation:'fadeIn 0.22s ease'
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:'var(--card)',border:'1px solid var(--gb)',borderRadius:28,
        padding:28,width:'100%',maxWidth:400,
        animation:'scaleIn 0.32s cubic-bezier(0.34,1.56,0.64,1)',
        boxShadow:'0 32px 80px rgba(0,0,0,0.75)'
      }}>{children}</div>
    </div>
  );
}

/* ─── GOLD BUTTON ────────────────────────────────────────────── */
function GBtn({children,onClick,disabled,style={},full=true}) {
  const [r,go]=useRipple();
  return (
    <button ref={r} className="gbtn rpl-btn" disabled={disabled}
      onClick={e=>{go(e);onClick&&onClick(e);}}
      style={{width:full?'100%':'auto',...style}}>
      {children}
    </button>
  );
}

/* ─── ICON BUTTON ────────────────────────────────────────────── */
function IBtn({icon,onClick,badge}) {
  return (
    <div className="iBtn" onClick={onClick} style={{
      width:40,height:40,background:'var(--card)',border:'1px solid var(--brd)',
      borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
      color:'var(--text2)',fontSize:15,cursor:'pointer',position:'relative'
    }}>
      <i className={`fa-solid ${icon}`}/>
      {badge>0 && (
        <div style={{position:'absolute',top:6,right:6,width:8,height:8,
          background:'var(--red)',borderRadius:'50%',border:'1.5px solid var(--bg)'}}/>
      )}
    </div>
  );
}

/* ─── TOPBAR ─────────────────────────────────────────────────── */
function TopBar({greeting,brand,left,right}) {
  return (
    <div className="topbar" style={{
      position:'sticky',top:0,zIndex:100,
      background:'rgba(6,8,16,0.91)',backdropFilter:'blur(24px)',
      borderBottom:'1px solid var(--brd)',padding:'14px 20px',
      display:'flex',alignItems:'center',justifyContent:'space-between'
    }}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        {left}
        <div>
          <div style={{fontSize:11,color:'var(--dim)',fontWeight:600}}>{greeting}</div>
          <div style={{fontFamily:'var(--dp)',fontSize:26,color:'var(--gold)',lineHeight:1.05}}>{brand}</div>
        </div>
      </div>
      {right}
    </div>
  );
}

/* ─── CHIP ROW ───────────────────────────────────────────────── */
function ChipRow({chips,active,onSelect,style={}}) {
  return (
    <div style={{display:'flex',gap:8,overflowX:'auto',padding:'0 20px 2px',scrollbarWidth:'none',...style}}>
      {chips.map(c=>(
        <div key={c} className={`chip${active===c?' active':''}`} onClick={()=>onSelect(c)}>{c}</div>
      ))}
    </div>
  );
}

/* ─── VENUE CARD ─────────────────────────────────────────────── */
const VenueCard = memo(({ v, variant='h', onOpen, idx=0 }) => {
  const [faved,setFaved]=useState(false);
  const isV=variant==='v';
  return (
    <div className={`vcard stg${Math.min(idx+1,5)}`}
      onClick={()=>onOpen(v.id)}
      style={{
        flexShrink:isV?undefined:0,width:isV?'100%':232,
        background:'var(--card)',border:'1px solid var(--brd)',
        borderRadius:18,overflow:'hidden',cursor:'pointer',
        borderColor:faved?'var(--gb)':'var(--brd)'
      }}>
      <div className="vimg" style={{position:'relative',overflow:'hidden'}}>
        <LazyImg
          src={v.img} thumb={v.imgThumb} alt={v.name}
          style={{height:isV?196:140}}
        />
        {/* Tag */}
        <div style={{position:'absolute',top:10,left:10,
          background:'rgba(6,8,16,0.82)',backdropFilter:'blur(10px)',
          borderRadius:8,padding:'3px 8px',fontSize:8,fontWeight:800,
          color:'var(--gold)',letterSpacing:'1.2px',border:'1px solid var(--gb)',textTransform:'uppercase'
        }}>{v.tag}</div>
        {/* Urgency */}
        <div style={{position:'absolute',bottom:10,left:10,
          background:'rgba(6,8,16,0.82)',backdropFilter:'blur(10px)',
          borderRadius:8,padding:'3px 8px',fontSize:9,fontWeight:700,color:'#fff',
          display:'flex',alignItems:'center',gap:5
        }}>
          <div style={{width:5,height:5,borderRadius:'50%',background:'var(--red)',animation:'pdot 1.2s infinite'}}/>
          {v.urgency}
        </div>
        {/* Fav */}
        <div className={`vfav${faved?' faved':''}`}
          onClick={e=>{e.stopPropagation();setFaved(f=>!f);}}>
          <i className={faved?'fa-solid fa-heart':'fa-regular fa-heart'}
            style={{fontSize:12,color:faved?'var(--red)':'var(--dim)',transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)'}}/>
        </div>
      </div>
      <div style={{padding:isV?'16px 18px 18px':'13px 14px 14px'}}>
        <div style={{fontFamily:'var(--dp)',fontSize:isV?17:14,fontWeight:700,marginBottom:4}}>{v.name}</div>
        <div style={{fontSize:isV?12:11,color:'var(--dim)',display:'flex',alignItems:'center',gap:4,marginBottom:11}}>
          <i className="fa-solid fa-location-dot" style={{fontSize:isV?10:9,color:'var(--gold)'}}/>
          {v.loc}
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <span style={{fontSize:isV?18:15,fontWeight:800}}>{v.price}</span>
            <span style={{fontSize:10,color:'var(--dim)'}}> /day</span>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:4,
            background:'var(--gs)',border:'1px solid var(--gb)',
            padding:'4px 9px',borderRadius:8}}>
            <i className="fa-solid fa-star" style={{fontSize:9,color:'var(--gold)'}}/>
            <span style={{fontSize:11,fontWeight:800,color:'var(--gold)'}}>{v.rating}</span>
            <span style={{fontSize:10,color:'var(--dim)'}}>({v.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  );
});

/* ─── CALENDAR ───────────────────────────────────────────────── */
function Calendar({venuePrice, selected, onSelect}) {
  const [ym, setYm] = useState([TODAY.getFullYear(), TODAY.getMonth()]);
  const [y,m] = ym;
  const first = new Date(y,m,1).getDay();
  const days = new Date(y,m+1,0).getDate();
  const monthLabel = new Date(y,m,1).toLocaleDateString('en-IN',{month:'long',year:'numeric'});

  const cells = [];
  for(let i=0;i<first;i++) cells.push(null);
  for(let d=1;d<=days;d++) cells.push(new Date(y,m,d));

  const prev = () => setYm(([y,m])=>m===0?[y-1,11]:[y,m-1]);
  const next = () => setYm(([y,m])=>m===11?[y+1,0]:[y,m+1]);

  return (
    <div style={{background:'var(--card2)',borderRadius:18,padding:'20px 16px',border:'1px solid var(--brd)',animation:'calPop 0.3s cubic-bezier(0.34,1.56,0.64,1)'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
        <button onClick={prev} style={{background:'var(--card3)',border:'1px solid var(--brd)',borderRadius:10,width:34,height:34,color:'var(--text)',cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
        <div style={{fontFamily:'var(--dp)',fontSize:17,fontWeight:700}}>{monthLabel}</div>
        <button onClick={next} style={{background:'var(--card3)',border:'1px solid var(--brd)',borderRadius:10,width:34,height:34,color:'var(--text)',cursor:'pointer',fontSize:18,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4,marginBottom:8}}>
        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d=>(
          <div key={d} style={{textAlign:'center',fontSize:10,fontWeight:700,color:'var(--dim)',paddingBottom:6}}>{d}</div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:4}}>
        {cells.map((d,i)=>{
          if(!d) return <div key={i}/>;
          const booked=BOOKED.has(d.toDateString());
          const past=d<TODAY;
          const today=d.toDateString()===TODAY.toDateString();
          const sel=selected&&d.toDateString()===selected.toDateString();
          const mult=getMult(d);
          const peak=mult>=1.15;
          let cls='cal-day';
          if(sel) cls+=' sel';
          else if(booked) cls+=' booked';
          else if(past) cls+=' past';
          else if(today) cls+=' today';
          else if(peak) cls+=' peak';
          const pct=mult===1.30?'+30%':mult===1.20?'+20%':'+15%';
          return (
            <div key={i} className={cls} onClick={()=>!booked&&!past&&onSelect(d,mult)}>
              <span>{d.getDate()}</span>
              {!past&&!booked&&peak&&<span className="cprice">{pct}</span>}
              {booked&&<span className="cprice" style={{color:'var(--red)'}}>✕</span>}
            </div>
          );
        })}
      </div>
      <div style={{display:'flex',gap:14,marginTop:14,flexWrap:'wrap'}}>
        {[['var(--red)','Booked'],['var(--gold)','Peak'],['var(--green)','Available']].map(([c,l])=>(
          <div key={l} style={{display:'flex',alignItems:'center',gap:5,fontSize:10,color:'var(--dim)'}}>
            <div style={{width:8,height:8,borderRadius:2,background:c}}/>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── OTP MODAL ──────────────────────────────────────────────── */
function OTPModal({open,phone,onVerify,onBack}) {
  const [boxes,setBoxes]=useState(['','','','','','']);
  const [code]=useState(()=>String(Math.floor(100000+Math.random()*900000)));
  const [err,setErr]=useState('');
  const [shake,setShake]=useState(false);
  const [sec,setSec]=useState(60);
  const refs=Array.from({length:6},()=>useRef(null));

  useEffect(()=>{
    if(!open)return;
    setBoxes(['','','','','','']);setErr('');setSec(60);
    setTimeout(()=>refs[0].current?.focus(),300);
    const t=setInterval(()=>setSec(s=>s>0?s-1:0),1000);
    return ()=>clearInterval(t);
  },[open]);

  const handle=(i,val)=>{
    const v=val.replace(/\D/,'').slice(-1);
    const nb=[...boxes];nb[i]=v;setBoxes(nb);
    if(v&&i<5)refs[i+1].current?.focus();
    const full=nb.join('');
    if(full.length===6)verify(full);
  };
  const kd=(i,e)=>{if(e.key==='Backspace'&&!boxes[i]&&i>0)refs[i-1].current?.focus();};
  const verify=entered=>{
    if(entered===code){onVerify();}
    else{
      setErr('Wrong OTP. Try again.');
      setShake(true);setTimeout(()=>setShake(false),400);
      setBoxes(['','','','','','']);setTimeout(()=>refs[0].current?.focus(),50);
    }
  };

  if(!open)return null;
  return (
    <Modal open={open} onClose={()=>{}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:22,cursor:'pointer'}} onClick={onBack}>
        <div style={{width:32,height:32,borderRadius:10,background:'var(--card2)',border:'1px solid var(--brd)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,color:'var(--dim)'}}>←</div>
        <span style={{fontSize:12,color:'var(--dim)',fontWeight:600}}>Back</span>
      </div>
      <div style={{fontFamily:'var(--dp)',fontSize:26,fontWeight:700,marginBottom:6}}>Verify OTP</div>
      <div style={{fontSize:13,color:'var(--dim)',marginBottom:12,lineHeight:1.55}}>Code sent to <strong style={{color:'var(--text)'}}>{phone}</strong></div>
      <div style={{background:'rgba(79,142,245,0.08)',border:'1px solid rgba(79,142,245,0.2)',borderRadius:12,padding:'10px 14px',marginBottom:22,fontSize:12,color:'var(--blue)'}}>
        <i className="fa-solid fa-circle-info" style={{marginRight:6}}/>
        Demo OTP: <strong style={{fontSize:16,letterSpacing:4}}>{code}</strong>
      </div>
      <div className={shake?'otp-shake':''} style={{display:'flex',gap:8,justifyContent:'center',marginBottom:14}}>
        {boxes.map((b,i)=>(
          <input key={i} ref={refs[i]} className={`otp-i${b?' filled':''}`}
            maxLength={1} type="tel" value={b}
            onChange={e=>handle(i,e.target.value)} onKeyDown={e=>kd(i,e)}/>
        ))}
      </div>
      {err&&<div style={{fontSize:12,color:'var(--red)',textAlign:'center',marginBottom:10,animation:'fadeIn 0.2s'}}>{err}</div>}
      <div style={{fontSize:12,color:'var(--dim)',textAlign:'center'}}>
        {sec>0?`Resend in ${sec}s`:<span style={{color:'var(--gold)',cursor:'pointer',fontWeight:700}} onClick={()=>{setSec(60);}}>Resend OTP</span>}
      </div>
    </Modal>
  );
}

/* ─── AUTH MODAL ─────────────────────────────────────────────── */
function AuthModal({open,onClose}) {
  const {login}=useApp();
  const [tab,setTab]=useState('login');
  const [f,setF]=useState({name:'',email:'',phone:'',pass:''});
  const [err,setErr]=useState('');
  const [otpOpen,setOtpOpen]=useState(false);
  const [pending,setPending]=useState(null);
  const upd=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const is={width:'100%',background:'var(--card2)',border:'1px solid var(--brd)',borderRadius:14,padding:'14px 16px',color:'var(--text)',fontSize:15,outline:'none',fontFamily:'var(--fn)',transition:'border-color 0.18s',marginBottom:14};
  const lbl={fontSize:10,fontWeight:800,color:'var(--dim)',textTransform:'uppercase',letterSpacing:'1.2px',display:'block',marginBottom:7};

  const doLogin=()=>{
    const accs=sGet('vv_accs',[]);
    const found=accs.find(a=>(a.email===f.email||a.phone===f.email||a.name===f.email)&&a.pass===f.pass);
    if(!found){setErr('Invalid credentials.');return;}
    login({name:found.name,email:found.email,phone:found.phone});onClose();
  };
  const doSignup=()=>{
    if(!f.name||!f.email||!f.pass){setErr('Fill all fields.');return;}
    setPending({...f});setOtpOpen(true);
  };
  const finish=()=>{
    const accs=sGet('vv_accs',[]);
    if(!accs.find(a=>a.email===pending.email))accs.push(pending);
    sSet('vv_accs',accs);
    login({name:pending.name,email:pending.email,phone:pending.phone});
    setOtpOpen(false);onClose();
  };

  if(!open)return null;
  return (
    <>
      <OTPModal open={otpOpen} phone={pending?.phone||''} onVerify={finish} onBack={()=>setOtpOpen(false)}/>
      <Modal open={open&&!otpOpen} onClose={onClose}>
        <div style={{fontFamily:'var(--dp)',fontSize:32,color:'var(--gold)',textAlign:'center',marginBottom:5}}>Vivaha Venue</div>
        <div style={{fontSize:13,color:'var(--dim)',textAlign:'center',marginBottom:22}}>Book your dream Telugu wedding hall</div>
        <div style={{display:'flex',background:'var(--card2)',borderRadius:12,padding:4,marginBottom:22}}>
          {['login','signup'].map(t=>(
            <div key={t} onClick={()=>{setTab(t);setErr('');}} style={{
              flex:1,textAlign:'center',padding:'11px',borderRadius:10,
              fontWeight:700,fontSize:14,cursor:'pointer',
              background:tab===t?'var(--gold)':'transparent',
              color:tab===t?'#000':'var(--dim)',
              transition:'all 0.25s cubic-bezier(0.34,1.56,0.64,1)',
              transform:tab===t?'scale(1.02)':'scale(1)'
            }}>{t==='login'?'Sign In':'Sign Up'}</div>
          ))}
        </div>
        {tab==='login'?(
          <div style={{animation:'fadeUp 0.28s ease'}}>
            <label style={lbl}>Email / Phone / Name</label>
            <input style={is} placeholder="your@email.com" value={f.email} onChange={upd('email')}/>
            <label style={lbl}>Password</label>
            <input style={is} type="password" placeholder="Password" value={f.pass} onChange={upd('pass')}/>
            <GBtn onClick={doLogin}><i className="fa-solid fa-right-to-bracket" style={{marginRight:8}}/>Sign In</GBtn>
          </div>
        ):(
          <div style={{animation:'fadeUp 0.28s ease'}}>
            {[['name','Full Name','text','Ravi Kumar'],['email','Email','email','you@email.com'],['phone','Phone','tel','+91 9XXXXXXXXX'],['pass','Password','password','Create password']].map(([k,l,t,p])=>(
              <div key={k}><label style={lbl}>{l}</label><input style={is} type={t} placeholder={p} value={f[k]} onChange={upd(k)}/></div>
            ))}
            <GBtn onClick={doSignup}><i className="fa-solid fa-user-plus" style={{marginRight:8}}/>Create Account & Verify OTP</GBtn>
          </div>
        )}
        {err&&<div style={{fontSize:12,color:'var(--red)',textAlign:'center',marginTop:10,animation:'fadeIn 0.2s'}}>{err}</div>}
        <div onClick={onClose} style={{fontSize:12,color:'var(--dim)',textAlign:'center',marginTop:16,cursor:'pointer'}}>
          Continue as guest &nbsp;<span style={{color:'var(--gold)',fontWeight:700}}>Skip →</span>
        </div>
      </Modal>
    </>
  );
}

/* ─── VENUE DETAIL SHEET ─────────────────────────────────────── */
function VenueSheet({venueId,open,onClose,onBook}) {
  const v=VENUES[venueId]; if(!v)return null;
  const adv=v.priceRaw*ADVANCE, pf=v.priceRaw*PLATFORM;
  return (
    <Sheet open={open} onClose={onClose} maxH="94vh">
      {/* Back button */}
      <div className="sh-back" onClick={onClose} style={{marginBottom:4}}>
        <div className="sh-back-btn"><i className="fa-solid fa-arrow-left"/></div>
        <span style={{fontSize:13,color:'var(--dim)',fontWeight:600}}>Back</span>
      </div>
      {/* Hero image */}
      <LazyImg src={v.img} thumb={v.imgThumb} alt={v.name} style={{width:'100%',height:250}}/>
      <div style={{padding:'20px 20px 0'}}>
        <div style={{display:'inline-flex',fontSize:9,fontWeight:800,letterSpacing:'1.2px',padding:'4px 10px',borderRadius:8,background:'var(--gs)',color:'var(--gold)',border:'1px solid var(--gb)',textTransform:'uppercase',marginBottom:14}}>{v.tag}</div>
        <div style={{fontFamily:'var(--dp)',fontSize:26,fontWeight:700,lineHeight:1.2,marginBottom:6}}>{v.name}</div>
        <div style={{fontSize:13,color:'var(--dim)',display:'flex',alignItems:'center',gap:6,marginBottom:18}}>
          <i className="fa-solid fa-location-dot" style={{color:'var(--gold)'}}/>
          {v.loc}
        </div>
        {/* Stats */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
          {[[`${v.rating}★`,'Rating'],[v.reviews,'Reviews'],[v.cap,'Capacity']].map(([val,lbl])=>(
            <div key={lbl} style={{background:'var(--card2)',borderRadius:14,padding:12,textAlign:'center',border:'1px solid var(--brd)'}}>
              <div style={{fontSize:17,fontWeight:800,color:'var(--gold)',fontFamily:'var(--dp)'}}>{val}</div>
              <div style={{fontSize:10,color:'var(--dim)',marginTop:3,fontWeight:600}}>{lbl}</div>
            </div>
          ))}
        </div>
        <div style={{fontSize:14,color:'var(--dim)',lineHeight:1.72,marginBottom:20}}>{v.desc}</div>
        {/* Amenities */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:10,fontWeight:800,color:'var(--dim)',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:12}}>Amenities</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
            {v.amenities.map(a=>(
              <div key={a} style={{background:'var(--card2)',border:'1px solid var(--brd)',borderRadius:50,padding:'6px 14px',fontSize:12,fontWeight:600,color:'var(--text2)'}}>{a}</div>
            ))}
          </div>
        </div>
        {/* Payment box */}
        <div style={{background:'var(--card2)',border:'1px solid var(--brd)',borderRadius:18,padding:18,marginBottom:18}}>
          {[['Full Hall Cost',v.price,false],['30% Advance Online',fmt(adv),true],['Platform Fee (2%)',fmt(pf),false],null,['💳 Pay Now',fmt(adv+pf),true,true]].map((row,i)=>row===null?(
            <div key={i} style={{borderTop:'1px solid var(--brd)',margin:'12px 0'}}/>
          ):(
            <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:row[3]?0:11,fontSize:14}}>
              <span style={{color:row[1]&&!row[3]?'var(--gold)':'var(--dim)',fontWeight:row[3]?700:'normal',fontSize:row[3]?15:14}}>{row[0]}</span>
              <span style={{fontWeight:row[3]?800:600,color:row[2]?'var(--gold)':'var(--text)',fontSize:row[3]?17:14}}>{row[1]}</span>
            </div>
          ))}
          <div style={{display:'flex',justifyContent:'space-between',background:'rgba(52,199,123,0.07)',padding:'9px 12px',borderRadius:10,marginTop:10,fontSize:12}}>
            <span style={{color:'var(--dim)'}}>🏛️ Pay at Hall on Event Day</span>
            <span style={{color:'var(--green)',fontWeight:700}}>{fmt(v.priceRaw*0.70)}</span>
          </div>
        </div>
        {/* Reviews */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:10,fontWeight:800,color:'var(--dim)',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:12}}>Guest Reviews</div>
          {v.revs.map((r,i)=>(
            <div key={i} style={{background:'var(--card2)',border:'1px solid var(--brd)',borderRadius:14,padding:14,marginBottom:10}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <div style={{width:32,height:32,borderRadius:'50%',background:'var(--gs)',border:'1px solid var(--gb)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:700,color:'var(--gold)',fontFamily:'var(--dp)'}}>{r.n.charAt(0)}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700}}>{r.n}</div>
                  <div style={{color:'var(--gold)',fontSize:11}}>{'★'.repeat(r.s)}</div>
                </div>
              </div>
              <div style={{fontSize:13,color:'var(--dim)',lineHeight:1.5}}>{r.t}</div>
            </div>
          ))}
        </div>
        {/* Sticky CTA */}
        <div style={{position:'sticky',bottom:0,background:'linear-gradient(0,var(--card) 70%,transparent)',paddingTop:16,paddingBottom:8}}>
          <GBtn onClick={()=>onBook(v.id)}>
            <i className="fa-solid fa-calendar-check" style={{marginRight:8}}/>
            Book Now — {fmt(adv+pf)} advance
          </GBtn>
        </div>
        <div style={{height:16}}/>
      </div>
    </Sheet>
  );
}

/* ─── BOOKING SHEET ──────────────────────────────────────────── */
function BookingSheet({venueId,open,onClose,onSuccess,onBackToVenue}) {
  const {user,toast}=useApp();
  const v=VENUES[venueId];
  const [step,setStep]=useState(0);
  const [selDate,setSelDate]=useState(null);
  const [mult,setMult]=useState(1.0);
  const [occasion,setOccasion]=useState('');
  const [guests,setGuests]=useState('');
  const [name,setName]=useState(user?.name||'');
  const [phone,setPhone]=useState(user?.phone||'');
  const [paying,setPaying]=useState(false);
  const innerRef=useRef(null);

  useEffect(()=>{
    if(open){setStep(0);setSelDate(null);setMult(1.0);setOccasion('');setGuests('');
      setName(user?.name||'');setPhone(user?.phone||'');}
  },[open,venueId]);

  if(!v)return null;
  const adj=v.priceRaw*mult;
  const adv=adj*ADVANCE, pf=adj*PLATFORM, total=adv+pf;
  const dateLabel=selDate?selDate.toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}):'';

  const next=s=>{
    if(s===1){
      if(!selDate){toast('Please select a date');return;}
      if(!occasion){toast('Select an occasion');return;}
      if(!guests){toast('Enter guest count');return;}
    }
    if(s===2){
      if(!name){toast('Enter your name');return;}
      if(!phone){toast('Enter your phone');return;}
    }
    setStep(s);
    setTimeout(()=>innerRef.current?.scrollTo({top:0,behavior:'smooth'}),50);
  };

  const pay=()=>{
    setPaying(true);
    // Razorpay mock
    const el=document.createElement('div');
    el.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(12px);animation:fadeIn 0.25s';
    el.innerHTML=`<div style="background:#12122A;border:1px solid rgba(13,110,253,0.3);border-radius:24px;padding:28px;max-width:380px;width:100%;box-shadow:0 32px 80px rgba(0,0,0,0.8);animation:scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1)">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px"><div style="width:38px;height:38px;background:#0D6EFD;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px">💳</div><div><div style="font-size:12px;color:#aaa;font-family:Sora,sans-serif">Razorpay Secure Checkout</div><div style="font-family:Fraunces,serif;font-size:17px;font-weight:700;color:#fff">${v.name}</div></div></div>
      <div style="background:rgba(13,110,253,0.08);border:1px solid rgba(13,110,253,0.2);border-radius:14px;padding:18px;margin-bottom:20px"><div style="font-size:10px;color:#aaa;letter-spacing:1px;margin-bottom:4px">TOTAL AMOUNT</div><div style="font-family:Fraunces,serif;font-size:28px;font-weight:700;color:#fff">${fmt(total)}</div><div style="font-size:11px;color:#aaa;margin-top:4px">30% advance + platform fee</div></div>
      <div style="margin-bottom:14px"><div style="font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;font-family:Sora,sans-serif">Card Number</div><input readonly value="4242 4242 4242 4242" style="width:100%;background:#0d1117;border:1px solid #222;border-radius:12px;padding:13px;color:#fff;font-family:Sora,sans-serif;font-size:15px;outline:none"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px"><div><div style="font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Expiry</div><input readonly value="12/27" style="width:100%;background:#0d1117;border:1px solid #222;border-radius:12px;padding:13px;color:#fff;font-family:Sora,sans-serif;font-size:15px;outline:none"></div><div><div style="font-size:10px;color:#aaa;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">CVV</div><input type="password" readonly value="123" style="width:100%;background:#0d1117;border:1px solid #222;border-radius:12px;padding:13px;color:#fff;font-family:Sora,sans-serif;font-size:15px;outline:none"></div></div>
      <button id="rzBtn" style="width:100%;padding:16px;background:linear-gradient(135deg,#0D6EFD,#0A56C7);color:#fff;font-weight:800;font-size:15px;border-radius:16px;border:none;cursor:pointer;font-family:Sora,sans-serif;box-shadow:0 6px 24px rgba(13,110,253,0.4)">Pay ${fmt(total)} Securely →</button>
      <div style="text-align:center;margin-top:12px;font-size:11px;color:#555">🔒 256-bit SSL · Razorpay certified</div>
    </div>`;
    document.body.appendChild(el);
    document.getElementById('rzBtn').onclick=()=>{
      document.getElementById('rzBtn').textContent='⏳ Processing...';
      document.getElementById('rzBtn').style.opacity='0.7';
      setTimeout(()=>{
        document.body.removeChild(el);
        const refId='KH-'+Date.now().toString().slice(-6);
        onSuccess({id:refId,venue:v.name,loc:v.loc,date:dateLabel,guests:parseInt(guests)||0,
          occasion,status:'confirmed',priceRaw:adj,name,phone,mult,
          peakNote:mult>1?`Peak pricing +${Math.round((mult-1)*100)}%`:'',
          dateStr:selDate?.toDateString()
        });
        setPaying(false);
      },1800);
    };
  };

  const iStyle={width:'100%',background:'var(--card2)',border:'1px solid var(--brd)',borderRadius:14,padding:'13px 16px',color:'var(--text)',fontSize:15,outline:'none',fontFamily:'var(--fn)',transition:'border-color 0.18s',marginBottom:14};
  const lStyle={fontSize:10,fontWeight:800,color:'var(--dim)',textTransform:'uppercase',letterSpacing:'1.2px',display:'block',marginBottom:7};

  return (
    <Sheet open={open} onClose={onClose} maxH="96vh">
      <div ref={innerRef} style={{padding:'0 20px'}}>
        {/* Step dots */}
        <div style={{display:'flex',gap:6,justifyContent:'center',margin:'20px 0 24px'}}>
          {[0,1,2].map(i=>(
            <div key={i} style={{height:8,borderRadius:4,
              width:step===i?28:8,
              background:step===i?'var(--gold)':step>i?'rgba(212,168,67,0.4)':'var(--dim2)',
              transition:'all 0.35s cubic-bezier(0.34,1.56,0.64,1)'}}/>
          ))}
        </div>

        {/* STEP 0 */}
        {step===0&&(
          <div style={{animation:'fadeUp 0.3s ease'}}>
            {/* Back to venue */}
            <div className="sh-back" style={{padding:'0 0 16px 0'}} onClick={()=>{onClose();setTimeout(()=>onBackToVenue&&onBackToVenue(venueId),350);}}>
              <div className="sh-back-btn"><i className="fa-solid fa-arrow-left"/></div>
              <span style={{fontSize:13,color:'var(--dim)',fontWeight:600}}>Back to venue</span>
            </div>
            <div style={{fontSize:9,fontWeight:800,letterSpacing:'1.5px',color:'var(--dim)',textTransform:'uppercase',marginBottom:8}}>STEP 1 OF 3</div>
            <div style={{fontFamily:'var(--dp)',fontSize:24,fontWeight:700,marginBottom:4}}>Pick Your Date</div>
            <div style={{fontSize:13,color:'var(--dim)',marginBottom:20}}>Peak dates cost more. Red = already booked.</div>
            <Calendar venuePrice={v.priceRaw} selected={selDate} onSelect={(d,m)=>{setSelDate(d);setMult(m);}}/>
            {selDate&&(
              <div style={{background:'var(--gs)',border:'1px solid var(--gb)',borderRadius:14,padding:'12px 16px',marginTop:16,display:'flex',alignItems:'center',justifyContent:'space-between',animation:'fadeUp 0.25s ease'}}>
                <div>
                  <div style={{fontSize:11,color:'var(--dim)',fontWeight:600}}>Selected Date</div>
                  <div style={{fontWeight:700,color:'var(--gold)',fontFamily:'var(--dp)',fontSize:15}}>{dateLabel}</div>
                </div>
                {mult>1&&<div style={{background:'rgba(212,168,67,0.15)',borderRadius:10,padding:'4px 10px',fontSize:11,fontWeight:800,color:'var(--gold)'}}>+{Math.round((mult-1)*100)}% peak</div>}
              </div>
            )}
            <div style={{marginTop:18}}>
              <label style={lStyle}>Occasion</label>
              <select style={iStyle} value={occasion} onChange={e=>setOccasion(e.target.value)}>
                <option value="">Select...</option>
                {['Wedding','Reception','Engagement','Sangeet','Mehendi / Haldi','Birthday','Corporate'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label style={lStyle}>Expected Guests</label>
              <input style={iStyle} type="number" placeholder="e.g. 500" value={guests} onChange={e=>setGuests(e.target.value)}/>
            </div>
            <GBtn style={{marginTop:8,marginBottom:24}} onClick={()=>next(1)}>
              Continue <i className="fa-solid fa-arrow-right" style={{marginLeft:8}}/>
            </GBtn>
          </div>
        )}

        {/* STEP 1 */}
        {step===1&&(
          <div style={{animation:'fadeUp 0.3s ease'}}>
            <div style={{fontSize:9,fontWeight:800,letterSpacing:'1.5px',color:'var(--dim)',textTransform:'uppercase',marginBottom:8}}>STEP 2 OF 3</div>
            <div style={{fontFamily:'var(--dp)',fontSize:24,fontWeight:700,marginBottom:4}}>Contact & Payment</div>
            <div style={{fontSize:13,color:'var(--dim)',marginBottom:20}}>Only 30% advance to confirm your booking.</div>
            <label style={lStyle}>Your Name</label>
            <input style={iStyle} value={name} onChange={e=>setName(e.target.value)} placeholder="Full name"/>
            <label style={lStyle}>Phone</label>
            <input style={iStyle} type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91 9XXXXXXXXX"/>
            {/* Breakdown */}
            <div style={{background:'var(--card2)',border:'1px solid var(--brd)',borderRadius:18,padding:18,marginBottom:16}}>
              <div style={{fontSize:10,fontWeight:800,color:'var(--dim)',letterSpacing:'1.2px',textTransform:'uppercase',marginBottom:14}}>Payment Breakdown</div>
              {[['Date',dateLabel],['Occasion',occasion],mult>1?['Peak Adjustment',`+${Math.round((mult-1)*100)}%`]:null,['Full Cost',fmt(adj)],['30% Advance',fmt(adv)],['Platform Fee',fmt(pf)]].filter(Boolean).map(([l,val])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:9,fontSize:13}}>
                  <span style={{color:'var(--dim)'}}>{l}</span>
                  <span style={{fontWeight:600,color:l==='30% Advance'?'var(--gold)':'var(--text)'}}>{val}</span>
                </div>
              ))}
              <div style={{borderTop:'1px solid var(--brd)',margin:'12px 0'}}/>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:15}}>
                <span style={{fontWeight:700}}>💳 Pay via Razorpay</span>
                <span style={{fontWeight:800,color:'var(--gold)',fontSize:17}}>{fmt(total)}</span>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',background:'rgba(52,199,123,0.07)',padding:'9px 12px',borderRadius:10,marginTop:10,fontSize:12}}>
                <span style={{color:'var(--dim)'}}>🏛️ Pay at Hall</span>
                <span style={{color:'var(--green)',fontWeight:700}}>{fmt(adj*0.70)}</span>
              </div>
            </div>
            <div style={{background:'var(--gs)',border:'1px solid var(--gb)',borderRadius:13,padding:'11px 14px',marginBottom:20,fontSize:12,color:'var(--dim)',lineHeight:1.6}}>
              <i className="fa-solid fa-circle-info" style={{color:'var(--gold)',marginRight:6}}/>
              <strong style={{color:'var(--text2)'}}>Cancellation: </strong>5% of advance + platform fee deducted. Refund in 5–7 days.
            </div>
            <div style={{display:'flex',gap:10,marginBottom:24}}>
              <button onClick={()=>setStep(0)} style={{padding:'14px 18px',background:'transparent',border:'1px solid var(--brd2)',borderRadius:14,color:'var(--text2)',fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:'var(--fn)'}}>← Back</button>
              <GBtn full={false} style={{flex:1}} onClick={()=>next(2)}>Review & Confirm</GBtn>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step===2&&(
          <div style={{animation:'fadeUp 0.3s ease'}}>
            <div style={{fontSize:9,fontWeight:800,letterSpacing:'1.5px',color:'var(--dim)',textTransform:'uppercase',marginBottom:8}}>STEP 3 OF 3</div>
            <div style={{fontFamily:'var(--dp)',fontSize:24,fontWeight:700,marginBottom:20}}>Confirm & Pay</div>
            <div style={{background:'var(--card2)',border:'1px solid var(--brd)',borderRadius:18,padding:18,marginBottom:18}}>
              {[['Venue',v.name],['Date',dateLabel],['Occasion',occasion],['Guests',guests+' pax'],['Name',name],['Phone',phone]].map(([l,val])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:9,fontSize:13}}>
                  <span style={{color:'var(--dim)'}}>{l}</span>
                  <span style={{fontWeight:600,textAlign:'right',maxWidth:'55%'}}>{val}</span>
                </div>
              ))}
              <div style={{borderTop:'1px solid var(--brd)',margin:'12px 0'}}/>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:16}}>
                <span style={{fontWeight:700}}>💳 Pay via Razorpay</span>
                <span style={{fontWeight:800,color:'var(--gold)',fontSize:18}}>{fmt(total)}</span>
              </div>
            </div>
            <div style={{background:'linear-gradient(135deg,rgba(13,110,253,0.08),rgba(13,110,253,0.04))',border:'1px solid rgba(13,110,253,0.2)',borderRadius:14,padding:'14px 16px',marginBottom:20,display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:40,height:40,background:'rgba(13,110,253,0.15)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>💳</div>
              <div>
                <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>Razorpay Secure Payment</div>
                <div style={{fontSize:11,color:'var(--dim)'}}>256-bit SSL · UPI · Cards · Net Banking · Wallets</div>
              </div>
            </div>
            <div style={{display:'flex',gap:10,marginBottom:24}}>
              <button onClick={()=>setStep(1)} style={{padding:'14px 18px',background:'transparent',border:'1px solid var(--brd2)',borderRadius:14,color:'var(--text2)',fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:'var(--fn)'}}>← Back</button>
              <button disabled={paying} onClick={pay} style={{
                flex:1,padding:16,background:'linear-gradient(135deg,#0D6EFD,#0A56C7)',color:'#fff',
                fontWeight:800,fontSize:15,borderRadius:16,border:'none',cursor:paying?'wait':'pointer',
                fontFamily:'var(--fn)',boxShadow:'0 6px 24px rgba(13,110,253,0.4)',transition:'all 0.2s',
                opacity:paying?0.7:1
              }}>
                {paying?'⏳ Processing...':`🔒 Pay ${fmt(total)} Now`}
              </button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}

/* ─── HOME PAGE ──────────────────────────────────────────────── */
function HomePage({onOpenVenue,onGoPage}) {
  const {user,openAuth}=useApp();
  const [city,setCity]=useState('All');
  const [q,setQ]=useState('');
  const [activeOcc,setActiveOcc]=useState('');

  const handleOcc=(type)=>{
    setActiveOcc(type);
    onGoPage('explore',{occ:type});
  };
  const handleCity=(c)=>{
    setCity(c);
    if(c!=='All') onGoPage('explore',{city:c});
  };
  const handleSearch=(val)=>{
    setQ(val);
    if(val.length>1) onGoPage('explore',{q:val});
  };

  const featured=Object.values(VENUES).slice(0,5);

  return (
    <div className="page-enter" style={{paddingBottom:100}}>
      <TopBar
        greeting={user?`Namaste, ${user.name.split(' ')[0]} 🙏`:'Namaste 🙏'}
        brand="Vivaha Venue"
        right={<IBtn icon="fa-circle-user" onClick={openAuth}/>}
      />
      {/* Search */}
      <div style={{padding:'16px 20px 0'}}>
        <div className="sbar">
          <i className="fa-solid fa-magnifying-glass" style={{color:'var(--dim)',fontSize:15}}/>
          <input placeholder="Search city, hall name..." value={q} onChange={e=>handleSearch(e.target.value)}/>
          {q&&<i className="fa-solid fa-xmark" style={{color:'var(--dim)',cursor:'pointer'}} onClick={()=>setQ('')}/>}
        </div>
      </div>
      {/* Hero */}
      <div onClick={()=>onGoPage('explore',{})} style={{
        margin:'18px 20px 0',
        background:'linear-gradient(135deg,#120E03 0%,#090C1A 45%,#020E0A 100%)',
        borderRadius:22,padding:'26px 22px',border:'1px solid rgba(212,168,67,0.12)',
        position:'relative',overflow:'hidden',cursor:'pointer',
        transition:'transform 0.25s',
      }}
        onMouseEnter={e=>e.currentTarget.style.transform='scale(1.01)'}
        onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
      >
        <div style={{position:'absolute',top:-50,right:-50,width:200,height:200,background:'radial-gradient(circle,rgba(212,168,67,0.12),transparent 70%)',pointerEvents:'none',animation:'float 5s ease-in-out infinite'}}/>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'var(--gs)',border:'1px solid var(--gb)',borderRadius:50,padding:'5px 12px',marginBottom:14,fontSize:11,fontWeight:700,color:'var(--gold)'}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:'var(--gold)',animation:'pdot 1.4s infinite'}}/>
          47 bookings confirmed this week
        </div>
        <div style={{fontFamily:'var(--dp)',fontSize:30,lineHeight:1.18,marginBottom:12,fontWeight:700}}>
          Your Dream<br/><span style={{color:'var(--gold)'}}>Wedding Venue</span><br/>Awaits
        </div>
        <div style={{fontSize:13,color:'var(--dim)',marginBottom:20,lineHeight:1.6}}>500+ premium halls across AP & Telangana. Pay just 30% to lock your date.</div>
        <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'var(--gold)',color:'#000',fontWeight:800,fontSize:13,borderRadius:13,padding:'11px 20px'}}>
          <i className="fa-solid fa-calendar-check"/> Book Now
        </div>
      </div>
      {/* Cities */}
      <div style={{padding:'22px 20px 14px'}}>
        <div style={{fontSize:11,fontWeight:700,color:'var(--dim)',textTransform:'uppercase',letterSpacing:'2px',marginBottom:14}}>Browse by City</div>
      </div>
      <ChipRow chips={CITIES} active={city} onSelect={handleCity}/>
      {/* Occasions */}
      <div style={{padding:'22px 20px 0'}}>
        <div style={{fontSize:11,fontWeight:700,color:'var(--dim)',textTransform:'uppercase',letterSpacing:'2px',marginBottom:14}}>What's the Occasion?</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
          {OCCASIONS.map(([ico,lbl,type])=>(
            <div key={type} className={`occ${activeOcc===type?' active':''}`} onClick={()=>handleOcc(type)}>
              <div className="oico"><i className={`fa-solid ${ico}`} style={{fontSize:19,color:activeOcc===type?'#000':'var(--gold)'}}/></div>
              <div className="olbl" style={{color:activeOcc===type?'#000':''}}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Featured */}
      <div style={{padding:'22px 20px 14px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <div style={{fontSize:11,fontWeight:700,color:'var(--dim)',textTransform:'uppercase',letterSpacing:'2px'}}>Top Venues</div>
        <div style={{fontSize:12,fontWeight:700,color:'var(--gold)',cursor:'pointer'}} onClick={()=>onGoPage('explore',{})}>See All →</div>
      </div>
      <div style={{display:'flex',gap:14,overflowX:'auto',padding:'0 20px 4px',scrollbarWidth:'none'}}>
        {featured.map((v,i)=>(
          <VenueCard key={v.id} v={v} variant="h" onOpen={onOpenVenue} idx={i}/>
        ))}
      </div>
    </div>
  );
}

/* ─── EXPLORE PAGE ───────────────────────────────────────────── */
function ExplorePage({onOpenVenue,onBack,initialFilters={}}) {
  const [q,setQ]=useState(initialFilters.q||'');
  const [chip,setChip]=useState('All');
  const [city,setCity]=useState(initialFilters.city||'All');
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    // Simulate fast load — show skeletons briefly
    const t=setTimeout(()=>setLoading(false),300);
    return()=>clearTimeout(t);
  },[]);

  // Apply initial filters
  useEffect(()=>{
    if(initialFilters.q) setQ(initialFilters.q);
    if(initialFilters.city) setCity(initialFilters.city);
  },[initialFilters.q,initialFilters.city]);

  const filtered=Object.values(VENUES).filter(v=>{
    if(city&&city!=='All'&&v.city!==city) return false;
    if(q&&!v.name.toLowerCase().includes(q.toLowerCase())&&!v.city.toLowerCase().includes(q.toLowerCase())) return false;
    if(chip==='Under ₹2L') return v.priceRaw<200000;
    if(chip==='₹2L–₹5L') return v.priceRaw>=200000&&v.priceRaw<=500000;
    if(chip==='5★ Only') return v.rating>=4.8;
    if(chip==='Outdoor') return ['SCENIC','BEACHFRONT'].includes(v.tag)||v.name.includes('Garden');
    if(chip==='AC Hall') return ['ULTRA LUXE','DIVINE'].includes(v.tag)||v.cap>800;
    return true;
  });

  const handleChip=c=>{setChip(c);setCity('All');};

  return (
    <div className="page-enter" style={{paddingBottom:100}}>
      <TopBar
        greeting={city!=='All'?city:'500+ Venues'}
        brand="Explore"
        left={<div className="iBtn" onClick={onBack} style={{width:36,height:36,background:'var(--card)',border:'1px solid var(--brd)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'var(--text2)',cursor:'pointer',flexShrink:0}}><i className="fa-solid fa-arrow-left"/></div>}
        right={null}
      />
      <div style={{padding:'16px 20px 0'}}>
        <div className="sbar">
          <i className="fa-solid fa-magnifying-glass" style={{color:'var(--dim)',fontSize:15}}/>
          <input placeholder="Search venues or cities..." value={q} onChange={e=>setQ(e.target.value)}/>
          {(q||city!=='All')&&<i className="fa-solid fa-xmark" style={{color:'var(--dim)',cursor:'pointer'}} onClick={()=>{setQ('');setCity('All');}}/>}
        </div>
      </div>
      {/* City chips */}
      <ChipRow chips={CITIES} active={city} onSelect={c=>{setCity(c);setChip('All');}} style={{padding:'14px 20px 0'}}/>
      {/* Filter chips */}
      <ChipRow chips={EXPLORE_CHIPS} active={chip} onSelect={handleChip} style={{padding:'10px 20px 0'}}/>
      <div style={{display:'flex',flexDirection:'column',gap:16,padding:'16px 20px 0'}}>
        {loading?(
          [1,2,3].map(i=><CardSkeleton key={i}/>)
        ):filtered.length===0?(
          <div style={{textAlign:'center',padding:'64px 20px',animation:'fadeIn 0.4s ease'}}>
            <div style={{fontSize:52,opacity:0.2,marginBottom:16}}>🏛️</div>
            <div style={{fontFamily:'var(--dp)',fontSize:20,fontWeight:700,marginBottom:8}}>No venues found</div>
            <div style={{fontSize:14,color:'var(--dim)',marginBottom:16}}>Try a different filter or city</div>
            <GBtn full={false} style={{padding:'10px 20px',fontSize:13}} onClick={()=>{setQ('');setCity('All');setChip('All');}}>Clear Filters</GBtn>
          </div>
        ):filtered.map((v,i)=>(
          <VenueCard key={v.id} v={v} variant="v" onOpen={onOpenVenue} idx={i}/>
        ))}
      </div>
    </div>
  );
}

/* ─── BOOKINGS PAGE ──────────────────────────────────────────── */
function BookingsPage({bookings,onCancel,onInvoice,onGoExplore}) {
  const statusClr={confirmed:'rgba(52,199,123,0.12)',pending:'rgba(212,168,67,0.12)',completed:'rgba(107,117,148,0.12)',cancelled:'rgba(224,84,84,0.12)'};
  const statusTxt={confirmed:'var(--green)',pending:'var(--gold)',completed:'var(--dim)',cancelled:'var(--red)'};
  return (
    <div className="page-enter" style={{paddingBottom:100}}>
      <TopBar greeting="My Events" brand="Bookings"/>
      {bookings.length===0?(
        <div style={{textAlign:'center',padding:'80px 20px',animation:'fadeIn 0.4s ease'}}>
          <div style={{fontSize:52,opacity:0.2,marginBottom:16}}>📅</div>
          <div style={{fontFamily:'var(--dp)',fontSize:20,fontWeight:700,marginBottom:8}}>No Bookings Yet</div>
          <div style={{fontSize:14,color:'var(--dim)',lineHeight:1.6,marginBottom:20}}>Your bookings survive refresh.<br/>Go book a venue!</div>
          <GBtn full={false} style={{padding:'12px 24px'}} onClick={onGoExplore}>Browse Venues →</GBtn>
        </div>
      ):(
        <div style={{display:'flex',flexDirection:'column',gap:14,padding:'20px 20px 0'}}>
          {bookings.map((b,i)=>{
            const adv=b.priceRaw*ADVANCE;
            return (
              <div key={b.id} className={`stg${Math.min(i+1,5)}`} style={{background:'var(--card)',border:'1px solid var(--brd)',borderRadius:18,padding:16}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:13,gap:8}}>
                  <div style={{fontFamily:'var(--dp)',fontSize:16,fontWeight:700,flex:1}}>{b.venue}</div>
                  <div style={{fontSize:9,fontWeight:800,padding:'4px 10px',borderRadius:8,
                    background:statusClr[b.status]||statusClr.completed,
                    color:statusTxt[b.status]||'var(--dim)',
                    whiteSpace:'nowrap',letterSpacing:'0.8px',
                    border:`1px solid ${statusTxt[b.status]||'var(--dim)'}33`
                  }}>{b.status.toUpperCase()}</div>
                </div>
                {[['fa-calendar',b.date],['fa-location-dot',b.loc],['fa-users',`${b.guests} guests · ${b.occasion}`]].map(([ico,val])=>(
                  <div key={ico} style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'var(--dim)',marginBottom:6}}>
                    <i className={`fa-solid ${ico}`} style={{width:14,fontSize:10,color:'var(--dim2)',flexShrink:0}}/>
                    {val}
                  </div>
                ))}
                {b.peakNote&&<div style={{fontSize:11,color:'var(--gold)',marginBottom:6}}>⚡ {b.peakNote}</div>}
                <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12,color:'var(--dim)',marginBottom:10}}>
                  <i className="fa-solid fa-indian-rupee-sign" style={{width:14,fontSize:10,color:'var(--dim2)'}}/>
                  Advance: <strong style={{color:'var(--text)',marginLeft:2}}>{fmt(adv)}</strong>
                  &nbsp;·&nbsp;
                  <span style={{color:'var(--gold)',fontWeight:700,fontSize:11}}>{b.id}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:8,background:'rgba(52,199,123,0.06)',borderRadius:10,padding:'8px 10px',marginBottom:12,fontSize:12}}>
                  <i className="fa-solid fa-store" style={{color:'var(--green)',fontSize:11}}/>
                  <span style={{color:'var(--green)',fontWeight:600}}>Pay {fmt(b.priceRaw*0.70)} at hall on event day</span>
                </div>
                <div style={{display:'flex',gap:8}}>
                  <button onClick={()=>onInvoice(i)} style={{flex:1,padding:'10px',background:'transparent',border:'1px solid var(--brd2)',borderRadius:12,color:'var(--text2)',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'var(--fn)'}}>
                    <i className="fa-solid fa-file-invoice" style={{marginRight:6}}/>Invoice
                  </button>
                  {b.status!=='cancelled'&&b.status!=='completed'&&(
                    <button onClick={()=>onCancel(i)} style={{flex:1,padding:'10px',background:'rgba(224,84,84,0.1)',border:'1px solid rgba(224,84,84,0.2)',borderRadius:12,color:'var(--red)',fontWeight:700,fontSize:12,cursor:'pointer',fontFamily:'var(--fn)'}}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─── PROFILE PAGE ───────────────────────────────────────────── */
function ProfilePage({bookings}) {
  const {user,openAuth,logout,toast}=useApp();
  const [editOpen,setEditOpen]=useState(false);
  const [f,setF]=useState({name:'',email:'',phone:''});
  const is={width:'100%',background:'var(--card2)',border:'1px solid var(--brd)',borderRadius:14,padding:'13px 16px',color:'var(--text)',fontSize:15,outline:'none',fontFamily:'var(--fn)',marginBottom:14};
  const ls={fontSize:10,fontWeight:800,color:'var(--dim)',textTransform:'uppercase',letterSpacing:'1.2px',display:'block',marginBottom:7};

  const menuItems=[
    {ico:'fa-calendar-check',c:'var(--blue)',bg:'rgba(79,142,245,0.1)',lbl:'My Bookings',sub:`${bookings.length} total`,fn:()=>{}},
    {ico:'fa-user-pen',c:'var(--gold)',bg:'var(--gs)',lbl:'Edit Profile',sub:'Update name, email & phone',fn:()=>{if(!user){openAuth();return;}setF({name:user.name||'',email:user.email||'',phone:user.phone||''});setEditOpen(true);}},
    {ico:'fa-headset',c:'var(--green)',bg:'rgba(52,199,123,0.1)',lbl:'Help & Support',sub:'support@vivahavenue.in',fn:()=>alert('📞 +91 98765 43210\n✉️ support@vivahavenue.in')},
    user
      ?{ico:'fa-right-from-bracket',c:'var(--red)',bg:'rgba(224,84,84,0.1)',lbl:'Sign Out',sub:user.name,fn:logout}
      :{ico:'fa-right-to-bracket',c:'var(--gold)',bg:'var(--gs)',lbl:'Sign In / Sign Up',sub:'Login or create account',fn:openAuth},
  ];

  const saveEdit=()=>{
    if(!f.name||!f.email){toast('Name and email required');return;}
    const u={...user,...f};sSet('vv_user',u);
    setEditOpen(false);toast('Profile updated!');window.location.reload();
  };

  return (
    <div className="page-enter" style={{paddingBottom:100}}>
      <TopBar greeting="Account" brand="Profile" right={<IBtn icon="fa-pen" onClick={()=>setEditOpen(true)}/>}/>
      {/* Header */}
      <div style={{padding:'28px 20px 20px',display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',position:'relative'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:140,background:'linear-gradient(180deg,rgba(212,168,67,0.07),transparent)',borderRadius:'0 0 40px 40px',pointerEvents:'none'}}/>
        <div style={{width:88,height:88,borderRadius:'50%',background:'linear-gradient(135deg,var(--gold2),var(--gold))',display:'flex',alignItems:'center',justifyContent:'center',fontSize:34,fontWeight:800,color:'#000',fontFamily:'var(--dp)',marginBottom:14,boxShadow:'0 8px 32px rgba(212,168,67,0.3)',zIndex:1,transition:'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',cursor:'pointer'}}
          onMouseEnter={e=>e.currentTarget.style.transform='scale(1.07)'}
          onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
        >{user?user.name.charAt(0).toUpperCase():'?'}</div>
        <div style={{fontFamily:'var(--dp)',fontSize:22,fontWeight:700,marginBottom:4}}>{user?.name||'Guest User'}</div>
        <div style={{fontSize:13,color:'var(--dim)',marginBottom:20}}>{user?.email||'Sign in to continue'}</div>
        <div style={{display:'flex',gap:10}}>
          {[[bookings.length,'Bookings'],['0','Saved'],['4.9★','Rating']].map(([v,l])=>(
            <div key={l} style={{background:'var(--card)',border:'1px solid var(--brd)',borderRadius:14,padding:'8px 16px',textAlign:'center'}}>
              <div style={{fontSize:19,fontWeight:800,color:'var(--gold)',fontFamily:'var(--dp)'}}>{v}</div>
              <div style={{fontSize:10,color:'var(--dim)',fontWeight:600,marginTop:2}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Menu */}
      <div style={{display:'flex',flexDirection:'column',gap:8,padding:'0 20px'}}>
        {menuItems.map((item,i)=>(
          <div key={i} className={`mrow stg${i+1}`} onClick={item.fn} style={{display:'flex',alignItems:'center',gap:14,padding:15,background:'var(--card)',border:'1px solid var(--brd)',borderRadius:16,cursor:'pointer'}}>
            <div className="micon" style={{width:40,height:40,borderRadius:13,background:item.bg,border:`1px solid ${item.c}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,color:item.c,flexShrink:0}}>
              <i className={`fa-solid ${item.ico}`}/>
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:600}}>{item.lbl}</div>
              <div style={{fontSize:11,color:'var(--dim)',marginTop:2}}>{item.sub}</div>
            </div>
            <i className="fa-solid fa-chevron-right" style={{color:'var(--dim2)',fontSize:12}}/>
          </div>
        ))}
      </div>
      {/* Edit modal */}
      <Modal open={editOpen} onClose={()=>setEditOpen(false)}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:22}}>
          <div style={{fontFamily:'var(--dp)',fontSize:20,fontWeight:700}}>Edit Profile</div>
          <div onClick={()=>setEditOpen(false)} style={{width:32,height:32,background:'var(--card2)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:13,color:'var(--dim)'}}>✕</div>
        </div>
        {[['name','Full Name','text'],['email','Email','email'],['phone','Phone','tel']].map(([k,l,t])=>(
          <div key={k}><label style={ls}>{l}</label><input type={t} value={f[k]} onChange={e=>setF(p=>({...p,[k]:e.target.value}))} style={is}/></div>
        ))}
        <GBtn onClick={saveEdit}>Save Changes</GBtn>
      </Modal>
    </div>
  );
}

/* ─── CANCEL + INVOICE MODALS ────────────────────────────────── */
function CancelModal({open,booking,onConfirm,onClose}) {
  if(!booking)return null;
  const adv=booking.priceRaw*ADVANCE,pf=booking.priceRaw*PLATFORM;
  const pen=adv*0.05,ref=Math.max(0,adv-pen-pf);
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{width:56,height:56,background:'rgba(224,84,84,0.12)',borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,color:'var(--red)',marginBottom:16}}>
        <i className="fa-solid fa-circle-xmark"/>
      </div>
      <div style={{fontFamily:'var(--dp)',fontSize:20,fontWeight:700,marginBottom:8}}>Cancel Booking?</div>
      <div style={{fontSize:13,color:'var(--dim)',marginBottom:16}}>This cannot be undone.</div>
      <div style={{background:'rgba(224,84,84,0.06)',border:'1px solid rgba(224,84,84,0.18)',borderRadius:14,padding:14,marginBottom:20}}>
        {[['Advance Paid',fmt(adv),''],['5% Penalty',`-${fmt(pen)}`,'var(--red)'],['Platform Fee',`-${fmt(pf)}`,'var(--red)'],null,['Refund',fmt(ref),'var(--green)']].map((row,i)=>row===null?(
          <div key={i} style={{borderTop:'1px solid rgba(224,84,84,0.18)',margin:'10px 0'}}/>
        ):(
          <div key={i} style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:13}}>
            <span style={{color:'var(--dim)'}}>{row[0]}</span>
            <span style={{color:row[2]||'var(--text)',fontWeight:row[2]?700:600}}>{row[1]}</span>
          </div>
        ))}
      </div>
      <div style={{display:'flex',gap:10}}>
        <button onClick={onClose} style={{flex:1,padding:13,background:'transparent',border:'1px solid var(--brd2)',borderRadius:14,color:'var(--text2)',fontWeight:700,fontSize:13,cursor:'pointer',fontFamily:'var(--fn)'}}>Keep</button>
        <button onClick={onConfirm} style={{flex:1,padding:13,background:'var(--red)',border:'none',borderRadius:14,color:'#fff',fontWeight:800,fontSize:13,cursor:'pointer',fontFamily:'var(--fn)'}}>Yes, Cancel</button>
      </div>
    </Modal>
  );
}

function InvoiceModal({open,booking,onClose}) {
  if(!booking)return null;
  const adv=booking.priceRaw*ADVANCE,pf=booking.priceRaw*PLATFORM;
  return (
    <Modal open={open} onClose={onClose}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:18}}>
        <div style={{fontFamily:'var(--dp)',fontSize:20,fontWeight:700}}><i className="fa-solid fa-file-invoice" style={{color:'var(--gold)',marginRight:8}}/>Invoice</div>
        <div onClick={onClose} style={{width:32,height:32,background:'var(--card2)',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:13,color:'var(--dim)'}}>✕</div>
      </div>
      <div style={{background:'var(--gs)',border:'1px solid var(--gb)',borderRadius:14,padding:14,marginBottom:16}}>
        <div style={{fontSize:10,color:'var(--dim)',fontWeight:700,letterSpacing:'1px',marginBottom:4}}>REFERENCE</div>
        <div style={{fontFamily:'var(--dp)',fontSize:20,fontWeight:800,color:'var(--gold)',letterSpacing:1}}>{booking.id}</div>
      </div>
      <div style={{background:'var(--card2)',border:'1px solid var(--brd)',borderRadius:16,padding:16,marginBottom:16}}>
        {[['Venue',booking.venue],['Date',booking.date],['Guests',booking.guests],['Name',booking.name]].map(([l,v])=>(
          <div key={l} style={{display:'flex',justifyContent:'space-between',marginBottom:9,fontSize:13}}>
            <span style={{color:'var(--dim)'}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
          </div>
        ))}
        <div style={{borderTop:'1px solid var(--brd)',margin:'12px 0'}}/>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8,fontSize:13}}>
          <span style={{color:'var(--dim)'}}>Advance</span><span style={{color:'var(--gold)',fontWeight:700}}>{fmt(adv)}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:15}}>
          <span style={{fontWeight:700}}>Total Paid</span><span style={{fontWeight:800,color:'var(--gold)',fontSize:17}}>{fmt(adv+pf)}</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',background:'rgba(52,199,123,0.07)',padding:'9px 12px',borderRadius:10,marginTop:10,fontSize:12}}>
          <span style={{color:'var(--dim)'}}>🏛️ Pay at Hall</span>
          <span style={{color:'var(--green)',fontWeight:700}}>{fmt(booking.priceRaw*0.70)}</span>
        </div>
      </div>
      <GBtn onClick={onClose}>Close Invoice</GBtn>
    </Modal>
  );
}

/* ─── ROOT APP ───────────────────────────────────────────────── */
export default function App() {
  const [page,setPage]=useState('home');
  const [exploreFilters,setExploreFilters]=useState({});
  const [user,setUser]=useState(()=>sGet('vv_user',null));
  const [bookings,setBookings]=useState(()=>sGet('vv_bookings',[]));
  const [toastMsg,setToastMsg]=useState('');
  const [authOpen,setAuthOpen]=useState(false);
  const [venueSheet,setVenueSheet]=useState({open:false,id:null});
  const [bookSheet,setBookSheet]=useState({open:false,id:null});
  const [cancelState,setCancelState]=useState({open:false,idx:-1});
  const [invoiceState,setInvoiceState]=useState({open:false,idx:-1});

  const toast=useCallback(msg=>{setToastMsg(msg);setTimeout(()=>setToastMsg(''),2800);},[]);
  const login=useCallback(u=>{setUser(u);sSet('vv_user',u);toast(`Welcome, ${u.name.split(' ')[0]}! 🎉`);},[toast]);
  const logout=useCallback(()=>{if(!window.confirm('Sign out?'))return;setUser(null);sSet('vv_user',null);toast('Signed out.');},[toast]);

  useEffect(()=>{if(!user)setTimeout(()=>setAuthOpen(true),900);},[]);

  const goPage=(p,filters={})=>{
    setPage(p);
    if(p==='explore') setExploreFilters(filters);
  };

  const openVenue=id=>setVenueSheet({open:true,id});
  const openBook=id=>{
    if(!user){toast('Sign in to book');setAuthOpen(true);return;}
    setVenueSheet({open:false,id:null});
    setTimeout(()=>setBookSheet({open:true,id}),350);
  };
  const backToVenue=id=>{
    setBookSheet({open:false,id:null});
    setTimeout(()=>setVenueSheet({open:true,id}),350);
  };

  const handleSuccess=b=>{
    const nb=[b,...bookings];
    setBookings(nb);sSet('vv_bookings',nb);
    setBookSheet({open:false,id:null});
    toast(`🎉 Confirmed! Ref: ${b.id}`);
    setTimeout(()=>setPage('bookings'),600);
  };
  const handleCancel=i=>{
    const nb=[...bookings];nb[i].status='cancelled';
    const adv=nb[i].priceRaw*ADVANCE,pf=nb[i].priceRaw*PLATFORM;
    const pen=adv*0.05,ref=Math.max(0,adv-pen-pf);
    setBookings(nb);sSet('vv_bookings',nb);
    setCancelState({open:false,idx:-1});
    toast(`Cancelled. Refund ${fmt(ref)} in 5–7 days.`);
  };

  const activeB=bookings.filter(b=>b.status==='confirmed'||b.status==='pending').length;
  const ctx={user,login,logout,openAuth:()=>setAuthOpen(true),toast};

  return (
    <Ctx.Provider value={ctx}>
      <GS/>
      <div style={{minHeight:'100vh',paddingBottom:'calc(90px + var(--sb))'}}>
        {page==='home'     && <HomePage onOpenVenue={openVenue} onGoPage={goPage}/>}
        {page==='explore'  && <ExplorePage onOpenVenue={openVenue} onBack={()=>setPage('home')} initialFilters={exploreFilters}/>}
        {page==='bookings' && <BookingsPage bookings={bookings} onCancel={i=>setCancelState({open:true,idx:i})} onInvoice={i=>setInvoiceState({open:true,idx:i})} onGoExplore={()=>setPage('explore')}/>}
        {page==='profile'  && <ProfilePage bookings={bookings}/>}
      </div>
      {/* Dock */}
      <nav style={{
        position:'fixed',bottom:'calc(14px + var(--sb))',left:'50%',transform:'translateX(-50%)',
        width:'calc(100% - 32px)',maxWidth:420,height:68,
        background:'rgba(12,16,32,0.97)',backdropFilter:'blur(32px)',
        borderRadius:24,border:'1px solid var(--brd)',
        display:'flex',alignItems:'center',zIndex:1000,
        boxShadow:'0 8px 40px rgba(0,0,0,0.65),0 1px 0 rgba(255,255,255,0.04) inset',
        animation:'slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1)'
      }}>
        {[['home','fa-house-chimney','Home'],['explore','fa-compass','Explore'],['bookings','fa-calendar-check','Bookings'],['profile','fa-circle-user','Profile']].map(([p,ico,lbl])=>(
          <div key={p} className={`dock-i${page===p?' active':''}`} onClick={()=>setPage(p)} style={{
            flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4,
            cursor:'pointer',color:page===p?'var(--gold)':'var(--dim2)',padding:'10px 0',position:'relative'
          }}>
            <i className={`fa-solid ${ico} di`}/>
            <span style={{fontSize:10,fontWeight:700,letterSpacing:0.2}}>{lbl}</span>
            {p==='bookings'&&activeB>0&&(
              <div style={{position:'absolute',top:6,left:'50%',transform:'translateX(4px)',
                minWidth:16,height:16,background:'var(--red)',borderRadius:8,
                fontSize:9,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',
                color:'#fff',padding:'0 4px',border:'2px solid var(--bg)',animation:'spop 0.35s ease'
              }}>{activeB}</div>
            )}
          </div>
        ))}
      </nav>
      {/* Modals & Sheets */}
      <AuthModal open={authOpen} onClose={()=>setAuthOpen(false)}/>
      <VenueSheet venueId={venueSheet.id} open={venueSheet.open} onClose={()=>setVenueSheet({open:false,id:null})} onBook={openBook}/>
      <BookingSheet venueId={bookSheet.id} open={bookSheet.open} onClose={()=>setBookSheet({open:false,id:null})} onSuccess={handleSuccess} onBackToVenue={backToVenue}/>
      <CancelModal open={cancelState.open} booking={bookings[cancelState.idx]} onConfirm={()=>handleCancel(cancelState.idx)} onClose={()=>setCancelState({open:false,idx:-1})}/>
      <InvoiceModal open={invoiceState.open} booking={bookings[invoiceState.idx]} onClose={()=>setInvoiceState({open:false,idx:-1})}/>
      <Toast msg={toastMsg}/>
    </Ctx.Provider>
  );
}