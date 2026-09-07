const seedTasks=[
 {title:"完成高三第一次月考组织方案",dept:"教务处",owner:"张建国",due:"9月9日",status:"urgent",label:"紧急",detail:"考场安排与监考名单"},
 {title:"新学期校园安全专项检查",dept:"政教处",owner:"刘海峰",due:"9月10日",status:"progress",label:"进行中",detail:"消防、门卫与学生宿舍"},
 {title:"青年教师培养计划定稿",dept:"办公室",owner:"李静",due:"9月12日",status:"review",label:"待验收",detail:"导师名单与学期培养节点"},
 {title:"食堂燃气安全整改复查",dept:"总务处",owner:"周国强",due:"9月9日",status:"urgent",label:"紧急",detail:"提交整改照片与复查记录"},
 {title:"高一家长会流程与分工",dept:"高一年级",owner:"陈晓琳",due:"9月15日",status:"progress",label:"进行中",detail:"议程、场地及家长通知"},
 {title:"秋季运动会前期筹备",dept:"政教处",owner:"王明远",due:"9月18日",status:"progress",label:"进行中",detail:"项目设置与工作小组"}
];
let tasks=JSON.parse(localStorage.getItem("schoolTasks")||"null")||seedTasks;
const taskList=document.querySelector("#taskList"),fullTaskList=document.querySelector("#fullTaskList");
function row(t){return `<div class="task-row" data-status="${t.status}"><i class="status-dot ${t.status}"></i><div class="task-main"><b>${t.title}</b><span>${t.dept} · ${t.detail||"按要求推进并及时反馈"}</span></div><div class="task-owner"><b>${t.owner}</b><span>负责人</span></div><div class="task-due"><b>${t.due}</b><span>截止时间</span></div><span class="badge ${t.status}">${t.label}</span></div>`}
function render(filter="all",query=""){const visible=tasks.filter(t=>(filter==="all"||t.status===filter)&&(!query||[t.title,t.owner,t.dept].join("").includes(query)));taskList.innerHTML=visible.slice(0,4).map(row).join("")||"<p>暂无符合条件的任务</p>";fullTaskList.innerHTML=visible.map(row).join("")||"<p>暂无符合条件的任务</p>";document.querySelector("#totalCount").textContent=24+Math.max(0,tasks.length-seedTasks.length)}
render();
document.querySelectorAll(".nav-item").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".nav-item,.view").forEach(x=>x.classList.remove("active"));btn.classList.add("active");document.querySelector("#"+btn.dataset.view).classList.add("active")});
document.querySelectorAll("[data-go]").forEach(btn=>btn.onclick=()=>document.querySelector(`[data-view="${btn.dataset.go}"]`).click());
document.querySelectorAll(".filter").forEach(btn=>btn.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");render(btn.dataset.filter)});
const dialog=document.querySelector("#taskDialog");["openTask","openTask2"].forEach(id=>document.querySelector("#"+id).onclick=()=>dialog.showModal());["closeTask","cancelTask"].forEach(id=>document.querySelector("#"+id).onclick=()=>dialog.close());
document.querySelector("#taskForm").onsubmit=e=>{e.preventDefault();const d=new FormData(e.target),urgent=d.get("priority")==="urgent";tasks.unshift({title:d.get("title"),dept:d.get("department"),owner:d.get("owner"),due:d.get("due").slice(5).replace("-","月")+"日",status:urgent?"urgent":"progress",label:urgent?"紧急":"进行中",detail:d.get("detail")});localStorage.setItem("schoolTasks",JSON.stringify(tasks));render();dialog.close();e.target.reset();const toast=document.querySelector("#toast");toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200)};
document.querySelector("#searchTask").oninput=e=>render(document.querySelector("#statusSelect").value,e.target.value.trim());document.querySelector("#statusSelect").onchange=e=>render(e.target.value,document.querySelector("#searchTask").value.trim());
const deps=[["办公室",12,95],["教务处",18,92],["政教处",15,86],["总务处",11,78],["高一年级",9,89],["高二年级",8,91],["高三年级",14,84]];
document.querySelector("#departmentGrid").innerHTML=deps.map(d=>`<article class="panel department"><div class="department-top"><div><h3>${d[0]}</h3><small>本周任务</small></div><strong>${d[1]}</strong></div><div class="mini"><i style="width:${d[2]}%"></i></div><div class="department-footer"><span>按时完成率 ${d[2]}%</span><span>${Math.max(1,Math.round(d[1]*(100-d[2])/100))} 项需关注</span></div></article>`).join("");
const meetings=[["周一","7","08:30 年级主任例会"],["周二","8","09:00 行政办公会","16:10 青年教师座谈"],["周三","9","14:00 教学质量分析"],["周四","10","10:00 安全整改复查"],["周五","11","15:30 本周工作复盘"]];
document.querySelector("#weekGrid").innerHTML=meetings.map(d=>`<div class="day"><h4>${d[0]}<span>${d[1]}</span></h4>${d.slice(2).map(x=>`<div class="meeting"><time>${x.slice(0,5)}</time>${x.slice(6)}</div>`).join("")}</div>`).join("");
document.querySelector("#copyReport").onclick=async()=>{await navigator.clipboard.writeText(document.querySelector(".report").innerText);const t=document.querySelector("#toast");t.textContent="校务简报已复制";t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)};
