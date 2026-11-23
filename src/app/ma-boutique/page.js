"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "../../supabase";

function MaBoutiqueContent() {
  const [nomBoutique, setNomBoutique] = useState("");
  const [vendeurId, setVendeurId] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lienBoutique, setLienBoutique] = useState("");
  const [copie, setCopie] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("vendeur_id");
    if (!id) { window.location.href = "/connexion"; return; }
    setVendeurId(id);
    setNomBoutique(localStorage.getItem("nom_boutique") || "");
    setWhatsapp(localStorage.getItem("vendeur_whatsapp") || "");
    setLienBoutique(`${window.location.origin}/boutique/${id}`);
    chargerProduits(id);
  }, []);

  async function chargerProduits(id) {
    const { data } = await supabase.from("produits").select("*").eq("vendeur_id", id).order("id", { ascending: false });
    setProduits(data || []);
    setLoading(false);
  }

  async function supprimerProduit(pid) {
    if (!confirm("Supprimer ce produit ?")) return;
    await supabase.from("produits").delete().eq("id", pid);
    chargerProduits(vendeurId);
  }

  function deconnexion() {
    localStorage.removeItem("vendeur_id");
    localStorage.removeItem("nom_boutique");
    localStorage.removeItem("vendeur_whatsapp");
    window.location.href = "/";
  }

  function copier() {
    navigator.clipboard.writeText(lienBoutique);
    setCopie(true);
    setTimeout(() => setCopie(false), 2000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7f8", fontFamily: "Inter, system-ui, sans-serif", color: "#111827" }}>
      <header style={{ background: "#0f2a1d", color: "white", padding: "18px 20px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, opacity: 0.7, letterSpacing: 1 }}>ESPACE VENDEUR</div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{nomBoutique}</div>
          </div>
          <button onClick={deconnexion} style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 14px", borderRadius: 20, cursor: "pointer" }}>Déconnexion</button>
        </div>
      </header>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "white", padding: 18, borderRadius: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, color: "#6b7280" }}>Produits</div>
            <div style={{ fontSize: 28, fontWeight: 800 }}>{produits.length}</div>
          </div>
          <div style={{ background: "white", padding: 18, borderRadius: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, color: "#6b7280" }}>WhatsApp</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{whatsapp}</div>
          </div>
          <div style={{ background: "white", padding: 18, borderRadius: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, color: "#6b7280" }}>Statut</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#16a34a" }}>● Boutique active</div>
          </div>
        </div>

        <section style={{ background: "white", borderRadius: 20, padding: 22, boxShadow: "0 4px 20px rgba(0,0,0,0.06)", marginBottom: 20 }}>
          <h3 style={{ margin: "0 0 6px" }}>Ton lien boutique</h3>
          <p style={{ color: "#6b7280", fontSize: 14, marginTop: 0 }}>Partage-le sur Facebook, WhatsApp, TikTok. Tes clients commandent direct sur ton WhatsApp.</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", background: "#f9fafb", padding: 12, borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <span style={{ flex: 1, wordBreak: "break-all", fontSize: 14 }}>{lienBoutique}</span>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <button onClick={copier} style={{ background: "#16a34a", color: "white", border: "none", padding: "11px 18px", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>{copie ? "Copié ✓" : "Copier le lien"}</button>
            <a href={`https://wa.me/?text=${encodeURIComponent(`Découvre ma boutique ${nomBoutique} 👇 ${lienBoutique}`)}`} target="_blank" style={{ background: "#25D366", color: "white", padding: "11px 18px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>WhatsApp</a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(lienBoutique)}`} target="_blank" style={{ background: "#1877F2", color: "white", padding: "11px 18px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>Facebook</a>
            <a href={`/boutique/${vendeurId}`} style={{ background: "white", border: "1px solid #d1d5db", color: "#111", padding: "11px 18px", borderRadius: 12, textDecoration: "none", fontWeight: 600 }}>Aperçu boutique</a>
          </div>
        </section>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ margin: 0 }}>Mes produits</h2>
          <a href="/ajouter-produit" style={{ background: "#111827", color: "white", padding: "10px 16px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>+ Nouveau produit</a>
        </div>

        {loading && <p>Chargement...</p>}
        {!loading && produits.length === 0 && (
          <div style={{ background: "white", borderRadius: 20, padding: 40, textAlign: "center", border: "1px dashed #d1d5db" }}>
            <div style={{ fontSize: 40 }}>🛍️</div>
            <h3>Aucun produit pour le moment</h3>
            <p style={{ color: "#6b7280" }}>Ajoute ton premier produit, il apparaîtra direct sur ton lien boutique.</p>
            <a href="/ajouter-produit" style={{ background: "#16a34a", color: "white", padding: "12px 20px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>Ajouter un produit</a>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
          {produits.map(p => (
            <div key={p.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              {p.image_url ? <img src={p.image_url} style={{ width: "100%", height: 170, objectFit: "cover" }} /> : <div style={{ height: 170, background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>📦</div>}
              <div style={{ padding: 14 }}>
                <div style={{ fontWeight: 800 }}>{p.nom}</div>
                <div style={{ color: "#16a34a", fontWeight: 800, margin: "4px 0" }}>{p.prix} FCFA</div>
                <div style={{ color: "#6b7280", fontSize: 14 }}>{p.description}</div>
                <button onClick={() => supprimerProduit(p.id)} style={{ marginTop: 12, width: "100%", background: "#fef2f2", color: "#991b1b", border: "none", padding: 9, borderRadius: 10, cursor: "pointer", fontWeight: 600 }}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function MaBoutique() {
  return (
    <Suspense fallback={<div style={{ padding: 40, fontFamily: "sans-serif", textAlign: "center" }}>Chargement...</div>}>
      <MaBoutiqueContent />
    </Suspense>
  );
}
