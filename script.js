// *****************************************

// ✅ DATABASE INITIALIZATION (Runs Once)
// *****************************************
if (!localStorage.getItem("db_init")) {

   const packages = [
    {id:1,name:"Wedding Basic",img:"pastel-drapes-simple-wedding-decorations.png",price:15000,desc:"Decoration + Music + Photography",category:"Wedding"},
    {id:2,name:"Wedding Royal",img:"1ba90259af4a5dd568f46a17a8c47ebb.jpg",price:35000,desc:"Premium Décor + DJ + Video",category:"Wedding"},

    {id:3,name:"Corporate Basic",img:"corrporet image.jpg",price:12000,desc:"Hall + Snacks + Projector",category:"Corporate"},
    {id:4,name:"Corporate Premium",img:"corporet primium.jpg",price:30000,desc:"Hall + LED Screen + Lunch",category:"Corporate"},

    {id:5,name:"Birthday Fun",img:"fun.jpg",price:8000,desc:"Cake + Games + Décor",category:"Birthday"},
    {id:6,name:"Birthday Premium",img:"birthday pri.jpg",price:20000,desc:"Theme + Magician + Photoshoot",category:"Birthday"},

    {id:7,name:"Concert Basic",img:"consert fun.jpg",price:25000,desc:"Stage + Basic Sound",category:"Concert"},
    {id:8,name:"Concert Pro",img:"consert pro.jpg",price:60000,desc:"Dolby Sound + Lighting",category:"Concert"},

    {id:9,name:"Fest Basic",img:"fest fun.jpg",price:15000,desc:"Stage + Mic + Speakers",category:"Fest"},
    {id:10,name:"Fest Premium",img:"https://images.unsplash.com/photo-1548191265-cc70d3d45ba1",price:45000,desc:"DJ + Laser Show + Stage",category:"Fest"}
];


    const upcoming = [
        {title:"Music Fest",date:"12 Dec 2025",desc:"India’s top DJs performing.",guest:"DJ Shadow"},
        {title:"Tech Conference",date:"20 Jan 2026",desc:"Future of Robotics & AI.",guest:"Elon Musk (Virtual)"},
        {title:"Food Carnival",date:"5 Feb 2026",desc:"200+ stalls & cooking arena.",guest:"Chef Ranveer Brar"},
        {title:"Startup Summit",date:"22 Feb 2026",desc:"Pitch ideas to investors.",guest:"Kunal Shah"}
    ];

    localStorage.setItem("packages", JSON.stringify(packages));
    localStorage.setItem("upcoming", JSON.stringify(upcoming));
    localStorage.setItem("bookings", JSON.stringify([]));
    localStorage.setItem("db_init", 1);
}

// Currency Formatter
const currency = x => "₹" + Number(x).toLocaleString("en-IN");


// *****************************************
// ✅ LOAD PACKAGES ON HOME PAGE
// *****************************************
function loadPackages() {
    const list = document.getElementById("package-list");
    if (!list) return;

    const data = JSON.parse(localStorage.getItem("packages"));
    list.innerHTML = "";

    data.forEach(p => {
        list.innerHTML += `
            <div class='card'>
                <img src='${p.img}'>
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <h4>${currency(p.price)}</h4>
                <button class='btn' onclick='book(${p.id})'>Book Now</button>
            </div>
        `;
    });
}


// *****************************************
// ✅ LOAD UPCOMING EVENTS
// *****************************************
function loadUpcoming() {
    const list = document.getElementById("upcoming-list");
    if (!list) return;

    const data = JSON.parse(localStorage.getItem("upcoming"));
    list.innerHTML = "";

    data.forEach(e => {
        list.innerHTML += `
            <li>
                <strong>${e.title}</strong> — ${e.date}<br>
                <em>${e.desc}</em><br>
                Guest: <b>${e.guest}</b>
            </li>`;
    });
}


// *****************************************
// ✅ REDIRECT TO BOOKING PAGE
// *****************************************
function book(id) {
    const data = JSON.parse(localStorage.getItem("packages"));
    const p = data.find(x => x.id === id);
    localStorage.setItem("selected", JSON.stringify(p));
    window.location = "booking.html";
}


// *****************************************
// ✅ LOAD TOTAL BOOKINGS (HOME PAGE)
// *****************************************
function loadTotalBookings() {
    const b = JSON.parse(localStorage.getItem("bookings")) || [];
    const el = document.getElementById("totalBookingCount");
    if (el) el.textContent = b.length;
}


// *****************************************
// ✅ DASHBOARD — TOTAL BOOKINGS
// *****************************************
function loadDashBookings() {
    const b = JSON.parse(localStorage.getItem("bookings")) || [];
    const el = document.getElementById("dashBookings");
    if (el) el.textContent = b.length;
}


// *****************************************
// ✅ DASHBOARD — TOTAL REVENUE
// *****************************************
function loadDashRevenue() {
    const b = JSON.parse(localStorage.getItem("bookings")) || [];
    let total = 0;

    b.forEach(x => {
        total += Number(x.package.price);
    });

    const el = document.getElementById("dashRevenue");
    if (el) el.textContent = "₹" + total.toLocaleString("en-IN");
}


// *****************************************
// ✅ DASHBOARD — TOP BOOKED PACKAGE
// *****************************************
function loadTopPackage() {
    const all = JSON.parse(localStorage.getItem("bookings")) || [];
    const el = document.getElementById("topPackage");

    if (!el) return;

    if (all.length === 0) {
        el.textContent = "-";
        return;
    }

    const count = {};

    all.forEach(b => {
        const name = b.package.name;
        count[name] = (count[name] || 0) + 1;
    });

    // Highest count
    let top = Object.keys(count)[0];
    for (let k in count) {
        if (count[k] > count[top]) top = k;
    }

    el.textContent = top;
}


// *****************************************
// ✅ DASHBOARD — LATEST 5 BOOKINGS TABLE
// *****************************************
function loadLatestBookings() {
    const all = JSON.parse(localStorage.getItem("bookings")) || [];
    const list = document.getElementById("latestBookings");
    if (!list) return;

    list.innerHTML = "";

    all.slice(-5).reverse().forEach(b => {
        list.innerHTML += `
            <tr>
                <td>${b.name}</td>
                <td>${b.package.name}</td>
                <td>${b.date}</td>
                <td>${currency(b.package.price)}</td>
            </tr>
        `;
    });
}


// *****************************************
// ✅ PAGE ONLOAD — CALL ALL FUNCTIONS
// *****************************************
window.onload = () => {
    loadPackages();
    loadUpcoming();
    loadTotalBookings();

    loadDashBookings();
    loadDashRevenue();
    loadTopPackage();
    loadLatestBookings();
};


/* =========================
   ADMIN CRUD HELPERS
   Paste this into script.js (end) or in admin-specific JS file
   ========================= */

function getPackages(){
  return JSON.parse(localStorage.getItem('packages') || '[]');
}
function setPackages(arr){
  localStorage.setItem('packages', JSON.stringify(arr));
}

/* Render packages into admin list (call this on admin page load) */
function renderPackagesAdmin(){
  const container = document.getElementById('pkgList');
  if(!container) return;
  const pkgs = getPackages();
  container.innerHTML = '';
  if(pkgs.length===0){ container.innerHTML = '<p>No packages found.</p>'; return; }
  pkgs.forEach(p=>{
    const div = document.createElement('div');
    div.className = 'card';
    div.style.marginBottom = '10px';
    div.innerHTML = `
      <div style="display:flex;gap:12px;align-items:center">
        <img src="${p.img || 'https://picsum.photos/seed/'+p.id+'/200/120'}" class="img-thumb">
        <div style="flex:1">
          <strong>${p.name}</strong><br><small>${p.category || ''} • ${currency(p.price)}</small>
          <p style="margin:6px 0">${p.desc}</p>
          <div style="display:flex;gap:8px">
            <button class="btn" onclick="adminEditPkg(${p.id})">Edit</button>
            <button class="btn" onclick="adminDeletePkg(${p.id})">Delete</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

/* When admin clicks Edit — fill the form */
function adminEditPkg(id){
  const pkgs = getPackages();
  const p = pkgs.find(x=>x.id==id);
  if(!p) return alert('Package not found');
  document.getElementById('pkgId').value = p.id;
  document.getElementById('pkgName').value = p.name;
  document.getElementById('pkgCategory').value = p.category || '';
  document.getElementById('pkgPrice').value = p.price;
  document.getElementById('pkgDesc').value = p.desc;
  // image file input cannot be programmatically set - it's OK
  window.scrollTo({top:0,behavior:'smooth'});
}

/* Delete package */
function adminDeletePkg(id){
  if(!confirm('Delete this package?')) return;
  const pkgs = getPackages().filter(x=>x.id!=id);
  setPackages(pkgs);
  renderPackagesAdmin();
  alert('Package deleted');
}

/* Save package from admin form (handles create & update, including base64 image) */
async function adminSavePackageFromForm(formEl){
  // formEl is the <form> element or you can fetch values directly
  const idField = document.getElementById('pkgId').value;
  const name = document.getElementById('pkgName').value.trim();
  const category = document.getElementById('pkgCategory').value.trim();
  const price = Number(document.getElementById('pkgPrice').value) || 0;
  const desc = document.getElementById('pkgDesc').value.trim();
  const inputFile = document.getElementById('pkgImage');

  if(!name || !category || !desc){ alert('Please fill name, category and description'); return; }

  // convert image to base64 if provided
  let base64 = '';
  if(inputFile && inputFile.files && inputFile.files[0]){
    base64 = await fileToBase64(inputFile.files[0]);
  }

  const pkgs = getPackages();
  if(idField){ // update
    const idx = pkgs.findIndex(x=>x.id==idField);
    if(idx>-1){
      pkgs[idx].name = name;
      pkgs[idx].category = category;
      pkgs[idx].price = price;
      pkgs[idx].desc = desc;
      if(base64) pkgs[idx].img = base64; // replace image only if new image provided
    }
  } else { // create
    const nid = Date.now();
    pkgs.push({id:nid, name, category, price, desc, img: base64});
  }
  setPackages(pkgs);
  // reset form
  document.getElementById('pkgForm').reset();
  document.getElementById('pkgId').value = '';
  renderPackagesAdmin();
  alert('Package saved');
}

/* helper: file to base64 */
function fileToBase64(file){
  return new Promise((resolve,reject)=>{
    const fr = new FileReader();
    fr.onload = ()=> resolve(fr.result);
    fr.onerror = ()=> reject('err');
    fr.readAsDataURL(file);
  });
}

/* Wire up admin form submit (call once when admin page loads) */
function adminWireUpForm(){
  const form = document.getElementById('pkgForm');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    adminSavePackageFromForm(form);
  });
  // reset button (if you have)
  const resetBtn = document.getElementById('resetForm');
  if(resetBtn) resetBtn.addEventListener('click', ()=>{ form.reset(); document.getElementById('pkgId').value=''; });
}

/* Init admin page (call on admin.html load) */
function initAdminPage(){
  adminWireUpForm();
  renderPackagesAdmin();
}

/* If admin page is open and DOM ready, init automatically */
if(document.readyState !== 'loading'){
  if(document.getElementById('pkgList')) initAdminPage();
} else {
  document.addEventListener('DOMContentLoaded', ()=>{
    if(document.getElementById('pkgList')) initAdminPage();
  });
}










