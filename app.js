// Compressed copies preserve the product artwork with much smaller downloads.
const products = [
  {
    id:1,
    name:'The Field Overshirt',
    category:'Apparel',
    price:148,
    image:'assets/The Field Overshirt.webp',
    badge:'New',
    description:'A structured midweight layer cut from brushed cotton twill with four purposeful pockets.',
    colors:[
      ['Forest','#263c2f'],
      ['Navy','#263748'],
      ['Stone','#b4aa98']
    ],
    sizes:['S','M','L','XL'],
    stock:8
  },

  {
    id:2,
    name:'The Weight Knit',
    category:'Apparel',
    price:124,
    image:'assets/The Weight Knit.webp',
    badge:'',
    description:'A substantial cotton-merino crewneck with a clean shape, soft hand, and reinforced rib trim.',
    colors:[
      ['Cream','#e5dfd2'],
      ['Charcoal','#444642'],
      ['Rust','#9a4d2e']
    ],
    sizes:['S','M','L','XL'],
    stock:12
  },

  {
    id:3,
    name:'The Transit Trouser',
    category:'Apparel',
    price:118,
    image:'assets/The Transit Trouser.webp',
    badge:'',
    description:'A tailored trouser with discreet stretch, an internal drawcord, and an easy tapered leg.',
    colors:[
      ['Charcoal','#3d3f3d'],
      ['Navy','#273647'],
      ['Olive','#59634a']
    ],
    sizes:['30','32','34','36','38'],
    stock:10
  },

  {
    id:4,
    name:'The Weekender',
    category:'Accessories',
    price:198,
    image:'assets/The Weekender.webp',
    // Search also recognizes the everyday name without changing the description.
    keywords:'bag',
    badge:'3 left',
    description:'Full-grain leather, a padded laptop sleeve, and enough room for a three-day escape.',
    colors:[
      ['Cognac','#a85b2c'],
      ['Espresso','#4c3026']
    ],
    sizes:['One size'],
    stock:3
  },

  {
    id:5,
    name:'The Court Low',
    category:'Footwear',
    price:136,
    image:'assets/The Court Low.webp',
    badge:'Best seller',
    description:'Low-profile leather sneakers with a cushioned footbed and durable rubber cupsole.',
    colors:[
      ['Bone / Navy','#e8e3d8'],
      ['White / Forest','#f5f4ef']
    ],
    sizes:['8','9','10','11','12'],
    stock:7
  },

  {
    id:6,
    name:'The Signal Beanie',
    category:'Accessories',
    price:38,
    image:'assets/The Signal Beanie.webp',
    badge:'2 left',
    description:'A warm merino-blend rib knit finished in the collection’s signature burnt orange.',
    colors:[
      ['Signal Orange','#b54f24'],
      ['Forest','#293d31'],
      ['Charcoal','#424441']
    ],
    sizes:['One size'],
    stock:2
  }
];

const cart=[];
let activeFilter='All';
let promo=false;
let activeProduct=null;
let selectedColor='';
let selectedSize='';
// Keep fractional dollars visible when a percentage discount produces cents.
const currency=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:Number.isInteger(Math.round(n*100)/100)?0:2,maximumFractionDigits:2}).format(n);

function swatchHTML(colors){return colors.map(c=>`<span class="swatch" style="background:${c[1]}" title="${c[0]}"></span>`).join('')}
function renderProducts(){
  const query=document.querySelector('#product-search').value.trim().toLowerCase();
  const sort=document.querySelector('#sort-select').value;

  // Search descriptions and color names as well as the product label.
  let shown=products.filter(
    p =>
      (activeFilter==='All'||p.category===activeFilter) &&
      (`${p.name} ${p.category} ${p.description} ${p.colors.map(c=>c[0]).join(" ")} ${p.keywords||""}`.toLowerCase().includes(query))
  );

  if(sort==='low') shown.sort((a,b)=>a.price-b.price);
  if(sort==='high') shown.sort((a,b)=>b.price-a.price);
  if(sort==='name') shown.sort((a,b)=>a.name.localeCompare(b.name));

  document.querySelector('#product-grid').innerHTML=shown.map(p=>`
    <article class="product-card" data-id="${p.id}">

      ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}

      <div
        class="product-image"
        role="button"
        tabindex="0"
        aria-label="Quick view ${p.name}"
        style="
          background-image:url('${p.image}');
          background-size:cover;
          background-position:center;
          background-repeat:no-repeat;
        "
      ></div>

      <div class="product-card-info">

        <div class="product-meta">
          <h3>${p.name}</h3>
          <strong>${currency(p.price)}</strong>
        </div>

        <p>${p.category}</p>

        <div class="swatches">
          ${swatchHTML(p.colors)}
        </div>

      </div>

    </article>
  `).join('');

  document.querySelector('#no-results').hidden=shown.length>0;

  document.querySelectorAll('.product-image').forEach(el=>{
    el.addEventListener('click',()=>{
      openProduct(Number(el.closest('.product-card').dataset.id));
    });

    el.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        openProduct(Number(el.closest('.product-card').dataset.id));
      }
    });
  });
}

document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{activeFilter=btn.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b===btn));renderProducts()}));
document.querySelectorAll('[data-nav-filter]').forEach(link=>link.addEventListener('click',()=>{activeFilter=link.dataset.navFilter;document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===activeFilter));renderProducts()}));
document.querySelector('#product-search').addEventListener('input',renderProducts);
document.querySelector('#sort-select').addEventListener('change',renderProducts);

// Modal focus stays inside the active panel and returns to its opening control.
let currentPanel=null;
const panelOpeners=new Map();
function activatePanel(panel,focusTarget){
  panelOpeners.set(panel,document.activeElement);
  currentPanel=panel;
  [...document.body.children].forEach(el=>{
    if(!['SCRIPT','STYLE'].includes(el.tagName))el.inert=el!==panel&&el.id!=='page-shade'&&el.id!=='toast';
  });
  document.body.classList.add('locked');
  focusTarget.focus();
}
function deactivatePanel(panel){
  currentPanel=null;
  [...document.body.children].forEach(el=>el.inert=false);
  document.querySelector('#cart-drawer').inert=!document.querySelector('#cart-drawer').classList.contains('open');
  document.body.classList.remove('locked');
  const opener=panelOpeners.get(panel);
  if(opener?.isConnected&&!opener.closest('[hidden],[inert]'))opener.focus();
}
document.addEventListener('keydown',e=>{
  if(e.key!=='Tab'||!currentPanel)return;
  const controls=[...currentPanel.querySelectorAll('a[href],button,input,select,textarea,[tabindex="0"]')].filter(el=>!el.disabled&&!el.closest('[hidden],[inert]')&&el.getClientRects().length);
  const first=controls[0],last=controls[controls.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});
// Stock belongs to the product, so all colors and sizes share one quantity limit.
function productQuantity(id){return cart.filter(i=>i.id===id).reduce((sum,i)=>sum+i.qty,0)}
function updateStockControl(){
  const full=productQuantity(activeProduct.id)>=activeProduct.stock;
  document.querySelector('#modal-add').disabled=full;
  document.querySelector('#stock-note').textContent=full?`Only ${activeProduct.stock} available — all in your bag`:activeProduct.stock<=3?`Only ${activeProduct.stock} left in stock`:'';
}
function openProduct(id){

  activeProduct=products.find(p=>p.id===id);

  selectedColor=activeProduct.colors[0][0];
  selectedSize=activeProduct.sizes[0];

  const image=document.querySelector('#modal-product-image');

  image.className='modal-product-image';

  image.style.backgroundImage=`url('${activeProduct.image}')`;
  image.style.backgroundSize='contain';
  image.style.backgroundPosition='center';
  image.style.backgroundRepeat='no-repeat';

  document.querySelector('#modal-product-category').textContent=
    activeProduct.category;

  document.querySelector('#product-modal-name').textContent=
    activeProduct.name;

  document.querySelector('#modal-product-price').textContent=
    currency(activeProduct.price);

  document.querySelector('#modal-product-description').textContent=
    activeProduct.description;

  renderOptions();

  updateStockControl();

  document.querySelector('#product-modal').hidden=false;

  activatePanel(document.querySelector('#product-modal'),document.querySelector('.modal-close'));
}
function renderOptions(){
  document.querySelector('#selected-color-label').textContent=selectedColor;
  document.querySelector('#color-options').innerHTML=activeProduct.colors.map(c=>`<button class="color-option ${c[0]===selectedColor?'active':''}" type="button" data-color="${c[0]}" style="background:${c[1]}" aria-label="${c[0]}"></button>`).join('');
  document.querySelector('#size-options').innerHTML=activeProduct.sizes.map(s=>`<button class="size-option ${s===selectedSize?'active':''}" type="button" data-size="${s}">${s}</button>`).join('');
  document.querySelectorAll('[data-color]').forEach(b=>b.addEventListener('click',()=>{selectedColor=b.dataset.color;renderOptions()})); document.querySelectorAll('[data-size]').forEach(b=>b.addEventListener('click',()=>{selectedSize=b.dataset.size;renderOptions()}));
}
function closeProduct(){document.querySelector('#product-modal').hidden=true;deactivatePanel(document.querySelector('#product-modal'))}
document.querySelectorAll('[data-product-close]').forEach(el=>el.addEventListener('click',closeProduct));
document.querySelector('#modal-add').addEventListener('click',()=>{if(addToCart(activeProduct,selectedColor,selectedSize)){closeProduct();openCart()}});

// Guard every addition, including attempts from a different color or size.
function addToCart(product,color,size){if(productQuantity(product.id)>=product.stock){showToast(`Only ${product.stock} left in stock`);updateStockControl();return false;}const existing=cart.find(i=>i.id===product.id&&i.color===color&&i.size===size);if(existing)existing.qty+=1;else cart.push({id:product.id,color,size,qty:1});renderCart();showToast(`${product.name} added to your bag`);return true}
function cartValues(){const subtotal=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);const discount=promo?subtotal*.15:0;return{subtotal,discount,total:subtotal-discount}}
function renderCart(){

  // Replacing cart rows must not drop keyboard focus onto the background.
  const focusedControl=document.activeElement.closest('#cart-items button');
  const focusedAttribute=focusedControl&&['data-plus','data-minus','data-remove'].find(a=>focusedControl.hasAttribute(a));
  const focusedIndex=focusedAttribute?focusedControl.getAttribute(focusedAttribute):null;
  const count=cart.reduce((s,i)=>s+i.qty,0);

  document.querySelector('#cart-count').textContent=count;
  document.querySelector('#cart-title-count').textContent=count;
  // Match the noun to the total quantity, including an empty bag.
  document.querySelector('#cart-title-word').textContent=count===1?'item':'items';

  document.querySelector('#cart-empty').hidden=count>0;
  document.querySelector('#cart-filled').hidden=count===0;

  document.querySelector('#cart-items').innerHTML=
    cart.map((item,index)=>{

      const p=products.find(x=>x.id===item.id);

      return `
        <article class="cart-line">

          <div
            class="cart-thumb"
            style="
              background-image:url('${p.image}');
              background-size:cover;
              background-position:center;
              background-repeat:no-repeat;
            "
          ></div>

          <div class="cart-line-info">

            <h3>${p.name}</h3>

            <span>
              ${item.color} · ${item.size}
            </span>

            <strong class="line-price">
              ${currency(p.price)}
            </strong>

            <div class="line-controls">

              <div class="quantity">

                <button
                  type="button"
                  data-minus="${index}"
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span>${item.qty}</span>

                <button
                  type="button"
                  data-plus="${index}"
                  ${productQuantity(p.id)>=p.stock?'disabled':''}
                  aria-label="Increase quantity"
                >
                  +
                </button>

              </div>

              <button
                class="remove-item"
                type="button"
                data-remove="${index}"
              >
                Remove
              </button>

            </div>

          </div>

        </article>
      `;
    }).join('');

  const v=cartValues();

  document.querySelector('#cart-subtotal').textContent=
    currency(v.subtotal);

  document.querySelector('#discount-line').hidden=!promo;

  document.querySelector('#cart-discount').textContent=
    `−${currency(v.discount)}`;

  document.querySelector('#cart-total').textContent=
    currency(v.total);

  document.querySelector('#cart-shipping').textContent=
    v.total>=150 ? 'Free' : 'Calculated at checkout';

  document.querySelectorAll('[data-minus]').forEach(b=>
    b.addEventListener('click',()=>{
      const i=Number(b.dataset.minus);

      cart[i].qty-=1;

      if(cart[i].qty<1){
        cart.splice(i,1);
      }

      renderCart();
    })
  );

  document.querySelectorAll('[data-plus]').forEach(b=>
    b.addEventListener('click',()=>{
      // Recheck shared stock before changing the quantity.
      const item=cart[Number(b.dataset.plus)];
      const product=products.find(p=>p.id===item.id);
      if(productQuantity(item.id)>=product.stock){showToast(`Only ${product.stock} left in stock`);return;}
      item.qty+=1;
      renderCart();
    })
  );

  document.querySelectorAll('[data-remove]').forEach(b=>
    b.addEventListener('click',()=>{
      cart.splice(Number(b.dataset.remove),1);
      renderCart();
    })
  );
  if(focusedAttribute)restoreCartFocus(focusedAttribute,focusedIndex);
}
function restoreCartFocus(attribute,index){
  const control=document.querySelector(`[${attribute}="${index}"]`);
  (control&&!control.disabled?control:document.querySelector('.drawer-close')).focus();
}
function openCart(){document.querySelector('#cart-drawer').classList.add('open');document.querySelector('#cart-drawer').setAttribute('aria-hidden','false');document.querySelector('#page-shade').hidden=false;activatePanel(document.querySelector('#cart-drawer'),document.querySelector('.drawer-close'))}
function closeCart(){document.querySelector('#cart-drawer').classList.remove('open');document.querySelector('#cart-drawer').setAttribute('aria-hidden','true');document.querySelector('#page-shade').hidden=true;deactivatePanel(document.querySelector('#cart-drawer'))}
document.querySelector('.cart-button').addEventListener('click',openCart);document.querySelectorAll('.drawer-close').forEach(b=>b.addEventListener('click',closeCart));document.querySelector('#page-shade').addEventListener('click',closeCart);
document.querySelector('#promo-button').addEventListener('click',()=>{const message=document.querySelector('#promo-message');if(document.querySelector('#promo-input').value.trim().toUpperCase()==='WELCOME15'){promo=true;message.textContent='WELCOME15 applied — 15% off.';message.style.color='#2d7747';renderCart()}else{message.textContent='Code not recognized. Try WELCOME15.';message.style.color='#b44b2c'}});

function showToast(text){const t=document.querySelector('#toast');t.textContent=text;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),2200)}
document.querySelector('.search-toggle').addEventListener('click',()=>{document.querySelector('.search-panel').hidden=false;document.querySelector('#header-search').focus()});document.querySelector('.search-close').addEventListener('click',()=>document.querySelector('.search-panel').hidden=true);document.querySelector('#header-search').addEventListener('input',e=>{document.querySelector('#product-search').value=e.target.value;renderProducts();/* Bring matching products into view as the header query changes. */document.querySelector('#shop').scrollIntoView({behavior:'smooth',block:'start'})});

function renderCheckout(){

  const v=cartValues();

  const delivery=
    document.querySelector('input[name="delivery"]:checked')?.value||'ship';

  const shipping=
    delivery==='pickup'||v.total>=150
      ? 0
      : 8;

  document.querySelector('#checkout-items').innerHTML=
    cart.map(item=>{

      const p=products.find(x=>x.id===item.id);

      return `
        <article class="summary-item">

          <div
            class="summary-thumb"
            style="
              background-image:url('${p.image}');
              background-size:cover;
              background-position:center;
              background-repeat:no-repeat;
            "
          ></div>

          <div>

            <h3>
              ${p.name} × ${item.qty}
            </h3>

            <span>
              ${item.color} · ${item.size}
            </span>

          </div>

          <strong>
            ${currency(p.price*item.qty)}
          </strong>

        </article>
      `;
    }).join('');

  document.querySelector('#checkout-subtotal').textContent=
    currency(v.subtotal);

  document.querySelector('#checkout-discount-row').hidden=
    !promo;

  document.querySelector('#checkout-discount').textContent=
    `−${currency(v.discount)}`;

  document.querySelector('#checkout-shipping').textContent=
    shipping ? currency(shipping) : 'Free';

  document.querySelector('#checkout-total').textContent=
    currency(v.total+shipping);
}
function showCheckoutStep(n){document.querySelectorAll('.checkout-step').forEach(s=>s.classList.toggle('active',Number(s.dataset.checkoutStep)===n));document.querySelectorAll('.checkout-steps span').forEach((s,i)=>s.classList.toggle('active',i<n));/* Move focus to the newly visible step instead of its now-hidden button. */const heading=document.querySelector(`[data-checkout-step="${n}"] h1`);heading.tabIndex=-1;heading.focus();window.scrollTo(0,0)}
// Checkout opens from the bag and Escape returns to that same bag control.
let checkoutOpener=null;
function closeCheckout(){
  if(!document.querySelector('#checkout-success').hidden){finishCheckout();return;}
  document.querySelector('#checkout-modal').hidden=true;
  deactivatePanel(document.querySelector('#checkout-modal'));
  openCart();
  if(checkoutOpener?.isConnected)checkoutOpener.focus();
}
document.querySelector('.checkout-open').addEventListener('click',()=>{
  checkoutOpener=document.activeElement;
  closeCart();renderCheckout();
  document.querySelector('#checkout-modal').hidden=false;
  document.querySelector('.checkout-close').hidden=false;
  showCheckoutStep(1);
  activatePanel(document.querySelector('#checkout-modal'),document.querySelector('.checkout-close'));
});
document.querySelector('.checkout-close').addEventListener('click',closeCheckout);
document.querySelectorAll('input[name="delivery"]').forEach(r=>r.addEventListener('change',()=>{const ship=r.value==='ship'&&r.checked;document.querySelectorAll('.ship-field').forEach(f=>{f.hidden=!ship;f.querySelector('input,select').required=ship});renderCheckout()}));
document.querySelector('.next-checkout').addEventListener('click',()=>{const step=document.querySelector('[data-checkout-step="1"]');if([...step.querySelectorAll('[required]')].every(i=>i.reportValidity()))showCheckoutStep(2)});document.querySelector('.back-checkout').addEventListener('click',()=>showCheckoutStep(1));
document.querySelector('#checkout-form').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;const data=new FormData(e.currentTarget);document.querySelector('#customer-name').textContent=data.get('first');document.querySelector('#customer-email').textContent=data.get('email');document.querySelector('#checkout-form').hidden=true;document.querySelector('#checkout-success').hidden=false;
// Confirmation cannot reopen the ordered bag; use a fresh demo reference each time.
document.querySelector('.checkout-close').hidden=true;document.querySelector('#order-number').textContent=`NL-${Math.floor(100000+Math.random()*900000)}`;document.querySelector('.checkout-finish').focus();document.querySelectorAll('.checkout-steps span').forEach(s=>s.classList.add('active'));window.scrollTo(0,0)});
// Clear order and promo state together so the next demo starts cleanly.
function finishCheckout(){
  document.querySelector('#checkout-modal').hidden=true;
  deactivatePanel(document.querySelector('#checkout-modal'));
  cart.splice(0);promo=false;
  document.querySelector('#promo-input').value='';
  const message=document.querySelector('#promo-message');
  message.textContent='Try WELCOME15 for this demonstration.';message.style.color='';
  renderCart();document.querySelector('#checkout-form').reset();
  document.querySelectorAll('.ship-field').forEach(field=>{field.hidden=false;field.querySelector('input,select').required=true});
  document.querySelector('#checkout-form').hidden=false;
  document.querySelector('#checkout-success').hidden=true;
  document.querySelector('.checkout-close').hidden=false;
  document.querySelector('.cart-button').focus();
  showToast('Demonstration order complete');
}
document.querySelector('.checkout-finish').addEventListener('click',finishCheckout);

// Local help content explains the demo policies without mail links or submissions.
const helpContent={
  shipping:['Shipping & Returns','<p>Demo shipping is free over $150 and $8 otherwise. Returns are available within 30 days.</p>'],
  sizes:['Size Guide','<p>Demonstration size ranges:</p><table><thead><tr><th scope="col">Product type</th><th scope="col">Sizes</th></tr></thead><tbody><tr><th scope="row">Tops</th><td>S, M, L, XL</td></tr><tr><th scope="row">Trousers</th><td>30, 32, 34, 36, 38</td></tr><tr><th scope="row">Shoes</th><td>8, 9, 10, 11, 12</td></tr></tbody></table>'],
  contact:['Contact','<p>This is a fictional demonstration storefront. There is no customer service inbox or contact form, and no messages are sent.</p>']
};
function closeHelp(){document.querySelector('#help-modal').hidden=true;deactivatePanel(document.querySelector('#help-modal'))}
document.querySelectorAll('[data-help]').forEach(link=>link.addEventListener('click',e=>{
  e.preventDefault();const [title,content]=helpContent[link.dataset.help];
  document.querySelector('#help-title').textContent=title;
  document.querySelector('#help-content').innerHTML=content;
  document.querySelector('#help-modal').hidden=false;
  activatePanel(document.querySelector('#help-modal'),document.querySelector('button[data-help-close]'));
}));
document.querySelectorAll('[data-help-close]').forEach(el=>el.addEventListener('click',closeHelp));

document.querySelector('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#newsletter-note').textContent='You’re on the demonstration list. No email was submitted.';e.currentTarget.reset()});
const menu=document.querySelector('.menu-button');menu.addEventListener('click',()=>{const header=document.querySelector('.site-header');const open=header.classList.toggle('open');menu.setAttribute('aria-expanded',String(open))});document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{document.querySelector('.site-header').classList.remove('open');menu.setAttribute('aria-expanded','false')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!document.querySelector('#help-modal').hidden)closeHelp();else if(!document.querySelector('#checkout-modal').hidden)closeCheckout();else if(!document.querySelector('#product-modal').hidden)closeProduct();else if(document.querySelector('#cart-drawer').classList.contains('open'))closeCart()}});
renderProducts();renderCart();
