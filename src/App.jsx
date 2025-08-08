import React, { useMemo, useState, useEffect } from "react";
import { Play, Flag, Swords, Grid2X2, Keyboard } from "lucide-react";

/* ---------------- Data ---------------- */
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

/* --------------- Utils --------------- */
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
  const bump = (key, ok) =>
    setWeights(w => ({ ...w, [key]: Math.max(0.5, Math.min(10, (w[key] ?? 1) * (ok ? 0.9 : 1.35))) }));
  const pickWeighted = () => {
    const entries = Object.entries(weights);
    const total = entries.reduce((s, [, wt]) => s + wt, 0);
    let r = Math.random() * total;
    for (const [k, wt] of entries) { if ((r -= wt) <= 0) return k; }
    return entries[0][0];
  };
  return { bump, pickWeighted };
}

/* --------------- Games --------------- */
function Flashcards({ data, onResult, nextItemKey }) {
  const [flipped, setFlipped] = useState(false);
  const pose = data.find(p => p.key === nextItemKey) ?? data[0];
  useEffect(() => setFlipped(false), [pose.key]);
  return (
    <div className="grid gap-4">
      <div className="text-sm opacity-70">Flashcards. Tap to flip.</div>
      <div
        className="relative w-full h-56 md:h-64 rounded-2xl shadow-lg cursor-pointer bg-white dark:bg-zinc-900"
        onClick={() => setFlipped(f => !f)}
        style={{ transformStyle: "preserve-3d", transition: "transform .5s", transform: `rotateY(${flipped ? 180 : 0}deg)` }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center" style={{ backfaceVisibility: "hidden" }}>
          <div>
            <div className="text-2xl font-semibold">{pose.en}</div>
            <div className="mt-2 text-sm opacity-70">Click to reveal Sanskrit</div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center p-6 text-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
          <div>
            <div className="text-2xl font-semibold">{pose.sa}</div>
            <div className="mt-2 text-sm opacity-80">{pose.literal}</div>
            <div className="mt-2 text-xs opacity-70">Mnemonic: {pose.mnemonic}</div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded-xl


