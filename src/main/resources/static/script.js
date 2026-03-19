const API = "";
let currentStudent = null;
let currentRegistration = null;
let currentPayment = null;
let currentEligibility = null;
let allCourses = [];
let enteredPin = "";

/* ============================================================
   AUTH
============================================================ */
function showLogin(){ document.getElementById("loginBox").classList.remove("hidden"); document.getElementById("signupBox").classList.add("hidden"); }
function showSignup(){ document.getElementById("signupBox").classList.remove("hidden"); document.getElementById("loginBox").classList.add("hidden"); }

async function login(){
    const registerNo = document.getElementById("loginReg").value.trim();
    const password   = document.getElementById("loginPass").value.trim();
    if(!registerNo || !password){ setErr("loginErr","Please enter register number and password"); return; }
    try {
        const res = await fetch(API+"/auth/login",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({registerNo,password}) });
        const data = await res.json();
        if(!res.ok){ setErr("loginErr", data.error||"Login failed"); return; }
        currentStudent = data;
        initPortal();
    } catch(e){ setErr("loginErr","Connection error — is the server running?"); }
}

async function signup(){
    const registerNo = document.getElementById("regNo").value.trim();
    const name       = document.getElementById("regName").value.trim();
    const department = document.getElementById("regDept").value;
    const degree     = document.getElementById("regDegree").value;
    const semester   = document.getElementById("regSem").value;
    const year       = document.getElementById("regYear").value;
    const email      = document.getElementById("regEmail").value.trim();
    const phone      = document.getElementById("regPhone").value.trim();
    const password   = document.getElementById("regPass").value.trim();
    if(!registerNo||!name||!department||!degree||!semester||!year||!password){ setErr("signupErr","All required fields must be filled"); return; }
    try {
        const res = await fetch(API+"/auth/register",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({registerNo,name,department,degree,semester:parseInt(semester),year:parseInt(year),email,phone,password}) });
        const data = await res.json();
        if(!res.ok){ setErr("signupErr", data.error||"Registration failed"); return; }
        document.getElementById("signupOk").innerText = "Account created! Please login.";
        setErr("signupErr","");
        setTimeout(()=>showLogin(), 1500);
    } catch(e){ setErr("signupErr","Connection error"); }
}

function logout(){
    currentStudent=null; currentRegistration=null; currentPayment=null; currentEligibility=null;
    document.getElementById("portal").classList.add("hidden");
    document.getElementById("authPage").classList.remove("hidden");
    document.getElementById("loginReg").value="";
    document.getElementById("loginPass").value="";
}

/* ============================================================
   PORTAL INIT
============================================================ */
function initPortal(){
    document.getElementById("authPage").classList.add("hidden");
    document.getElementById("portal").classList.remove("hidden");
    document.getElementById("navName").innerText = currentStudent.name;
    document.getElementById("sidebarName").innerText = currentStudent.name;
    document.getElementById("sidebarReg").innerText = currentStudent.registerNo;
    document.getElementById("sidebarDept").innerText = (currentStudent.degree||"BE")+" — "+currentStudent.department+" Sem "+currentStudent.semester;
    document.getElementById("dashGreet").innerText = "Welcome, "+currentStudent.name.split(" ")[0]+"!";
    if(currentStudent.profilePhoto){
        showPhoto(currentStudent.profilePhoto);
    }
    loadDashboard();
    showSection("dashboard");
}

function showPhoto(base64){
    ["navPhoto","sidePhoto"].forEach(id=>{
        const img = document.getElementById(id);
        img.src = base64;
        img.classList.remove("hidden");
    });
    document.getElementById("navIcon").classList.add("hidden");
    document.getElementById("sideIcon").classList.add("hidden");
}

/* ============================================================
   NAVIGATION
============================================================ */
function showSection(name){
    document.querySelectorAll(".section").forEach(s=>s.classList.add("hidden"));
    document.querySelectorAll(".snav-item").forEach(s=>s.classList.remove("active"));
    document.getElementById("sec-"+name).classList.remove("hidden");
    const nav = document.getElementById("snav-"+name);
    if(nav) nav.classList.add("active");
    if(name==="eligibility")  loadEligibility();
    if(name==="register")     loadRegister();
    if(name==="payment")      loadPayment();
    if(name==="hallticket")   loadHallTicket();
    if(name==="profile")      loadProfile();
}

/* ============================================================
   DASHBOARD
============================================================ */
async function loadDashboard(){
    try {
        const [eligRes, regRes] = await Promise.all([
            fetch(API+"/student/"+currentStudent.studentId+"/eligibility"),
            fetch(API+"/exam/student/"+currentStudent.studentId)
        ]);
        const elig = await eligRes.json();
        currentEligibility = elig;
        const regOk = regRes.ok;
        if(regOk) currentRegistration = await regRes.json();

        let payOk = false, htOk = false;
        if(regOk && currentRegistration){
            const payRes = await fetch(API+"/payment/registration/"+currentRegistration.registrationId);
            payOk = payRes.ok;
            if(payOk){ currentPayment = await payRes.json(); }
            if(payOk){
                const htRes = await fetch(API+"/hallticket/"+currentRegistration.registrationId);
                htOk = htRes.ok;
            }
        }

        // Progress calculation
        let prog = 0, activeStep = 0;
        if(elig.eligibilityStatus==="ELIGIBLE"){ prog=25; activeStep=1; }
        if(regOk){  prog=50; activeStep=2; }
        if(payOk){  prog=75; activeStep=3; }
        if(htOk){   prog=100; activeStep=4; }

        // Sidebar small progress bar
        const sideBar = document.getElementById("sideProgressBar");
        if(sideBar) sideBar.style.width = prog+"%";
        ["ps1","ps2","ps3","ps4"].forEach((id,i)=>{
            const el = document.getElementById(id);
            if(!el) return;
            el.className = "pstep";
            if(i < activeStep) el.classList.add("done");
            else if(i === activeStep) el.classList.add("active");
        });

        // Dashboard graduation cap progress bar
        const fillEl = document.getElementById("dashProgressFill");
        const capEl  = document.getElementById("gradCapIcon");
        if(fillEl) fillEl.style.width = prog+"%";
        // Cap sits exactly at the end of the fill line
        // prog maps directly to left% so cap tip = fill end
        if(capEl){
            // clamp to 0-100, cap stays at last step when complete
            capEl.style.left = Math.min(prog, 100)+"%";
        }

        // Step circles
        [1,2,3,4].forEach(i => {
            const circle = document.getElementById("dps"+i);
            const label  = document.getElementById("dpl"+i);
            if(!circle || !label) return;
            circle.className = "step-circle";
            label.className  = "step-label";
            if(i <= activeStep){
                circle.classList.add("done");
                circle.innerHTML = "&#10003;";
                label.classList.add("done");
            } else if(i === activeStep+1){
                circle.classList.add("active-step");
                label.classList.add("active-step");
            }
        });

        // Status cards
        document.getElementById("statusCards").innerHTML = `
            <div class="status-card">
                <div class="sc-label">Eligibility</div>
                <div class="sc-value ${elig.eligibilityStatus==="ELIGIBLE"?"sc-green":"sc-red"}">${elig.eligibilityStatus==="ELIGIBLE"?"&#10003; Eligible":"&#10007; Not Eligible"}</div>
            </div>
            <div class="status-card">
                <div class="sc-label">Registration</div>
                <div class="sc-value ${regOk?"sc-green":"sc-amber"}">${regOk?"&#10003; Registered":"&#9679; Pending"}</div>
            </div>
            <div class="status-card">
                <div class="sc-label">Fee Payment</div>
                <div class="sc-value ${payOk?"sc-green":"sc-amber"}">${payOk?"&#10003; Paid":"&#9679; Pending"}</div>
            </div>
            <div class="status-card">
                <div class="sc-label">Hall Ticket</div>
                <div class="sc-value ${htOk?"sc-green":"sc-amber"}">${htOk?"&#10003; Generated":"&#9679; Pending"}</div>
            </div>
        `;
    } catch(e){ console.error(e); }
}

/* ============================================================
   ELIGIBILITY
============================================================ */
async function loadEligibility(){
    const el = document.getElementById("eligibilityContent");
    el.innerHTML = '<div class="loading-box">Loading eligibility...</div>';
    try {
        const res = await fetch(API+"/student/"+currentStudent.studentId+"/eligibility");
        const e = await res.json();
        currentEligibility = e;

        const eligible = e.eligibilityStatus === "ELIGIBLE";
        const arrearList = e.arrearSubjects ? e.arrearSubjects.split("|").filter(x=>x.trim()) : [];

        let arrearHTML = "";
        if(arrearList.length > 0){
            arrearHTML = `<div class="card mt2">
                <div class="card-title">&#9888; Arrear Subjects</div>
                <div>` + arrearList.map(a=>`<span class="arrear-chip">${a.trim()}</span>`).join("") + `</div>
            </div>`;
        }

        el.innerHTML = `
            <div class="elig-status-box ${eligible?"elig-eligible":"elig-not"}">
                <div class="elig-badge ${eligible?"badge-green":"badge-red"}">
                    ${eligible?"✓ Eligible for Exam Registration":"✗ Not Eligible for Exam Registration"}
                </div>
                <div class="elig-detail">${eligible
                    ? "You are eligible to register for April/May 2026 examinations."
                    : "You have too many arrears. Please contact the exam cell."}</div>
            </div>
            <div class="card">
                <div class="card-title">Eligibility Summary</div>
                <table class="elig-table">
                    <tr><th>Arrear Count</th><td>${e.arrearCount}</td></tr>
                    <tr><th>Max Courses Allowed</th><td>${e.maxCoursesAllowed}</td></tr>
                    <tr><th>Status</th><td><span class="badge ${eligible?"badge-success":"badge-danger"}">${e.eligibilityStatus}</span></td></tr>
                </table>
            </div>
            ${arrearHTML}
            <div class="card">
                <div class="card-title">Arrear-Based Course Limit</div>
                <table class="elig-table">
                    <thead><tr><th>Arrear Count</th><th>Max Regular Courses</th><th>Status</th></tr></thead>
                    <tbody>
                        <tr><td>0 arrears</td><td>9 courses</td><td><span class="badge badge-success">ELIGIBLE</span></td></tr>
                        <tr><td>1–2 arrears</td><td>7 courses</td><td><span class="badge badge-success">ELIGIBLE</span></td></tr>
                        <tr><td>3–4 arrears</td><td>5 courses</td><td><span class="badge badge-success">ELIGIBLE</span></td></tr>
                        <tr><td>5–6 arrears</td><td>3 courses</td><td><span class="badge badge-success">ELIGIBLE</span></td></tr>
                        <tr><td>7+ arrears</td><td>0 courses</td><td><span class="badge badge-danger">NOT ELIGIBLE</span></td></tr>
                    </tbody>
                </table>
            </div>
        `;
    } catch(e){ el.innerHTML = '<div class="alert alert-error">Failed to load eligibility</div>'; }
}

/* ============================================================
   REGISTRATION
============================================================ */
async function loadRegister(){
    const el = document.getElementById("registerContent");
    el.innerHTML = '<div class="loading-box">Loading...</div>';
    try {
        const [eligRes, regRes, coursesRes] = await Promise.all([
            fetch(API+"/student/"+currentStudent.studentId+"/eligibility"),
            fetch(API+"/exam/student/"+currentStudent.studentId),
            fetch(API+"/courses/semester/"+currentStudent.semester)
        ]);
        const elig = await eligRes.json();
        currentEligibility = elig;

        if(elig.eligibilityStatus === "NOT_ELIGIBLE"){
            el.innerHTML = '<div class="alert alert-error">You are not eligible for exam registration. Contact exam cell.</div>';
            return;
        }

        allCourses = await coursesRes.json();
        const arrearSubjects = elig.arrearSubjects ? elig.arrearSubjects.split("|").filter(x=>x.trim()) : [];

        if(regRes.ok){
            currentRegistration = await regRes.json();
            showExistingRegistration(el, currentRegistration, arrearSubjects);
            return;
        }

        renderRegistrationForm(el, elig, allCourses, arrearSubjects);
    } catch(e){ el.innerHTML = '<div class="alert alert-error">Failed to load: '+e.message+'</div>'; }
}

function renderRegistrationForm(el, elig, courses, arrearSubjects){
    const regularCourses = courses.filter(c => c.courseType === "REGULAR");

    let regularHTML = regularCourses.map(c => `
        <label class="course-item" onclick="toggleCourse(this)">
            <input type="checkbox" value="${c.courseCode}" data-name="${c.courseName}" data-fee="500">
            <span class="course-code">${c.courseCode}</span>
            <span class="course-name">${c.courseName}</span>
            <span class="course-meta">
                <span class="course-session ${c.examSession==="FN"?"session-fn":"session-an"}">${c.examSession}</span><br>
                ${c.examDate} &bull; ${c.credits} Credits
            </span>
        </label>
    `).join("");

    let arrearHTML = "";
    if(arrearSubjects.length > 0){
        arrearHTML = arrearSubjects.map(a => {
            const parts = a.trim().split("-");
            const code = parts[0]?.trim() || "";
            const name = parts.slice(1).join("-").trim() || a;
            return `
            <label class="course-item" onclick="toggleCourse(this)">
                <input type="checkbox" value="${code}" data-name="${name}" data-fee="300" data-type="arrear">
                <span class="course-code" style="color:#d97706">${code}</span>
                <span class="course-name">${name} <span class="badge badge-warning" style="margin-left:.3rem">Arrear</span></span>
                <span class="course-meta">&#8377;300 per arrear subject</span>
            </label>`;
        }).join("");
    }

    el.innerHTML = `
        <div class="alert alert-info">Max regular courses: <strong>${elig.maxCoursesAllowed}</strong> &bull; Regular fee: &#8377;500/course &bull; Arrear fee: &#8377;300/subject</div>
        <div class="reg-tabs">
            <div class="rtab active" id="rtab-regular" onclick="switchRegTab('regular')">Regular Exam</div>
            ${arrearSubjects.length > 0 ? '<div class="rtab" id="rtab-arrear" onclick="switchRegTab(\'arrear\')">Arrear Exam</div>' : ''}
        </div>
        <div id="rtab-regular-content" class="course-grid">${regularHTML}</div>
        <div id="rtab-arrear-content" class="course-grid hidden">${arrearHTML}</div>
        <div class="reg-footer">
            <div>
                <div class="reg-summary" id="regSummary">0 courses selected</div>
                <div class="reg-fee" id="regFee">Total: &#8377;0</div>
            </div>
            <button class="btn-primary" onclick="submitRegistration(${elig.maxCoursesAllowed})">Register →</button>
        </div>
    `;
}

function switchRegTab(tab){
    document.querySelectorAll(".rtab").forEach(t=>t.classList.remove("active"));
    document.getElementById("rtab-"+tab).classList.add("active");
    ["regular","arrear"].forEach(t=>{
        const el = document.getElementById("rtab-"+t+"-content");
        if(el) el.classList.toggle("hidden", t!==tab);
    });
}

function toggleCourse(label){
    const cb = label.querySelector("input[type=checkbox]");
    cb.checked = !cb.checked;
    label.classList.toggle("selected", cb.checked);
    updateRegSummary();
}

function updateRegSummary(){
    const regularChecked = [...document.querySelectorAll("#rtab-regular-content input:checked")];
    const arrearChecked  = [...document.querySelectorAll("#rtab-arrear-content input:checked")];
    const regularFee     = regularChecked.length * 500;
    const arrearFee      = arrearChecked.length * 300;
    const total          = regularFee + arrearFee;
    const totalCount     = regularChecked.length + arrearChecked.length;

    const el1 = document.getElementById("regSummary");
    const el2 = document.getElementById("regFee");
    if(el1){
        let parts = [];
        if(regularChecked.length > 0) parts.push(regularChecked.length+" regular");
        if(arrearChecked.length  > 0) parts.push(arrearChecked.length+" arrear");
        el1.innerText = parts.length ? parts.join(", ")+" course"+(totalCount!==1?"s":"")+" selected" : "0 courses selected";
    }
    if(el2) el2.innerHTML = "Total: &#8377;"+total;
}

async function submitRegistration(maxAllowed){
    const regularChecked = [...document.querySelectorAll("#rtab-regular-content input:checked")];
    const arrearChecked  = [...document.querySelectorAll("#rtab-arrear-content input:checked")];

    if(regularChecked.length === 0 && arrearChecked.length === 0){
        alert("Please select at least one course"); return;
    }
    if(regularChecked.length > maxAllowed){
        alert("You can register max "+maxAllowed+" regular courses"); return;
    }

    const regularCourses = regularChecked.map(cb => cb.value+"|"+cb.dataset.name).join(",");
    const arrearCourses  = arrearChecked.map(cb => cb.value+"|"+cb.dataset.name).join(",");
    const totalFee = (regularChecked.length * 500) + (arrearChecked.length * 300);

    const examType = arrearChecked.length > 0 && regularChecked.length > 0 ? "BOTH"
                   : arrearChecked.length > 0 ? "ARREAR" : "REGULAR";

    try {
        const res = await fetch(API+"/exam/register",{
            method:"POST", headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ studentId:currentStudent.studentId, examType, registeredCourses:regularCourses, arrearCourses, totalFee })
        });
        const data = await res.json();
        if(!res.ok){ alert(data.error||"Registration failed"); return; }
        currentRegistration = data;
        loadDashboard();
        loadRegister();
    } catch(e){ alert("Error: "+e.message); }
}

function showExistingRegistration(el, reg, arrearSubjects){
    const regularRows = reg.registeredCourses ? reg.registeredCourses.split(",").filter(x=>x).map((c,i)=>{
        const parts = c.split("|");
        return `<tr><td>${i+1}</td><td>${parts[0]||""}</td><td>${parts[1]||c}</td><td><span class="badge badge-info">Regular</span></td></tr>`;
    }).join("") : "";

    const arrearRows = reg.arrearCourses ? reg.arrearCourses.split(",").filter(x=>x).map((c,i)=>{
        const parts = c.split("|");
        return `<tr><td>${i+1}</td><td>${parts[0]||""}</td><td>${parts[1]||c}</td><td><span class="badge badge-warning">Arrear</span></td></tr>`;
    }).join("") : "";

    el.innerHTML = `
        <div class="alert alert-success">&#10003; Registration complete — ${reg.examType} Examination</div>
        <div class="card">
            <div class="card-title">Registration Details</div>
            <table class="elig-table">
                <tr><th>Registration ID</th><td>#${reg.registrationId}</td></tr>
                <tr><th>Exam Type</th><td><span class="badge badge-info">${reg.examType}</span></td></tr>
                <tr><th>Total Fee</th><td><strong>&#8377;${calcCorrectFee(reg)}</strong></td></tr>
                <tr><th>Status</th><td><span class="badge badge-success">${reg.registrationStatus}</span></td></tr>
            </table>
        </div>
        ${regularRows || arrearRows ? `
        <div class="card">
            <div class="card-title">Registered Courses</div>
            <table class="elig-table">
                <thead><tr><th>#</th><th>Code</th><th>Course Name</th><th>Type</th></tr></thead>
                <tbody>${regularRows}${arrearRows}</tbody>
            </table>
        </div>` : ""}
        <p class="text-sm text-muted mt2">Proceed to <strong>Fee Payment</strong> to complete your registration.</p>
    `;
}

/* ============================================================
   PAYMENT
============================================================ */
async function loadPayment(){
    const el = document.getElementById("paymentContent");
    el.innerHTML = '<div class="loading-box">Loading...</div>';
    try {
        if(!currentRegistration){
            const regRes = await fetch(API+"/exam/student/"+currentStudent.studentId);
            if(!regRes.ok){ el.innerHTML='<div class="alert alert-warn">Complete exam registration first.</div>'; return; }
            currentRegistration = await regRes.json();
        }
        const payRes = await fetch(API+"/payment/registration/"+currentRegistration.registrationId);
        if(payRes.ok){
            currentPayment = await payRes.json();
            showPaymentSuccess(el, currentPayment);
            return;
        }
        renderPaymentForm(el, currentRegistration);
    } catch(e){ el.innerHTML='<div class="alert alert-error">Error: '+e.message+'</div>'; }
}

function renderPaymentForm(el, reg){
    const regularCount = reg.registeredCourses ? reg.registeredCourses.split(",").filter(x=>x.trim()).length : 0;
    const arrearCount  = reg.arrearCourses     ? reg.arrearCourses.split(",").filter(x=>x.trim()).length : 0;
    const regularFee   = regularCount * 500;
    const arrearFee    = arrearCount * 300;
    // Recalculate correct total in case backend had empty string bug
    const correctTotal = regularFee + arrearFee;

    el.innerHTML = `
        <div class="card" style="max-width:480px">
            <div class="card-title">Fee Summary</div>
            <div class="pay-info">
                ${regularCount > 0 ? `<div class="pay-row"><span>Regular Exam (${regularCount} courses × &#8377;500)</span><strong>&#8377;${regularFee}</strong></div>` : ""}
                ${arrearCount  > 0 ? `<div class="pay-row"><span>Arrear Exam (${arrearCount} subjects × &#8377;300)</span><strong>&#8377;${arrearFee}</strong></div>` : ""}
                <div class="pay-row pay-total"><span>Total Amount</span><strong>&#8377;${correctTotal}</strong></div>
            </div>
            <div class="form-group">
                <label>Account Number</label>
                <input type="text" id="payAccNo" placeholder="Enter your bank account number" maxlength="18">
            </div>
            <div class="form-group">
                <label>Enter 4-digit PIN</label>
                <div class="pin-dots" id="pinDots">
                    <div class="pin-dot"></div><div class="pin-dot"></div>
                    <div class="pin-dot"></div><div class="pin-dot"></div>
                </div>
                <div class="pin-keypad">
                    ${[1,2,3,4,5,6,7,8,9,"",0,"DEL"].map(k=>`<button class="pin-key ${k==="DEL"?"del":""}" onclick="pinPress('${k}')">${k}</button>`).join("")}
                </div>
            </div>
            <div class="error-msg" id="payErr"></div>
            <button class="btn-primary full mt2" onclick="submitPayment(${reg.registrationId}, ${correctTotal})">Pay &#8377;${correctTotal}</button>
        </div>
    `;
    enteredPin = "";
}

function pinPress(key){
    if(key === "" || key === "undefined") return;
    if(key === "DEL"){
        enteredPin = enteredPin.slice(0,-1);
    } else {
        if(enteredPin.length < 4) enteredPin += key;
    }
    const dots = document.querySelectorAll(".pin-dot");
    dots.forEach((d,i)=> d.classList.toggle("filled", i < enteredPin.length));
}

async function submitPayment(registrationId, amount){
    const accountNo = document.getElementById("payAccNo")?.value.trim();
    if(!accountNo || accountNo.length < 9){ setErr("payErr","Enter valid account number (min 9 digits)"); return; }
    if(enteredPin.length < 4){ setErr("payErr","Enter your 4-digit PIN"); return; }
    try {
        const res = await fetch(API+"/payment/pay",{
            method:"POST", headers:{"Content-Type":"application/json"},
            body:JSON.stringify({ registrationId, amount, accountNo, pin:enteredPin })
        });
        const data = await res.json();
        if(!res.ok){ setErr("payErr", data.error||"Payment failed"); return; }
        currentPayment = data;
        loadDashboard();
        showPaymentSuccess(document.getElementById("paymentContent"), data);
    } catch(e){ setErr("payErr","Error: "+e.message); }
}

function showPaymentSuccess(el, pay){
    el.innerHTML = `
        <div class="card" style="max-width:480px">
            <div class="txn-success">
                <div class="txn-icon">&#10003;</div>
                <div style="font-weight:700;font-size:1.1rem;color:#15803d">Payment Successful!</div>
                <div class="txn-id">Transaction ID: <strong>${pay.transactionId||pay.paymentId}</strong></div>
            </div>
            <div class="pay-info mt2">
                <div class="pay-row"><span>Amount Paid</span><strong>&#8377;${pay.amount}</strong></div>
                <div class="pay-row"><span>Account</span><strong>****${(pay.accountNo||"").slice(-4)}</strong></div>
                <div class="pay-row"><span>Date</span><strong>${pay.paymentDate ? new Date(pay.paymentDate).toLocaleDateString("en-IN") : "Today"}</strong></div>
                <div class="pay-row"><span>Status</span><strong style="color:#15803d">${pay.paymentStatus}</strong></div>
            </div>
            <button class="btn-primary full mt2" onclick="showSection('hallticket')">Generate Hall Ticket →</button>
        </div>
    `;
}

/* ============================================================
   HALL TICKET
============================================================ */
async function loadHallTicket(){
    const el = document.getElementById("hallticketContent");
    el.innerHTML = '<div class="loading-box">Loading...</div>';
    try {
        if(!currentRegistration){
            const regRes = await fetch(API+"/exam/student/"+currentStudent.studentId);
            if(!regRes.ok){ el.innerHTML='<div class="alert alert-warn">Complete exam registration first.</div>'; return; }
            currentRegistration = await regRes.json();
        }
        if(!currentPayment){
            const payRes = await fetch(API+"/payment/registration/"+currentRegistration.registrationId);
            if(!payRes.ok){ el.innerHTML='<div class="alert alert-warn">Complete fee payment first.</div>'; return; }
            currentPayment = await payRes.json();
        }
        // Try to get existing hall ticket
        const htRes = await fetch(API+"/hallticket/"+currentRegistration.registrationId);
        let ht;
        if(htRes.ok){
            ht = await htRes.json();
        } else {
            // Generate it
            const genRes = await fetch(API+"/hallticket/generate/"+currentRegistration.registrationId, {method:"POST"});
            if(!genRes.ok){ const err = await genRes.json(); el.innerHTML='<div class="alert alert-error">'+(err.error||"Could not generate hall ticket")+'</div>'; return; }
            ht = await genRes.json();
        }
        loadDashboard();
        renderHallTicket(el, ht);
    } catch(e){ el.innerHTML='<div class="alert alert-error">Error: '+e.message+'</div>'; }
}

async function renderHallTicket(el, ht){
    // Fetch full course details for the registered courses
    const allCoursesRes = await fetch(API+"/courses/semester/"+currentStudent.semester);
    const semCourses = allCoursesRes.ok ? await allCoursesRes.json() : [];
    const courseMap = {};
    semCourses.forEach(c => courseMap[c.courseCode] = c);

    const buildCourseRows = (coursesStr, type) => {
        if(!coursesStr) return "";
        return coursesStr.split(",").filter(x=>x).map((entry,i) => {
            const parts = entry.split("|");
            const code = parts[0]?.trim() || "";
            const name = parts[1]?.trim() || code;
            const course = courseMap[code];
            return `<tr>
                <td>${i+1}</td>
                <td>${code}</td>
                <td>${name}</td>
                <td>${course ? course.examDate : "—"}</td>
                <td>${course ? `<span class="course-session ${course.examSession==="FN"?"session-fn":"session-an"}">${course.examSession}</span>` : "—"}</td>
                <td><span class="badge ${type==="arrear"?"badge-warning":"badge-info"}">${type==="arrear"?"Arrear":"Regular"}</span></td>
            </tr>`;
        }).join("");
    };

    const regularRows = buildCourseRows(currentRegistration.registeredCourses, "regular");
    const arrearRows  = buildCourseRows(currentRegistration.arrearCourses, "arrear");

    const photoHTML = currentStudent.profilePhoto
        ? `<img src="${currentStudent.profilePhoto}" alt="Photo">`
        : `&#9786;`;

    el.innerHTML = `
        <div class="ht-actions">
            <button class="btn-primary" onclick="downloadHallTicket()">&#11015; Download PDF</button>
            <button class="btn-secondary" onclick="window.print()">&#128438; Print</button>
            <button class="btn-secondary" onclick="loadHallTicket()">&#8635; Refresh</button>
        </div>
        <div class="hall-ticket" id="hallTicketPrint">
            <div class="ht-header">
                <div class="ht-college-logo">LICET</div>
                <div class="ht-college-info">
                    <h3>Loyola-ICAM College of Engineering and Technology</h3>
                    <p>Affiliated to Anna University, Chennai | Accredited by NAAC</p>
                </div>
            </div>
            <div class="ht-title-bar">HALL TICKET — APRIL / MAY 2026 EXAMINATIONS</div>
            <div class="ht-body">
                <div class="ht-student-row">
                    <div class="ht-photo">${photoHTML}</div>
                    <div class="ht-student-details">
                        <div class="ht-field"><label>Student Name</label><span>${currentStudent.name}</span></div>
                        <div class="ht-field"><label>Register Number</label><span>${currentStudent.registerNo}</span></div>
                        <div class="ht-field"><label>Department</label><span>${currentStudent.department}</span></div>
                        <div class="ht-field"><label>Degree</label><span>${currentStudent.degree||"BE"}</span></div>
                        <div class="ht-field"><label>Semester</label><span>${currentStudent.semester}</span></div>
                        <div class="ht-field"><label>Academic Year</label><span>2025 – 2026</span></div>
                        <div class="ht-field"><label>Hall Ticket No.</label><span>HT${String(ht.hallTicketId).padStart(5,"0")}</span></div>
                        <div class="ht-field"><label>Exam Centre</label><span>${ht.examCenter}</span></div>
                    </div>
                </div>
                <div class="ht-courses-title">&#128196; Courses Registered</div>
                <table class="ht-courses-table">
                    <thead><tr><th>#</th><th>Course Code</th><th>Course Name</th><th>Exam Date</th><th>Session</th><th>Type</th></tr></thead>
                    <tbody>${regularRows}${arrearRows}</tbody>
                </table>
                <div class="ht-instructions">
                    <strong>Instructions to Candidates:</strong>
                    <ul>
                        <li>Candidates must carry this hall ticket to all examination sessions.</li>
                        <li>Hall ticket must be produced for verification by the invigilator.</li>
                        <li>Electronic devices are strictly prohibited in the examination hall.</li>
                        <li>FN session: 10:00 AM – 1:00 PM &nbsp;|&nbsp; AN session: 2:00 PM – 5:00 PM</li>
                        <li>Report 30 minutes before the commencement of the examination.</li>
                    </ul>
                </div>
            </div>
            <div class="ht-footer">
                <span>Issued on: ${new Date(ht.issueDate).toLocaleDateString("en-IN")}</span>
                <span>This is a computer-generated hall ticket</span>
                <span>Controller of Examinations</span>
            </div>
        </div>
    `;
}

/* ============================================================
   PROFILE
============================================================ */
async function loadProfile(){
    const el = document.getElementById("profileContent");
    el.innerHTML = '<div class="loading-box">Loading...</div>';
    try {
        const [stuRes, eligRes, regRes] = await Promise.all([
            fetch(API+"/student/"+currentStudent.studentId),
            fetch(API+"/student/"+currentStudent.studentId+"/eligibility"),
            fetch(API+"/exam/student/"+currentStudent.studentId)
        ]);
        const stu  = await stuRes.json();
        const elig = await eligRes.json();
        const regOk = regRes.ok;
        if(regOk) currentRegistration = await regRes.json();

        const arrearList = elig.arrearSubjects ? elig.arrearSubjects.split("|").filter(x=>x.trim()) : [];
        const arrearHTML = arrearList.length > 0
            ? arrearList.map(a=>`<span class="arrear-chip">${a.trim()}</span>`).join("")
            : '<span class="text-muted text-sm">No arrears</span>';

        const photoSrc = stu.profilePhoto || "";
        const photoHTML = photoSrc
            ? `<img src="${photoSrc}" alt="Profile">`
            : `&#9786;`;

        let regHTML = "";
        if(regOk && currentRegistration){
            const payRes = await fetch(API+"/payment/registration/"+currentRegistration.registrationId);
            const paid = payRes.ok;
            const htRes = await fetch(API+"/hallticket/"+currentRegistration.registrationId);
            const htDone = htRes.ok;

            const regularCourses = currentRegistration.registeredCourses
                ? currentRegistration.registeredCourses.split(",").filter(x=>x).map(c=>{ const p=c.split("|"); return p[1]||c; }).join(", ") : "—";
            const arrearCourses = currentRegistration.arrearCourses
                ? currentRegistration.arrearCourses.split(",").filter(x=>x).map(c=>{ const p=c.split("|"); return p[1]||c; }).join(", ") : "—";

            regHTML = `
            <div class="card mt2">
                <div class="card-title">Registration Status</div>
                <div class="reg-history-item">
                    <div class="rhi-header">
                        <span class="rhi-type">April / May 2026 — ${currentRegistration.examType}</span>
                        <span class="badge ${paid?"badge-success":"badge-warning"}">${paid?"Paid":"Payment Pending"}</span>
                    </div>
                    <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:.3rem">
                        <span class="badge badge-info">${currentRegistration.registrationStatus}</span>
                        ${htDone ? '<span class="badge badge-success">Hall Ticket Generated</span>' : ""}
                    </div>
                    ${regularCourses !== "—" ? `<div class="rhi-courses"><strong>Regular:</strong> ${regularCourses}</div>` : ""}
                    ${arrearCourses !== "—" ? `<div class="rhi-courses"><strong>Arrear:</strong> ${arrearCourses}</div>` : ""}
                    <div class="rhi-courses"><strong>Total Fee:</strong> &#8377;${calcCorrectFee(currentRegistration)}</div>
                </div>
            </div>`;
        }

        el.innerHTML = `
            <div class="profile-layout">
                <div>
                    <div class="profile-photo-card">
                        <div class="profile-pic" onclick="document.getElementById('photoUploadInput').click()">${photoHTML}</div>
                        <div class="profile-name">${stu.name}</div>
                        <div class="profile-reg">${stu.registerNo}</div>
                        <div class="profile-upload-btn" onclick="document.getElementById('photoUploadInput').click()">Upload Photo</div>
                        <input type="file" id="photoUploadInput" accept="image/*" onchange="uploadPhoto(event)">
                    </div>
                    <div class="card mt2">
                        <div class="card-title">Arrear Status</div>
                        <div style="margin-bottom:.3rem"><span class="badge ${elig.eligibilityStatus==="ELIGIBLE"?"badge-success":"badge-danger"}">${elig.eligibilityStatus}</span></div>
                        <div class="text-sm text-muted" style="margin-bottom:.5rem">Arrear count: <strong>${elig.arrearCount}</strong></div>
                        <div>${arrearHTML}</div>
                    </div>
                </div>
                <div>
                    <div class="card">
                        <div class="card-title">Personal Information</div>
                        <div class="info-grid">
                            <div class="info-field"><label>Full Name</label><span>${stu.name}</span></div>
                            <div class="info-field"><label>Register No</label><span>${stu.registerNo}</span></div>
                            <div class="info-field"><label>Department</label><span>${stu.department||"—"}</span></div>
                            <div class="info-field"><label>Degree</label><span>${stu.degree||"—"}</span></div>
                            <div class="info-field"><label>Semester</label><span>${stu.semester}</span></div>
                            <div class="info-field"><label>Year</label><span>${stu.year}</span></div>
                        </div>
                        <hr class="divider">
                        <div class="info-grid">
                            <div class="info-field"><label>Email</label><input type="email" id="editEmail" value="${stu.email||""}" placeholder="your@email.com"></div>
                            <div class="info-field"><label>Phone</label><input type="text" id="editPhone" value="${stu.phone||""}" placeholder="10-digit number"></div>
                        </div>
                        <div class="success-msg" id="profileSaveMsg"></div>
                        <button class="btn-primary mt2" onclick="saveProfile()">Save Changes</button>
                    </div>
                    ${regHTML}
                </div>
            </div>
        `;
    } catch(e){ el.innerHTML='<div class="alert alert-error">Error loading profile: '+e.message+'</div>'; }
}

async function saveProfile(){
    const email = document.getElementById("editEmail")?.value.trim();
    const phone = document.getElementById("editPhone")?.value.trim();
    try {
        const res = await fetch(API+"/student/"+currentStudent.studentId+"/profile",{
            method:"PUT", headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email, phone})
        });
        if(res.ok){
            currentStudent.email = email;
            currentStudent.phone = phone;
            document.getElementById("profileSaveMsg").innerText = "Profile updated successfully!";
            setTimeout(()=>{ const el=document.getElementById("profileSaveMsg"); if(el) el.innerText=""; }, 3000);
        }
    } catch(e){ alert("Error saving profile"); }
}

async function uploadPhoto(event){
    const file = event.target.files[0];
    if(!file) return;
    if(file.size > 2*1024*1024){ alert("Image must be under 2MB"); return; }
    const reader = new FileReader();
    reader.onload = async (e) => {
        const base64 = e.target.result;
        try {
            const res = await fetch(API+"/student/"+currentStudent.studentId+"/profile",{
                method:"PUT", headers:{"Content-Type":"application/json"},
                body:JSON.stringify({profilePhoto: base64})
            });
            if(res.ok){
                currentStudent.profilePhoto = base64;
                showPhoto(base64);
                loadProfile();
            }
        } catch(err){ alert("Upload failed"); }
    };
    reader.readAsDataURL(file);
}


/* ============================================================
   DOWNLOAD HALL TICKET AS PDF
============================================================ */
async function downloadHallTicket(){
    const el = document.getElementById("hallTicketPrint");
    if(!el){ alert("Hall ticket not loaded"); return; }

    const htHTML = el.outerHTML;
    const regNo  = currentStudent ? currentStudent.registerNo : "hallticket";

    const styles = `
        body{font-family:'Segoe UI',sans-serif;margin:20px;font-size:13px;}
        .hall-ticket{border:2px solid #1d4ed8;border-radius:8px;overflow:hidden;max-width:780px;margin:0 auto;}
        .ht-header{background:#0f2850;color:#fff;padding:1rem 1.5rem;display:flex;align-items:center;gap:1rem;}
        .ht-college-logo{width:48px;height:48px;background:rgba(255,255,255,.12);border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.9rem;flex-shrink:0;border:2px solid rgba(255,255,255,.2);color:#fff;}
        .ht-college-info h3{font-size:.95rem;font-weight:700;color:#fff;}
        .ht-college-info p{font-size:.75rem;color:#93c5fd;margin-top:2px;}
        .ht-title-bar{background:#1d4ed8;color:#fff;text-align:center;padding:.5rem;font-size:.82rem;font-weight:700;letter-spacing:.06em;}
        .ht-body{padding:1.2rem;}
        .ht-student-row{display:flex;gap:1.2rem;margin-bottom:1.2rem;padding-bottom:1.2rem;border-bottom:1px solid #e2e8f0;}
        .ht-photo{width:80px;height:95px;border:2px solid #e2e8f0;border-radius:4px;overflow:hidden;flex-shrink:0;display:flex;align-items:center;justify-content:center;background:#f8fafc;font-size:2rem;color:#94a3b8;}
        .ht-photo img{width:100%;height:100%;object-fit:cover;}
        .ht-student-details{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:.4rem;}
        .ht-field label{font-size:.65rem;color:#64748b;font-weight:600;text-transform:uppercase;display:block;}
        .ht-field span{font-size:.82rem;font-weight:600;color:#1e293b;display:block;}
        .ht-courses-title{font-size:.85rem;font-weight:700;color:#1e293b;margin-bottom:.6rem;}
        .ht-courses-table{width:100%;border-collapse:collapse;font-size:.78rem;}
        .ht-courses-table th{background:#0f2850;color:#fff;padding:6px 10px;text-align:left;font-size:.72rem;}
        .ht-courses-table td{padding:6px 10px;border-bottom:1px solid #f1f5f9;}
        .ht-courses-table tr:nth-child(even) td{background:#f8fafc;}
        .badge{display:inline-block;padding:2px 8px;border-radius:12px;font-size:.68rem;font-weight:700;}
        .badge-info{background:#dbeafe;color:#1d4ed8;}
        .badge-warning{background:#fef9c3;color:#a16207;}
        .course-session{display:inline-block;padding:2px 7px;border-radius:8px;font-size:.68rem;font-weight:600;}
        .session-fn{background:#eff6ff;color:#1d4ed8;}
        .session-an{background:#fef3c7;color:#d97706;}
        .ht-instructions{background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:.7rem .9rem;margin-top:.8rem;font-size:.72rem;color:#92400e;}
        .ht-instructions ul{padding-left:1.1rem;margin-top:.3rem;}
        .ht-instructions li{margin-bottom:.2rem;}
        .ht-footer{background:#f8fafc;border-top:1px solid #e2e8f0;padding:.8rem 1.2rem;display:flex;justify-content:space-between;align-items:center;font-size:.72rem;color:#64748b;}
    `;

    // Build a complete HTML page and convert to a Blob, then trigger download
    const fullHTML = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Hall Ticket — ${regNo}</title>
<style>${styles}</style>
</head>
<body>${htHTML}</body>
</html>`;

    const blob = new Blob([fullHTML], {type: "text/html"});
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = "HallTicket_" + regNo + ".html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}


/* ============================================================
   FEE HELPER — always recalculate from course counts
============================================================ */
function calcCorrectFee(reg){
    const rc = reg.registeredCourses ? reg.registeredCourses.split(",").filter(x=>x.trim()).length : 0;
    const ac = reg.arrearCourses     ? reg.arrearCourses.split(",").filter(x=>x.trim()).length : 0;
    return (rc * 500) + (ac * 300);
}

/* ============================================================
   HELPERS
============================================================ */
function setErr(id, msg){ const el=document.getElementById(id); if(el) el.innerText=msg; }