"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

const ADMIN_EMAIL = "corneillesamuel725@gmail.com";

export default function AdminPage() {
  const [vendeurs, setVendeurs] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { init(); }, []);

  async function init() {
    const { data } = await supabase.auth.getSession();
    const e = data.session?.user?.email || "";
    setEmail(e);
    if (e.toLowerCase().trim() === ADMIN_EMAIL) {
      const { data: v } = await supabase.from("vendeurs").select("*").order("id", { ascending: false });
      setVendeurs(v || []);
    }
    setLoading(false);
  }

  async function login() {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
    if (error) { setError(error.message); return; }
    init();
  }

  async function logout() { await supabase.auth.signOut(); setEmail(""); }

  async function toggle(v) {
    await supabase.from("vendeurs").update({ is_active: !v.is_active }).eq("id", v.id);
    init();
  }

  async function supprimer(v) {
    if (!confirm(`Supprimer ${v.nom} ?`)) return;
    await supabase.from("vendeurs").delete().eq("id", v.id);
    init();
  }

  if (loading) return <p style={{padding:20}}>Chargement...</p>;

  if (!email) return (
    <div style={{padding:20, maxWidth:400, margin:"40px auto", fontFamily:"sans-serif"}}>
      <h2>Connexion Admin</h2>
      <input value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} style={{width:"100%", padding:10, marginBottom:10}} />
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mot de passe" style={{width:"100%", padding:10, marginBottom:10}} />
      {error && <p style={{color:"red"}}>{error}</p>}
      <button onClick={login} style={{width:"100%", padding:12, background:"#16a34a", color:"white", border:"none", borderRadius:8}}>Se connecter</button>
    </div>
  );

  if (email.toLowerCase().trim() !== ADMIN_EMAIL) return <p style={{padding:20}}>Accès refusé pour : {email}</p>;

  return (
    <div style={{padding:20, maxWidth:800, margin:"0 auto", fontFamily:"sans-serif"}}>
      <h1>Admin - Vendeurs ({vendeurs.length})</h1>
      <p>Connecté : {email} <button onClick={logout}>Déconnexion</button></p>
      {vendeurs.map(v => (
        <div key={v.id} style={{border:"1px solid #ddd", padding:12, marginBottom:10, borderRadius:8}}>
          <b>{v.nom || "Sans nom"}</b> - {v.is_active ? "✅ Active" : "❌ Suspendue"}<br/>
          Tél : {v.telephone || "-"} - Ville : {v.ville || "-"}
          <div style={{marginTop:10, display:"flex", gap:8}}>
            <button onClick={()=>toggle(v)} style={{background: v.is_active ? "#f59e0b":"#16a34a", color:"white", padding:"6px 12px", border:"none", borderRadius:6}}>{v.is_active ? "Désactiver" : "Activer"}</button>
            <button onClick={()=>supprimer(v)} style={{background:"#dc2626", color:"white", padding:"6px 12px", border:"none", borderRadius:6}}>Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  );
}
