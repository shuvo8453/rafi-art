
const menuBtn=document.querySelector('.menu-btn');const navLinks=document.querySelector('.nav-links');
if(menuBtn){menuBtn.addEventListener('click',()=>{navLinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',navLinks.classList.contains('open'));});document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')))}
const filters=document.querySelectorAll('.filter');const cards=document.querySelectorAll('.work-card');
filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;cards.forEach(card=>{card.style.display=(f==='All'||card.dataset.category===f)?'block':'none';});}));
const lightbox=document.querySelector('.lightbox');
function openWork(card){if(!lightbox)return;lightbox.querySelector('img').src=card.querySelector('img').src;lightbox.querySelector('img').alt=card.querySelector('img').alt;lightbox.querySelector('h3').textContent=card.querySelector('h3').textContent;lightbox.querySelector('.category').textContent=card.dataset.category;lightbox.querySelector('.description').textContent=card.querySelector('.work-description').textContent;lightbox.classList.add('open');document.body.style.overflow='hidden';}
function closeWork(){if(!lightbox)return;lightbox.classList.remove('open');document.body.style.overflow='';}
cards.forEach(card=>{card.addEventListener('click',()=>openWork(card));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openWork(card)}})});
if(lightbox){lightbox.querySelector('.lightbox-close').addEventListener('click',closeWork);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeWork();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeWork()});}
