<script>
 export let mode = 'rink';
 export let step = false;
 import { onDestroy } from 'svelte';
 const players = [{x:9,y:50,label:'G'},{x:26,y:30,label:'D'},{x:26,y:70,label:'D'},{x:53,y:25,label:'LW'},{x:58,y:50,label:'C'},{x:53,y:75,label:'RW'}];

 // Multi-step plays: each frame changes some pieces and holds for `hold` ms. Frames build on the one before.
 const build = frames => frames.reduce((out, f) => {
  const prev = out[out.length - 1] || {pieces:{}};
  const pieces = {...prev.pieces};
  for (const id in f.pieces) pieces[id] = {...pieces[id], ...f.pieces[id]};
  out.push({...prev, ...f, pieces});
  return out;
 }, []);
 const offsideStart = [
  {hold:900, arm:false, callout:null, pieces:{A:{x:76,y:32,label:'A'},B:{x:52,y:62,label:'B'},D1:{x:84,y:40,red:true},D2:{x:84,y:66,red:true},RG:{x:92,y:50,label:'G',red:true},puck:{x:55,y:62}}},
  {hold:1200, arm:true, callout:{text:'DELAYED OFFSIDE. ARM UP'}, pieces:{puck:{x:86,y:80},B:{x:60,y:62}}}
 ];
 const penaltyStart = [
  {hold:900, arm:false, callout:null, pieces:{N:{x:72,y:38,label:'A'},W:{x:72,y:72,label:'B'},R1:{x:80,y:30,red:true},R2:{x:84,y:62,red:true},RG:{x:92,y:50,label:'G',red:true},G:{x:9,y:50,label:'G'},S:{x:50,y:4,label:'6',hidden:true},puck:{x:75,y:40}}},
  {hold:1300, arm:true, callout:{text:'HOOKING. ARM UP, PLAY ON'}, pieces:{R1:{x:75,y:33},N:{x:75,y:45},puck:{x:79,y:47}}},
  {hold:1300, callout:{text:'GOALIE HEADS TO THE BENCH'}, pieces:{G:{x:44,y:4},N:{x:77,y:48}}},
  {hold:200, pieces:{G:{hidden:true},S:{hidden:false}}},
  {hold:1300, callout:{text:'EXTRA ATTACKER ON'}, pieces:{S:{x:70,y:26}}}
 ];
 const plays = {
  'delayed-offside': [
   build([...offsideStart,
    {hold:1300, pieces:{A:{x:62,y:30},D1:{x:84,y:66},D2:{x:78,y:76}}},
    {hold:1300, arm:false, callout:{text:'EVERYONE TAGGED UP. PLAY ON'}},
    {hold:1800, pieces:{A:{x:74,y:34},B:{x:70,y:58}}}]),
   build([...offsideStart,
    {hold:1300, pieces:{A:{x:83,y:74},D1:{x:82,y:56}}},
    {hold:2200, callout:{text:'ATTACKER TOUCHED IT. WHISTLE, OFFSIDE',bad:true}}])
  ],
  'delayed-penalty': [
   build([...penaltyStart,
    {hold:1100, pieces:{puck:{x:74,y:70}}},
    {hold:900, pieces:{R2:{x:78,y:67},puck:{x:76,y:68}}},
    {hold:2200, callout:{text:'THEY GAINED CONTROL. WHISTLE'}, pieces:{R2:{x:66,y:62},puck:{x:63,y:62}}}]),
   build([...penaltyStart,
    {hold:900, pieces:{puck:{x:72,y:29}}},
    {hold:2200, arm:false, callout:{text:'GOAL. THE MINOR IS WIPED OUT'}, pieces:{puck:{x:94.3,y:50},RG:{x:90,y:61}}}])
  ]
 };
 let frame = 0, timer;
 $: play = plays[mode] && plays[mode][step ? 1 : 0];
 $: run(play);
 function run(p) {
  clearTimeout(timer); frame = 0;
  if (!p) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { frame = p.length - 1; return; }
  const tick = () => { timer = setTimeout(() => { frame = (frame + 1) % p.length; tick(); }, p[frame].hold); };
  tick();
 }
 onDestroy(() => clearTimeout(timer));
 $: shown = play && play[frame];
</script>
<div class="rink-wrap">
 <div class="rink" class:zoned={mode === 'rink'} aria-label="Hockey rink diagram. Team attacks toward the right goal.">
  <svg class="rink-lines" viewBox="0 0 200 100" aria-hidden="true">
   <rect class="zone zone-def" x="0" y="0" width="66.2" height="100"/><rect class="zone zone-neutral" x="66.2" y="0" width="67.6" height="100"/><rect class="zone zone-att" x="133.8" y="0" width="66.2" height="100"/>
   {#each [13.2,186.8] as x}<line class="goal-line" x1={x} y1="0" x2={x} y2="100"/>{/each}
   {#each [66.2,133.8] as x}<line class="blue-line" x1={x} y1="0" x2={x} y2="100"/>{/each}
   <line class="center-line" x1="100" y1="0" x2="100" y2="100"/>
   <path class="crease" d="M13.2 44.1A5.9 5.9 0 0 1 13.2 55.9Z"/><path class="crease" d="M186.8 44.1A5.9 5.9 0 0 0 186.8 55.9Z"/>
   <rect class="net" x="10" y="46.8" width="3.2" height="6.4"/><rect class="net" x="186.8" y="46.8" width="3.2" height="6.4"/>
   <circle class="center-circle" cx="100" cy="50" r="14.8"/><circle class="center-dot" cx="100" cy="50" r="0.8"/>
   <path class="ref-crease" d="M90 100A10 10 0 0 1 110 100"/>
   {#each [71,129] as x}{#each [25,75] as y}<circle class="dot" cx={x} cy={y} r="1.3"/>{/each}{/each}
   {#each [36.6,163.4] as cx}{#each [25,75] as cy}
    <circle class="face-circle" {cx} {cy} r="14.8"/><circle class="dot" {cx} {cy} r="1.3"/>
    <path class="face-mark" d="M{cx-2.3} {cy-14.8}v-2.2M{cx+2.3} {cy-14.8}v-2.2M{cx-2.3} {cy+14.8}v2.2M{cx+2.3} {cy+14.8}v2.2
     M{cx-2.3} {cy-4}V{cy-1.2}H{cx-5.2}M{cx+2.3} {cy-4}V{cy-1.2}H{cx+5.2}M{cx-2.3} {cy+4}V{cy+1.2}H{cx-5.2}M{cx+2.3} {cy+4}V{cy+1.2}H{cx+5.2}"/>
   {/each}{/each}
  </svg>
  {#if mode === 'positions'}
   {#each players as p}<div class="player" style="--x:{p.x}%;--y:{p.y}%">{p.label}</div>{/each}
  {:else if mode === 'offside'}
   {#key step}
   <div class="player offside-player" class:offside={step} style="--x:{step ? 76 : 72}%;--y:39%">A</div>
   <div class="puck offside-puck" class:offside={step} style="--x:{step ? 72 : 76}%;--y:64%"></div>
   <div class="diagram-callout offside-callout" class:bad={step}>{step ? 'OFFSIDE. PLAYER WENT FIRST' : 'ONSIDE. PUCK WENT FIRST'}</div>
   {/key}
  {:else if shown}
   <div class="play" class:reset={frame === 0}>
    {#each Object.entries(shown.pieces) as [id, p] (id)}
     {#if id === 'puck'}<div class="puck" style="--x:{p.x}%;--y:{p.y}%"></div>
     {:else}<div class="player" class:opponent={p.red} class:gone={p.hidden} style="--x:{p.x}%;--y:{p.y}%">{p.label || '●'}</div>{/if}
    {/each}
    <div class="official" class:up={shown.arm} style={mode === 'delayed-offside' ? '--x:67%;--y:17%' : '--x:84%;--y:88%'}>
     <svg viewBox="0 0 24 40" aria-hidden="true">
      <line class="official-leg" x1="10" y1="26" x2="9" y2="38"/><line class="official-leg" x1="14" y1="26" x2="15" y2="38"/>
      <line class="official-limb" x1="7" y1="12" x2="4" y2="24"/>
      <rect class="official-shirt" x="6.5" y="10" width="11" height="17" rx="2"/>
      <path class="official-stripes" d="M9 10v17M12 10v17M15 10v17"/>
      <circle class="official-head" cx="12" cy="5.5" r="4"/>
      <g class="official-arm"><line class="official-limb" x1="17" y1="12" x2="20" y2="24"/>{#if mode === 'delayed-penalty'}<line class="official-band" x1="18.9" y1="19.5" x2="19.4" y2="21.5"/>{/if}</g>
     </svg>
     <span>{mode === 'delayed-offside' ? 'Linesman' : 'Referee'}</span>
    </div>
    {#if shown.callout}<div class="diagram-callout" class:bad={shown.callout.bad}>{shown.callout.text}</div>{/if}
   </div>
  {:else if mode === 'stayin'}
   <div class="player stayin-player" style="--x:78%;--y:36%">A</div>
   <div class="puck" style="--x:86%;--y:66%"></div>
   {#if step}<div class="diagram-callout">PLAY ON. PUCK NEVER LEFT</div>{/if}
  {:else if mode === 'icing'}
   <div class="player" style="--x:40%;--y:58%">A</div><div class="puck" style="--x:{step ? 96 : 44}%;--y:58%"></div>
   <div class="travel-arrow"></div>
   <div class="diagram-callout">{step ? 'ICING. FACE-OFF IN YOUR END' : 'SHOT FROM BEHIND CENTER'}</div>
  {:else if mode === 'powerplay' || mode === 'empty'}
   {#each [{x:70,y:25},{x:83,y:10},{x:70,y:75},{x:83,y:90},{x:89,y:38}] as p}<div class="player" style="--x:{p.x}%;--y:{p.y}%">●</div>{/each}
   {#each [{x:76,y:42},{x:76,y:58},{x:85,y:24},{x:85,y:76}] as p}<div class="player opponent" style="--x:{p.x}%;--y:{p.y}%">●</div>{/each}
   <div class="player opponent" style="--x:92%;--y:50%">G</div>
   {#if mode === 'empty'}<div class="player opponent" style="--x:90%;--y:63%">●</div><div class="player" style="--x:71%;--y:50%">6</div><div class="diagram-callout">EMPTY NET ←</div>{:else}<div class="player" style="--x:9%;--y:50%">G</div>{/if}
  {:else}
   <div class="zone-label zone-def" style="--x:18.3%">Defensive<br/>zone</div><div class="zone-label zone-neutral" style="--x:50%">Neutral<br/>zone</div><div class="zone-label zone-att" style="--x:81.7%">Attacking<br/>zone</div>
  {/if}
 </div>
 <p class="rink-caption">Your team attacks this way →</p>
</div>
