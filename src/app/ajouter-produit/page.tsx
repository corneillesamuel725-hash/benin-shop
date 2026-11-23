"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function AjouterProduit() {
  const [vendeurId, setVendeurId] = useState("");
  const [nomBoutique, setNomBoutique] = useState("");
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [fichier, setFichier] = useState(null);
  const [apercu, setApercu] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("vendeur_id");
    if (!id) { window.location.href = "/connexion"; return; }
    setVendeurId(id);
    setNomBoutique(localStorage.getItem("nom_boutique") || "");
  }, []);

  function choisirPhoto(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFichier(f);
    setApercu(URL.createObjectURL(f));
  }

  async function ajouter(e) {
    e.preventDefault();
    setLoading(true); setErreur("");
    let urlFinale = imageUrl.trim();

    if (fichier) {
      const nomFichier = `${vendeurId}/${Date.now()}-${fichier.name.replace(/\s/g, "_")}`;
      const { error: uploadError } = await supabase.storage.from("produits").upload(nomFichier, fichier);
      if (uploadError) { setErreur("Photo non envoyée : " + uploadError.message); setLoading(false); return; }
      const { data } = supabase.storage.from("produits").getPublicUrl(nomFichier);
      urlFinale = data.publicUrl;
    }

    const { error } = await supabase.from("produits").insert({
      vendeur_id: vendeurId,
      nom: nom,
      prix: Number(prix),
      description: description,
      image_url: urlFinale || null
    });

    if (error) { setErreur(error.message); setLoading(false); return; }
    window.location.href = "/ma-boutique";
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7f8", padding: 20, fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        <a href="/ma-boutique" style={{ color: "#374151", textDecoration: "none" }}>← Retour à ma boutique</a>
        <h2>Ajouter un produit</h2>
        <p>Boutique : <b>{nomBoutique}</b></p>

        <form onSubmit={ajouter} style={{ background: "white", padding: 22, borderRadius: 20, display: "flex", flexDirection: "column", gap: 12 }}>
          <input value={nom} onChange={e => setNom(e.target.value)} placeholder="Nom du produit" required style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db" }} />
          <input value={prix} onChange={e => setPrix(e.target.value)} placeholder="Prix en FCFA" type="number" required style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db" }} />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" rows={3} style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db" }} />

          <div style={{ border: "2px dashed #d1d5db", borderRadius: 12, padding: 16, textAlign: "center" }}>
            {apercu ? <img src={apercu} style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 10 }} /> : <div style={{ fontSize: 40 }}>📸</div>}
            <p style={{ margin: "8px 0", fontSize: 14, color: "#6b7280" }}>Choisir une photo dans ton téléphone</p>
            <input type="file" accept="image/*" onChange={choisirPhoto} style={{ width: "100%" }} />
          </div>

          <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Ou coller un lien de photo (optionnel)" style={{ padding: 12, borderRadius: 12, border: "1px solid #d1d5db" }} />

          {erreur && <p style={{ color: "red", fontSize: 14 }}>{erreur}</p>}
          <button disabled={loading} style={{ background: "#16a34a", color: "white", border: "none", padding: 13, borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>{loading ? "Ajout en cours..." : "Ajouter le produit"}</button>
        </form>
      </div>
    </div>
  );
}
