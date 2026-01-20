import React, { useState, useEffect, useRef } from 'react';

// ========== CONFIG ==========
const CONFIG = {
  ROOM_SIZE: { min: 4, max: 8 },
  DEBATE_DURATION: 90,
  VOTE_DURATION: 30,
  TOTAL_ROUNDS: 5,
  ENTRY_FEE: 10,
  BASE_REWARD: 50,
  WIN_BONUS: 20,
  DEBATE_BONUS: 5,
};

// ========== STORY ARCS ==========
const STORY_ARCS = {
  fantasy: {
    name: 'Fantasy Quest',
    icon: '🏰',
    desc: 'Dragons, magic, ancient prophecies',
    opening: 'The ancient prophecy has come true—the Black Dragon awakens after a thousand years. The kingdom is in peril. The King summons heroes from across the realm to decide the fate of all...',
    rounds: [
      {
        context: 'The dragon threat is imminent. The kingdom must make its first crucial decision.',
        a: { text: 'Mobilize the army immediately and strike the dragon lair before it fully awakens.', tag: 'Aggressive', consequence: 'The army marches toward the lair, but encounters fierce resistance...' },
        b: { text: 'Send envoys to seek help from the Elven Kingdom—they sealed the dragon once before.', tag: 'Diplomatic', consequence: 'The envoys reach the elves, but they demand a steep price...' },
      },
      {
        contextA: 'Heavy losses sustained, but the army nears the lair. Scouts report: dragon eggs found inside.',
        contextB: 'The Elves demand the Sacred Sword as proof of trust, or they will not help.',
        a: { text: 'Destroy the eggs. End the dragon bloodline forever.', tag: 'Ruthless', consequenceFromA: 'The eggs are destroyed. The dragon flies into a rage...', consequenceFromB: 'Refusing the elves, humans destroy the eggs alone...' },
        b: { text: 'Preserve the eggs. Perhaps they can be used to negotiate.', tag: 'Merciful', consequenceFromA: 'The eggs are protected, but word leaks causing strife...', consequenceFromB: 'Trading the sword for elven aid while protecting eggs...' },
      },
      {
        contextAA: 'The enraged dragon unleashes devastating power. The army faces annihilation.',
        contextAB: 'Internal conflict weakens morale. Some want to surrender.',
        contextBA: 'Without elven magic, the human army struggles in combat.',
        contextBB: 'Elven forces arrive but threaten to leave upon learning of the eggs.',
        a: { text: 'Use forbidden magic. The caster sacrifices their life to wound the dragon.', tag: 'Sacrifice', consequence: 'The forbidden spell works. The dragon falls wounded, but at terrible cost...' },
        b: { text: 'Order a retreat. Preserve strength for a better opportunity.', tag: 'Strategic', consequence: 'The army retreats safely, but the dragon destroys several villages...' },
      },
      {
        contextA: 'The wounded dragon retreats to heal. Dark energy shrouds the region.',
        contextB: 'After retreat, the kingdom reflects. New voices emerge among the people.',
        a: { text: 'Launch a final assault while the dragon heals. End this now.', tag: 'Decisive', consequence: 'The final assault begins. This battle will determine the kingdoms fate...' },
        b: { text: 'Attempt to communicate with the wounded dragon. Seek peace.', tag: 'Peaceful', consequence: 'An envoy approaches the dragon. Surprisingly, it agrees to talk...' },
      },
      {
        contextA: 'In the final battle, both sides suffer greatly. Victory hangs in the balance.',
        contextB: 'The dragon reveals it awakened because of a greater threat—a demon god rises.',
        a: { text: 'Spare nothing to destroy the dragon, even if the kingdom burns.', tag: 'Total War', ending: 'The dragon falls, but so does most of the kingdom. Survivors begin rebuilding. History remembers this pyrrhic victory.' },
        b: { text: 'Forge an alliance with the dragon against future threats.', tag: 'Unity', ending: 'Humans and dragon forge an unprecedented pact against the coming darkness. A new era dawns.' },
      },
    ],
  },
  scifi: {
    name: 'Stellar Crisis',
    icon: '🚀',
    desc: 'Space survival, alien contact',
    opening: 'Year 2157. Mars Colony "New Hope" receives a mysterious deep space signal. Scientists decode it: Earth will be struck by an asteroid in 100 days. Resources can only save half the population...',
    rounds: [
      {
        context: 'Panic spreads after the announcement. Leadership must decide immediately.',
        a: { text: 'Launch "Ark Protocol"—use lottery to determine who boards escape ships.', tag: 'Fair', consequence: 'Lottery results announced. Those left behind begin protests...' },
        b: { text: 'Focus resources on analyzing the signal source. Perhaps salvation lies there.', tag: 'Hopeful', consequence: 'Research reveals the signal comes from an unknown civilization...' },
      },
      {
        contextA: 'Protests escalate into riots. Some occupy the ship launch facility.',
        contextB: 'The alien civilization invites humanity to a distant galaxy—500 year journey.',
        a: { text: 'Authorize security forces to use force. Ensure protocol proceeds.', tag: 'Order', consequenceFromA: 'Riots suppressed. Many die, survivors harbor resentment...', consequenceFromB: 'Abandoning alien contact, focusing on escape plans...' },
        b: { text: 'Negotiate with protesters. Modify the plan to save more.', tag: 'Humane', consequenceFromA: 'Engineers propose overloading ships—risky but saves more...', consequenceFromB: 'Sending advance team while others enter cryosleep...' },
      },
      {
        contextAA: 'Overloading reduces success from 95% to 60%, but saves 30% more people.',
        contextAB: 'Advance team loses contact. Resources last only 60 days.',
        contextBA: 'Extremists plot to sabotage the ships.',
        contextBB: 'Cryosleep technology has 30% failure rate.',
        a: { text: 'Accept overload plan. Trade success rate for more hope.', tag: 'Gamble', consequence: 'Overload plan initiated. Everyone prays for a miracle...' },
        b: { text: 'Maintain original plan. Ensure half definitely survive.', tag: 'Safe', consequence: 'Original plan proceeds, but social fractures cannot heal...' },
      },
      {
        contextA: 'Before launch, AI detects: the asteroids trajectory can be altered.',
        contextB: 'Advance team transmits: aliens can destroy asteroid, but humanity must disarm.',
        a: { text: 'Attempt to alter the asteroids path. Worth trying.', tag: 'Heroic', consequence: 'All colony energy focused on this audacious plan...' },
        b: { text: 'Proceed with evacuation. Dont risk everything.', tag: 'Cautious', consequence: 'Ships begin evacuation, but hope remains...' },
      },
      {
        contextA: 'Trajectory alteration used 80% energy. Asteroid shifted but not enough.',
        contextB: 'Alien technology works, but they demand all nuclear weapons destroyed.',
        a: { text: 'Go all in. Use remaining energy. All or nothing.', tag: 'Last Stand', ending: 'Miracle! The asteroid veers away. Humanity conquers fate through courage. This day is "New Hope Day."' },
        b: { text: 'Accept partial loss. Begin disaster recovery.', tag: 'Realistic', ending: 'The asteroid grazes Earth, causing severe damage. Survivors rebuild, knowing hope endures.' },
      },
    ],
  },
  mystery: {
    name: 'Murder Mystery',
    icon: '🔍',
    desc: 'Secrets, deduction, justice',
    opening: 'A stormy night. Wealthy Mr. Chen is poisoned in his locked study. Present: son Chen Ming, daughter Chen Yue, butler Zhang, maid Fang, and mysterious businessman Mr. Li. Everyone has secrets...',
    rounds: [
      {
        context: 'Police seal the mansion. As the detective, you must begin investigating.',
        a: { text: 'Search the victims study first. Look for physical evidence.', tag: 'Evidence', consequence: 'A half-burned letter found with words "betrayal" and "inheritance"...' },
        b: { text: 'Interview each person. Observe reactions and inconsistencies.', tag: 'Intuition', consequence: 'Butler Zhang appears nervous. Chen Yue mentions threats...' },
      },
      {
        contextA: 'The letter reveals Mr. Chen planned to change his will, disinheriting someone.',
        contextB: 'The threats came from a mysterious organization. Mr. Li seems connected.',
        a: { text: 'Investigate the inheritance issue. Follow the money.', tag: 'Financial', consequenceFromA: 'Chen Ming has gambling debts. Chen Yue funds a secret charity...', consequenceFromB: 'Mr. Chen transferred large assets, destination unknown...' },
        b: { text: 'Investigate Mr. Lis identity. His appearance is too convenient.', tag: 'Suspicious', consequenceFromA: 'Mr. Li is Mr. Chens illegitimate son...', consequenceFromB: 'Mr. Li brings a shocking secret...' },
      },
      {
        contextAA: 'Chen Ming has motive, but has alibi—maid Fang testifies.',
        contextAB: 'Asset destination is an overseas account with encrypted owner.',
        contextBA: 'The illegitimate son means inheritance redistribution—all have motive.',
        contextBB: 'Mr. Li reveals Mr. Chen was investigating a covered-up murder.',
        a: { text: 'Verify Fangs testimony. She could be accomplice.', tag: 'Thorough', consequence: 'Under pressure, Fang admits Chen Ming threatened her to lie...' },
        b: { text: 'Investigate the old case. Past secrets reveal present truth.', tag: 'Historical', consequence: 'Old case leads to a fire 20 years ago where first wife died...' },
      },
      {
        contextA: 'False testimony exposed. Chen Ming insists innocence, accuses Chen Yue.',
        contextB: 'The fire was arson. Mr. Chen may have known the true culprit.',
        a: { text: 'Cross-examine both. Find who is lying.', tag: 'Direct', consequence: 'Stunning: Chen Yue isnt Mr. Chens biological daughter...' },
        b: { text: 'Re-examine poison source. Murder weapon points to killer.', tag: 'Scientific', consequence: 'Poison from rare plant—one in butler Zhangs room...' },
      },
      {
        contextA: 'Chen Yue is daughter of someone who "died" 20 years ago, secretly adopted.',
        contextB: 'Evidence points to Zhang, but he has heart attack, leaving: "Truth under old tree..."',
        a: { text: 'Reveal all truth. Let law decide.', tag: 'Justice', ending: 'Truth: Zhang was lover of first wife. They planned the fire. When Chen discovered, Zhang killed him. Chen Yue forgives and uses inheritance for charity.' },
        b: { text: 'Give parties a choice. Some truths shouldnt be revealed.', tag: 'Mercy', ending: 'Zhangs crimes handled quietly. Chen Ming quits gambling, Chen Yue continues charity. Some truths buried, but living get fresh starts.' },
      },
    ],
  },
  political: {
    name: 'Court Intrigue',
    icon: '👑',
    desc: 'Power, succession, wisdom',
    opening: 'Great Qi Dynasty. The old Emperor passes. His will shocks: throne goes to "whoever best represents peoples will." Three princes compete. As Grand Chancellor, you must navigate...',
    rounds: [
      {
        context: 'Three princes: Crown Prince—kind but weak; Second—cunning but cruel; Third—young but reform-minded.',
        a: { text: 'Support Crown Prince per tradition. Uphold stability.', tag: 'Traditional', consequence: 'Crown Prince gains confidence, but Second Prince contacts military...' },
        b: { text: 'Propose all princes present plans. Let officials decide.', tag: 'Democratic', consequence: 'Reformers cheer, conservatives oppose...' },
      },
      {
        contextA: 'Second Prince allies with generals, plots to "cleanse the court."',
        contextB: 'Before council, Third Prince accused of treason via foreign correspondence.',
        a: { text: 'Mobilize Imperial Guard. Divide Second Princes alliance.', tag: 'Cunning', consequenceFromA: 'Scheme delays Second Prince, but he suspects betrayal...', consequenceFromB: 'Investigation suggests letter may be forged...' },
        b: { text: 'Negotiate with Second Prince. Seek peace.', tag: 'Peaceful', consequenceFromA: 'Second offers terms: throne but spare brothers...', consequenceFromB: 'You investigate the forgery yourself...' },
      },
      {
        contextAA: 'Second Princes ally turned, but demands Prime Minister position.',
        contextAB: 'Letter forged by Empress Dowagers faction to enthrone her nephew.',
        contextBA: 'Second Princes terms unacceptable, but he has armies. Refusal risks war.',
        contextBB: 'Empress Dowager demands "regency" as late Emperors widow.',
        a: { text: 'Accept terms. Lesser evil. Stabilize first.', tag: 'Pragmatic', consequence: 'Situation stable, but you know storms ahead...' },
        b: { text: 'Expose Empress Dowager. Unite princes against interference.', tag: 'Righteous', consequence: 'Three princes stand together for first time...' },
      },
      {
        contextA: 'Powers balanced, succession unresolved. Then: northern nomads at border.',
        contextB: 'Empress confined. Another will found from late Emperor...',
        a: { text: 'Propose princes campaign north. Victor becomes Emperor.', tag: 'Meritocratic', consequence: 'Three princes march north. War determines future...' },
        b: { text: 'Select Emperor first. Nation needs ruler.', tag: 'Orderly', consequence: 'Decisive court session begins...' },
      },
      {
        contextA: 'Northern campaign: Crown Prince wins hearts, Second fights bravely, Third manages logistics. All have merit.',
        contextB: 'True will: throne to "whoever makes three sons coexist peacefully." That person is you.',
        a: { text: 'Propose shared rule—"Three Kings Council."', tag: 'Innovative', ending: 'Great Qi enters "Three Kings Era." Crown handles domestic, Second commands military, Third leads reform. Despite disputes, system works under your mediation.' },
        b: { text: 'Rank by military merit. Greatest contributor takes throne.', tag: 'Fair', ending: 'Second Prince claims throne by merit. He brings renaissance—defeats nomads, reforms governance. When you retire, new Emperor escorts you, saying: "Without you, no Great Qi today."' },
      },
    ],
  },
};

// ========== AI PLAYERS ==========
const AI_PLAYERS = [
  { id: 'ai_1', name: 'Sage Iris', avatar: '🧙‍♀️', style: 'analytical' },
  { id: 'ai_2', name: 'Knight Kane', avatar: '⚔️', style: 'bold' },
  { id: 'ai_3', name: 'Scholar Noah', avatar: '📚', style: 'cautious' },
  { id: 'ai_4', name: 'Merchant Marco', avatar: '💰', style: 'pragmatic' },
  { id: 'ai_5', name: 'Poet Luna', avatar: '🎭', style: 'romantic' },
];

const generateAIDebate = (style) => {
  const debates = {
    analytical: { A: ['Logically, A has higher success rate.', 'Data favors decisive action. A.'], B: ['Analysis shows B offers better long-term value.', 'B is more prudent overall.'] },
    bold: { A: ['Fortune favors the bold! A!', 'Strike now! A!'], B: ['True courage means B!', 'B takes real bravery!'] },
    cautious: { A: ['Though risky, A may be necessary.', 'Lesser evil. Support A.'], B: ['For safety, B is wiser.', 'Steady progress—B.'] },
    pragmatic: { A: ['ROI favors A.', 'A pays more.'], B: ['B has controlled risk.', 'B is sensible.'] },
    romantic: { A: ['A has tragic beauty.', 'Let A be legend.'], B: ['B represents hope.', 'B is most moving.'] },
  };
  const choice = Math.random() > 0.5 ? 'A' : 'B';
  const opts = debates[style]?.[choice] || debates.analytical[choice];
  return { text: opts[Math.floor(Math.random() * opts.length)], choice };
};

// ========== STORAGE ==========
const load = (k, d) => { try { const s = localStorage.getItem(k); return s ? JSON.parse(s) : d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ========== MAIN COMPONENT ==========
export default function ConsensusChronicle() {
  const [view, setView] = useState('home');
  const [player, setPlayer] = useState(() => load('cc_player', { id: `p_${Date.now()}`, name: '', avatar: '🎮', tokens: 100, totalEarned: 0 }));
  const [room, setRoom] = useState(null);
  const [players, setPlayers] = useState([]);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState('waiting');
  const [timer, setTimer] = useState(0);
  const [story, setStory] = useState([]);
  const [storyPath, setStoryPath] = useState([]);
  const [currentOptions, setCurrentOptions] = useState({ a: null, b: null });
  const [votes, setVotes] = useState({});
  const [myVote, setMyVote] = useState(null);
  const [scores, setScores] = useState({});
  const [messages, setMessages] = useState([]);
  const [debateInput, setDebateInput] = useState('');
  const [gameEnded, setGameEnded] = useState(false);
  const [gameHistory, setGameHistory] = useState(() => load('cc_history', []));
  const [leaderboard, setLeaderboard] = useState(() => load('cc_leaderboard', []));
  
  const timerRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => { save('cc_player', player); }, [player]);
  useEffect(() => { chatRef.current?.scrollTo(0, chatRef.current.scrollHeight); }, [messages]);

  const fmt = s => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  const msg = (t, type='system', sender=null, choice=null) => setMessages(p => [...p.slice(-40), { id: Date.now(), type, text: t, sender, choice }]);

  const getRound = (r, path) => {
    const arc = STORY_ARCS[room?.theme];
    const rd = arc?.rounds[r - 1];
    if (!rd) return null;
    let ctx = rd.context;
    if (r > 1 && path.length) {
      const k = path.slice(-2).join('');
      ctx = rd[`context${k}`] || rd[`context${path[path.length-1]}`] || rd.context;
    }
    return { ...rd, context: ctx };
  };

  const getResult = (r, choice, path) => {
    const rd = STORY_ARCS[room?.theme]?.rounds[r - 1];
    if (!rd) return '';
    const opt = choice === 'A' ? rd.a : rd.b;
    if (path.length) { const k = `consequenceFrom${path[path.length-1]}`; if (opt[k]) return opt[k]; }
    return r === CONFIG.TOTAL_ROUNDS && opt.ending ? opt.ending : (opt.consequence || '');
  };

  const createRoom = (theme) => {
    if (player.tokens < CONFIG.ENTRY_FEE) { alert(`Need ${CONFIG.ENTRY_FEE} GLT to play!`); return; }
    setPlayer(p => ({ ...p, tokens: p.tokens - CONFIG.ENTRY_FEE }));
    setRoom({ id: `room_${Date.now()}`, theme, host: player.id });
    setPlayers([player]);
    setView('room');
    setStory([]); setStoryPath([]); setGameEnded(false); setMessages([]);
    msg(`Room created. -${CONFIG.ENTRY_FEE} GLT deducted.`);
    const ais = [...AI_PLAYERS].sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 2));
    ais.forEach((ai, i) => setTimeout(() => {
      setPlayers(p => p.length < CONFIG.ROOM_SIZE.max ? [...p, { ...ai, isAI: true }] : p);
      msg(`${ai.avatar} ${ai.name} joined`);
    }, 600 * (i + 1)));
  };

  const startGame = () => {
    if (players.length < CONFIG.ROOM_SIZE.min) { msg(`Need ${CONFIG.ROOM_SIZE.min}+ players!`); return; }
    setView('game'); setGameEnded(false);
    const init = {}; players.forEach(p => init[p.id] = { influence: 0, debates: 0, wins: 0 });
    setScores(init);
    const arc = STORY_ARCS[room.theme];
    setStory([{ text: arc.opening, type: 'opening' }]); setStoryPath([]);
    msg(`📖 ${arc.name} begins!`);
    setTimeout(() => startRound(1, []), 2000);
  };

  const startRound = (r, path) => {
    if (r > CONFIG.TOTAL_ROUNDS || gameEnded) return;
    setRound(r); setPhase('debate'); setVotes({}); setMyVote(null); setDebateInput('');
    const rd = getRound(r, path);
    if (!rd) { endGame(path); return; }
    setStory(p => [...p, { text: rd.context, type: 'context', round: r }]);
    setCurrentOptions({ a: rd.a, b: rd.b });
    msg(`Round ${r}/${CONFIG.TOTAL_ROUNDS} - Debate`);
    setTimer(CONFIG.DEBATE_DURATION);
    runTimer(CONFIG.DEBATE_DURATION, () => startVote(r, path));
    players.filter(p => p.isAI).forEach((ai, i) => setTimeout(() => {
      const d = generateAIDebate(ai.style);
      msg(d.text, 'chat', ai, d.choice);
    }, 2000 * (i + 1) + Math.random() * 3000));
  };

  const startVote = (r, path) => {
    setPhase('vote'); setTimer(CONFIG.VOTE_DURATION);
    msg('🗳️ Vote now!');
    players.filter(p => p.isAI).forEach((ai, i) => setTimeout(() => {
      setVotes(v => ({ ...v, [ai.id]: Math.random() > 0.5 ? 'A' : 'B' }));
    }, 1000 * (i + 1)));
    runTimer(CONFIG.VOTE_DURATION, () => calcResult(r, path));
  };

  const runTimer = (dur, cb) => {
    if (timerRef.current) clearInterval(timerRef.current);
    let t = dur; setTimer(t);
    timerRef.current = setInterval(() => {
      t--; setTimer(t);
      if (t <= 0) { clearInterval(timerRef.current); timerRef.current = null; cb(); }
    }, 1000);
  };

  const submitDebate = () => {
    if (!debateInput.trim() || phase !== 'debate') return;
    const c = debateInput.toUpperCase().includes(' A') ? 'A' : debateInput.toUpperCase().includes(' B') ? 'B' : null;
    msg(debateInput, 'chat', player, c);
    setDebateInput('');
    setScores(s => ({ ...s, [player.id]: { ...s[player.id], debates: (s[player.id]?.debates || 0) + CONFIG.DEBATE_BONUS } }));
  };

  const submitVote = (c) => {
    if (phase !== 'vote' || myVote) return;
    setMyVote(c); setVotes(v => ({ ...v, [player.id]: c }));
    msg(`Voted ${c}`);
  };

  const calcResult = (r, path) => {
    setPhase('result');
    const cnt = { A: 0, B: 0 };
    Object.values(votes).forEach(v => { if (v) cnt[v]++; });
    const winner = cnt.A + cnt.B === 0 ? (Math.random() > 0.5 ? 'A' : 'B') : (cnt.A >= cnt.B ? 'A' : 'B');
    const ns = { ...scores };
    Object.entries(votes).forEach(([id, v]) => { if (v === winner && ns[id]) { ns[id].influence += CONFIG.WIN_BONUS; ns[id].wins++; } });
    setScores(ns);
    const np = [...path, winner]; setStoryPath(np);
    const opt = winner === 'A' ? currentOptions.a : currentOptions.b;
    const res = getResult(r, winner, path);
    setStory(p => [...p, { text: `[${opt?.tag}] ${opt?.text}`, type: 'choice', winner }, { text: res, type: 'result' }]);
    msg(`📜 ${winner} wins! (${cnt[winner]} vs ${cnt[winner === 'A' ? 'B' : 'A']})`);
    if (r >= CONFIG.TOTAL_ROUNDS) setTimeout(() => endGame(np), 2500);
    else setTimeout(() => startRound(r + 1, np), 3000);
  };

  const endGame = (fp) => {
    if (gameEnded) return;
    setGameEnded(true); setPhase('ended');
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    const ps = scores[player.id] || { influence: 0, debates: 0 };
    const pts = ps.influence + ps.debates;
    const reward = CONFIG.BASE_REWARD + Math.floor(pts / 2);
    setPlayer(p => ({ ...p, tokens: p.tokens + reward, totalEarned: p.totalEarned + reward }));
    const rec = { id: Date.now(), theme: room.theme, name: STORY_ARCS[room.theme].name, date: new Date().toISOString(), score: pts, reward, fee: CONFIG.ENTRY_FEE, net: reward - CONFIG.ENTRY_FEE };
    const nh = [rec, ...gameHistory].slice(0, 30);
    setGameHistory(nh); save('cc_history', nh);
    const lb = [...leaderboard, { id: Date.now(), name: player.name, avatar: player.avatar, score: pts, theme: room.theme }].sort((a, b) => b.score - a.score).slice(0, 15);
    setLeaderboard(lb); save('cc_leaderboard', lb);
    msg(`🏆 Complete! +${reward} GLT`);
  };

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setView('home'); setRoom(null); setPlayers([]); setStory([]); setRound(0); setPhase('waiting'); setMessages([]); setVotes({}); setMyVote(null); setGameEnded(false);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  // ===== STYLES =====
  const bg = { minHeight: '100vh', background: '#0b0b0f', fontFamily: 'system-ui', color: '#d0d0d0' };
  const header = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', borderBottom: '1px solid #1a1a1f' };
  const card = { background: '#111116', borderRadius: '8px', border: '1px solid #1a1a1f' };

  // ===== HOME =====
  if (view === 'home') {
    return (
      <div style={bg}>
        <div style={header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📜</span>
            <span style={{ fontWeight: 600, color: '#fff' }}>Consensus Chronicle</span>
          </div>
          {player.name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => setView('history')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>History</button>
              <span style={{ padding: '0.4rem 0.8rem', background: '#1a1a1f', borderRadius: '16px', color: '#f59e0b', fontWeight: 600 }}>{player.tokens} GLT</span>
              <span>{player.avatar} {player.name}</span>
            </div>
          )}
        </div>
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem 1rem' }}>
          {!player.name ? (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📜</div>
              <h1 style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem' }}>Consensus Chronicle</h1>
              <p style={{ color: '#555', marginBottom: '2rem' }}>Shape history through collective decisions</p>
              <input
                type="text"
                placeholder="Enter your name..."
                style={{ width: '100%', maxWidth: '280px', padding: '0.75rem 1rem', background: '#111116', border: '1px solid #222', borderRadius: '6px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                onKeyDown={e => e.key === 'Enter' && e.target.value.trim() && setPlayer(p => ({ ...p, name: e.target.value.trim() }))}
              />
              <p style={{ color: '#444', fontSize: '0.8rem', marginTop: '0.5rem' }}>Press Enter</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1rem', color: '#888', marginBottom: '0.75rem' }}>Select Theme · {CONFIG.ENTRY_FEE} GLT per game</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {Object.entries(STORY_ARCS).map(([k, arc]) => (
                    <button
                      key={k}
                      onClick={() => createRoom(k)}
                      disabled={player.tokens < CONFIG.ENTRY_FEE}
                      style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', ...card, cursor: player.tokens >= CONFIG.ENTRY_FEE ? 'pointer' : 'not-allowed', opacity: player.tokens >= CONFIG.ENTRY_FEE ? 1 : 0.5, textAlign: 'left' }}
                    >
                      <span style={{ fontSize: '2rem' }}>{arc.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, color: '#fff' }}>{arc.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#555' }}>{arc.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h2 style={{ fontSize: '1rem', color: '#888', marginBottom: '0.75rem' }}>🏆 Leaderboard</h2>
                <div style={card}>
                  {leaderboard.length === 0 ? (
                    <p style={{ padding: '1.5rem', textAlign: 'center', color: '#444' }}>No records yet</p>
                  ) : (
                    leaderboard.slice(0, 5).map((e, i) => (
                      <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderBottom: i < 4 ? '1px solid #1a1a1f' : 'none' }}>
                        <span style={{ width: '1.5rem', fontWeight: 700, color: i < 3 ? '#f59e0b' : '#444' }}>#{i + 1}</span>
                        <span>{e.avatar}</span>
                        <span style={{ flex: 1, color: '#fff' }}>{e.name}</span>
                        <span style={{ color: '#a78bfa', fontWeight: 600 }}>{e.score} pts</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ===== HISTORY =====
  if (view === 'history') {
    return (
      <div style={bg}>
        <div style={header}>
          <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>← Back</button>
          <span style={{ fontWeight: 600, color: '#fff' }}>History & Rewards</span>
          <div />
        </div>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1.5rem 1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ ...card, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f59e0b' }}>{player.tokens}</div>
              <div style={{ fontSize: '0.75rem', color: '#555' }}>Balance (GLT)</div>
            </div>
            <div style={{ ...card, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4ade80' }}>{player.totalEarned}</div>
              <div style={{ fontSize: '0.75rem', color: '#555' }}>Total Earned</div>
            </div>
            <div style={{ ...card, padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#a78bfa' }}>{gameHistory.length}</div>
              <div style={{ fontSize: '0.75rem', color: '#555' }}>Games</div>
            </div>
          </div>
          <h3 style={{ fontSize: '0.9rem', color: '#888', marginBottom: '0.75rem' }}>Game Records</h3>
          <div style={card}>
            {gameHistory.length === 0 ? (
              <p style={{ padding: '1.5rem', textAlign: 'center', color: '#444' }}>No games yet</p>
            ) : (
              gameHistory.slice(0, 10).map((r, i) => (
                <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderBottom: i < gameHistory.length - 1 ? '1px solid #1a1a1f' : 'none' }}>
                  <span style={{ fontSize: '1.5rem' }}>{STORY_ARCS[r.theme]?.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: '#fff', fontSize: '0.9rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#555' }}>{new Date(r.date).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', color: '#a78bfa' }}>{r.score} pts</div>
                    <div style={{ fontSize: '0.85rem', color: '#4ade80', fontWeight: 600 }}>+{r.reward} GLT</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===== ROOM =====
  if (view === 'room') {
    return (
      <div style={bg}>
        <div style={header}>
          <button onClick={reset} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>← Leave</button>
          <span style={{ fontWeight: 600, color: '#fff' }}>{STORY_ARCS[room?.theme]?.icon} {STORY_ARCS[room?.theme]?.name}</span>
          <span style={{ fontSize: '0.75rem', color: '#444', fontFamily: 'monospace' }}>{room?.id?.slice(-6)}</span>
        </div>
        <div style={{ maxWidth: '500px', margin: '0 auto', padding: '1.5rem 1rem' }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>Players ({players.length}/{CONFIG.ROOM_SIZE.max})</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {players.map(p => (
              <div key={p.id} style={{ ...card, padding: '0.75rem', textAlign: 'center', borderColor: p.id === player.id ? '#a78bfa' : '#1a1a1f' }}>
                <div style={{ fontSize: '1.5rem' }}>{p.avatar}</div>
                <div style={{ fontSize: '0.75rem', color: '#fff' }}>{p.name}</div>
                {p.isAI && <div style={{ fontSize: '0.6rem', color: '#3b82f6' }}>AI</div>}
              </div>
            ))}
            {Array(CONFIG.ROOM_SIZE.max - players.length).fill(0).map((_, i) => (
              <div key={i} style={{ ...card, padding: '0.75rem', textAlign: 'center', opacity: 0.3, borderStyle: 'dashed' }}>
                <div style={{ fontSize: '1.5rem' }}>?</div>
                <div style={{ fontSize: '0.75rem' }}>...</div>
              </div>
            ))}
          </div>
          {player.id === room?.host && (
            <button
              onClick={startGame}
              disabled={players.length < CONFIG.ROOM_SIZE.min}
              style={{ width: '100%', padding: '0.875rem', fontWeight: 600, border: 'none', borderRadius: '6px', cursor: players.length >= CONFIG.ROOM_SIZE.min ? 'pointer' : 'not-allowed', background: players.length >= CONFIG.ROOM_SIZE.min ? '#a78bfa' : '#222', color: players.length >= CONFIG.ROOM_SIZE.min ? '#fff' : '#555' }}
            >
              {players.length >= CONFIG.ROOM_SIZE.min ? 'Start Game' : `Need ${CONFIG.ROOM_SIZE.min}+ players`}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ===== GAME =====
  return (
    <div style={{ height: '100vh', background: '#0b0b0f', fontFamily: 'system-ui', color: '#d0d0d0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 1rem', background: '#08080a', borderBottom: '1px solid #151518', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: '#555' }}>Round {round}/{CONFIG.TOTAL_ROUNDS}</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
            {phase === 'debate' && '💬 Debate'}{phase === 'vote' && '🗳️ Vote'}{phase === 'result' && '⏳ Result'}{phase === 'ended' && '🏆 Done'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[1,2,3,4,5].map(n => <div key={n} style={{ width: '8px', height: '8px', borderRadius: '50%', background: n < round ? '#4ade80' : n === round ? '#a78bfa' : '#222' }} />)}
        </div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'monospace', color: timer <= 10 && phase !== 'ended' && phase !== 'result' ? '#ef4444' : '#a78bfa' }}>
          {phase === 'ended' || phase === 'result' ? '--' : fmt(timer)}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.65rem', color: '#555' }}>Score</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f59e0b' }}>{(scores[player.id]?.influence || 0) + (scores[player.id]?.debates || 0)}</div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0.75rem', gap: '0.75rem', overflow: 'hidden' }}>
          {/* Story - Fixed */}
          <div style={{ ...card, padding: '0.75rem', flexShrink: 0 }}>
            <div style={{ fontSize: '0.7rem', color: '#555', marginBottom: '0.5rem' }}>{STORY_ARCS[room?.theme]?.icon} {STORY_ARCS[room?.theme]?.name}</div>
            {story.slice(-2).map((s, i) => (
              <p key={i} style={{ fontSize: '0.85rem', lineHeight: 1.6, color: s.type === 'opening' || s.type === 'context' ? '#c4b5fd' : s.type === 'choice' ? '#4ade80' : '#888', margin: '0.25rem 0' }}>
                {s.winner && <span style={{ marginRight: '0.25rem' }}>{s.winner === 'A' ? '🅰️' : '🅱️'}</span>}
                {s.text?.slice(0, 200)}{s.text?.length > 200 ? '...' : ''}
              </p>
            ))}
          </div>

          {/* Options - Fixed */}
          {(phase === 'debate' || phase === 'vote') && currentOptions.a && (
            <div style={{ ...card, padding: '0.75rem', flexShrink: 0 }}>
              <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.75rem', textAlign: 'center' }}>What should we do?</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[{ k: 'A', o: currentOptions.a, c: '#ef4444' }, { k: 'B', o: currentOptions.b, c: '#3b82f6' }].map(({ k, o, c }) => (
                  <div
                    key={k}
                    onClick={() => phase === 'vote' && submitVote(k)}
                    style={{ padding: '0.75rem', borderRadius: '6px', border: `2px solid ${myVote === k ? c : c + '30'}`, background: c + '10', cursor: phase === 'vote' ? 'pointer' : 'default' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, color: c }}>{k}</span>
                      <span style={{ fontSize: '0.65rem', color: '#666', background: '#1a1a1f', padding: '0.15rem 0.4rem', borderRadius: '3px' }}>{o?.tag}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', lineHeight: 1.5, color: '#aaa' }}>{o?.text}</p>
                    {phase === 'vote' && <div style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '1rem', fontWeight: 600, color: '#f59e0b' }}>{Object.values(votes).filter(v => v === k).length}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* End */}
          {phase === 'ended' && (
            <div style={{ ...card, padding: '1.5rem', textAlign: 'center', flex: 1 }}>
              <h2 style={{ color: '#f59e0b', marginBottom: '1rem' }}>🏆 Chronicle Complete!</h2>
              {Object.entries(scores).map(([id, s]) => ({ p: players.find(x => x.id === id), t: s.influence + s.debates })).sort((a, b) => b.t - a.t).slice(0, 4).map((r, i) => (
                <div key={r.p?.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', marginBottom: '0.25rem', background: i === 0 ? '#1a1a1f' : 'transparent', borderRadius: '4px' }}>
                  <span style={{ width: '1.25rem', fontWeight: 700, color: i < 3 ? '#f59e0b' : '#444' }}>#{i + 1}</span>
                  <span>{r.p?.avatar}</span>
                  <span style={{ flex: 1, color: '#fff' }}>{r.p?.name}</span>
                  <span style={{ color: '#a78bfa', fontWeight: 600 }}>{r.t}</span>
                </div>
              ))}
              <div style={{ margin: '1rem 0', padding: '0.75rem', background: '#0a1a0a', borderRadius: '6px', border: '1px solid #1a3a1a' }}>
                <div style={{ fontSize: '0.75rem', color: '#555' }}>Your Reward</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#4ade80' }}>+{CONFIG.BASE_REWARD + Math.floor(((scores[player.id]?.influence || 0) + (scores[player.id]?.debates || 0)) / 2)} GLT</div>
              </div>
              <button onClick={reset} style={{ padding: '0.6rem 1.5rem', background: '#a78bfa', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Return</button>
            </div>
          )}
        </div>

        {/* Right - Chat SCROLLABLE */}
        <div style={{ width: '260px', display: 'flex', flexDirection: 'column', background: '#08080a', borderLeft: '1px solid #151518', flexShrink: 0 }}>
          {/* Players - Fixed */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', padding: '0.5rem', borderBottom: '1px solid #151518', flexShrink: 0 }}>
            {players.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', padding: '0.2rem 0.4rem', background: votes[p.id] ? '#0a1a0a' : '#111', borderRadius: '10px', fontSize: '0.7rem' }}>
                <span>{p.avatar}</span>
                <span style={{ maxWidth: '40px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                {votes[p.id] && <span style={{ color: '#4ade80', fontWeight: 700 }}>{votes[p.id]}</span>}
              </div>
            ))}
          </div>
          
          {/* Messages - SCROLLABLE */}
          <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
            {messages.map(m => (
              <div key={m.id} style={{ marginBottom: '0.4rem', fontSize: '0.75rem' }}>
                {m.type === 'system' ? (
                  <div style={{ color: '#a78bfa', fontStyle: 'italic' }}>{m.text}</div>
                ) : (
                  <div style={{ background: '#111116', borderRadius: '4px', padding: '0.35rem 0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <span style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.7rem' }}>{m.sender?.avatar} {m.sender?.name}</span>
                      {m.choice && <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.25rem', background: m.choice === 'A' ? '#ef444430' : '#3b82f630', borderRadius: '2px', color: m.choice === 'A' ? '#ef4444' : '#3b82f6' }}>{m.choice}</span>}
                    </div>
                    <div style={{ color: '#bbb' }}>{m.text}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Input - Fixed */}
          {phase === 'debate' && (
            <div style={{ padding: '0.5rem', borderTop: '1px solid #151518', flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '0.3rem' }}>
                <input
                  type="text"
                  value={debateInput}
                  onChange={e => setDebateInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitDebate()}
                  placeholder="Your argument..."
                  style={{ flex: 1, padding: '0.4rem', background: '#111', border: '1px solid #222', borderRadius: '4px', color: '#fff', fontSize: '0.75rem', outline: 'none' }}
                />
                <button onClick={submitDebate} style={{ padding: '0.4rem 0.6rem', background: '#a78bfa', border: 'none', borderRadius: '4px', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.7rem' }}>Send</button>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button onClick={() => setDebateInput('I support A because ')} style={{ padding: '0.2rem 0.4rem', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '8px', color: '#ef4444', fontSize: '0.65rem', cursor: 'pointer' }}>A</button>
                <button onClick={() => setDebateInput('I support B because ')} style={{ padding: '0.2rem 0.4rem', background: '#3b82f620', border: '1px solid #3b82f640', borderRadius: '8px', color: '#3b82f6', fontSize: '0.65rem', cursor: 'pointer' }}>B</button>
              </div>
            </div>
          )}
          
          {phase === 'vote' && !myVote && (
            <div style={{ padding: '0.5rem', textAlign: 'center', background: '#1a1a2f', flexShrink: 0 }}>
              <p style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.8rem' }}>⏰ Vote now!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
