<script>
 import { onMount } from 'svelte';
 import { slides, questions, rulebook } from './slides.js';
 import Rink from './Rink.svelte';
 let index = $state(0), overview = $state(false), notes = $state(false), example = $state(false), revealed = $state(false), question = $state(0);
 let current = $derived(slides[index]);
 let touchX = 0;
 function go(i) { index = Math.max(0,Math.min(slides.length-1,i)); example=false; revealed=false; overview=false; history.replaceState(null,'',`#${index+1}`); }
 function key(e) {
  if(e.target instanceof HTMLButtonElement && (e.key===' ' || e.key==='Enter')) return;
  if(e.key==='Escape'){overview=false; notes=false; return;}
  if(overview) return;
  if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();go(index+1);}
  if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();go(index-1);}
  if(e.key==='Home')go(0); if(e.key==='End')go(slides.length-1);
  if(e.key.toLowerCase()==='n')notes=!notes;
  if(e.key.toLowerCase()==='o')overview=!overview;
  if(e.key.toLowerCase()==='f')fullscreen();
 }
 async function fullscreen(){if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen().catch(()=>{});}
 onMount(()=>{const n=Number(location.hash.slice(1));if(n>=1&&n<=slides.length)index=n-1;});
</script>
<svelte:window onkeydown={key} onhashchange={()=>{const n=Number(location.hash.slice(1));if(n>=1&&n<=slides.length)index=n-1;}} />
<div class="app isolate antialiased">
 <header class="flex items-center justify-between gap-4">
  <a class="brand" href="#1" onclick={()=>go(0)}>H<span>●</span>CKEY <span class="brand-number">101</span></a>
  <div class="edition max-sm:hidden">A SPECTATOR’S FIELD GUIDE <span> / </span> NHL EDITION</div>
  <button class="text-button" onclick={()=>overview=!overview} aria-expanded={overview}>☷ <span>All slides</span></button>
 </header>
 <main ontouchstart={e=>touchX=e.changedTouches[0].clientX} ontouchend={e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>75)go(index+(dx<0?1:-1));}}>
 {#key index}
 <article class:cover={current.kind==='cover'} class:photo-slide={current.kind==='photo'} class="slide" aria-label={`Slide ${index+1} of ${slides.length}: ${current.title.replaceAll('\n',' ')}`}>
  {#if current.kind==='cover'}
   <div class="cover-photo"><img src="./images/toronto-montreal.jpg" alt="Toronto and Montreal players line up for a center-ice face-off"/><div class="photo-shade"></div><div class="photo-tag">ON THE ICE / TORONTO × MONTRÉAL</div></div>
   <div class="cover-content"><div class="eyebrow"><span class="live-dot"></span> THE GAME, EXPLAINED</div><h1>HOCKEY<span>101<span class="title-period">.</span></span></h1><p class="cover-sub">{current.subtitle}</p><p class="cover-description">{current.take}</p><button class="start" onclick={()=>go(1)}>Let’s drop the puck <span>↗</span></button><div class="cover-meta">17 SLIDES <span>·</span> ABOUT 15 MINUTES <span>·</span> ZERO EXPERIENCE REQUIRED</div></div>
   <div class="vertical-text">WELCOME TO THE COOLEST GAME ON EARTH</div>
  {:else}
   <div class="slide-copy"><div class="eyebrow"><span class="section-index">{String(index).padStart(2,'0')}</span> {current.section}</div><h1>{current.title}</h1><p class="subtitle">{current.subtitle}</p>
   {#if current.kind==='photo' || current.kind==='positions' || current.kind==='powerplay' || current.kind==='changes' || current.kind==='end'}
    <div class="explanations">{#each current.items as item}<div><h2>{item[0]}</h2><p>{item[1]}</p></div>{/each}</div>
   {/if}
   {#if current.take}<p class="takeaway">{current.take}</p>{/if}
   </div>
   <div class="slide-visual">
   {#if current.kind==='photo'}<figure><img src={`./images/${current.image}`} alt={current.image==='toronto-montreal.jpg'?'Two NHL centers prepare for a face-off with teammates positioned around them':'Canucks and Oilers players positioned near the goal during a game'}/><figcaption>{current.image==='toronto-montreal.jpg'?'THE RESTART / TORONTO × MONTRÉAL':'READ THE PLAY / VANCOUVER × EDMONTON'}</figcaption></figure>
   {:else if ['rink','positions','offside','icing','powerplay','empty'].includes(current.kind)}
    <Rink mode={current.kind} step={example}/>
    {#if current.kind==='offside' || current.kind==='icing'}<div class="demo-controls"><button class="demo-button" onclick={()=>example=!example}>{current.kind==='offside'?(example?'Show legal entry':'Move player ahead of puck'):(example?'Reset the play':'Send the puck down ice')} <span>↗</span></button><p>{current.kind==='offside'?'Simplified entry · blue team attacks right':'5-on-5 · untouched puck · opponent wins the race'}</p></div>{/if}
    {#if current.kind==='offside'}<p class="visual-note">Delayed offside? Attackers can leave the zone to “tag up” before playing the puck.</p>{/if}
    {#if current.kind==='icing'}<p class="visual-note">NHL exception: a shorthanded team may ice the puck. Officials can also wave icing off.</p>{/if}
   {:else if current.kind==='clock'}<div class="periods">{#each current.items as item,i}<div><span class="period-number">0{i+1}</span><h2>{item[0]}</h2><p>{item[1]}</p></div>{/each}</div><div class="clock-note">WHISTLE BLOWS. CLOCK STOPS.</div>
   {:else if current.kind==='compare' || current.kind==='overtime'}<div class="comparison">{#each current.items as item,i}<div><span class="eyebrow">{item[0]}</span><h2>{item[1]}</h2><p>{item[2]}</p></div>{/each}</div>
   {:else if current.kind==='penalties'}<div class="penalty-list">{#each current.items as item,i}<div><span>0{i+1}</span><div><h2>{item[0]}</h2><p>{item[1]}</p></div></div>{/each}</div><div class="penalty-time"><strong>2:00</strong><p>A common minor penalty<br/>means time in the box.</p></div>
   {:else if current.kind==='changes'}<div class="big-number">45<span>SECONDS, GIVE OR TAKE</span></div><p class="visual-note">A typical shift is roughly 30–60 seconds.<br/>Hockey is exhausting. The bench is your friend.</p>
   {:else if current.kind==='quiz'}<div class="quiz"><div class="eyebrow">CALL {question+1} / {questions.length}</div><h2>{questions[question].q}</h2>{#if revealed}<div class="answer"><h3>{questions[question].a}</h3><p>{questions[question].why}</p></div>{/if}<div class="flex flex-wrap gap-3"><button class="demo-button" onclick={()=>revealed=!revealed}>{revealed?'Hide answer':'Make the call'} ↗</button><button class="text-button" onclick={()=>{question=(question+1)%questions.length;revealed=false;}}>Next scenario →</button></div></div>
   {:else if current.kind==='end'}<div class="end-mark">YOU’RE<br/>IN THE<br/><span>GAME.</span></div>
   {:else if current.kind==='sources'}<div class="sources"><h2>The rulebook</h2><p><a href={rulebook} target="_blank" rel="noreferrer">NHL Video Rulebook & 2026–27 official rules ↗</a><br/>Rules 15–16, 20, 24, 74, 76–78, 81, 83–84.</p><h2>The photographs</h2><p><a href="https://commons.wikimedia.org/wiki/File:NHL_faceoff.jpg" target="_blank" rel="noreferrer">Toronto–Montréal face-off ↗</a><br/>Eternalsleeper · <a href="https://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a> · cropped for layout.</p><p><a href="https://commons.wikimedia.org/wiki/File:Face_off.jpg" target="_blank" rel="noreferrer">Vancouver–Edmonton face-off ↗</a><br/>Anders Elkjaer Johansen · public domain · cropped for layout.</p><p class="visual-note">Historic game photos illustrate general play, not a specific rule violation. Independent educational project; no NHL affiliation.</p></div>
   {/if}
   </div>
  {/if}
 </article>
 {/key}
 </main>
 {#if notes}<aside class="notes"><div class="flex items-center justify-between"><h2>Speaker notes</h2><button class="text-button" onclick={()=>notes=false}>Close ×</button></div><p>{current.notes}</p><a href={rulebook} target="_blank" rel="noreferrer">Official NHL rules & video examples ↗</a></aside>{/if}
 <footer><div class="footer-left"><span class="page tabular-nums">{String(index+1).padStart(2,'0')} <span>/ {slides.length}</span></span><span class="footer-section max-sm:hidden">{current.section}</span></div><div class="footer-tools"><button class="text-button" class:active={notes} onclick={()=>notes=!notes} aria-pressed={notes}>Notes <kbd>N</kbd></button><button class="text-button max-sm:hidden" onclick={fullscreen} aria-label="Toggle fullscreen">Fullscreen <kbd>F</kbd></button><div class="arrows"><button onclick={()=>go(index-1)} disabled={index===0} aria-label="Previous slide">←</button><button onclick={()=>go(index+1)} disabled={index===slides.length-1} aria-label="Next slide">→</button></div></div></footer>
 <div class="progress" style="--progress:{((index+1)/slides.length)*100}%"></div>
 {#if overview}<div class="overview"><div class="overview-heading"><div><p class="eyebrow">THE WHOLE PLAYBOOK</p><h2>Pick your next play</h2></div><button class="text-button" onclick={()=>overview=false}>Close ×</button></div><div class="overview-grid">{#each slides as slide,i}<button class:chosen={index===i} onclick={()=>go(i)}><span>{String(i+1).padStart(2,'0')} / {slide.section}</span><h3>{slide.title.replaceAll('\n',' ')}</h3><span>↗</span></button>{/each}</div></div>{/if}
</div>
