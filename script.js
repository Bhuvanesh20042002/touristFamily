

try{
const raw = localStorage.getItem(STORAGE_KEY);
return raw ? JSON.parse(raw) : [];
}catch(e){ console.error(e); return []; }


function saveRegs(arr){ localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); }


function renderRegs(){
const regs = loadRegs();
if (!regs.length){ regsWrap.innerHTML=''; noRegs.style.display='block'; return; }
noRegs.style.display='none';


let html = '<table><thead><tr><th>Name</th><th>Phone</th><th>Country</th><th>Visit</th><th>Purpose</th><th></th></tr></thead><tbody>';
regs.forEach((r, i)=>{
const visit = `${r.fromDate} → ${r.toDate}`;
html += `<tr><td>${escapeHtml(r.fullName)}</td><td>${escapeHtml(r.phone)}</td><td>${escapeHtml(r.country)}</td><td>${visit}</td><td>${escapeHtml(r.purpose)}</td><td><button data-i="${i}" class="view">View</button> <button data-i="${i}" class="del">Delete</button></td></tr>`;
});
html += '</tbody></table>';
regsWrap.innerHTML = html;


regsWrap.querySelectorAll('.view').forEach(btn=>btn.onclick = (e)=>{ const i=+e.target.dataset.i; showDetails(i); });
regsWrap.querySelectorAll('.del').forEach(btn=>btn.onclick = (e)=>{ const i=+e.target.dataset.i; deleteReg(i); });
}


function showDetails(i){
const regs = loadRegs(); const r = regs[i];
if(!r) return;
const details = `Name: ${escapeHtml(r.fullName)}\nEmail: ${escapeHtml(r.email)}\nPhone: ${escapeHtml(r.phone)}\nCountry: ${escapeHtml(r.country)}\nVisit: ${r.fromDate} → ${r.toDate}\nPurpose: ${escapeHtml(r.purpose)}\nNotes: ${escapeHtml(r.notes||'—')}`;
alert(details);
}


function deleteReg(i){
if(!confirm('Delete this registration?')) return;
const regs = loadRegs(); regs.splice(i,1); saveRegs(regs); renderRegs(); showMessage('Registration deleted','success');
}


function escapeHtml(str){
if(!str && str!==0) return '';
return String(str).replace(/[&<>"']/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[tag]);
}


form.addEventListener('submit', (ev)=>{
ev.preventDefault();
const data = new FormData(form);
const obj = Object.fromEntries(data.entries());


if(!obj.fullName || obj.fullName.trim().length < 2){ showMessage('Please enter a valid full name','error'); return; }
if(!validateEmail(obj.email)){ showMessage('Please provide a valid email','error'); return; }
if(!validatePhone(obj.phone)){ showMessage('Please provide a valid phone number','error'); return; }
if(!obj.country || obj.country.trim().length < 2){ showMessage('Please provide country','error'); return; }
if(!obj.fromDate || !obj.toDate){ showMessage('Please pick both from and to dates','error'); return; }
if(new Date(obj.fromDate) > new Date(obj.toDate)){ showMessage('From date cannot be after To date','error'); return; }


const regs = loadRegs();
regs.push(obj);
saveRegs(regs);
renderRegs();
form.reset();
showMessage('Registration saved');
});


clearBtn.addEventListener('click', ()=>{
if(!confirm('Clear ALL saved registrations from this browser?')) return;
localStorage.removeItem(STORAGE_KEY);
renderRegs();
showMessage('All saved data cleared');
});


function validateEmail(email){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
function validatePhone(phone){ return /^\+?[0-9 \-]{7,20}$/.test(phone); }


renderRegs();