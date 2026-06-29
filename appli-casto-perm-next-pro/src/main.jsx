import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ShieldCheck, Search, Plus, Users, CheckCircle, XCircle, LogOut, FileText, Settings, Upload } from 'lucide-react';
import './styles.css';

const initialUsers = [
  { id: 1, username: 'admin', password: 'admin123', name: 'Administrateur', role: 'admin', status: 'approved' },
  { id: 2, username: 'dupont', password: '1234', name: 'Marie Dupont', role: 'user', status: 'approved' }
];

const initialConsignes = [
  { id: 1, title: 'Sécurité incendie', category: 'Sécurité', priority: 'Haute', active: true, content: "En cas d'incendie, déclencher l'alarme, prévenir les secours, évacuer par les issues de secours et rejoindre le point de rassemblement.", author: 'Administrateur', date: '2026-06-01', files: [] },
  { id: 2, title: 'Accueil visiteurs', category: 'Procédures', priority: 'Normale', active: true, content: "Tout visiteur doit être identifié, accompagné et porter un badge visible pendant toute sa présence sur site.", author: 'Administrateur', date: '2026-06-10', files: [] },
  { id: 3, title: 'Confidentialité', category: 'Informatique', priority: 'Haute', active: true, content: "Ne jamais partager ses identifiants. Verrouiller son poste en cas d'absence. Signaler toute anomalie informatique.", author: 'Administrateur', date: '2026-06-20', files: [] }
];

const categories = ['Sécurité', 'Procédures', 'Matériel', 'Informatique', 'RH', 'Qualité', 'Autre'];

function App() {
  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('casto_users') || 'null') || initialUsers);
  const [consignes, setConsignes] = useState(() => JSON.parse(localStorage.getItem('casto_consignes') || 'null') || initialConsignes);
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [login, setLogin] = useState({ username: '', password: '' });
  const [register, setRegister] = useState({ name: '', username: '', password: '' });
  const [message, setMessage] = useState('');
  const [page, setPage] = useState('consignes');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Toutes');
  const [form, setForm] = useState({ title: '', category: 'Sécurité', priority: 'Normale', content: '', active: true });
  const [editing, setEditing] = useState(null);

  const persistUsers = (next) => { setUsers(next); localStorage.setItem('casto_users', JSON.stringify(next)); };
  const persistConsignes = (next) => { setConsignes(next); localStorage.setItem('casto_consignes', JSON.stringify(next)); };

  const pendingUsers = users.filter(u => u.status === 'pending');
  const visibleConsignes = useMemo(() => consignes.filter(c => {
    const okSearch = !query || `${c.title} ${c.content} ${c.category}`.toLowerCase().includes(query.toLowerCase());
    const okCat = filter === 'Toutes' || c.category === filter;
    const okActive = currentUser?.role === 'admin' || c.active;
    return okSearch && okCat && okActive;
  }), [consignes, query, filter, currentUser]);

  const submitLogin = () => {
    const user = users.find(u => u.username === login.username && u.password === login.password);
    if (!user) return setMessage('Identifiant ou mot de passe incorrect.');
    if (user.status !== 'approved') return setMessage('Votre compte est en attente de validation par un administrateur.');
    setCurrentUser(user); setMessage(''); setLogin({ username: '', password: '' });
  };

  const submitRegister = () => {
    if (!register.name || !register.username || !register.password) return setMessage('Tous les champs sont obligatoires.');
    if (users.some(u => u.username === register.username)) return setMessage('Cet identifiant existe déjà.');
    persistUsers([...users, { id: Date.now(), ...register, role: 'user', status: 'pending' }]);
    setRegister({ name: '', username: '', password: '' }); setMessage('Demande envoyée. Un administrateur devra valider votre compte.'); setAuthMode('login');
  };

  const saveConsigne = () => {
    if (!form.title || !form.content) return setMessage('Titre et contenu obligatoires.');
    if (editing) {
      persistConsignes(consignes.map(c => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      persistConsignes([{ id: Date.now(), ...form, author: currentUser.name, date: new Date().toISOString().slice(0, 10), files: [] }, ...consignes]);
    }
    setForm({ title: '', category: 'Sécurité', priority: 'Normale', content: '', active: true }); setEditing(null); setPage('consignes'); setMessage('Consigne enregistrée.');
  };

  if (!currentUser) return <Auth authMode={authMode} setAuthMode={setAuthMode} login={login} setLogin={setLogin} register={register} setRegister={setRegister} submitLogin={submitLogin} submitRegister={submitRegister} message={message} />;

  return <div className="app">
    <header className="topbar">
      <div className="brand"><div className="logo">C</div><div><b>Consignes Permanentes</b><span>Castorama Claye-Souilly</span></div></div>
      <nav>
        <button onClick={() => setPage('consignes')} className={page === 'consignes' ? 'active' : ''}><FileText size={16}/>Consignes</button>
        {currentUser.role === 'admin' && <button onClick={() => setPage('admin')} className={page === 'admin' ? 'active' : ''}><Settings size={16}/>Admin {pendingUsers.length ? <em>{pendingUsers.length}</em> : null}</button>}
        <button onClick={() => setCurrentUser(null)}><LogOut size={16}/>Déconnexion</button>
      </nav>
    </header>
    <main>
      {message && <div className="alert">{message}</div>}
      {page === 'consignes' && <section>
        <div className="sectionHead"><div><h1>Tableau des consignes</h1><p>{visibleConsignes.length} consigne(s)</p></div>{currentUser.role === 'admin' && <button className="primary" onClick={() => { setEditing(null); setPage('form'); }}><Plus size={18}/>Nouvelle consigne</button>}</div>
        <div className="filters"><div className="search"><Search size={18}/><input placeholder="Rechercher une consigne..." value={query} onChange={e => setQuery(e.target.value)} /></div><select value={filter} onChange={e => setFilter(e.target.value)}><option>Toutes</option>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
        <div className="cards">{visibleConsignes.map(c => <article className={!c.active ? 'card disabled' : 'card'} key={c.id}><div className="chips"><span className={'prio ' + c.priority.toLowerCase()}>{c.priority}</span><span>{c.category}</span>{!c.active && <span>Archivée</span>}</div><h3>{c.title}</h3><p>{c.content}</p><small>Publié le {new Date(c.date).toLocaleDateString('fr-FR')} par {c.author}</small>{currentUser.role === 'admin' && <div className="actions"><button onClick={() => { setEditing(c); setForm({ title: c.title, category: c.category, priority: c.priority, content: c.content, active: c.active }); setPage('form'); }}>Modifier</button><button onClick={() => persistConsignes(consignes.map(x => x.id === c.id ? { ...x, active: !x.active } : x))}>{c.active ? 'Archiver' : 'Réactiver'}</button><button className="danger" onClick={() => persistConsignes(consignes.filter(x => x.id !== c.id))}>Supprimer</button></div>}</article>)}</div>
      </section>}
      {page === 'form' && <section className="panel"><h1>{editing ? 'Modifier une consigne' : 'Nouvelle consigne'}</h1><label>Titre<input value={form.title} onChange={e => setForm({...form, title: e.target.value})}/></label><div className="row"><label>Catégorie<select value={form.category} onChange={e => setForm({...form, category: e.target.value})}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Priorité<select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}><option>Haute</option><option>Normale</option><option>Basse</option></select></label></div><label>Contenu<textarea rows="8" value={form.content} onChange={e => setForm({...form, content: e.target.value})}/></label><label className="check"><input type="checkbox" checked={form.active} onChange={e => setForm({...form, active: e.target.checked})}/>Visible par les utilisateurs</label><div className="upload"><Upload size={18}/>Zone prévue pour les pièces jointes Supabase Storage</div><button className="primary" onClick={saveConsigne}>Enregistrer</button></section>}
      {page === 'admin' && <Admin users={users} persistUsers={persistUsers} currentUser={currentUser}/>}    
    </main>
  </div>;
}

function Auth({ authMode, setAuthMode, login, setLogin, register, setRegister, submitLogin, submitRegister, message }) {
  return <div className="authPage"><div className="authCard"><div className="brand authBrand"><div className="logo">C</div><div><b>Consignes Permanentes</b><span>Castorama Claye-Souilly</span></div></div><div className="tabs"><button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Connexion</button><button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>Inscription</button></div>{message && <div className="alert">{message}</div>}{authMode === 'login' ? <><input placeholder="Identifiant" value={login.username} onChange={e => setLogin({...login, username: e.target.value})}/><input type="password" placeholder="Mot de passe" value={login.password} onChange={e => setLogin({...login, password: e.target.value})}/><button className="primary full" onClick={submitLogin}>Se connecter</button></> : <><input placeholder="Nom complet" value={register.name} onChange={e => setRegister({...register, name: e.target.value})}/><input placeholder="Identifiant" value={register.username} onChange={e => setRegister({...register, username: e.target.value})}/><input type="password" placeholder="Mot de passe" value={register.password} onChange={e => setRegister({...register, password: e.target.value})}/><button className="primary full" onClick={submitRegister}>Créer mon compte</button><p className="hint">Le compte devra être validé par un administrateur.</p></>}</div></div>
}

function Admin({ users, persistUsers, currentUser }) {
  const approve = id => persistUsers(users.map(u => u.id === id ? { ...u, status: 'approved' } : u));
  const refuse = id => persistUsers(users.map(u => u.id === id ? { ...u, status: 'refused' } : u));
  const toggleRole = id => persistUsers(users.map(u => u.id === id ? { ...u, role: u.role === 'admin' ? 'user' : 'admin' } : u));
  return <section><h1>Administration</h1><div className="panel"><h2><Users size={20}/> Demandes d'inscription</h2>{users.filter(u => u.status === 'pending').length === 0 ? <p>Aucune demande en attente.</p> : users.filter(u => u.status === 'pending').map(u => <div className="userLine" key={u.id}><span><b>{u.name}</b><small>{u.username}</small></span><button onClick={() => approve(u.id)}><CheckCircle size={16}/>Approuver</button><button className="danger" onClick={() => refuse(u.id)}><XCircle size={16}/>Refuser</button></div>)}</div><div className="panel"><h2>Utilisateurs actifs</h2>{users.filter(u => u.status === 'approved').map(u => <div className="userLine" key={u.id}><span><b>{u.name}</b><small>{u.username} · {u.role}</small></span>{u.id !== currentUser.id && <button onClick={() => toggleRole(u.id)}>Changer rôle</button>}</div>)}</div></section>
}

createRoot(document.getElementById('root')).render(<App />);
