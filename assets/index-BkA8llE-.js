(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=new URLSearchParams(location.search).get(`id`)??`3200`,t=`https://placehold.co/210x295`,n=document.querySelector(`header`),r=document.querySelector(`.episodes`),i=async e=>{let t=await fetch(e);if(!t.ok)throw Error(`HTTP Error: ${t.status}`);return t.json()},a=async e=>{let n=await i(`https://api.tvmaze.com/shows/${e}`);return{name:n.name,rating:n.rating?.average??null,image:n.image?.medium??t}},o=async e=>{let t=(await i(`https://api.tvmaze.com/shows/${e}/episodes`)).filter(e=>e.number!==null).map(e=>({number:e.number,season:e.season,rating:e.rating?.average??null}));return Object.groupBy(t,e=>e.season)},s=e=>`rating-${Math.floor(e??0)}`,c=e=>String(e).padStart(2,`0`),l=({name:e,image:t,rating:n})=>`
  <img class="poster" src="${t}" alt="Póster de ${e}">
  <h1>${e}</h1>
  <p class="show-rating">★ ${n??`N/A`}</p>
`,u=({number:e,rating:t})=>`
  <div class="episode episode-${e} ${s(t)}"
       title="Episodio ${e} · Rating: ${t??`N/A`}">${e}</div>
`,d=(e,t)=>`
  <article class="season">
    <header class="season-header">T${c(t)}</header>
    ${e.map(u).join(``)}
  </article>
`;try{let[t,i]=await Promise.all([a(e),o(e)]);document.title=t.name,n.setHTMLUnsafe(l(t));let s=Object.entries(i).map(([e,t])=>d(t,e));r.setHTMLUnsafe(s.join(``))}catch(e){console.error(`Error al obtener los datos: `,e),n.textContent=`No se pudieron cargar los datos`}