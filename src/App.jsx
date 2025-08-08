import React, { useMemo, useState, useEffect } from "react";
import { Play, Flag, Swords, Grid2X2, Type, Keyboard } from "lucide-react";

// --- Data
const POSES = [
  { key: "tadasana", sa: "Tāḍāsana", en: "Mountain Pose", literal: "tāḍa = mountain + āsana = seat/pose", mnemonic: "Stand tall like a mountain." },
  { key: "adho-mukha-svanasana", sa: "Adho Mukha Śvānāsana", en: "Downward-Facing Dog", literal: "adho = downward, mukha = face, śvāna = dog", mnemonic: "Dog stretching face down." },
  { key: "utkatasana", sa: "Utkatāsana", en: "Chair / Fierce", literal: "utkata = fierce + āsana", mnemonic: "Invisible chair." },
  { key: "virabhadrasana-i", sa: "Vīrabhadrāsana I", en: "Warrior I", literal: "Vīrabhadra = warrior", mnemonic: "Arms up, heroic." },
  { key: "virabhadrasana-ii", sa: "Vīrabhadrāsana II", en: "Warrior II", literal: "Vīrabhadra = warrior", mnemonic: "Gaze over front hand." },
  { key: "virabhadrasana-iii", sa: "Vīrabhadrāsana III", en: "Warrior III", literal: "Vīrabhadra = warrior", mnemonic: "Body like a T." },
  { key: "trikonasana", sa: "Trikoṇāsana", en: "Triangle", literal: "trikoṇa = triangle", mnemonic: "Long triangle shape." },
  { key: "ardha-chandrasana", sa: "Ardha Chandrāsana", en: "Half Moon", literal: "ardha = half, candra = moon", mnemonic: "Shine sideways." },
  { key: "bhujangasana", sa: "Bhujangāsana", en: "Cobra", literal: "bhujanga = cobra", mnemonic: "Lift chest like a hood." },
  { key: "chaturanga-dandasana", sa: "Caturaṅga Daṇḍāsana", en: "Four-Limbed Staff", literal: "caturaṅga = four-limbed, daṇḍa = staff", mnemonic: "Hover straight." },
  { key: "urdhva-mukha-svanasana", sa: "Ūrdhva Mukha Śvānāsana", en: "Upward-Facing Dog", literal: "ūrdhva = upward", mnemonic: "Lifted hips, open chest." },
  { key: "balasana", sa: "Bālāsana", en: "Child's Pose", literal: "bāla = child", mnemonic: "Curl and rest." },
  { key: "paschimottanasana", sa: "Paścimottānāsana", en: "Seated Forward Fold", literal: "paścima = back body, uttāna = intense stretch", mnemonic: "Long fold." },
  { key: "setu-bandhasana", sa: "Setu Bandhāsana", en: "Bridge", literal: "setu = bridge", mnemonic: "Lift to form a bridge." },
  { key: "savasana", sa: "Śavāsana", en: "Corpse", literal: "śava = corpse", mnemonic: "Total stillness." },
  { key: "vrksasana", sa: "Vṛkṣāsana", en: "Tree", literal: "vṛkṣa = tree", mnemonic: "Root down, branch up." },
  { key: "garudasana", sa: "Garudāsana", en: "Eagle", literal: "garuḍa = eagle", mnemonic: "Wrap like wings." },
  { key: "navasana", sa: "Nāvāsana", en: "Boat", literal: "nāva = boat", mnemonic: "V-boat balance." },
  { key: "marjaryasana", sa: "Mārjāryāsana", en: "Cat", literal: "mārjāra = cat", mnemonic: "Arch the spine." },
  { key: "bitilasana", sa: "Bitilāsana", en: "Cow", literal: "bitila = cow", mnemonic: "Belly soft, heart forward." },
  { key: "anjaneyasana", sa: "Añjaneyāsana", en: "Low Lunge", literal: "Añjaneya = Hanuman (child)", mnemonic: "Kneeling lunge." },
  { key: "parivrtta-trikonasana", sa: "Parivṛtta Trikoṇāsana", en: "Revolved Triangle", literal: "parivṛtta = revolved", mnemonic: "Triangle with a twist." }
];

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

function useWeights(keys) {
  const [weights, setWeights] = useState(() => Object.fromEntries(keys.map(k => [k, 1])));
  const bump = (key, ok) => setWeights(w => ({ ...w, [key]: Math.max(0.5, Math.min(10, (w[key] ?? 1) * (ok ? 0.9 : 1.35))) }));
  const pickWeighted = () => {
    const entries = Object.entries(weights);
    const total = entries.reduce((s, [,wt]) => s + wt, 0);
    let r = Math.random() * total;
    for (const [k, wt] of entries) { if ((r -= wt) <= 0) return k; }
    return entries[0][0];
  };
  return { bump, pickWeighted };
}

function Flashcards({ data, onResult, nextItemKey }) {
  const [flipped, setFlipped] = useState(false);
  const pose = data.find(p => p.key === nextItemKey) ?? data[0];
  useEffect(() => setFlipped(false), [pose.key]);
  return (
    <div className="grid gap-4">
      <div className="text-sm opacity-70">Flashcards. Tap to flip.</div>
      <div className="relative w-full h-56 md:h-64 rounded-2xl shadow-lg cursor-pointer bg-white dark:bg-zinc-900"
           onClick={() => setFlipped(f => !f)}
           style={{ transformStyle:"preserve-3d", transition:"transform .5s", transform:`rotateY(${flipped?180:0}deg)` }}>
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center" style={{ backfaceVisibility:"hidden" }}>
          <div><div className="text-2xl font-semibold">{pose.en}</div><div className="mt-2 text-sm opacity-70">Click to reveal Sanskrit</div></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center" style={{ backfaceVisibility:"hidden", transform:"rotateY(180deg)" }}>
          <div>
            <div className="text-2xl font-semibold">{pose.sa}</div>
            <div className="mt-2 text-sm opacity-80">{pose.literal}</div>
            <div className="mt-2 text-xs opacity-70">Mnemonic: {pose.mnemonic}</div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded-xl shadow bg-zinc-100 dark:bg-zinc-800" onClick={() => onResult(pose.key, false)}>Did not know</button>
        <button className="px-3 py-2 rounded-xl shadow bg-emerald-100 dark:bg-emerald-900" onClick={() => onResult(pose.key, true)}>Knew it</button>
      </div>
    </div>
  );
}

function MultipleChoice({ data, onResult, nextItemKey }) {
  const correct = data.find(p => p.key === nextItemKey) ?? data[0];
  const options = useMemo(() => shuffle([correct, ...shuffle(data.filter(p => p.key !== correct.key)).slice(0,3)]), [correct.key]);
  const [picked, setPicked] = useState(null);
  const choose = (opt) => { if (picked) return; const ok = opt.key === correct.key; setPicked(opt.key); onResult(correct.key, ok); };
  return (
    <div className="grid gap-3">
      <div className="text-sm opacity-70">Which Sanskrit is “{correct.en}”?</div>
      <div className="grid gap-2">
        {options.map(o => (
          <button key={o.key}
                  className={`px-3 py-2 rounded-xl shadow text-left ${picked ? (o.key === correct.key ? "bg-emerald-200 dark:bg-emerald-800" : o.key === picked ? "bg-rose-200 dark:bg-rose-900" : "bg-zinc-100 dark:bg-zinc-800") : "bg-zinc-100 dark:bg-zinc-800"}`}
                  onClick={() => choose(o)}>{o.sa}</button>
        ))}
      </div>
      <div className="text-xs opacity-70">Hint: {correct.literal}</div>
    </div>
  );
}

function DragMatch({ data, onResult, batch = 6 }) {
  const subset = React.useMemo(() => shuffle(data).slice(0, batch), [data, batch]);
  const [pairs]   = React.useState(() => shuffle(subset.map(p => p.key))); // Sanskrit chips
  const [targets] = React.useState(() => shuffle(subset.map(p => p.key))); // English drops
  const [done, setDone] = React.useState([]);
  const [selected, setSelected] = React.useState(null); // for tap-to-select on mobile

  const handleMatch = (srcKey, dstKey) => {
    const ok = srcKey === dstKey;
    if (ok) setDone(d => [...new Set([...d, srcKey])]);
    onResult(dstKey, ok);
    setSelected(null);
  };

  return (
    <div className="grid gap-3">
      <div className="text-sm opacity-70">
        Match English to Sanskrit. Drag on desktop, tap to select on mobile.
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Targets: English boxes */}
        <div className="grid gap-2">
          {targets.map(k => {
            const pose = data.find(p => p.key === k);
            const isDone = done.includes(k);
            return (
              <div key={k}
                   className={`p-3 rounded-xl border ${isDone ? "bg-emerald-50 dark:bg-emerald-900/40" : "bg-zinc-50 dark:bg-zinc-900"}`}
                   onDragOver={(e) => e.preventDefault()}
                   onDrop={(e) => {
                     const src = e.dataTransfer.getData("text/plain");
                     handleMatch(src, k);
                   }}
                   onClick={() => { if (selected) handleMatch(selected, k); }}>
                <div className="font-medium">{pose.en}</div>
                <div className="text-xs opacity-70">{pose.literal}</div>
                {isDone && <div className="text-sm mt-1">→ {pose.sa}</div>}
              </div>
            );
          })}
        </div>

        {/* Sources: Sanskrit chips */}
        <div className="grid gap-2">
          {pairs.map(k => {
            const pose = data.find(p => p.key === k);
            const isDone = done.includes(k);
            const isSel = selected === k;
            return (
              <div key={k}
                   draggable={!isDone}
                   onDragStart={(e) => e.dataTransfer.setData("text/plain", k)}
                   onClick={() => setSelected(isSel ? null : k)}
                   className={`p-3 rounded-xl shadow select-none ${isDone ? "opacity-40" : "cursor-pointer bg-white dark:bg-zinc-800"} ${isSel && !isDone ? "ring-2 ring-indigo-500" : ""}`}>
                {pose.sa}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TypeIt({ data, onResult, nextItemKey }) {
  const pose = data.find(p => p.key === nextItemKey) ?? data[0];
  const [val, setVal] = useState("");
  const [msg, setMsg] = useState(null);
  const norm = s => s.toLowerCase().replace(/[^a-z]/g, "");
  const submit = () => { const ok = norm(val) === norm(pose.sa); setMsg(ok ? "Correct!" : `Oops: ${pose.sa}`); onResult(pose.key, ok); };
  return (
    <div className="grid gap-3">
      <div className="text-sm opacity-70">Type the Sanskrit for “{pose.en}”. Accents optional.</div>
      <input className="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800" value={val} onChange={e=>setVal(e.target.value)} placeholder="e.g., Tadasana" onKeyDown={e=>e.key==='Enter'&&submit()} />
      <button className="px-3 py-2 rounded-xl shadow bg-indigo-100 dark:bg-indigo-900 w-fit" onClick={submit}>Check</button>
      {msg && <div className="text-sm">{msg}</div>}
      <div className="text-xs opacity-70">Hint: {pose.literal}. Mnemonic: {pose.mnemonic}</div>
    </div>
  );
}

function MemoryMatch({ data, onResult, pairs = 6 }) {
  const subset = useMemo(() => shuffle(data).slice(0,pairs), [data,pairs]);
  const cards = useMemo(() => shuffle(subset.flatMap(p => ([{ t:"en", k:p.key }, { t:"sa", k:p.key }]))), [subset]);
  const [open, setOpen] = useState([]);
  const [matched, setMatched] = useState([]);
  const click = (i) => {
    if (open.includes(i) || matched.includes(i)) return;
    const n = [...open, i];
    if (n.length === 2) {
      const a = cards[n[0]], b = cards[n[1]];
      const ok = a.k === b.k && a.t !== b.t;
      setTimeout(() => {
        if (ok) { setMatched(m => [...m, ...n]); onResult(a.k, true); }
        else { onResult(a.k, false); }
        setOpen([]);
      }, 650);
    } else setOpen(n);
  };
  return (
    <div className="grid gap-3">
      <div className="text-sm opacity-70">Memory. Match English and Sanskrit pairs.</div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {cards.map((c, idx) => {
          const pose = data.find(p => p.key === c.k);
          const show = open.includes(idx) || matched.includes(idx);
          return (
            <div key={idx} onClick={() => click(idx)}
                 className={`p-3 rounded-xl h-20 flex items-center justify-center shadow cursor-pointer ${show ? "bg-white dark:bg-zinc-800" : "bg-zinc-200 dark:bg-zinc-700"}`}>
              {show ? (c.t === "en" ? pose.en : pose.sa) : "?"}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MODES = [
  { id: "flash", label: "Flashcards", icon: Play },
  { id: "mc", label: "Multiple Choice", icon: Flag },
  { id: "drag", label: "Drag and Drop", icon: Swords },
  { id: "type", label: "Type-It", icon: Keyboard },
  { id: "memory", label: "Memory", icon: Grid2X2 },
];

export default function App() {
  const [mode, setMode] = useState("flash");
  const [filter, setFilter] = useState("");
  const [history, setHistory] = useState([]);
  const { bump, pickWeighted } = useWeights(POSES.map(p => p.key));
  const filtered = useMemo(() =>
    POSES.filter(p => p.sa.toLowerCase().includes(filter.toLowerCase()) || p.en.toLowerCase().includes(filter.toLowerCase()))
  , [filter]);

  const todayKey = useMemo(() => {
    const d = new Date();
    const idx = d.getFullYear()*372 + (d.getMonth()+1)*31 + d.getDate();
    return POSES[idx % POSES.length].key;
  }, []);

  const nextKey = useMemo(() => pickWeighted(), [history]);
  const onResult = (key, ok) => setHistory(h => (bump(key, ok), [...h, { key, ok, at: Date.now() }]));
  const correct = history.filter(h => h.ok).length;
  const total = history.length;
  const pct = total ? Math.round(correct/total*100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 text-zinc-900 dark:text-zinc-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto grid gap-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Sanskrit Yoga Pose Trainer</h1>
            <div className="text-sm opacity-70">Make Sanskrit stick with play.</div>
          </div>
          <div className="flex gap-2">
            {MODES.map(m => (
              <button key={m.id}
                className={`px-3 py-2 rounded-xl shadow flex items-center gap-2 ${mode===m.id?"bg-indigo-200 dark:bg-indigo-800":"bg-white dark:bg-zinc-800"}`}
                onClick={()=>setMode(m.id)}>
                <m.icon size={16}/>{m.label}
              </button>
            ))}
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl shadow bg-white dark:bg-zinc-900">
            <div className="text-xs uppercase tracking-wide opacity-60">Pose of the Day</div>
            <div className="mt-2 text-lg font-semibold">{POSES.find(p=>p.key===todayKey)?.sa}</div>
            <div className="text-sm opacity-80">{POSES.find(p=>p.key===todayKey)?.en}</div>
            <div className="text-xs opacity-70 mt-2">{POSES.find(p=>p.key===todayKey)?.literal}</div>
          </div>
          <div className="p-4 rounded-2xl shadow bg-white dark:bg-zinc-900">
            <div className="text-xs uppercase tracking-wide opacity-60">Session Stats</div>
            <div className="mt-2 text-sm">Correct: {correct}/{total} ({pct}%)</div>
            <div className="text-xs opacity-70 mt-2">Missed items appear more until you master them.</div>
          </div>
          <div className="p-4 rounded-2xl shadow bg-white dark:bg-zinc-900">
            <div className="text-xs uppercase tracking-wide opacity-60">Filter Poses</div>
            <input className="mt-2 w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800"
                   placeholder="Search English or Sanskrit"
                   value={filter} onChange={(e)=>setFilter(e.target.value)} />
          </div>
        </section>

        <main className="p-4 rounded-2xl shadow bg-white dark:bg-zinc-900">
          {mode === "flash" && <Flashcards data={filtered} onResult={onResult} nextItemKey={nextKey} />}
          {mode === "mc" && <MultipleChoice data={filtered} onResult={onResult} nextItemKey={nextKey} />}
          {mode === "drag" && <DragMatch data={filtered} onResult={onResult} />}
          {mode === "type" && <TypeIt data={filtered} onResult={onResult} nextItemKey={nextKey} />}
          {mode === "memory" && <MemoryMatch data={filtered} onResult={onResult} />}
        </main>
      </div>
    </div>
  );
}
