"use client";
import { useState } from "react";
import { supabase } from "../../supabase";

export default function Connexion() {
  const [whatsapp, setWhatsapp] = useState("");
  const [erreur, setErreur] = useState("");
  const [loading, setLoading] = useState(false);

  async function seConnecter(e) {
    e.preventDefault();
    setLoading(true); setErreur("");
    const numero = whatsapp.replace(/\s/g, "");
    const { data } = await supabase.from("vendeurs").select("*").eq("whatsapp", numero).single();
    if (!data) {
      const { data: data2 } = await supabase.from("vendeurs").select("*").ilike("whatsapp", `%${numero.slice(-8)}`).single();
      if (!data2) { setErreur("Boutique introuvable avec ce numéro. Vérifie et réessaie."); setLoading(false); return; }
      localStorage.setItem("vendeur_id", data2.id);
      localStorage.setItem("nom_boutique", data2.nom_boutique || "");
      localStorage.setItem("vendeur_whatsapp", data2.whatsapp);
      window.location.href = "/ma-boutique"; return;
    }
    localStorage.setItem("vendeur_id", data.id);
    localStorage.setItem("nom_boutique", data.nom_boutique || "");
    localStorage.setItem("vendeur_whatsapp", data.whatsapp);
    window.location.href = "/ma-boutique";
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f7f8", padding: 20, fontFamily: "sans-serif" }}>
      <form onSubmit={seConnecter} style={{ background: "white", padding: 30, borderRadius: 20, width: "100%", maxWidth: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <h2 style={{ marginTop: 0 }}>Retrouver ma boutique</h2>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Entre le numéro WhatsApp que tu as utilisé à l'inscription</p>
        <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="Ex: 22997000000" required style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #d1d5db", marginBottom: 12, boxSizing: "border-box" }} />
        {erreur && <p style={{ color: "red", fontSize: 14 }}>{erreur}</p>}
        <button disabled={loading} style={{ width: "100%", background: "#16a34a", color: "white", border: "none", padding: 13, borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>{loading ? "Connexion..." : "Se connecter"}</button>
        <p style={{ textAlign: "center", fontSize: 14, marginTop: 16 }}>Pas encore de boutique ? <a href="/inscription">Créer une boutique</a></p>
      </form>
    </div>
  );
}
