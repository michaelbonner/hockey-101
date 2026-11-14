<script>
 export let mode = 'rink';
 export let step = false;
 const players = [{x:18,y:50,label:'G'},{x:31,y:30,label:'D'},{x:31,y:70,label:'D'},{x:53,y:25,label:'LW'},{x:58,y:50,label:'C'},{x:53,y:75,label:'RW'}];
</script>
<div class="rink-wrap">
 <div class="rink" aria-label="Hockey rink diagram. Team attacks toward the right goal.">
  <div class="zone zone-left"></div><div class="zone zone-right"></div>
  <div class="red-line center-line"></div><div class="blue-line left-blue"></div><div class="blue-line right-blue"></div>
  <div class="red-line left-goal"></div><div class="red-line right-goal"></div>
  <div class="center-circle"></div><div class="center-dot"></div>
  {#each [25,75] as x}{#each [26,74] as y}<div class="face-circle" style="--x:{x}%;--y:{y}%"></div>{/each}{/each}
  <div class="net net-left"></div><div class="net net-right"></div>
  {#if mode === 'positions'}
   {#each players as p}<div class="player" style="--x:{p.x}%;--y:{p.y}%">{p.label}</div>{/each}
  {:else if mode === 'offside'}
   <div class="player" style="--x:{step ? 76 : 61}%;--y:39%">A</div>
   <div class="puck" style="--x:70%;--y:64%"></div><div class="puck-label">PUCK →</div>
   <div class="diagram-callout" class:bad={step}>{step ? 'PLAYER FIRST = OFFSIDE' : 'PUCK FIRST = ONSIDE'}</div>
  {:else if mode === 'icing'}
   <div class="player" style="--x:34%;--y:58%">A</div><div class="puck" style="--x:{step ? 94 : 38}%;--y:58%"></div>
   <div class="travel-arrow">································→</div>
   <div class="diagram-callout">{step ? 'WHISTLE → BACK TO YOUR END' : 'SHOT FROM BEHIND CENTER'}</div>
  {:else if mode === 'powerplay' || mode === 'empty'}
   {#each [{x:48,y:24},{x:62,y:30},{x:49,y:72},{x:63,y:70},{x:75,y:49}] as p}<div class="player" style="--x:{p.x}%;--y:{p.y}%">●</div>{/each}
   {#each [{x:77,y:30},{x:66,y:46},{x:77,y:68},{x:83,y:49}] as p}<div class="player opponent" style="--x:{p.x}%;--y:{p.y}%">●</div>{/each}
   <div class="player opponent" style="--x:89%;--y:50%">G</div>
   {#if mode === 'empty'}<div class="player opponent" style="--x:67%;--y:18%">●</div><div class="player" style="--x:57%;--y:49%">6</div><div class="diagram-callout">EMPTY NET ←</div>{:else}<div class="player" style="--x:11%;--y:50%">G</div>{/if}
  {:else}
   <div class="zone-label" style="--x:24%">DEFENSIVE<br/>ZONE</div><div class="zone-label" style="--x:50%">NEUTRAL<br/>ZONE</div><div class="zone-label" style="--x:76%">ATTACKING<br/>ZONE</div>
  {/if}
 </div>
 <div class="rink-caption"><span>YOUR TEAM</span><span>ATTACKING THIS WAY ⟶</span></div>
</div>
