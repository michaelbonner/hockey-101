<script>
 export let mode = 'rink';
 export let step = false;
 const players = [{x:9,y:50,label:'G'},{x:26,y:30,label:'D'},{x:26,y:70,label:'D'},{x:53,y:25,label:'LW'},{x:58,y:50,label:'C'},{x:53,y:75,label:'RW'}];
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
