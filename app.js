const products = [
  {id:1,name:"Colchão Essencial Casal",category:"Colchões",description:"Conforto para noites mais tranquilas.",price:899.90,tag:"DESTAQUE",image:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80"},
  {id:2,name:"Cama Aurora Casal",category:"Camas",description:"Design contemporâneo para seu quarto.",price:1199.90,tag:"MAIS VENDIDO",image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"},
  {id:3,name:"Cabeceira Linho",category:"Cabeceiras",description:"Acabamento elegante e aconchegante.",price:479.90,tag:"NOVO",image:"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80"},
  {id:4,name:"Rack de TV Horizonte",category:"Sala de estar",description:"Organização com estilo para sua sala.",price:649.90,tag:"DESTAQUE",image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80"},
  {id:5,name:"Colchão Premium Queen",category:"Colchões",description:"Mais espaço para relaxar e recarregar.",price:1499.90,tag:"CONFORTO+",image:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80"},
  {id:6,name:"Mesa de Centro Serena",category:"Sala de estar",description:"Um toque acolhedor para receber bem.",price:389.90,tag:"ESCOLHA DA CASA",image:"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80"}
];
const money = value => value.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
let selectedCategory = "Todos";
let searchTerm = "";
let cart = [];
const grid = document.getElementById("productGrid");
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600)}
function filteredProducts(){return products.filter(p=>(selectedCategory==="Todos"||p.category===selectedCategory)&&(`${p.name} ${p.category} ${p.description}`.toLowerCase().includes(searchTerm.toLowerCase())))}
function renderProducts(){
  const shown=filteredProducts();
  grid.innerHTML=shown.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span class="product-tag">${p.tag}</span><button class="quick-add" data-add="${p.id}" aria-label="Adicionar ${p.name} à sacola">+</button></div><div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><p class="product-desc">${p.description}</p><div class="price">${money(p.price)}</div><div class="price-note">Preço demonstrativo</div></div></article>`).join("");
  document.getElementById("productCount").textContent=`${shown.length} ${shown.length===1?"produto":"produtos"}`;
  document.getElementById("emptyState").hidden=shown.length!==0;
  document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("active",b.dataset.category===selectedCategory));
}
function setCategory(category){selectedCategory=category;renderProducts();document.getElementById("produtos").scrollIntoView({behavior:"smooth",block:"start"})}
document.addEventListener("click",e=>{
  const categoryButton=e.target.closest("[data-category]");
  if(categoryButton){e.preventDefault();setCategory(categoryButton.dataset.category)}
  const addButton=e.target.closest("[data-add]");
  if(addButton)addToCart(Number(addButton.dataset.add));
});
document.getElementById("searchForm").addEventListener("submit",e=>{e.preventDefault();searchTerm=document.getElementById("searchInput").value.trim();renderProducts();document.getElementById("produtos").scrollIntoView({behavior:"smooth"})});
document.getElementById("clearFilters").addEventListener("click",()=>{selectedCategory="Todos";searchTerm="";document.getElementById("searchInput").value="";renderProducts()});
function addToCart(id){const p=products.find(x=>x.id===id);const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({...p,qty:1});renderCart();showToast(`${p.name} adicionad${p.category==="Colchões"?"o":"o"} à sacola.`)}
function updateQty(id,delta){const item=cart.find(x=>x.id===id);if(!item)return;item.qty+=delta;if(item.qty<=0)cart=cart.filter(x=>x.id!==id);renderCart()}
function renderCart(){
  const count=cart.reduce((sum,p)=>sum+p.qty,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("cartItems").innerHTML=cart.length?cart.map(p=>`<div class="cart-item"><img src="${p.image}" alt=""><div><b>${p.name}</b><small>${money(p.price)} cada</small><div class="qty-controls"><button data-qty="${p.id}" data-delta="-1" aria-label="Diminuir quantidade">−</button><span>${p.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Aumentar quantidade">+</button></div></div><span class="cart-item-price">${money(p.price*p.qty)}</span></div>`).join(""):'<div class="cart-empty">Sua sacola está vazia.<br>Explore os produtos e encontre algo para sua casa.</div>';
  document.getElementById("cartTotal").textContent=money(cart.reduce((sum,p)=>sum+p.price*p.qty,0));
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-qty]");if(b)updateQty(Number(b.dataset.qty),Number(b.dataset.delta))});
const cartDialog=document.getElementById("cartDialog");
document.getElementById("cartButton").addEventListener("click",()=>cartDialog.showModal());
document.getElementById("closeCart").addEventListener("click",()=>cartDialog.close());
document.getElementById("checkoutButton").addEventListener("click",()=>showToast("O checkout seguro será ativado na etapa de backend."));
document.getElementById("year").textContent=new Date().getFullYear();
// Troque pelo número oficial da loja, com código do país e DDD, somente quando tiver o número.
const WHATSAPP_NUMBER="";
const whatsapp=document.getElementById("whatsappLink");
whatsapp.href=WHATSAPP_NUMBER?`https://wa.me/${WHATSAPP_NUMBER}`:"https://wa.me/";
whatsapp.addEventListener("click",e=>{if(!WHATSAPP_NUMBER){e.preventDefault();showToast("Configure o número oficial do WhatsApp no arquivo app.js.")}});
renderProducts();renderCart();
