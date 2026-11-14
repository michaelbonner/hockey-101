<script module>
 // Built by scripts/optimize-images.sh at these widths.
 const widths = [800, 1600];
 export const srcset = (name, ext) => widths.map(w => `./images/${name}-${w}.${ext} ${w}w`).join(', ');
 // Fetch a photo ahead of its slide so it is ready when the presenter arrives.
 export function warm(name, sizes) { const img = new Image(); img.sizes = sizes; img.srcset = srcset(name, 'avif'); }
</script>
<script>
 let { name, alt, sizes, priority = false } = $props();
</script>
<picture>
 <source type="image/avif" srcset={srcset(name, 'avif')} {sizes}/>
 <source type="image/webp" srcset={srcset(name, 'webp')} {sizes}/>
 <img src={`./images/${name}-1600.jpg`} srcset={srcset(name, 'jpg')} {sizes} {alt} decoding="async" fetchpriority={priority ? 'high' : 'auto'}/>
</picture>
