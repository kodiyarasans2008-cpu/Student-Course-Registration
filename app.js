const COURSES=[
{id:"CS101",name:"Java Programming",credits:4,capacity:40,desc:"Object-oriented programming and core Java concepts."},
{id:"CS102",name:"Python Programming",credits:4,capacity:45,desc:"Python fundamentals, functions, collections and modules."},
{id:"CS103",name:"Data Structures",credits:4,capacity:40,desc:"Linked lists, stacks, queues, trees and algorithms."},
{id:"CS104",name:"Database Management",credits:3,capacity:50,desc:"SQL, relational databases, normalization and transactions."},
{id:"CS105",name:"Web Technology",credits:3,capacity:45,desc:"HTML, CSS, JavaScript and modern web development."},
{id:"CS106",name:"Computer Networks",credits:3,capacity:35,desc:"Networking models, protocols, IP addressing and security."},
{id:"CS107",name:"Operating Systems",credits:4,capacity:40,desc:"Processes, threads, memory and file management."},
{id:"CS108",name:"Artificial Intelligence",credits:3,capacity:30,desc:"AI fundamentals, search methods and intelligent systems."}
];

/* LINKED LIST */
class Node{constructor(course){this.course=course;this.next=null}}
class LinkedList{
 constructor(){this.head=null;this.size=0}
 add(course){let n=new Node(course);if(!this.head)this.head=n;else{let c=this.head;while(c.next)c=c.next;c.next=n}this.size++}
 remove(id){let c=this.head,p=null;while(c){if(c.course.id===id){if(p)p.next=c.next;else this.head=c.next;this.size--;return true}p=c;c=c.next}return false}
 contains(id){let c=this.head;while(c){if(c.course.id===id)return true;c=c.next}return false}
 array(){let a=[],c=this.head;while(c){a.push(c.course);c=c.next}return a}
}

/* Demo data persisted in browser */
let user=JSON.parse(localStorage.getItem("crs_user")||"null");
let allStudents=JSON.parse(localStorage.getItem("crs_students")||"[]");
let registrations=JSON.parse(localStorage.getItem("crs_registrations")||"[]");
let list=new LinkedList();

const $=id=>document.getElementById(id);
const toast=m=>{$("toast").textContent=m;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),2200)};
const save=()=>{localStorage.setItem("crs_user",JSON.stringify(user));localStorage.setItem("crs_students",JSON.stringify(allStudents));localStorage.setItem("crs_registrations",JSON.stringify(registrations))};

function studentCourses(){
 list=new LinkedList();
 registrations.filter(r=>r.studentId===user?.id).forEach(r=>{let c=COURSES.find(x=>x.id===r.courseId);if(c)list.add(c)});
 return list;
}
function countForCourse(id){return registrations.filter(r=>r.courseId===id).length}

function enterStudent(){
 const name=$("studentName").value.trim(),id=$("studentId").value.trim(),dept=$("studentDept").value;
 if(!name||!id){toast("Enter Student Name and ID.");return}
 user={type:"student",name,id,dept};
 if(!allStudents.some(s=>s.id===id))allStudents.push({id,name,dept});
 save();openApp("student");toast("Student login successful!");
}
function enterAdmin(){
 if($("adminId").value==="admin"&&$("adminPass").value==="admin123"){user={type:"admin",name:"Officer",id:"ADMIN001"};save();openApp("admin");toast("Officer login successful!")}
 else toast("Invalid demo login. Use admin / admin123");
}
function openApp(type){
 $("loginScreen").classList.add("hidden");$("app").classList.remove("hidden");
 $("studentNav").classList.toggle("hidden",type!=="student");$("adminNav").classList.toggle("hidden",type!=="admin");
 $("userMini").innerHTML=`<div class="user-mini"><div class="mini-avatar">${type==="admin"?"A":"S"}</div><div><b>${user.name}</b><small>${user.id}</small></div></div>`;
 showPage(type==="admin"?"adminDashboard":"dashboard");
}
function showPage(page){
 document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
 $(page)?.classList.add("active");
 document.querySelectorAll(".nav").forEach(n=>n.classList.toggle("active",n.dataset.page===page));
 const titles={dashboard:"Dashboard",courses:"Courses",register:"Register Course",mycourses:"My Courses",search:"Search Courses",profile:"Profile",adminDashboard:"Admin Dashboard",students:"Students",adminCourses:"Course Management",registrations:"Registrations",about:"About Project"};
 $("pageTitle").textContent=titles[page]||"Dashboard";
 if(page==="dashboard")renderDashboard();
 if(page==="courses")renderCourses();
 if(page==="register")fillRegister();
 if(page==="mycourses")renderMyCourses();
 if(page==="profile")renderProfile();
 if(page==="adminDashboard")renderAdmin();
 if(page==="students")renderStudents();
 if(page==="adminCourses")renderAdminCourses();
 if(page==="registrations")renderRegistrations();
 $("sidebar")?.classList.remove("open");
}
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>showPage(n.dataset.page));
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>showPage(b.dataset.go));

function renderDashboard(){
 const l=studentCourses(),a=l.array(),credits=a.reduce((s,c)=>s+c.credits,0);
 $("welcome").textContent=user.name;
 $("studentStats").innerHTML=`<div class="stat"><span class="stat-icon">👤</span><div><small>Student ID</small><strong>${user.id}</strong></div></div><div class="stat"><span class="stat-icon">📚</span><div><small>Available Courses</small><strong>${COURSES.length}</strong></div></div><div class="stat"><span class="stat-icon">🎒</span><div><small>Registered</small><strong>${a.length}</strong></div></div><div class="stat"><span class="stat-icon">⭐</span><div><small>Total Credits</small><strong>${credits}</strong></div></div>`;
 $("linkedPreview").innerHTML=a.length?a.map((c,i)=>`<div class="node">${c.id}<br><b>${c.name}</b></div>${i<a.length-1?'<span class="arrow">→</span>':''}`).join(""):'<span class="muted">No registered courses yet.</span>';
}
function bubbleSort(arr,key){
 for(let i=0;i<arr.length-1;i++)for(let j=0;j<arr.length-i-1;j++){
  if((typeof arr[j][key]==="string"?arr[j][key].toLowerCase():arr[j][key])>(typeof arr[j+1][key]==="string"?arr[j+1][key].toLowerCase():arr[j+1][key]))[0]&&(function(){let t=arr[j];arr[j]=arr[j+1];arr[j+1]=t})();
 }
 return arr;
}
function sortCourses(){
 let key=$("sort").value==="name"?"name":$("sort").value==="credits"?"credits":$("sort").value==="seats"?"capacity":"id";
 let a=COURSES.map(c=>({...c}));
 for(let i=0;i<a.length-1;i++)for(let j=0;j<a.length-i-1;j++){
  let x=key==="name"?a[j].name.toLowerCase():key==="credits"?a[j].credits:key==="capacity"?a[j].capacity:a[j].id;
  let y=key==="name"?a[j+1].name.toLowerCase():key==="credits"?a[j+1].credits:key==="capacity"?a[j+1].capacity:a[j+1].id;
  if(x>y){let t=a[j];a[j]=a[j+1];a[j+1]=t}
 }return a;
}
function renderCourses(){
 $("courseGrid").innerHTML=sortCourses().map(c=>{
  let registered=studentCourses().contains(c.id),used=countForCourse(c.id),left=Math.max(0,c.capacity-used);
  return `<div class="course-card"><span class="course-code">${c.id}</span><h3>${c.name}</h3><p>${c.desc}</p><div class="meta"><span>⭐ ${c.credits} Credits</span><span>👥 ${left}/${c.capacity} Seats</span></div>${registered?'<div class="registered">✓ Registered</div>':left===0?'<div class="registered" style="background:#fff1f2;color:#be123c">Seats Full</div>':`<button class="primary" onclick="registerCourse('${c.id}')">Register</button>`}</div>`;
 }).join("");
}
function fillRegister(){
 let available=COURSES.filter(c=>!studentCourses().contains(c.id)&&countForCourse(c.id)<c.capacity);
 $("registerSelect").innerHTML=available.length?available.map(c=>`<option value="${c.id}">${c.id} — ${c.name} (${c.credits} credits)</option>`).join(""):'<option>No available courses</option>';
}
function registerCourse(id){
 if(!user||user.type!=="student")return;
 if(studentCourses().contains(id)){toast("Course already registered.");return}
 let c=COURSES.find(x=>x.id===id);if(!c)return;
 if(countForCourse(id)>=c.capacity){toast("Seats are full.");return}
 registrations.push({studentId:user.id,studentName:user.name,courseId:id,courseName:c.name,credits:c.credits,date:new Date().toLocaleString()});
 save();renderDashboard();renderCourses();fillRegister();renderMyCourses();toast(`${c.name} registered successfully!`);
}
function renderMyCourses(){
 let a=studentCourses().array();
 $("myCourses").innerHTML=a.length?`<table class="table"><thead><tr><th>Course ID</th><th>Course Name</th><th>Credits</th><th>Registered On</th><th>Action</th></tr></thead><tbody>${a.map(c=>{let r=registrations.find(x=>x.studentId===user.id&&x.courseId===c.id);return `<tr><td><b>${c.id}</b></td><td>${c.name}</td><td>${c.credits}</td><td>${r?.date||"-"}</td><td><button class="danger" onclick="dropCourse('${c.id}')">Drop</button></td></tr>`}).join("")}</tbody></table>`:'<p class="muted">No courses registered yet.</p>';
}
function dropCourse(id){
 let c=COURSES.find(x=>x.id===id);
 if(confirm(`Drop ${c.name}?`)){registrations=registrations.filter(r=>!(r.studentId===user.id&&r.courseId===id));save();renderMyCourses();renderDashboard();renderCourses();fillRegister();toast(`${c.name} dropped.`)}
}
/* LINEAR SEARCH */
function linearSearch(q){
 q=q.toLowerCase().trim();
 for(let i=0;i<COURSES.length;i++)if(COURSES[i].id.toLowerCase()===q||COURSES[i].name.toLowerCase().includes(q))return COURSES[i];
 return null;
}
function doSearch(){
 let q=$("searchInput").value;if(!q){$("searchResult").innerHTML="";return}
 let c=linearSearch(q);
 $("searchResult").innerHTML=c?`<div class="result"><span class="course-code">${c.id}</span><h3>${c.name}</h3><p>${c.desc}</p><div class="meta"><span>⭐ ${c.credits} Credits</span><span>👥 ${Math.max(0,c.capacity-countForCourse(c.id))}/${c.capacity} Seats</span></div>${studentCourses().contains(c.id)?'<div class="registered">✓ Already Registered</div>':`<button class="primary" onclick="registerCourse('${c.id}')">Register This Course</button>`}</div>`:'<div class="result"><b>No course found.</b><p class="muted">Try CS101 or Java Programming.</p></div>';
}
function renderProfile(){$("profileName").textContent=user.name;$("profileId").textContent=`Student ID: ${user.id}`;$("profileDept").textContent=`Department: ${user.dept}`}

function renderAdmin(){
 $("adminStats").innerHTML=`<div class="stat"><span class="stat-icon">👨‍🎓</span><div><small>Total Students</small><strong>${allStudents.length}</strong></div></div><div class="stat"><span class="stat-icon">📚</span><div><small>Total Courses</small><strong>${COURSES.length}</strong></div></div><div class="stat"><span class="stat-icon">📝</span><div><small>Registrations</small><strong>${registrations.length}</strong></div></div><div class="stat"><span class="stat-icon">⭐</span><div><small>Credits Registered</small><strong>${registrations.reduce((s,r)=>s+r.credits,0)}</strong></div></div>`;
 let recent=registrations.slice(-6).reverse();
 $("recentRegs").innerHTML=recent.length?`<table class="table"><thead><tr><th>Student</th><th>Course</th><th>Credits</th><th>Date</th></tr></thead><tbody>${recent.map(r=>`<tr><td>${r.studentName}<br><span class="muted">${r.studentId}</span></td><td>${r.courseName}</td><td>${r.credits}</td><td>${r.date}</td></tr>`).join("")}</tbody></table>`:'<p class="muted">No registrations yet.</p>';
}
function renderStudents(){
 $("studentsTable").innerHTML=allStudents.length?`<table class="table"><thead><tr><th>Student ID</th><th>Name</th><th>Department</th><th>Courses</th></tr></thead><tbody>${allStudents.map(s=>`<tr><td><b>${s.id}</b></td><td>${s.name}</td><td>${s.dept}</td><td>${registrations.filter(r=>r.studentId===s.id).length}</td></tr>`).join("")}</tbody></table>`:'<p class="muted">No students logged in yet.</p>';
}
function renderAdminCourses(){
 $("adminCourseTable").innerHTML=`<table class="table"><thead><tr><th>Course ID</th><th>Course</th><th>Credits</th><th>Capacity</th><th>Registered</th><th>Available</th></tr></thead><tbody>${COURSES.map(c=>{let n=countForCourse(c.id);return `<tr><td><b>${c.id}</b></td><td>${c.name}</td><td>${c.credits}</td><td>${c.capacity}</td><td>${n}</td><td>${Math.max(0,c.capacity-n)}</td></tr>`}).join("")}</tbody></table>`;
}
function renderRegistrations(){
 $("registrationsTable").innerHTML=registrations.length?`<table class="table"><thead><tr><th>Student</th><th>Course</th><th>Credits</th><th>Date</th></tr></thead><tbody>${registrations.map(r=>`<tr><td>${r.studentName}<br><span class="muted">${r.studentId}</span></td><td>${r.courseId} — ${r.courseName}</td><td>${r.credits}</td><td>${r.date}</td></tr>`).join("")}</tbody></table>`:'<p class="muted">No registrations found.</p>';
}

document.querySelectorAll(".tab").forEach(t=>t.onclick=()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");$("studentLogin").classList.toggle("hidden",t.dataset.login!=="student");$("adminLogin").classList.toggle("hidden",t.dataset.login!=="admin")});
$("studentLoginBtn").onclick=enterStudent;$("adminLoginBtn").onclick=enterAdmin;
$("sort").onchange=renderCourses;$("registerBtn").onclick=()=>registerCourse($("registerSelect").value);
$("searchBtn").onclick=doSearch;$("searchInput").onkeydown=e=>{if(e.key==="Enter")doSearch()};
$("menu").onclick=()=>document.querySelector(".sidebar").classList.toggle("open");
$("logout").onclick=()=>{user=null;localStorage.removeItem("crs_user");$("app").classList.add("hidden");$("loginScreen").classList.remove("hidden")};

function clock(){$("dateTime").textContent=new Date().toLocaleString([],{dateStyle:"medium",timeStyle:"short"})}
setInterval(clock,1000);clock();
if(user)openApp(user.type);
