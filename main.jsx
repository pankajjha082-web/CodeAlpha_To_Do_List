import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Check, Sun, Moon, UserRound, ChevronDown, Rocket, ClipboardList, Plus, CalendarDays, Pencil, Trash2, Filter, LayoutGrid, Circle, CheckCircle2, Lightbulb, X, Save } from "lucide-react";
import "./styles.css";

const initialTasks = [
  { id: 1, title: "Complete React To-Do List Project", date: "Today", time: "10:00 AM", done: true },
  { id: 2, title: "Learn Node.js and Express.js", date: "Today", time: "2:00 PM", done: false },
  { id: 3, title: "Build a Portfolio Website", date: "Tomorrow", time: "10:00 AM", done: false },
  { id: 4, title: "Read Web Development Articles", date: "Yesterday", time: "7:00 PM", done: true },
  { id: 5, title: "Practice DSA Problems", date: "Tomorrow", time: "5:00 PM", done: false },
  { id: 6, title: "Prepare for Interview", date: "Apr 30, 2025", time: "10:00 AM", done: false },
];

function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pastel-todo-tasks")) || initialTasks; }
    catch { return initialTasks; }
  });
  const [filter, setFilter] = useState("All");
  const [newTask, setNewTask] = useState("");
  const [dark, setDark] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  useEffect(() => localStorage.setItem("pastel-todo-tasks", JSON.stringify(tasks)), [tasks]);
  const completed = tasks.filter(t => t.done).length;
  const active = tasks.length - completed;
  const shownTasks = useMemo(() => tasks.filter(t => filter === "All" || (filter === "Active" ? !t.done : t.done)), [tasks, filter]);
  function addTask(e) {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), title: newTask.trim(), date: "Today", time: new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}), done: false }]);
    setNewTask(""); setFilter("All");
  }
  function toggleTask(id) { setTasks(prev => prev.map(t => t.id === id ? {...t, done: !t.done} : t)); }
  function deleteTask(id) { setTasks(prev => prev.filter(t => t.id !== id)); }
  function startEdit(task) { setEditingId(task.id); setEditTitle(task.title); }
  function saveEdit(id) {
    if (editTitle.trim()) setTasks(prev => prev.map(t => t.id === id ? {...t, title: editTitle.trim()} : t));
    setEditingId(null); setEditTitle("");
  }
  return <main className={`app-shell ${dark ? "dark" : ""}`}>
    <header className="topbar">
      <div className="brand"><div className="brand-mark"><Check size={30} strokeWidth={4}/></div><span>To-Do List</span></div>
      <div className="top-actions">
        <button className="icon-button" onClick={() => setDark(v => !v)} aria-label="Toggle theme">{dark ? <Moon size={27}/> : <Sun size={27}/>}</button>
        <button className="profile-button" onClick={() => setProfileOpen(v => !v)}><span>Pankaj</span><span className="avatar"><UserRound size={29} fill="white" color="white"/></span><ChevronDown size={17}/></button>
        {profileOpen && <div className="profile-menu"><strong>Pankaj</strong><span>Stay organized and productive.</span><button onClick={() => setProfileOpen(false)}>Close</button></div>}
      </div>
    </header>
    <div className="dashboard">
      <section className="main-column">
        <div className="welcome-card"><div className="rocket-tile"><Rocket size={49} fill="#1595ff" color="#176bdc" strokeWidth={1.5}/></div><div><h1>Welcome, Pankaj!</h1><p>Stay organized, get things done!</p></div></div>
        <form className="add-task" onSubmit={addTask}><input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Add a new task..." aria-label="Add a new task"/><button type="submit" aria-label="Add task"><Plus size={27} strokeWidth={2.5}/></button></form>
        <div className="tabs" role="tablist">{["All","Active","Completed"].map(item => <button key={item} role="tab" aria-selected={filter===item} className={`tab ${filter===item?"selected":""}`} onClick={() => setFilter(item)}>{item}</button>)}</div>
        <section className="task-list" aria-label="Tasks">
          {shownTasks.length === 0 ? <div className="empty-state">No {filter.toLowerCase()} tasks. Add one above to get started.</div> : shownTasks.map(task => <article className="task-row" key={task.id}>
            <button className={`task-check ${task.done?"checked":""}`} onClick={() => toggleTask(task.id)} aria-label={task.done?"Mark active":"Mark completed"}>{task.done && <Check size={18} strokeWidth={3}/>}</button>
            <div className="task-content">{editingId === task.id ? <form className="edit-form" onSubmit={e => {e.preventDefault();saveEdit(task.id)}}><input autoFocus value={editTitle} onChange={e=>setEditTitle(e.target.value)} aria-label="Edit task title"/><button className="save-icon" type="submit" aria-label="Save"><Save size={18}/></button><button className="cancel-icon" type="button" onClick={()=>setEditingId(null)} aria-label="Cancel"><X size={18}/></button></form> : <><div className={`task-title ${task.done?"completed-title":""}`}>{task.title}</div><div className="task-time"><CalendarDays size={15} strokeWidth={2.6}/><span>{task.date}, {task.time}</span></div></>}</div>
            <span className={`status ${task.done?"completed-status":"active-status"}`}>{task.done?"Completed":"Active"}</span>
            <div className="row-actions"><button className="edit-button" onClick={()=>startEdit(task)} aria-label="Edit task"><Pencil size={19} fill="currentColor"/></button><button className="delete-button" onClick={()=>deleteTask(task.id)} aria-label="Delete task"><Trash2 size={19}/></button></div>
          </article>)}
        </section>
      </section>
      <aside className="sidebar">
        <section className="side-card"><div className="side-heading"><span className="side-icon"><ClipboardList size={26} strokeWidth={3}/></span><h2>Task Summary</h2></div><div className="stats"><div><strong>{tasks.length}</strong><span>Total</span></div><div><strong>{active}</strong><span>Active</span></div><div><strong>{completed}</strong><span>Completed</span></div></div></section>
        <section className="side-card filters-card"><div className="side-heading"><span className="side-icon"><Filter size={25} strokeWidth={3}/></span><h2>Quick Filters</h2></div><div className="quick-filters">
          <button className={`quick-filter ${filter==="All"?"current":""}`} onClick={()=>setFilter("All")}><LayoutGrid size={23} strokeWidth={2.8}/>All Tasks</button>
          <button className={`quick-filter ${filter==="Active"?"current":""}`} onClick={()=>setFilter("Active")}><Circle size={22} strokeWidth={3}/>Active Tasks</button>
          <button className={`quick-filter ${filter==="Completed"?"current":""}`} onClick={()=>setFilter("Completed")}><CheckCircle2 size={22} fill="#0a9169" color="#0a9169"/>Completed Tasks</button>
        </div></section>
        <section className="quote-card"><Lightbulb size={25} strokeWidth={2.8}/><blockquote>“Small steps every day<br/>lead to big results.”</blockquote><p>— Keep going!</p></section>
      </aside>
    </div>
  </main>;
}
createRoot(document.getElementById("root")).render(<App/>);
