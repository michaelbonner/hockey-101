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
  <a class="brand" href="#1" onclick={()=>go(0)}>Hockey <span>101</span></a>
  <button class="text-button" onclick={()=>overview=!overview} aria-expanded={overview}>All slides</button>
 </header>
 <main ontouchstart={e=>touchX=e.changedTouches[0].clientX} ontouchend={e=>{const dx=e.changedTouches[0].clientX-touchX;if(Math.abs(dx)>75)go(index+(dx<0?1:-1));}}>
 {#key index}
 <article class:cover={current.kind==='cover'} class:photo-slide={current.kind==='photo'} class="slide" aria-label={`Slide ${index+1} of ${slides.length}: ${current.title.replaceAll('\n',' ')}`}>
  {#if current.kind==='cover'}
   <div class="cover-photo"><img src="./images/utah-st-louis-faceoff.jpg" alt="Utah Hockey Club and St. Louis Blues players prepare for a face-off"/><div class="photo-shade"></div></div>
   <div class="cover-content"><h1>HOCKEY<span>101.</span></h1><p class="cover-sub">{current.subtitle}</p><p class="cover-description">{current.take}</p><button class="start" onclick={()=>go(1)}>Let’s drop the puck</button></div>
  {:else}
   <div class="slide-copy"><p class="eyebrow">{current.section}</p><h1>{current.title}</h1><p class="subtitle">{current.subtitle}</p>
   {#if current.kind==='photo' || current.kind==='positions' || current.kind==='powerplay' || current.kind==='changes' || current.kind==='end'}
    <div class="explanations">{#each current.items as item}<div><h2>{item[0]}</h2><p>{item[1]}</p></div>{/each}</div>
   {/if}
   {#if current.take}<p class="takeaway">{current.take}</p>{/if}
   </div>
   <div class="slide-visual">
   {#if current.kind==='photo'}<figure><img src={`./images/${current.image}`} alt={current.image==='utah-st-louis-faceoff.jpg'?'Two NHL centers prepare for a face-off with teammates positioned around them':'Utah players Jack McBain, Karel Vejmelka and Mikhail Sergachev defend their net against Seattle'}/></figure>
   {:else if ['rink','positions','offside','delayed-offside','icing','delayed-penalty','powerplay','empty'].includes(current.kind)}
    <Rink mode={current.kind} step={example}/>
    {#if current.kind==='offside' || current.kind==='icing'}<div class="demo-controls"><button class="demo-button" onclick={()=>example=!example}>{current.kind==='offside'?(example?'Show legal entry':'Move player ahead of puck'):(example?'Reset the play':'Send the puck down ice')}</button></div>{/if}
    {#if current.kind==='delayed-offside'}<div class="demo-controls"><button class="demo-button" onclick={()=>example=!example}>{example?'Show the tag-up':'Play the puck instead'}</button></div><p class="visual-note">Linesmen wear plain stripes and watch the lines.</p>{/if}
    {#if current.kind==='delayed-penalty'}<div class="demo-controls"><button class="demo-button" onclick={()=>example=!example}>{example?'Show the whistle':'Score during the delay'}</button></div><p class="visual-note">Referees wear orange armbands and call the penalties.</p>{/if}
    {#if current.kind==='icing'}<p class="visual-note">The diagram shows 5-on-5 with an untouched puck. In the NHL, a shorthanded team may ice the puck, and officials can wave icing off.</p>{/if}
   {:else if current.kind==='clock'}<div class="periods">{#each current.items as item,i}<div><h2>{item[0]}</h2><p>{item[1]}</p></div>{/each}</div>
   {:else if current.kind==='compare' || current.kind==='overtime'}<div class="comparison">{#each current.items as item}<div><span class="eyebrow">{item[0]}</span><h2>{item[1]}</h2><p>{item[2]}</p></div>{/each}</div>
   {:else if current.kind==='penalties'}<div class="penalty-list">{#each current.items as item}<div><h2>{item[0]}</h2><p>{item[1]}</p></div>{/each}</div><div class="penalty-time"><strong>2:00</strong><p>A common minor penalty<br/>means two minutes in the box.</p></div>
   {:else if current.kind==='changes'}<div class="big-number">45<span>SECONDS, GIVE OR TAKE</span></div><p class="visual-note">A typical shift is roughly 30–60 seconds.<br/>Skating that hard wears players out fast.</p>
   {:else if current.kind==='quiz'}<div class="quiz"><div class="eyebrow">CALL {question+1} / {questions.length}</div><h2>{questions[question].q}</h2>{#if questions[question].diagram}<Rink mode={questions[question].diagram} step={revealed}/>{/if}{#if revealed}<div class="answer"><h3>{questions[question].a}</h3><p>{questions[question].why}</p>{#if questions[question].video}<a class="answer-link" href={questions[question].video.url} target="_blank" rel="noreferrer">Watch: {questions[question].video.label} →</a>{/if}</div>{/if}<div class="flex flex-wrap gap-3"><button class="demo-button" onclick={()=>revealed=!revealed}>{revealed?'Hide answer':'Make the call'}</button><button class="text-button" onclick={()=>{question=(question+1)%questions.length;revealed=false;}}>Next scenario</button></div></div>
   {:else if current.kind==='end'}<div class="end-mark">YOU’RE<br/>IN THE<br/><span>GAME.</span></div>
   {:else if current.kind==='sources'}<div class="sources"><h2>The rulebook</h2><p><a href={rulebook} target="_blank" rel="noreferrer">NHL Video Rulebook and 2026–27 official rules</a><br/>Rules 15–16, 20, 24, 74, 76–78, 81, 83–84.</p><h2>The photographs</h2><p><a href="https://commons.wikimedia.org/wiki/File:NHL-Utah-STL-DesMoines2024.jpg" target="_blank" rel="noreferrer">Utah–St. Louis face-off · Sept. 22, 2024</a><br/>Jar-Lar · <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> · resized and cropped for layout; adaptations under the same license.</p><p><a href="https://commons.wikimedia.org/wiki/File:McBain,_Vejmelka,_and_Sergachev_-_December_2024.jpg" target="_blank" rel="noreferrer">Utah–Seattle · Dec. 30, 2024</a><br/>Jenn G · <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a> · resized and cropped for layout; adaptations under the same license.</p><p class="visual-note">Photos show Utah Hockey Club before the Mammoth rebrand and illustrate general play, not a specific rule violation. This is an independent educational project with no NHL affiliation.</p></div>
   {/if}
   </div>
  {/if}
 </article>
 {/key}
 </main>
 {#if notes}<aside class="notes"><div class="flex items-center justify-between"><h2>Speaker notes</h2><button class="text-button" onclick={()=>notes=false}>Close ×</button></div><p>{current.notes}</p><a href={rulebook} target="_blank" rel="noreferrer">Official NHL rules and video examples</a></aside>{/if}
 <footer><span class="page"><strong>{index+1}</strong> / {slides.length}</span><div class="footer-tools"><button class="text-button" class:active={notes} onclick={()=>notes=!notes} aria-pressed={notes}>Notes</button><button class="text-button max-sm:hidden" onclick={fullscreen} aria-label="Toggle fullscreen">Fullscreen</button><div class="arrows"><button onclick={()=>go(index-1)} disabled={index===0} aria-label="Previous slide">←</button><button onclick={()=>go(index+1)} disabled={index===slides.length-1} aria-label="Next slide">→</button></div></div></footer>
 <div class="progress" style="--progress:{((index+1)/slides.length)*100}%"></div>
 {#if overview}<div class="overview"><div class="overview-heading"><h2>All slides</h2><button class="text-button" onclick={()=>overview=false}>Close ×</button></div><div class="overview-grid">{#each slides as slide,i}<button class:chosen={index===i} onclick={()=>go(i)}><span>{i+1} · {slide.section}</span><h3>{slide.title.replaceAll('\n',' ')}</h3></button>{/each}</div></div>{/if}
</div>
