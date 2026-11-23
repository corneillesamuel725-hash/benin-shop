"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../supabase";

function BoutiquePubliqueContent() {
  const params = useParams();
  const vendeurId = params.id;
  const [vendeur, setVendeur] = useState(null);
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function charger() {
      const { data: v } = await supabase.from("vendeurs").select("*").eq("id", vendeurId).single();
      const { data: p } = await supabase.from("produits").select("*").eq("vendeur_id", vendeurId).order("id", { ascending: false });
      setVendeur(v); setProduits(p || []); setLoading(false);
    }
    if (vendeurId) charger();
  }, [vendeurId]);

  if (loading) return <div style={{ padding: 40, fontFamily: "sans-serif", textAlign: "center" }}>Chargement de la boutique...</div>;
  if (!vendeur) return <div style={{ padding: 40, fontFamily: "sans-serif", textAlign: "center" }}>Boutique introuvable</div>;

  if (vendeur.suspendu) {
    return (
      <div style={{ minHeight: "100vh", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "Inter, system-ui, sans-serif" }}>
        <div style={{ background: "white", maxWidth: 480, width: "100%", padding: 32, borderRadius: 20, textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 52 }}>🔒</div>
          <h1 style={{ fontSize: 24, margin: "12px 0" }}>Boutique suspendue</h1>
          <p style={{ color: "#6b7280", lineHeight: 1.6 }}>Cette boutique est temporairement suspendue car l'abonnement n'a pas été payé.</p>
          <p style={{ fontWeight: 700, marginTop: 16 }}>Tu es le propriétaire ?</p>
          <a href={`https://wa.me/2290167275906?text=${encodeURIComponent("Bonjour, je veux payer pour réactiver ma boutique " + vendeur.nom_boutique)}`} target="_blank" style={{ display: "block", marginTop: 12, background: "#16a34a", color: "white", padding: 14, borderRadius: 12, textDecoration: "none", fontWeight: 800 }}>Payer pour réactiver</a>
          <a href="/" style={{ display: "block", marginTop: 16, color: "#6b7280", fontSize: 14 }}>← Retour à Samishop</a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7f8", fontFamily: "Inter, system-ui, sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #0f2a1d, #14532d)", color: "white", padding: "36px 20px 28px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <a href="/" style={{ color: "rgba(255,255,255,0.8)", textDecoration: "none", fontSize: 14 }}>← Samishop</a>
          <h1 style={{ fontSize: 36, margin: "14px 0 6px" }}>{vendeur.nom_boutique}</h1>
          <p style={{ opacity: 0.85, margin: 0 }}>{produits.length} produit(s) • Commande rapide sur WhatsApp</p>
          <a href={`https://wa.me/${vendeur.whatsapp}`} target="_blank" style={{ display: "inline-block", marginTop: 16, background: "#25D366", color: "white", padding: "12px 20px", borderRadius: 14, textDecoration: "none", fontWeight: 800 }}>Discuter sur WhatsApp</a>
        </div>
      </div>

      <main style={{ maxWidth: 960, margin: "0 auto", padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 16 }}>
          {produits.map(p => {
            const msg = encodeURIComponent(`Bonjour ${vendeur.nom_boutique}, je veux commander : ${p.nom} à ${p.prix} FCFA`);
            return (
              <div key={p.id} style={{ background: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 4px 18px rgba(0,0,0,0.06)" }}>
                {p.image_url ? <img src={p.image_url} style={{ width: "100%", height: 190, objectFit: "cover" }} /> : <div style={{ height: 190, background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>📦</div>}
                <div style={{ padding: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{p.nom}</div>
                  <div style={{ color: "#16a34a", fontWeight: 800, fontSize: 18, margin: "6px 0" }}>{p.prix} FCFA</div>
                  <p style={{ color: "#6b7280", fontSize: 14, margin: "0 0 14px" }}>{p.description}</p>
                  <a href={`https://wa.me/${vendeur.whatsapp}?text=${msg}`} target="_blank" style={{ display: "block", textAlign: "center", background: "#111827", color: "white", padding: 12, borderRadius: 12, textDecoration: "none", fontWeight: 800 }}>Commander</a>
                </div>
              </div>
            );
          })}
        </div>
        {produits.length === 0 && <p style={{ textAlign: "center", color: "#6b7280", padding: 40 }}>Cette boutique n'a pas encore de produit.</p>}
        <p style={{ textAlign: "center", color: "#9ca3af", fontSize: 12, marginTop: 30 }}>Propulsé par Samishop • Paiement à la livraison via WhatsApp</p>
      </main>
    </div>
  );
}

export default function BoutiquePublique() {
  return (
    <Suspense fallback={<div style={{ padding: 40, fontFamily: "sans-serif", textAlign: "center" }}>Chargement de la boutique...</div>}>
      <BoutiquePubliqueContent />
    </Suspense>
  );
}
