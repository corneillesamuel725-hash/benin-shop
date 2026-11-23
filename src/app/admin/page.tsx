"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

const ADMIN_EMAIL = "corneillesamuel725@gmail.com";

export default function AdminPage() {
  const [vendeurs, setVendeurs] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { init(); }, []);

  async function init() {
    const { data } = await supabase.auth.getUser();
    const e = data.user?.email || "";
    setEmail(e);
    if (e === ADMIN_EMAIL) {
      const { data: v } = await supabase.from("vendeurs").select("*").order("created_at", { ascending: false });
      setVendeurs(v || []);
    }
    setLoading(false);
  }

  async function toggle(v) {
    await supabase.from("vendeurs").update({ is_active: !v.is_active }).eq("id", v.id);
    init();
  }

  async function supprimer(v) {
    if (!confirm(`Supprimer ${v.nom_boutique} ?`)) return;
    await supabase.from("vendeurs").delete().eq("id", v.id);
    init();
  }

  if (loading) return <p style={{padding:20}}>Chargement...</p>;
  if (email !== ADMIN_EMAIL) return <p style={{padding:20}}>Accès refusé</p>;

  return (
    <div style={{padding:20, maxWidth:800, margin:"0 auto", fontFamily:"sans-serif"}}>
      <h1>Admin - Vendeurs ({vendeurs.length})</h1>
      {vendeurs.map(v => (
        <div key={v.id} style={{border:"1px solid #ddd", padding:12, marginBottom:10, borderRadius:8}}>
          <b>{v.nom_boutique}</b> - {v.is_active ? "✅ Active" : "❌ Suspendue"}<br/>
          WhatsApp : {v.whatsapp}
          <div style={{marginTop:10, display:"flex", gap:8}}>
            <button onClick={()=>toggle(v)} style={{background: v.is_active ? "#f59e0b":"#16a34a", color:"white", padding:"6px 12px", border:"none", borderRadius:6}}>{v.is_active ? "Désactiver" : "Activer"}</button>
            <button onClick={()=>supprimer(v)} style={{background:"#dc2626", color:"white", padding:"6px 12px", border:"none", borderRadius:6}}>Supprimer</button>
          </div>
        </div>
      ))}
    </div>
  );
}
