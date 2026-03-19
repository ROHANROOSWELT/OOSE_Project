const API = "";
let currentAdmin = null;
let allStudentsData = [];
let editingStudentId = null;
let _studentDataMap = {};

/* ============================================================
   AUTH
============================================================ */
async function adminLogin(){
    const username = document.getElementById("adminUser").value.trim();
    const password = document.getElementById("adminPass").value.trim();
    if(!username || !password){ setErr("loginErr","Enter username and password"); return; }
    try {
        const res = await fetch(API+"/admin/login",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({username,password}) });
        const data = await res.json();
        if(!res.ok){ setErr("loginErr", data.error||"Invalid credentials"); return; }
        currentAdmin = data;
        document.getElementById("adminLogin").classList.add("hidden");
        document.getElementById("adminDashboard").classList.remove("hidden");
        document.getElementById("adminWelcome").innerText = "Welcome, "+data.fullName;
        refreshAll();
    } catch(e){ setErr("loginErr","Connection error"); }
}

function adminLogout(){
    currentAdmin = null;
    document.getElementById("adminDashboard").classList.add("hidden");
    document.getElementById("adminLogin").classList.remove("hidden");
    document.getElementById("adminUser").value="";
    document.getElementById("adminPass").value="";
}

/* ============================================================
   TABS
============================================================ */
function showTab(name){
    document.querySelectorAll(".tab").forEach(t=>t.classList.add("hidden"));
    document.querySelectorAll(".snav").forEach(s=>s.classList.remove("active"));
    document.getElementById("tab-"+name).classList.remove("hidden");
    document.getElementById("snav-"+name).classList.add("active");
    if(name==="students")      renderStudentsTable();
    if(name==="registrations") renderRegistrationsTable();
}

async function refreshAll(){
    await loadDashboard();
    await loadStudents();
}

/* ============================================================
   DASHBOARD
============================================================ */
async function loadDashboard(){
    try {
        const res = await fetch(API+"/admin/dashboard");
        const d = await res.json();
        document.getElementById("statGrid").innerHTML = `
            <div class="stat-card"><div class="sc-num">${d.totalStudents}</div><div class="sc-label">Total Students</div></div>
            <div class="stat-card"><div class="sc-num">${d.totalRegistrations}</div><div class="sc-label">Registered</div></div>
            <div class="stat-card"><div class="sc-num">${d.totalPayments}</div><div class="sc-label">Payments Done</div></div>
            <div class="stat-card"><div class="sc-num">${d.totalHallTickets}</div><div class="sc-label">Hall Tickets</div></div>
        `;
    } catch(e){ console.error(e); }
}

/* ============================================================
   STUDENTS
============================================================ */
async function loadStudents(){
    try {
        const res = await fetch(API+"/admin/students");
        allStudentsData = await res.json();
        renderStudentsTable();
        renderRegistrationsTable();
        loadDashboard();
    } catch(e){
        document.getElementById("studentsContent").innerHTML='<div class="empty-state">Failed to load students</div>';
    }
}

function renderStudentsTable(){
    const el = document.getElementById("studentsContent");
    if(!allStudentsData.length){ el.innerHTML='<div class="empty-state">No students registered yet.</div>'; return; }

    // Store all student data globally — avoids inline string encoding issues
    _studentDataMap = {};
    allStudentsData.forEach(s => {
        _studentDataMap[s.studentId] = {
            name: s.name,
            arrearCount: s.arrearCount || 0,
            arrearSubjects: s.arrearSubjects || ""
        };
    });

    el.innerHTML = `
        <table class="data-table">
            <thead><tr>
                <th>Register No</th><th>Name</th><th>Dept</th><th>Sem</th>
                <th>Arrears</th><th>Max Courses</th><th>Eligibility</th>
                <th>Arrear Subjects</th><th>Action</th>
            </tr></thead>
            <tbody>
                ${allStudentsData.map(s => {
                    const arrearChips = s.arrearSubjects
                        ? s.arrearSubjects.split("|").filter(x=>x.trim()).map(a => {
                            const parts = a.trim().split("-");
                            const code = parts[0]?.trim() || "";
                            const name = parts.slice(1).join("-").trim() || a.trim();
                            return `<div style="display:flex;align-items:center;gap:5px;margin-bottom:3px">
                                <span class="badge badge-warning" style="font-size:.72rem">${code}</span>
                                <span style="font-size:.82rem;color:#475569">${name}</span>
                            </div>`;
                        }).join("")
                        : '<span style="color:#94a3b8">—</span>';

                    return `<tr>
                        <td><strong>${s.registerNo}</strong></td>
                        <td>${s.name}</td>
                        <td>${s.department||"—"}</td>
                        <td>Sem ${s.semester}</td>
                        <td><strong>${s.arrearCount}</strong></td>
                        <td>${s.maxCourses}</td>
                        <td><span class="badge ${s.eligibilityStatus==="ELIGIBLE"?"badge-success":"badge-danger"}">${s.eligibilityStatus}</span></td>
                        <td>${arrearChips}</td>
                        <td><button class="arrear-edit-btn" onclick="openArrearModal(${s.studentId})">Edit Arrears</button></td>
                    </tr>`;
                }).join("")}
            </tbody>
        </table>
    `;
}

/* ============================================================
   ARREAR MODAL — add row design
============================================================ */
let arrearRows = []; // [{code, name}]

function calcMaxCourses(count){
    if(count === 0)      return 9;
    if(count <= 2)       return 7;
    if(count <= 4)       return 5;
    if(count <= 6)       return 3;
    return 0;
}

function updateArrearSummary(){
    const count = arrearRows.length;
    const max   = calcMaxCourses(count);
    const status = count <= 6 ? "ELIGIBLE" : "NOT ELIGIBLE";

    const countEl  = document.getElementById("arrearCountNum");
    const maxEl    = document.getElementById("arrearMaxNum");
    const statusEl = document.getElementById("arrearStatusText");

    if(countEl)  countEl.innerText  = count;
    if(maxEl)    maxEl.innerText    = max;
    if(statusEl){
        statusEl.innerText = status;
        statusEl.style.color = count <= 6 ? "#16a34a" : "#dc2626";
    }
}

function renderArrearRows(){
    const container = document.getElementById("arrearRowsList");
    if(!container) return;

    if(arrearRows.length === 0){
        container.innerHTML = '<div style="text-align:center;padding:1.5rem;color:#94a3b8;font-size:.92rem;border:1.5px dashed #e2e8f0;border-radius:8px">No arrear subjects added yet. Click "+ Add Arrear Subject" to begin.</div>';
        return;
    }

    container.innerHTML = arrearRows.map((row, i) => `
        <div class="arrear-row-item" id="arrear-row-${i}">
            <div class="arrear-row-num">${i+1}</div>
            <div class="arrear-row-fields">
                <input type="text"
                    class="arrear-code-input"
                    placeholder="Course Code (e.g. CS301)"
                    value="${row.code}"
                    oninput="updateArrearRow(${i}, 'code', this.value)"
                    maxlength="10">
                <input type="text"
                    class="arrear-name-input"
                    placeholder="Course Name (e.g. Object Oriented Programming)"
                    value="${row.name}"
                    oninput="updateArrearRow(${i}, 'name', this.value)">
            </div>
            <button class="arrear-row-del" onclick="removeArrearRow(${i})" title="Remove">&#10005;</button>
        </div>
    `).join("");
}

function addArrearRow(){
    arrearRows.push({code:"", name:""});
    renderArrearRows();
    updateArrearSummary();
    // Focus the new code input
    setTimeout(()=>{
        const inputs = document.querySelectorAll(".arrear-code-input");
        if(inputs.length) inputs[inputs.length-1].focus();
    }, 50);
}

function removeArrearRow(index){
    arrearRows.splice(index, 1);
    renderArrearRows();
    updateArrearSummary();
}

function updateArrearRow(index, field, value){
    if(arrearRows[index]) arrearRows[index][field] = value;
    updateArrearSummary();
}

function openArrearModal(studentId){
    const d = _studentDataMap[studentId];
    if(!d){ alert("Student data not loaded. Please refresh."); return; }

    editingStudentId = studentId;
    document.getElementById("modalTitle").innerText = "Edit Arrears";
    document.getElementById("modalSubtitle").innerText = d.name;
    document.getElementById("modalErr").innerText = "";

    // Parse existing arrear subjects into rows
    arrearRows = [];
    if(d.arrearSubjects && d.arrearSubjects.trim()){
        d.arrearSubjects.split("|").filter(x=>x.trim()).forEach(entry => {
            const dashIdx = entry.indexOf("-");
            if(dashIdx > -1){
                arrearRows.push({
                    code: entry.slice(0, dashIdx).trim(),
                    name: entry.slice(dashIdx+1).trim()
                });
            } else {
                arrearRows.push({ code: entry.trim(), name: "" });
            }
        });
    }

    renderArrearRows();
    updateArrearSummary();
    document.getElementById("arrearModal").classList.remove("hidden");
}

function closeModal(){
    document.getElementById("arrearModal").classList.add("hidden");
    editingStudentId = null;
    arrearRows = [];
}

function closeArrearModal(e){
    if(e.target === document.getElementById("arrearModal")) closeModal();
}

async function saveArrear(){
    // Validate all rows have at least a code
    const invalid = arrearRows.some(r => !r.code.trim());
    if(invalid){ setErr("modalErr","All arrear subjects must have a Course Code"); return; }

    // Build pipe-separated string: CS301-OOP|CS302-Networks
    const arrearSubjects = arrearRows.map(r => r.code.trim() + (r.name.trim() ? "-"+r.name.trim() : "")).join("|");
    const arrearCount    = arrearRows.length;

    try {
        const res = await fetch(API+"/admin/student/"+editingStudentId+"/arrears",{
            method:"POST", headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ arrearCount, arrearSubjects })
        });
        const data = await res.json();
        if(!res.ok){ setErr("modalErr", data.error||"Failed to save"); return; }
        closeModal();
        await loadStudents();
        showToast("Arrears updated — "+arrearCount+" subjects | Max courses: "+data.maxCourses+" | "+data.eligibilityStatus);
    } catch(e){ setErr("modalErr","Error: "+e.message); }
}

/* ============================================================
   REGISTRATIONS
============================================================ */
function buildCourseList(coursesStr, type){
    if(!coursesStr) return '<span style="color:#94a3b8">—</span>';
    const items = coursesStr.split(",").filter(x=>x.trim());
    if(!items.length) return '<span style="color:#94a3b8">—</span>';

    const badgeClass = type === "arrear" ? "badge-warning" : "badge-info";
    const uid = "cl_" + Math.random().toString(36).slice(2,8);

    const renderItem = (c) => {
        const p    = c.split("|");
        const code = p[0]?.trim() || "";
        const name = p[1]?.trim() || "";
        return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
            <span class="badge ${badgeClass}" style="font-size:.7rem;padding:1px 7px;flex-shrink:0">${code}</span>
            <span style="font-size:.82rem;color:#334155">${name}</span>
        </div>`;
    };

    const first2 = items.slice(0,2);
    const rest   = items.slice(2);

    let html = first2.map(renderItem).join("");

    if(rest.length > 0){
        html += `<div id="${uid}_more" style="display:none">${rest.map(renderItem).join("")}</div>
        <button onclick="toggleCourseList('${uid}')" id="${uid}_btn"
            style="background:none;border:none;color:#1d4ed8;font-size:.78rem;cursor:pointer;padding:2px 0;font-weight:600;display:block;margin-top:2px">
            &#9660; Show ${rest.length} more
        </button>`;
    }
    return html;
}

function toggleCourseList(uid){
    const more = document.getElementById(uid+"_more");
    const btn  = document.getElementById(uid+"_btn");
    if(!more || !btn) return;
    const isHidden = more.style.display === "none";
    more.style.display = isHidden ? "block" : "none";
    btn.innerHTML = isHidden
        ? "&#9650; Show less"
        : "&#9660; Show " + more.children.length + " more";
}

function renderRegistrationsTable(){
    const el = document.getElementById("registrationsContent");
    const registered = allStudentsData.filter(s => s.registrationStatus !== "NOT_REGISTERED");
    if(!registered.length){ el.innerHTML='<div class="empty-state">No registrations yet.</div>'; return; }

    el.innerHTML = `
        <table class="data-table">
            <thead><tr>
                <th>Register No</th><th>Name</th><th>Exam Type</th>
                <th>Regular Courses</th><th>Arrear Courses</th>
                <th>Fee</th><th>Payment</th><th>Overall</th>
            </tr></thead>
            <tbody>
                ${registered.map(s => `<tr>
                    <td><strong>${s.registerNo}</strong></td>
                    <td>${s.name}</td>
                    <td><span class="badge badge-info">${s.examType||"—"}</span></td>
                    <td>${buildCourseList(s.registeredCourses, "regular")}</td>
                    <td>${buildCourseList(s.arrearCourses, "arrear")}</td>
                    <td><strong>&#8377;${s.totalFee||0}</strong></td>
                    <td><span class="badge ${s.paymentStatus==="SUCCESS"?"badge-success":"badge-warning"}">${s.paymentStatus||"PENDING"}</span></td>
                    <td>${getOverallBadge(s.overallStatus)}</td>
                </tr>`).join("")}
            </tbody>
        </table>
    `;
}

function getOverallBadge(status){
    const map = {
        "COMPLETED":           '<span class="badge badge-success">&#10003; Completed</span>',
        "HALL_TICKET_PENDING": '<span class="badge badge-info">Hall Ticket Pending</span>',
        "PAYMENT_PENDING":     '<span class="badge badge-warning">Payment Pending</span>',
        "NOT_REGISTERED":      '<span class="badge badge-gray">Not Registered</span>',
    };
    return map[status] || '<span class="badge badge-gray">'+status+'</span>';
}

/* ============================================================
   HELPERS
============================================================ */
function setErr(id, msg){ const el=document.getElementById(id); if(el) el.innerText=msg; }

function showToast(msg){
    const t = document.getElementById("toast");
    t.innerText = msg;
    t.classList.add("show");
    setTimeout(()=>t.classList.remove("show"), 3500);
}

document.addEventListener("keydown", e => { if(e.key==="Escape") closeModal(); });