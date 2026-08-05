
const P=window.STUDY_PLAN,K="mcu40quest-v1";let S=load(),day=initial();
function base(){return{tasks:{},debugDone:{},mastered:{},notes:{},checkedIn:{},strict:true}}
function load(){try{return{...base(),...JSON.parse(localStorage.getItem(K)||"{}")}}catch(e){return base()}}
function save(){localStorage.setItem(K,JSON.stringify(S));stats()}
function iso(){return new Date().toLocaleDateString("sv-SE")}
function tkey(d,s){return d+"-"+s} function task(d,s){return!!S.tasks[tkey(d,s)]}
function qdone(id){return!!S.mastered[id]} function debugDone(d){return!!S.debugDone[d]} function taskCount(d){return P.meta.subjects.filter(x=>task(d,x.key)).length}
function qscore(d){let a=P.days[d-1].questions,n=a.filter(q=>qdone(q.id)).length;return Math.round(n/a.length*100)}
function notesOK(d){return(S.notes[d]||"").trim().length>=20}
function passed(d){let x=P.days[d-1];return taskCount(d)===6&&debugDone(d)&&qscore(d)>=x.passScore&&notesOK(d)}
function unlocked(d){return!S.strict||d===1||passed(d-1)||passed(d)}
function initial(){let n=Math.floor((new Date()-new Date(P.meta.startDate+"T00:00:00"))/86400000)+1;if(n>=1&&n<=40)return n;let x=P.days.find(d=>!passed(d.day));return x?x.day:40}
function esc(x){return String(x).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function toast(x){let t=document.querySelector(".toast");t.textContent=x;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1700)}
function streak(){let n=0,d=new Date(iso()+"T00:00:00");for(let i=0;i<365;i++){let k=d.toLocaleDateString("sv-SE");if(S.checkedIn[k]){n++;d.setDate(d.getDate()-1)}else if(i===0)d.setDate(d.getDate()-1);else break}return n}
function stats(){document.querySelector("#statDays").textContent=P.days.filter(x=>passed(x.day)).length+"/40";let done=0;P.days.forEach(x=>{P.meta.subjects.forEach(s=>done+=task(x.day,s.key)?1:0);done+=debugDone(x.day)?1:0});document.querySelector("#statTasks").textContent=Math.round(done/280*100)+"%";document.querySelector("#statStreak").textContent=streak()+"天";document.querySelector("#statQuestions").textContent=P.meta.questionCount}
function nav(){let e=document.querySelector("#dayList");e.innerHTML="";P.days.forEach(x=>{let b=document.createElement("button");b.className=`day-dot ${passed(x.day)?"done":""} ${x.day===day?"current":""} ${!unlocked(x.day)?"locked":""}`;b.innerHTML=x.day+`<span class="mini">${passed(x.day)?"✓":!unlocked(x.day)?"🔒":""}</span>`;b.title=`Day ${x.day}｜${x.title}`;b.onclick=()=>{if(!unlocked(x.day))return toast("先通过上一关，或关闭严格解锁");day=x.day;render()};e.appendChild(b)})}
function qhtml(q){return`<article class="question ${qdone(q.id)?"mastered":""}" data-id="${q.id}"><div class="q-main"><div class="q-meta"><span class="tag">${esc(q.subject)}</span><span class="tag">${esc(q.difficulty)}</span><span class="tag">${esc(q.type)}</span></div><div class="q-text">${esc(q.question)}</div><div class="q-actions"><button class="btn small reveal">查看参考</button><button class="btn small mark ${qdone(q.id)?"mastered":""}">${qdone(q.id)?"✓ 已掌握":"标记掌握"}</button></div></div><div class="answer">${esc(q.answer)}</div></article>`}
function bindQ(e,rerender=true){e.querySelectorAll(".reveal").forEach(b=>b.onclick=()=>b.closest(".question").classList.toggle("open"));e.querySelectorAll(".mark").forEach(b=>b.onclick=()=>{let id=b.closest(".question").dataset.id;S.mastered[id]=!S.mastered[id];save();if(rerender)render();else{b.closest(".question").classList.toggle("mastered");b.textContent=S.mastered[id]?"✓ 已掌握":"标记掌握"}})}
function render(){nav();let d=P.days[day-1],e=document.querySelector("#dayContent");if(!unlocked(day)){e.innerHTML=`<div class="panel"><h2>🔒 第${day}关未解锁</h2><p>先完成上一关，或关闭严格解锁。</p></div>`;return}
let cards=P.meta.subjects.map(m=>{let s=d[m.key];return`<section class="subject-card detailed-card">
<div class="subject-top"><div><div class="subject-name">${m.icon} ${m.label}</div><h4>${esc(s.topic)}</h4></div><span class="subject-time">${s.minutes}分钟</span></div>
<div class="why-box"><strong>为什么学：</strong>${esc(s.why)}</div>
<div class="study-block"><h5>① 今天具体学什么</h5><ul>${s.learn.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
<div class="study-block method-block"><h5>② 今天怎么学</h5><ol>${s.how.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>
<div class="study-block"><h5>③ 当天训练</h5><p>${esc(s.practice)}</p></div>
<div class="study-block mastery-block"><h5>④ 学到什么程度算过关</h5><ul>${s.mastery.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
<details class="advanced-box"><summary>进阶标准：达到什么程度算“熟练”</summary><ul>${s.advanced.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>
<div class="deliver-box"><strong>当天必须留下的成果</strong><div class="deliver-grid">${s.deliverables.map(x=>`<span>□ ${esc(x)}</span>`).join("")}</div></div>
<label class="task-check"><input type="checkbox" data-task="${m.key}" ${task(day,m.key)?"checked":""}><span><strong>本科目已达到最低过关线</strong><div class="evidence">${esc(s.evidence)}</div></span></label>
</section>`}).join("");
let pct=Math.round(taskCount(day)/6*45+(debugDone(day)?15:0)+qscore(day)*.30+(notesOK(day)?10:0));
e.innerHTML=`<div class="panel"><div class="day-header"><div class="day-title"><span class="badge">${esc(d.phase.name)}</span><h2>Day ${d.day}｜${esc(d.title)}</h2><div class="muted">${d.date_cn} · 计划约${(d.totalMinutes/60).toFixed(1)}小时</div><p>${esc(d.focus)}</p></div><div class="day-score"><div class="score-big">${pct}%</div><div class="muted">今日完成度</div><div class="progress"><i style="width:${pct}%"></i></div></div></div>
<div class="execution-note"><strong>📌 今日执行原则</strong><span>每科按“闭卷回忆 → 学原理 → 做题/实验 → 证据验证 → 复盘重写”完成。勾选不是看完，而是达到卡片中的最低过关线。</span></div>
<div class="subject-grid">${cards}</div>
<section class="debug-card">
  <div class="debug-head"><div><span class="debug-label">🛠️ 每日调试主线</span><h3>${esc(d.debug.scenario)}</h3></div><span class="subject-time">${esc(d.debug.tools)}</span></div>
  <div class="debug-grid">
    <div><h5>故障注入</h5><p>${esc(d.debug.faultInjection)}</p></div>
    <div><h5>固定排查路径</h5><ol>${d.debug.workflow.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></div>
    <div><h5>必须保留的证据</h5><ul>${d.debug.evidence.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
    <div><h5>调试过关线</h5><p>${esc(d.debug.pass)}</p></div>
  </div>
  <label class="debug-check"><input type="checkbox" id="debugDone" ${debugDone(day)?"checked":""}><span><strong>我已经完成“复现—测量—定位—修复—回归”闭环</strong><small>只把代码改到能运行，不算调试通过。</small></span></label>
</section>
<div class="project-card"><strong>🏁 当日作品</strong><p>${esc(d.project)}</p></div><div class="questions-head"><div><h3>题库闯关｜${d.questions.length}题</h3><div class="muted">先闭卷作答，再看参考；看懂不等于掌握。</div></div><div><strong>${qscore(day)}%</strong> / 要求${d.passScore}%</div></div><div id="questions">${d.questions.map(qhtml).join("")}</div><h3>今日复盘</h3><textarea class="notes" id="notes" placeholder="至少20字：最难点、验证证据、错题和改进。">${esc(S.notes[day]||"")}</textarea><div class="gate ${passed(day)?"pass":""}"><div><strong>${passed(day)?"✅ 已通过本关":"⏳ 尚未过关"}</strong><div class="muted">六科${taskCount(day)}/6 · 调试${debugDone(day)?"通过":"未通过"} · 题库${qscore(day)}%/${d.passScore}% · 复盘${notesOK(day)?"达标":"至少20字"}</div></div><div class="top-actions"><button class="btn soft" id="log">生成打卡</button><button class="btn primary" id="check">${passed(day)?"今日打卡":"检查条件"}</button></div></div></div>`;
e.querySelectorAll("[data-task]").forEach(c=>c.onchange=()=>{S.tasks[tkey(day,c.dataset.task)]=c.checked;save();render()});e.querySelector("#debugDone").onchange=x=>{S.debugDone[day]=x.target.checked;save();render()};bindQ(e);e.querySelector("#notes").oninput=x=>{S.notes[day]=x.target.value;save()};e.querySelector("#check").onclick=()=>{if(!passed(day))return toast("还差任务、题库或复盘");S.checkedIn[iso()]=true;save();nav();toast("打卡成功，下一关已解锁")};e.querySelector("#log").onclick=()=>log(d)}
function log(d){let subs=P.meta.subjects.filter(s=>task(d.day,s.key)).map(s=>s.label).join("、");let txt=`# MCU 40天打卡｜Day ${String(d.day).padStart(2,"0")}\n\n- 打卡日期：${iso()}\n- 计划日期：${d.date}\n- 主题：${d.title}\n- 完成科目：${subs||"暂无"}\n- 题库掌握率：${qscore(d.day)}%\n- 当日作品：${d.project}\n\n## 复盘\n\n${S.notes[d.day]||"待填写"}\n\n## Commit\n\n\`day ${String(d.day).padStart(2,"0")}: ${d.title}\`\n`;download(txt,`day-${String(d.day).padStart(2,"0")}-checkin.md`,"text/markdown")}
function download(x,name,type){let a=document.createElement("a"),u=URL.createObjectURL(new Blob([x],{type}));a.href=u;a.download=name;a.click();URL.revokeObjectURL(u)}
function map(){document.querySelector("#mapPhases").innerHTML=P.meta.phases.map(p=>`<section class="phase-card"><span class="badge">Day ${p.start}–${p.end}</span><h2>${esc(p.name)}</h2><p class="muted">${esc(p.description)}</p><div class="phase-days">${P.days.filter(d=>d.day>=p.start&&d.day<=p.end).map(d=>`<div class="map-day ${passed(d.day)?"done":""}"><div class="muted">Day ${d.day} · ${d.date.slice(5)}</div><h4>${esc(d.title)}</h4><p>${esc(d.focus)}</p></div>`).join("")}</div></section>`).join("")}
function long(){let x=P.longTerm;document.querySelector("#longContent").innerHTML=`<div class="panel"><span class="eyebrow">♻️ 长期复用</span><h2>40天后的8周循环</h2><ul>${x.rules.map(r=>`<li>${esc(r)}</li>`).join("")}</ul><div class="week-grid">${x.week.map(w=>`<div class="week-card"><span class="badge">${w[0]}</span><h3>${w[1]}</h3><p class="muted">${w[2]}</p></div>`).join("")}</div></div>`}
function random(){let n=+document.querySelector("#randomCount").value,f=document.querySelector("#randomDifficulty").value,p=P.days.flatMap(d=>d.questions.map(q=>({...q,day:d.day,title:d.title})));if(f!=="全部")p=p.filter(q=>q.difficulty===f);p=p.sort(()=>Math.random()-.5).slice(0,n);let e=document.querySelector("#randomList");e.innerHTML=p.map(q=>`<div class="muted">Day ${q.day}｜${esc(q.title)}</div>${qhtml(q)}`).join("");bindQ(e,false)}
function debugGuide(){
let f=P.debugFramework,e=document.querySelector("#debugContent");
e.innerHTML=`<div class="panel"><span class="eyebrow">🛠️ 调试能力主线</span><h2>${esc(f.title)}</h2>
<p class="muted">调试能力不是“多看代码”形成的，而是反复完成：稳定复现 → 提出假设 → 选择工具测量 → 缩小范围 → 找到根因 → 回归验证。</p>
<div class="debug-rules">${f.rules.map((x,i)=>`<div class="rule-card"><strong>${i+1}</strong><span>${esc(x)}</span></div>`).join("")}</div>
<div class="debug-levels">${f.levels.map((l,i)=>`<section class="debug-level"><div class="level-no">${i+1}</div><div><h3>${esc(l.name)}</h3><div class="tool-pill">工具：${esc(l.tools)}</div><ul>${l.questions.map(q=>`<li>${esc(q)}</li>`).join("")}</ul></div></section>`).join("")}</div>
<div class="project-card"><strong>每周调试考试</strong><ul>${f.weekly.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
<h3>标准故障报告模板</h3><div class="fault-template">
<div><strong>1. 现象</strong><p>发生条件、频率、是否稳定复现。</p></div>
<div><strong>2. 假设</strong><p>至少列出3个可能原因，并按概率排序。</p></div>
<div><strong>3. 测量</strong><p>测了哪里、预期值、实际值、使用什么工具。</p></div>
<div><strong>4. 根因</strong><p>为什么它能解释全部现象，哪些假设被排除。</p></div>
<div><strong>5. 修复与回归</strong><p>修改内容、边界测试、长时间测试和副作用。</p></div>
<div><strong>6. 预防</strong><p>断言、超时、日志、设计检查表或自动测试。</p></div>
</div></div>`}
function guide(){
let e=document.querySelector("#guideContent");
e.innerHTML=`<div class="panel"><span class="eyebrow">🧭 六科统一学法</span><h2>不是“看完”，而是形成可验证能力</h2>
<p class="muted">每一科都按五步循环：闭卷回忆 → 理解机制 → 做题或实验 → 用证据验证 → 间隔复习。下面是六科长期不变的学习标准。</p>
<div class="guide-grid">${P.meta.subjects.map(m=>{let g=P.studyGuide[m.key];return`<section class="guide-card"><h3>${m.icon} ${m.label}</h3><p>${esc(g.goal)}</p><h4>推荐学法</h4><ol>${g.method.map(x=>`<li>${esc(x)}</li>`).join("")}</ol><h4>最低过关线</h4><ul>${g.pass.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>`}).join("")}</div>
<div class="project-card"><strong>统一判定规则</strong><p>能看懂资料只算“接触过”；能闭卷解释算“理解”；能独立做题或写最小程序算“掌握”；能改参数、迁移和排错算“熟练”；能读手册设计模块、权衡方案并形成测试证据，才进入“精通训练”。</p></div></div>`}
function switchV(id){document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===id));document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.view===id));if(id==="mapView")map();if(id==="debugView")debugGuide();if(id==="guideView")guide();if(id==="longView")long()}
document.addEventListener("DOMContentLoaded",()=>{document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>switchV(b.dataset.view));document.querySelector("#strict").checked=S.strict;document.querySelector("#strict").onchange=e=>{S.strict=e.target.checked;save();render()};document.querySelector("#prevDay").onclick=()=>{day=Math.max(1,day-1);render()};document.querySelector("#nextDay").onclick=()=>{let n=Math.min(40,day+1);if(unlocked(n)){day=n;render()}else toast("下一关未解锁")};document.querySelector("#todayDay").onclick=()=>{day=initial();render()};document.querySelector("#drawRandom").onclick=random;document.querySelector("#exportBtn").onclick=()=>download(JSON.stringify(S,null,2),`mcu40-progress-${iso()}.json`,"application/json");document.querySelector("#importInput").onchange=e=>{let f=e.target.files[0];if(!f)return;let r=new FileReader;r.onload=()=>{try{S={...base(),...JSON.parse(r.result)};save();render();toast("进度已导入")}catch(x){toast("文件格式不正确")}};r.readAsText(f)};document.querySelector("#resetBtn").onclick=()=>{if(confirm("确定清空全部进度吗？")){S=base();save();day=1;render()}};stats();render();map();debugGuide();guide();long();random()})
