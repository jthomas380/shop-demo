const products = [
  {id:1,name:'The Field Overshirt',category:'Apparel',price:148,image:'p1',badge:'New',description:'A structured midweight layer cut from brushed cotton twill with four purposeful pockets.',colors:[['Forest','#263c2f'],['Navy','#263748'],['Stone','#b4aa98']],sizes:['S','M','L','XL'],stock:8},
  {id:2,name:'The Weight Knit',category:'Apparel',price:124,image:'p2',badge:'',description:'A substantial cotton-merino crewneck with a clean shape, soft hand, and reinforced rib trim.',colors:[['Cream','#e5dfd2'],['Charcoal','#444642'],['Rust','#9a4d2e']],sizes:['S','M','L','XL'],stock:12},
  {id:3,name:'The Transit Trouser',category:'Apparel',price:118,image:'p3',badge:'',description:'A tailored trouser with discreet stretch, an internal drawcord, and an easy tapered leg.',colors:[['Charcoal','#3d3f3d'],['Navy','#273647'],['Olive','#59634a']],sizes:['30','32','34','36','38'],stock:10},
  {id:4,name:'The Weekender',category:'Accessories',price:198,image:'p4',badge:'3 left',description:'Full-grain leather, a padded laptop sleeve, and enough room for a three-day escape.',colors:[['Cognac','#a85b2c'],['Espresso','#4c3026']],sizes:['One size'],stock:3},
  {id:5,name:'The Court Low',category:'Footwear',price:136,image:'p5',badge:'Best seller',description:'Low-profile leather sneakers with a cushioned footbed and durable rubber cupsole.',colors:[['Bone / Navy','#e8e3d8'],['White / Forest','#f5f4ef']],sizes:['8','9','10','11','12'],stock:7},
  {id:6,name:'The Signal Beanie',category:'Accessories',price:38,image:'p6',badge:'2 left',description:'A warm merino-blend rib knit finished in the collection’s signature burnt orange.',colors:[['Signal Orange','#b54f24'],['Forest','#293d31'],['Charcoal','#424441']],sizes:['One size'],stock:2}
];

const cart=[];
let activeFilter='All';
let promo=false;
let activeProduct=null;
let selectedColor='';
let selectedSize='';
const currency=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);

function swatchHTML(colors){return colors.map(c=>`<span class="swatch" style="background:${c[1]}" title="${c[0]}"></span>`).join('')}
function renderProducts(){
  const query=document.querySelector('#product-search').value.trim().toLowerCase();
  const sort=document.querySelector('#sort-select').value;
  let shown=products.filter(p=>(activeFilter==='All'||p.category===activeFilter)&&(`${p.name} ${p.category}`.toLowerCase().includes(query)));
  if(sort==='low') shown.sort((a,b)=>a.price-b.price); if(sort==='high') shown.sort((a,b)=>b.price-a.price); if(sort==='name') shown.sort((a,b)=>a.name.localeCompare(b.name));
  document.querySelector('#product-grid').innerHTML=shown.map(p=>`<article class="product-card" data-id="${p.id}">${p.badge?`<span class="product-badge">${p.badge}</span>`:''}<div class="product-image ${p.image}" role="button" tabindex="0" aria-label="Quick view ${p.name}"></div><div class="product-card-info"><div class="product-meta"><h3>${p.name}</h3><strong>${currency(p.price)}</strong></div><p>${p.category}</p><div class="swatches">${swatchHTML(p.colors)}</div></div></article>`).join('');
  document.querySelector('#no-results').hidden=shown.length>0;
  document.querySelectorAll('.product-image').forEach(el=>{el.addEventListener('click',()=>openProduct(Number(el.closest('.product-card').dataset.id)));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProduct(Number(el.closest('.product-card').dataset.id))}})});
}

document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{activeFilter=btn.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===btn));renderProducts()}));
document.querySelectorAll('[data-nav-filter]').forEach(link=>link.addEventListener('click',()=>{activeFilter=link.dataset.navFilter;document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===activeFilter));renderProducts()}));
document.querySelector('#product-search').addEventListener('input',renderProducts);
document.querySelector('#sort-select').addEventListener('change',renderProducts);

function openProduct(id){
  activeProduct=products.find(p=>p.id===id); selectedColor=activeProduct.colors[0][0]; selectedSize=activeProduct.sizes[0];
  const image=document.querySelector('#modal-product-image'); image.className=`modal-product-image ${activeProduct.image}`;
  document.querySelector('#modal-product-category').textContent=activeProduct.category; document.querySelector('#product-modal-name').textContent=activeProduct.name; document.querySelector('#modal-product-price').textContent=currency(activeProduct.price); document.querySelector('#modal-product-description').textContent=activeProduct.description;
  renderOptions(); document.querySelector('#stock-note').textContent=activeProduct.stock<=3?`Only ${activeProduct.stock} left in stock`:'';
  document.querySelector('#product-modal').hidden=false; document.body.classList.add('locked');
}
function renderOptions(){
  document.querySelector('#selected-color-label').textContent=selectedColor;
  document.querySelector('#color-options').innerHTML=activeProduct.colors.map(c=>`<button class="color-option ${c[0]===selectedColor?'active':''}" type="button" data-color="${c[0]}" style="background:${c[1]}" aria-label="${c[0]}"></button>`).join('');
  document.querySelector('#size-options').innerHTML=activeProduct.sizes.map(s=>`<button class="size-option ${s===selectedSize?'active':''}" type="button" data-size="${s}">${s}</button>`).join('');
  document.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{selectedColor=b.dataset.color;renderOptions()})); document.querySelectorAll('[data-size]').forEach(b=>b.addEventListener('click',()=>{selectedSize=b.dataset.size;renderOptions()}));
}
function closeProduct(){document.querySelector('#product-modal').hidden=true;document.body.classList.remove('locked')}
document.querySelectorAll('[data-product-close]').forEach(el=>el.addEventListener('click',closeProduct));
document.querySelector('#modal-add').addEventListener('click',()=>{addToCart(activeProduct,selectedColor,selectedSize);closeProduct();openCart()});

function addToCart(product,color,size){const existing=cart.find(i=>i.id===product.id&&i.color===color&&i.size===size);if(existing)existing.qty+=1;else cart.push({id:product.id,color,size,qty:1});renderCart();showToast(`${product.name} added to your bag`)}
function cartValues(){const subtotal=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);const discount=promo?subtotal*.15:0;return{subtotal,discount,total:subtotal-discount}}
function renderCart(){
  const count=cart.reduce((s,i)=>s+i.qty,0); document.querySelector('#cart-count').textContent=count; document.querySelector('#cart-title-count').textContent=count; document.querySelector('#cart-empty').hidden=count>0; document.querySelector('#cart-filled').hidden=count===0;
  document.querySelector('#cart-items').innerHTML=cart.map((item,index)=>{const p=products.find(x=>x.id===item.id);return`<article class="cart-line"><div class="cart-thumb ${p.image}"></div><div class="cart-line-info"><h3>${p.name}</h3><span>${item.color} · ${item.size}</span><strong class="line-price">${currency(p.price)}</strong><div class="line-controls"><div class="quantity"><button type="button" data-minus="${index}" aria-label="Decrease quantity">−</button><span>${item.qty}</span><button type="button" data-plus="${index}" aria-label="Increase quantity">+</button></div><button class="remove-item" type="button" data-remove="${index}">Remove</button></div></div></article>`}).join('');
  const v=cartValues(); document.querySelector('#cart-subtotal').textContent=currency(v.subtotal); document.querySelector('#discount-line').hidden=!promo; document.querySelector('#cart-discount').textContent=`−${currency(v.discount)}`; document.querySelector('#cart-total').textContent=currency(v.total); document.querySelector('#cart-shipping').textContent=v.total>=150?'Free':'Calculated at checkout';
  document.querySelectorAll('[data-minus]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.minus);cart[i].qty-=1;if(cart[i].qty<1)cart.splice(i,1);renderCart()})); document.querySelectorAll('[data-plus]').forEach(b=>b.addEventListener('click',()=>{cart[Number(b.dataset.plus)].qty+=1;renderCart()})); document.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{cart.splice(Number(b.dataset.remove),1);renderCart()}));
}
function openCart(){document.querySelector('#cart-drawer').classList.add('open');document.querySelector('#cart-drawer').setAttribute('aria-hidden','false');document.querySelector('#page-shade').hidden=false;document.body.classList.add('locked')}
function closeCart(){document.querySelector('#cart-drawer').classList.remove('open');document.querySelector('#cart-drawer').setAttribute('aria-hidden','true');document.querySelector('#page-shade').hidden=true;document.body.classList.remove('locked')}
document.querySelector('.cart-button').addEventListener('click',openCart);document.querySelectorAll('.drawer-close').forEach(b=>b.addEventListener('click',closeCart));document.querySelector('#page-shade').addEventListener('click',closeCart);
document.querySelector('#promo-button').addEventListener('click',()=>{const message=document.querySelector('#promo-message');if(document.querySelector('#promo-input').value.trim().toUpperCase()==='WELCOME15'){promo=true;message.textContent='WELCOME15 applied — 15% off.';message.style.color='#2d7747';renderCart()}else{message.textContent='Code not recognized. Try WELCOME15.';message.style.color='#b44b2c'}});

function showToast(text){const t=document.querySelector('#toast');t.textContent=text;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}
document.querySelector('.search-toggle').addEventListener('click',()=>{document.querySelector('.search-panel').hidden=false;document.querySelector('#header-search').focus()});document.querySelector('.search-close').addEventListener('click',()=>document.querySelector('.search-panel').hidden=true);document.querySelector('#header-search').addEventListener('input',e=>{document.querySelector('#product-search').value=e.target.value;renderProducts()});

function renderCheckout(){const v=cartValues();const delivery=document.querySelector('input[name="delivery"]:checked')?.value||'ship';const shipping=delivery==='pickup'||v.total>=150?0:8;document.querySelector('#checkout-items').innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);return`<article class="summary-item"><div class="summary-thumb ${p.image}"></div><div><h3>${p.name} × ${item.qty}</h3><span>${item.color} · ${item.size}</span></div><strong>${currency(p.price*item.qty)}</strong></article>`}).join('');document.querySelector('#checkout-subtotal').textContent=currency(v.subtotal);document.querySelector('#checkout-discount-row').hidden=!promo;document.querySelector('#checkout-discount').textContent=`−${currency(v.discount)}`;document.querySelector('#checkout-shipping').textContent=shipping?currency(shipping):'Free';document.querySelector('#checkout-total').textContent=currency(v.total+shipping)}
function showCheckoutStep(n){document.querySelectorAll('.checkout-step').forEach(s=>s.classList.toggle('active',Number(s.dataset.checkoutStep)===n));document.querySelectorAll('.checkout-steps span').forEach((s,i)=>s.classList.toggle('active',i<n));window.scrollTo(0,0)}
document.querySelector('.checkout-open').addEventListener('click',()=>{closeCart();renderCheckout();document.querySelector('#checkout-modal').hidden=false;document.body.classList.add('locked');showCheckoutStep(1)});document.querySelector('.checkout-close').addEventListener('click',()=>{document.querySelector('#checkout-modal').hidden=true;document.body.classList.remove('locked');openCart()});
document.querySelectorAll('input[name="delivery"]').forEach(r=>r.addEventListener('change',()=>{const ship=r.value==='ship'&&r.checked;document.querySelectorAll('.ship-field').forEach(f=>{f.hidden=!ship;f.querySelector('input,select').required=ship});renderCheckout()}));
document.querySelector('.next-checkout').addEventListener('click',()=>{const step=document.querySelector('[data-checkout-step="1"]');if([...step.querySelectorAll('[required]')].every(i=>i.reportValidity()))showCheckoutStep(2)});document.querySelector('.back-checkout').addEventListener('click',()=>showCheckoutStep(1));
document.querySelector('#checkout-form').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;const data=new FormData(e.currentTarget);document.querySelector('#customer-name').textContent=data.get('first');document.querySelector('#customer-email').textContent=data.get('email');document.querySelector('#checkout-form').hidden=true;document.querySelector('#checkout-success').hidden=false;document.querySelectorAll('.checkout-steps span').forEach(s=>s.classList.add('active'));window.scrollTo(0,0)});
document.querySelector('.checkout-finish').addEventListener('click',()=>{document.querySelector('#checkout-modal').hidden=true;document.body.classList.remove('locked');cart.splice(0);promo=false;renderCart();document.querySelector('#checkout-form').reset();document.querySelectorAll('.ship-field').forEach(field=>{field.hidden=false;field.querySelector('input,select').required=true});document.querySelector('#checkout-form').hidden=false;document.querySelector('#checkout-success').hidden=true;showToast('Demonstration order complete')});

document.querySelector('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#newsletter-note').textContent='You’re on the demonstration list. No email was submitted.';e.currentTarget.reset()});
const menu=document.querySelector('.menu-button');menu.addEventListener('click',()=>{const header=document.querySelector('.site-header');const open=header.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.site-header').classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!document.querySelector('#product-modal').hidden)closeProduct();else if(document.querySelector('#cart-drawer').classList.contains('open'))closeCart()}});
renderProducts();renderCart();
