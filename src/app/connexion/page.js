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
    let numero = whatsapp.replace(/\D/g, "");
    if (numero.startsWith("0")) numero = numero.slice(1);
    const formats = [numero, "229" + numero, "+229" + numero, "0" + numero];

    let vendeur = null;
    for (const f of formats) {
      const { data } = await supabase.from("vendeurs").select("*").eq("whatsapp", f).maybeSingle();
      if (data) { vendeur = data; break; }
    }
    if (!vendeur) {
      const { data } = await supabase.from("vendeurs").select("*").ilike("whatsapp", `%${numero.slice(-8)}`).maybeSingle();
      vendeur = data;
    }
    if (!vendeur) {
      const { data } = await supabase.from("vendeurs").select("*").ilike("telephone", `%${numero.slice(-8)}`).maybeSingle();
      vendeur = data;
    }

    if (!vendeur) { setErreur("Boutique introuvable avec ce numéro. Vérifie et réessaie."); setLoading(false); return; }

    localStorage.setItem("vendeur_id", vendeur.id);
    localStorage.setItem("nom_boutique", vendeur.nom_boutique || vendeur.boutique || "");
    localStorage.setItem("vendeur_whatsapp", vendeur.whatsapp || vendeur.telephone || numero);
    window.location.href = "/ma-boutique";
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f6f7f8", padding: 20, fontFamily: "sans-serif" }}>
      <form onSubmit={seConnecter} style={{ background: "white", padding: 30, borderRadius: 20, width: "100%", maxWidth: 400, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <h2 style={{ marginTop: 0 }}>Retrouver ma boutique</h2>
        <p style={{ color: "#6b7280", fontSize: 14 }}>Entre le numéro WhatsApp que tu as utilisé à l'inscription</p>
        <input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="Ex: 0167275906" required style={{ width: "100%", padding: 12, borderRadius: 12, border: "1px solid #d1d5db", marginBottom: 12, boxSizing: "border-box" }} />
        {erreur && <p style={{ color: "red", fontSize: 14 }}>{erreur}</p>}
        <button disabled={loading} style={{ width: "100%", background: "#16a34a", color: "white", border: "none", padding: 13, borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>{loading ? "Connexion..." : "Se connecter"}</button>
        <p style={{ textAlign: "center", fontSize: 14, marginTop: 16 }}>Pas encore de boutique ? <a href="/inscription">Créer une boutique</a></p>
      </form>
    </div>
  );
}
