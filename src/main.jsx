import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Plus, ShieldCheck, Users, Clock, Trash2, Edit, LogOut, CheckCircle, XCircle, Paperclip, Download, Bell } from 'lucide-react';
import './styles.css';

const LS_USERS = 'casto_perm_users_v1';
const LS_CONSIGNES = 'casto_perm_consignes_v1';

const defaultUsers = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', nom: 'Administrateur', statut: 'approuve' },
  { id: 2, username: 'dupont', password: '1234', role: 'user', nom: 'Marie Dupont', statut: 'approuve' },
];

const defaultConsignes = [
  { id: 1, titre: 'Sécurité incendie', categorie: 'Sécurité', priorite: 'haute', contenu: "En cas d'incendie, déclencher l'alarme, évacuer par les sorties de secours et se rassembler au point de rassemblement. Ne jamais utiliser les ascenseurs.", auteur: 'Administrateur', date: '2026-06-01', actif: true, pieceJointe: '' },
  { id: 2, titre: 'Accueil visiteurs', categorie: 'Procédures', priorite: 'normale', contenu: "Tout visiteur doit se présenter à l'accueil, signer le registre et porter un badge visible à tout moment.", auteur: 'Administrateur', date: '2026-06-10', actif: true, pieceJointe: '' },
  { id: 3, titre: 'Confidentialité des données', categorie: 'Informatique', priorite: 'haute', contenu: "Ne jamais partager vos identifiants. Verrouiller votre session à chaque absence. Les données clients sont confidentielles.", auteur: 'Administrateur', date: '2026-06-20', actif: true, pieceJointe: '' },
];

const categories = ['Sécurité', 'Procédures', 'Matériel', 'Informatique', 'RH', 'Qualité', 'Maintenance', 'Autre'];
const priorites = { haute: 'Haute', normale: 'Normale', basse: 'Basse' };

function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function today() { return new Date().toISOString().slice(0, 10); }
function fmt(d) { return new Date(d).toLocaleDateString('fr-FR'); }

function App() {
  const [users, setUsers] = useState(() => load(LS_USERS, defaultUsers));
  const [consignes, setConsignes] = useState(() => load(LS_CONSIGNES, defaultConsignes));
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState('login');
  const [view, setView] = useState('liste');
  const [tab, setTab] = useState('consignes');
  const [selected, setSelected] = useState(null);
  const [login, setLogin] = useState({ username: '', password: '' });
  const [register, setRegister] = useState({ nom: '', username: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('Toutes');
  const [prio, setPrio] = useState('toutes');
  const [statut, setStatut] = useState('actives');
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ titre: '', categorie: 'Sécurité', priorite: 'normale', contenu: '', actif: true, pieceJointe: '' });
  const [mode, setMode] = useState('create');
  const [userForm, setUserForm] = useState({ nom: '', username: '', password: '', role: 'user' });
  const [editUser, setEditUser] = useState(null);

  useEffect(() => save(LS_USERS, users), [users]);
  useEffect(() => save(LS_CONSIGNES, consignes), [consignes]);
  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const pending = users.filter(u => u.statut === 'en_attente');
  const filtered = useMemo(() => consignes.filter(c => {
    const s = (c.titre + ' ' + c.contenu + ' ' + c.categorie).toLowerCase();
    return (cat === 'Toutes' || c.categorie === cat) && (prio === 'toutes' || c.priorite === prio) && (statut === 'toutes' || (statut === 'actives' ? c.actif : !c.actif)) && (!q || s.includes(q.toLowerCase()));
  }), [consignes, cat, prio, statut, q]);

  function doLogin() {
    const u = users.find(x => x.username === login.username && x.password === login.password);
    if (!u) return setError('Identifiant ou mot de passe incorrect.');
    if (u.statut !== 'approuve') return setError('Compte en attente ou refusé par un administrateur.');
    setCurrentUser(u); setError(''); setView('liste');
  }

  function doRegister() {
    if (!register.nom || !register.username || !register.password) return setError('Tous les champs sont obligatoires.');
    if (register.password !== register.confirm) return setError('Les mots de passe ne correspondent pas.');
    if (users.some(u => u.username === register.username)) return setError('Cet identifiant existe déjà.');
    setUsers([...users, { id: Date.now(), nom: register.nom, username: register.username, password: register.password, role: 'user', statut: 'en_attente' }]);
    setRegister({ nom: '', username: '', password: '', confirm: '' }); setScreen('login'); setError('Demande envoyée. Elle doit être validée par un admin.');
  }

  function openCreate() { setMode('create'); setForm({ titre: '', categorie: 'Sécurité', priorite: 'normale', contenu: '', actif: true, pieceJointe: '' }); setView('form'); }
  function openEdit(c) { setMode('edit'); setSelected(c); setForm({ titre: c.titre, categorie: c.categorie, priorite: c.priorite, contenu: c.contenu, actif: c.actif, pieceJointe: c.pieceJointe || '' }); setView('form'); }
  function saveConsigne() {
    if (!form.titre || !form.contenu) return notify('Titre et contenu obligatoires.');
    if (mode === 'create') setConsignes([{ ...form, id: Date.now(), auteur: currentUser.nom, date: today() }, ...consignes]);
    else setConsignes(consignes.map(c => c.id === selected.id ? { ...c, ...form } : c));
    notify('Consigne enregistrée.'); setView('admin'); setTab('consignes');
  }
  function deleteConsigne(id) { setConsignes(consignes.filter(c => c.id !== id)); notify('Consigne supprimée.'); setView('liste'); }
  function toggleConsigne(id) { setConsignes(consignes.map(c => c.id === id ? { ...c, actif: !c.actif } : c)); }
  function saveUser() {
    if (!userForm.nom || !userForm.username || !userForm.password) return notify('Tous les champs utilisateur sont obligatoires.');
    if (editUser) setUsers(users.map(u => u.id === editUser.id ? { ...u, ...userForm, statut: 'approuve' } : u));
    else setUsers([...users, { ...userForm, id: Date.now(), statut: 'approuve' }]);
    setUserForm({ nom: '', username: '', password: '', role: 'user' }); setEditUser(null); notify('Utilisateur enregistré.');
  }

  if (!currentUser) return <div className="loginPage"><div className="loginCard"><div className="logo"><ShieldCheck size={32}/></div><h1>Consignes Permanentes</h1><p className="muted center">Application de partage des consignes internes</p><div className="tabs"><button className={screen==='login'?'active':''} onClick={()=>setScreen('login')}>Connexion</button><button className={screen==='register'?'active':''} onClick={()=>setScreen('register')}>Inscription</button></div>{screen==='login'?<div className="form"><input placeholder="Identifiant" value={login.username} onChange={e=>setLogin({...login,username:e.target.value})}/><input type="password" placeholder="Mot de passe" value={login.password} onChange={e=>setLogin({...login,password:e.target.value})} onKeyDown={e=>e.key==='Enter'&&doLogin()}/><button className="primary" onClick={doLogin}>Se connecter</button><small>Démo : admin / admin123</small></div>:<div className="form"><input placeholder="Nom complet" value={register.nom} onChange={e=>setRegister({...register,nom:e.target.value})}/><input placeholder="Identifiant" value={register.username} onChange={e=>setRegister({...register,username:e.target.value})}/><input type="password" placeholder="Mot de passe" value={register.password} onChange={e=>setRegister({...register,password:e.target.value})}/><input type="password" placeholder="Confirmer le mot de passe" value={register.confirm} onChange={e=>setRegister({...register,confirm:e.target.value})}/><button className="primary" onClick={doRegister}>Créer mon compte</button></div>}{error&&<div className="alert">{error}</div>}</div></div>;

  return <div><header><div className="brand"><ShieldCheck/> <b>Consignes Permanentes</b></div><nav>{currentUser.role==='admin'&&<button onClick={()=>{setView('admin');setTab('consignes')}}>Admin {pending.length>0&&<span className="pill red">{pending.length}</span>}</button>}<button onClick={()=>setView('liste')}>Consignes</button><span className="user">{currentUser.nom}</span><button onClick={()=>setCurrentUser(null)}><LogOut size={16}/> Déconnexion</button></nav></header><main>{view==='liste'&&<><div className="top"><div><h2>Tableau des consignes</h2><p>{filtered.length} consigne(s) affichée(s)</p></div>{currentUser.role==='admin'&&<button className="primary" onClick={openCreate}><Plus size={16}/> Nouvelle consigne</button>}</div><div className="filters"><div className="search"><Search size={16}/><input placeholder="Rechercher une consigne..." value={q} onChange={e=>setQ(e.target.value)}/></div><select value={cat} onChange={e=>setCat(e.target.value)}><option>Toutes</option>{categories.map(c=><option key={c}>{c}</option>)}</select><select value={prio} onChange={e=>setPrio(e.target.value)}><option value="toutes">Toutes priorités</option><option value="haute">Haute</option><option value="normale">Normale</option><option value="basse">Basse</option></select><select value={statut} onChange={e=>setStatut(e.target.value)}><option value="actives">Actives</option><option value="inactives">Inactives</option><option value="toutes">Toutes</option></select></div><section className="grid">{filtered.map(c=><article key={c.id} className={!c.actif?'disabled':''} onClick={()=>{setSelected(c);setView('detail')}}><div><span className={'pill '+c.priorite}>{priorites[c.priorite]}</span><span className="pill">{c.categorie}</span>{c.pieceJointe&&<span className="pill"><Paperclip size={12}/> PJ</span>}</div><h3>{c.titre}</h3><p>{c.contenu.slice(0,130)}...</p><small>Publié le {fmt(c.date)} par {c.auteur}</small></article>)}</section></>}{view==='detail'&&selected&&<section className="panel"><button className="link" onClick={()=>setView('liste')}>← Retour</button><div className="detail"><span className={'pill '+selected.priorite}>{priorites[selected.priorite]}</span><span className="pill">{selected.categorie}</span><h2>{selected.titre}</h2><p>{selected.contenu}</p>{selected.pieceJointe&&<a className="download" href={selected.pieceJointe} target="_blank"><Download size={16}/> Ouvrir la pièce jointe</a>}<small>Publié le {fmt(selected.date)} par {selected.auteur}</small>{currentUser.role==='admin'&&<div className="actions"><button className="primary" onClick={()=>openEdit(selected)}><Edit size={16}/> Modifier</button><button onClick={()=>toggleConsigne(selected.id)}>{selected.actif?'Désactiver':'Activer'}</button><button className="danger" onClick={()=>deleteConsigne(selected.id)}><Trash2 size={16}/> Supprimer</button></div>}</div></section>}{view==='form'&&<section className="panel"><button className="link" onClick={()=>setView('admin')}>← Retour</button><h2>{mode==='create'?'Nouvelle consigne':'Modifier la consigne'}</h2><div className="form wide"><input placeholder="Titre" value={form.titre} onChange={e=>setForm({...form,titre:e.target.value})}/><div className="row"><select value={form.categorie} onChange={e=>setForm({...form,categorie:e.target.value})}>{categories.map(c=><option key={c}>{c}</option>)}</select><select value={form.priorite} onChange={e=>setForm({...form,priorite:e.target.value})}><option value="haute">Haute</option><option value="normale">Normale</option><option value="basse">Basse</option></select></div><textarea placeholder="Contenu de la consigne" value={form.contenu} onChange={e=>setForm({...form,contenu:e.target.value})}/><input placeholder="Lien pièce jointe (PDF, photo, document)" value={form.pieceJointe} onChange={e=>setForm({...form,pieceJointe:e.target.value})}/><label><input type="checkbox" checked={form.actif} onChange={e=>setForm({...form,actif:e.target.checked})}/> Consigne active</label><button className="primary" onClick={saveConsigne}>Enregistrer</button></div></section>}{view==='admin'&&<section><h2>Panneau d'administration</h2><div className="tabs admin"><button className={tab==='consignes'?'active':''} onClick={()=>setTab('consignes')}>Consignes</button><button className={tab==='pending'?'active':''} onClick={()=>setTab('pending')}>Inscriptions {pending.length>0&&<span className="pill red">{pending.length}</span>}</button><button className={tab==='users'?'active':''} onClick={()=>setTab('users')}>Utilisateurs</button></div>{tab==='consignes'&&<div className="panel"><button className="primary" onClick={openCreate}>+ Nouvelle consigne</button><table><tbody>{consignes.map(c=><tr key={c.id}><td><b>{c.titre}</b><br/><small>{c.categorie}</small></td><td><span className={'pill '+c.priorite}>{priorites[c.priorite]}</span></td><td>{c.actif?'Active':'Inactive'}</td><td><button onClick={()=>openEdit(c)}><Edit size={14}/></button><button onClick={()=>toggleConsigne(c.id)}><Bell size={14}/></button><button className="danger" onClick={()=>deleteConsigne(c.id)}><Trash2 size={14}/></button></td></tr>)}</tbody></table></div>}{tab==='pending'&&<div className="panel">{pending.length===0?<p>Aucune inscription en attente.</p>:pending.map(u=><div className="request" key={u.id}><b>{u.nom}</b><small>{u.username}</small><button className="ok" onClick={()=>setUsers(users.map(x=>x.id===u.id?{...x,statut:'approuve'}:x))}><CheckCircle size={16}/> Approuver</button><button className="danger" onClick={()=>setUsers(users.map(x=>x.id===u.id?{...x,statut:'refuse'}:x))}><XCircle size={16}/> Refuser</button></div>)}</div>}{tab==='users'&&<div className="panel"><div className="form wide"><div className="row"><input placeholder="Nom" value={userForm.nom} onChange={e=>setUserForm({...userForm,nom:e.target.value})}/><input placeholder="Identifiant" value={userForm.username} onChange={e=>setUserForm({...userForm,username:e.target.value})}/><input placeholder="Mot de passe" value={userForm.password} onChange={e=>setUserForm({...userForm,password:e.target.value})}/><select value={userForm.role} onChange={e=>setUserForm({...userForm,role:e.target.value})}><option value="user">Utilisateur</option><option value="admin">Administrateur</option></select></div><button className="primary" onClick={saveUser}>{editUser?'Modifier':'Ajouter'}</button></div><table><tbody>{users.filter(u=>u.statut==='approuve').map(u=><tr key={u.id}><td><Users size={16}/> {u.nom}</td><td>{u.username}</td><td>{u.role}</td><td><button onClick={()=>{setEditUser(u);setUserForm({nom:u.nom,username:u.username,password:u.password,role:u.role})}}>Modifier</button>{u.id!==currentUser.id&&<button className="danger" onClick={()=>setUsers(users.filter(x=>x.id!==u.id))}>Supprimer</button>}</td></tr>)}</tbody></table></div>}</section>}</main>{toast&&<div className="toast">{toast}</div>}</div>;
}

createRoot(document.getElementById('root')).render(<App />);
