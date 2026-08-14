// Simple client-side storage & CRUD for portal
const storage = {
  get(k){return JSON.parse(localStorage.getItem(k)||'[]')},
  set(k,v){localStorage.setItem(k,JSON.stringify(v))}
}

// keys
const KEYS = ['students','subjects','books','marks','teachers']
KEYS.forEach(k=>{if(!localStorage.getItem(k)) localStorage.setItem(k,'[]')})

// utils
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,8)

// init
document.addEventListener('DOMContentLoaded',()=>{
  initNav()
  renderAll()
  bindHeader()
})

function initNav(){
  document.querySelectorAll('.sidebar button').forEach(b=>{
    b.addEventListener('click',()=>{
      document.querySelectorAll('.section').forEach(s=>s.classList.add('hidden'))
      const id=b.getAttribute('data-section')
      document.getElementById(id).classList.remove('hidden')
    })
  })
}

function bindHeader(){
  const titleEl=document.getElementById('header-title')
  const btn=document.getElementById('save-header')
  btn.addEventListener('click',()=>{
    localStorage.setItem('site-header',titleEl.innerText.trim())
    alert('हेडर सेव हो गया')
  })
  const saved=localStorage.getItem('site-header')
  if(saved) titleEl.innerText=saved
}

function renderAll(){
  renderStudents()
  renderSubjects()
  renderBooks()
  renderMarks()
  renderTeachers()
}

// STUDENTS
const studentForm=document.getElementById('student-form')
studentForm.addEventListener('submit',e=>{e.preventDefault(); saveStudent()})
document.getElementById('student-clear').addEventListener('click',clearStudentForm)

function saveStudent(){
  const id=document.getElementById('student-id').value
  const name=document.getElementById('student-name').value.trim()
  const roll=document.getElementById('student-roll').value.trim()
  const cls=document.getElementById('student-class').value.trim()
  const email=document.getElementById('student-email').value.trim()
  if(!name||!roll){alert('नाम और रोल जरूरी हैं');return}
  const students=storage.get('students')
  if(id){
    const i=students.findIndex(s=>s.id===id)
    if(i>-1){students[i]={...students[i],name,roll,cls,email}}
  } else {
    students.push({id:uid(),name,roll,cls,email,locked:false})
  }
  storage.set('students',students)
  clearStudentForm(); renderStudents()
}
function clearStudentForm(){['student-id','student-name','student-roll','student-class','student-email'].forEach(id=>document.getElementById(id).value='')}
function renderStudents(){
  const ul=document.getElementById('students-list'); ul.innerHTML=''
  const students=storage.get('students')
  students.forEach(s=>{
    const li=document.createElement('li')
    li.className=s.locked? 'locked':''
    li.innerHTML=`<div><strong>${s.name}</strong><div class="meta">रोल: ${s.roll} • ${s.cls || ''}</div></div>`
    const actions=document.createElement('div'); actions.className='button-group'
    const edit=document.createElement('button'); edit.textContent='Edit'; edit.onclick=()=>populateStudent(s.id)
    const del=document.createElement('button'); del.textContent='Delete'; del.onclick=()=>{if(confirm('हटाएं?')){deleteItem('students',s.id);renderStudents()}}
    const lock=document.createElement('button'); lock.textContent=s.locked? 'Unlock':'Lock'; lock.onclick=()=>{toggleLock('students',s.id);renderStudents()}
    actions.append(edit,del,lock); li.appendChild(actions); ul.appendChild(li)
  })
}
function populateStudent(id){
  const s=storage.get('students').find(x=>x.id===id); if(!s) return
  if(s.locked){alert('यह रिकॉर्ड लॉक है');return}
  document.getElementById('student-id').value=s.id
  document.getElementById('student-name').value=s.name
  document.getElementById('student-roll').value=s.roll
  document.getElementById('student-class').value=s.cls
  document.getElementById('student-email').value=s.email
}

// GENERIC helpers
function deleteItem(key,id){
  const arr=storage.get(key).filter(x=>x.id!==id); storage.set(key,arr)
}
function toggleLock(key,id){
  const arr=storage.get(key).map(x=> x.id===id? {...x,locked:!x.locked}:x); storage.set(key,arr)
}

// SUBJECTS
const subjectForm=document.getElementById('subject-form')
subjectForm.addEventListener('submit',e=>{e.preventDefault(); saveSubject()})
document.getElementById('subject-clear').addEventListener('click',()=>{['subject-id','subject-code','subject-name'].forEach(id=>document.getElementById(id).value='')})
function saveSubject(){
  const id=document.getElementById('subject-id').value
  const code=document.getElementById('subject-code').value.trim()
  const name=document.getElementById('subject-name').value.trim()
  if(!code||!name){alert('कोड और नाम आवश्यक है');return}
  const list=storage.get('subjects')
  if(id){const i=list.findIndex(x=>x.id===id); if(i>-1) list[i]={...list[i],code,name}}
  else list.push({id:uid(),code,name,locked:false})
  storage.set('subjects',list); renderSubjects(); ['subject-id','subject-code','subject-name'].forEach(id=>document.getElementById(id).value='')
}
function renderSubjects(){
  const ul=document.getElementById('subjects-list'); ul.innerHTML=''
  storage.get('subjects').forEach(s=>{
    const li=document.createElement('li'); li.className=s.locked? 'locked':''
    li.innerHTML=`<div><strong>${s.code}</strong> — ${s.name}</div>`
    const edit=document.createElement('button'); edit.textContent='Edit'; edit.onclick=()=>{if(s.locked){alert('लॉक है');return} document.getElementById('subject-id').value=s.id;document.getElementById('subject-code').value=s.code;document.getElementById('subject-name').value=s.name}
    const del=document.createElement('button'); del.textContent='Delete'; del.onclick=()=>{if(confirm('हटाएं?')){deleteItem('subjects',s.id);renderSubjects()}}
    const lock=document.createElement('button'); lock.textContent=s.locked? 'Unlock':'Lock'; lock.onclick=()=>{toggleLock('subjects',s.id);renderSubjects()}
    li.appendChild(edit); li.appendChild(del); li.appendChild(lock); ul.appendChild(li)
  })
}

// BOOKS
const bookForm=document.getElementById('book-form')
bookForm.addEventListener('submit',e=>{e.preventDefault(); saveBook()})
document.getElementById('book-clear').addEventListener('click',()=>{['book-id','book-code','book-title'].forEach(id=>document.getElementById(id).value='')})
function saveBook(){
  const id=document.getElementById('book-id').value
  const code=document.getElementById('book-code').value.trim()
  const title=document.getElementById('book-title').value.trim()
  if(!code||!title){alert('कोड और शीर्षक आवश्यक है');return}
  const list=storage.get('books')
  if(id){const i=list.findIndex(x=>x.id===id); if(i>-1) list[i]={...list[i],code,title}}
  else list.push({id:uid(),code,title,locked:false})
  storage.set('books',list); renderBooks(); ['book-id','book-code','book-title'].forEach(id=>document.getElementById(id).value='')
}
function renderBooks(){
  const ul=document.getElementById('books-list'); ul.innerHTML=''
  storage.get('books').forEach(b=>{
    const li=document.createElement('li'); li.className=b.locked? 'locked':''
    li.innerHTML=`<div><strong>${b.code}</strong> — ${b.title}</div>`
    const edit=document.createElement('button'); edit.textContent='Edit'; edit.onclick=()=>{if(b.locked){alert('लॉक है');return} document.getElementById('book-id').value=b.id;document.getElementById('book-code').value=b.code;document.getElementById('book-title').value=b.title}
    const del=document.createElement('button'); del.textContent='Delete'; del.onclick=()=>{if(confirm('हटाएं?')){deleteItem('books',b.id);renderBooks()}}
    const lock=document.createElement('button'); lock.textContent=b.locked? 'Unlock':'Lock'; lock.onclick=()=>{toggleLock('books',b.id);renderBooks()}
    li.appendChild(edit); li.appendChild(del); li.appendChild(lock); ul.appendChild(li)
  })
}

// MARKS
const marksForm=document.getElementById('marks-form')
marksForm.addEventListener('submit',e=>{e.preventDefault(); saveMarks()})
document.getElementById('marks-clear').addEventListener('click',()=>{['marks-id','exam-name','marks-roll','marks-subject','marks-obtained'].forEach(id=>document.getElementById(id).value='')})
function saveMarks(){
  const id=document.getElementById('marks-id').value
  const exam=document.getElementById('exam-name').value.trim()
  const roll=document.getElementById('marks-roll').value.trim()
  const subj=document.getElementById('marks-subject').value.trim()
  const marksVal=Number(document.getElementById('marks-obtained').value)
  if(!exam||!roll||!subj||isNaN(marksVal)){alert('सभी फील्ड भरें');return}
  const list=storage.get('marks')
  if(id){const i=list.findIndex(x=>x.id===id); if(i>-1) list[i]={...list[i],exam,roll,subj,marks:marksVal}}
  else list.push({id:uid(),exam,roll,subj,marks:marksVal,locked:false})
  storage.set('marks',list); renderMarks(); ['marks-id','exam-name','marks-roll','marks-subject','marks-obtained'].forEach(id=>document.getElementById(id).value='')
}
function renderMarks(){
  const ul=document.getElementById('marks-list'); ul.innerHTML=''
  storage.get('marks').forEach(m=>{
    const li=document.createElement('li'); li.className=m.locked? 'locked':''
    li.innerHTML=`<div><strong>${m.exam}</strong> • रोल: ${m.roll} • ${m.subj} = ${m.marks}</div>`
    const edit=document.createElement('button'); edit.textContent='Edit'; edit.onclick=()=>{if(m.locked){alert('लॉक है');return} document.getElementById('marks-id').value=m.id;document.getElementById('exam-name').value=m.exam;document.getElementById('marks-roll').value=m.roll;document.getElementById('marks-subject').value=m.subj;document.getElementById('marks-obtained').value=m.marks}
    const del=document.createElement('button'); del.textContent='Delete'; del.onclick=()=>{if(confirm('हटाएं?')){deleteItem('marks',m.id);renderMarks()}}
    const lock=document.createElement('button'); lock.textContent=m.locked? 'Unlock':'Lock'; lock.onclick=()=>{toggleLock('marks',m.id);renderMarks()}
    li.appendChild(edit); li.appendChild(del); li.appendChild(lock); ul.appendChild(li)
  })
}

// TEACHERS
const teacherForm=document.getElementById('teacher-form')
teacherForm.addEventListener('submit',e=>{e.preventDefault(); saveTeacher()})
document.getElementById('teacher-clear').addEventListener('click',()=>{['teacher-id','teacher-name','teacher-subject'].forEach(id=>document.getElementById(id).value='')})
function saveTeacher(){
  const id=document.getElementById('teacher-id').value
  const name=document.getElementById('teacher-name').value.trim()
  const subj=document.getElementById('teacher-subject').value.trim()
  if(!name){alert('नाम जरूरी है');return}
  const list=storage.get('teachers')
  if(id){const i=list.findIndex(x=>x.id===id); if(i>-1) list[i]={...list[i],name,subj}}
  else list.push({id:uid(),name,subj,locked:false})
  storage.set('teachers',list); renderTeachers(); ['teacher-id','teacher-name','teacher-subject'].forEach(id=>document.getElementById(id).value='')
}
function renderTeachers(){
  const ul=document.getElementById('teachers-list'); ul.innerHTML=''
  storage.get('teachers').forEach(t=>{
    const li=document.createElement('li'); li.className=t.locked? 'locked':''
    li.innerHTML=`<div><strong>${t.name}</strong><div class=\"meta\">${t.subj||''}</div></div>`
    const edit=document.createElement('button'); edit.textContent='Edit'; edit.onclick=()=>{if(t.locked){alert('लॉक है');return} document.getElementById('teacher-id').value=t.id;document.getElementById('teacher-name').value=t.name;document.getElementById('teacher-subject').value=t.subj}
    const del=document.createElement('button'); del.textContent='Delete'; del.onclick=()=>{if(confirm('हटाएं?')){deleteItem('teachers',t.id);renderTeachers()}}
    const lock=document.createElement('button'); lock.textContent=t.locked? 'Unlock':'Lock'; lock.onclick=()=>{toggleLock('teachers',t.id);renderTeachers()}
    li.appendChild(edit); li.appendChild(del); li.appendChild(lock); ul.appendChild(li)
  })
}

// ADMIT / PROFILE / MARKSHEET generation
document.getElementById('gen-admit').addEventListener('click',()=>{
  const roll=document.getElementById('admit-roll').value.trim(); if(!roll){alert('रोल डालें');return}
  const s=storage.get('students').find(x=>x.roll===roll); if(!s){alert('छात्र नहीं मिला');return}
  document.getElementById('admit-card').innerHTML=`<h3>Admit कार्ड</h3><p><strong>${s.name}</strong></p><p>रोल: ${s.roll}</p><p>कक्षा: ${s.cls||''}</p>`
})

document.getElementById('gen-profile').addEventListener('click',()=>{
  const roll=document.getElementById('profile-roll').value.trim(); if(!roll){alert('रोल डालें');return}
  const s=storage.get('students').find(x=>x.roll===roll); if(!s){alert('छात्र नहीं मिला');return}
  document.getElementById('profile-card').innerHTML=`<h3>प्रोफ़ाइल</h3><p><strong>${s.name}</strong></p><p>रोल: ${s.roll}</p><p>ईमेल: ${s.email||''}</p>`
})

document.getElementById('gen-marksheet').addEventListener('click',()=>{
  const roll=document.getElementById('marksheet-roll').value.trim(); if(!roll){alert('रोल डालें');return}
  const s=storage.get('students').find(x=>x.roll===roll); if(!s){alert('छात्र नहीं मिला');return}
  const marks=storage.get('marks').filter(m=>m.roll===roll)
  let html=`<h3>अंकसूची — ${s.name} (${s.roll})</h3><table><tr><th>परीक्षा</th><th>विषय</th><th>अंक</th></tr>`
  marks.forEach(m=>{html+=`<tr><td>${m.exam}</td><td>${m.subj}</td><td>${m.marks}</td></tr>`})
  html+='</table>'
  document.getElementById('marksheet-view').innerHTML=html
})

// REPORTS
document.getElementById('export-data').addEventListener('click',()=>{
  const data={students:storage.get('students'),subjects:storage.get('subjects'),books:storage.get('books'),marks:storage.get('marks'),teachers:storage.get('teachers')}
  document.getElementById('report-output').textContent=JSON.stringify(data,null,2)
})

