"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { supabase } from "../../supabase";

export default function AjouterProduit() {
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [description, setDescription] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [nomBoutique, setNomBoutique] = useState("");

  useEffect(() => {
    const nom = localStorage.getItem("nom_boutique");
    if (nom) setNomBoutique(nom);
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const vendeurId = localStorage.getItem("vendeur_id");
    if (!vendeurId) {
      setMessage("D'abord crée ta boutique sur /inscription");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("produits").insert([
      {
        nom,
        prix: Number(prix),
        description,
        image_url: photoUrl || null,
        vendeur_id: parseInt(vendeurId),
      },
    ]);

    setLoading(false);

    if (error) {
      setMessage("Erreur : " + error.message);
      return;
    }

    setMessage("Produit ajouté avec succès ! Retour à ta boutique...");

    setTimeout(() => {
      window.location.href = "/ma-boutique";
    }, 1000);
  }

  return (
    <main style={{ maxWidth: 500, margin: "40px auto", padding: 20, fontFamily: "sans-serif" }}>
      <a href="/ma-boutique" style={{ color: "#666", textDecoration: "none" }}>← Retour à ma boutique</a>
      <h1>Ajouter un produit</h1>
      {nomBoutique && <p>Boutique : <strong>{nomBoutique}</strong></p>}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input placeholder="Nom du produit" value={nom} onChange={(e: ChangeEvent<HTMLInputElement>) => setNom(e.target.value)} required style={{ padding: 12 }} />
        <input placeholder="Prix (ex: 15000)" type="number" value={prix} onChange={(e: ChangeEvent<HTMLInputElement>) => setPrix(e.target.value)} required style={{ padding: 12 }} />
        <textarea placeholder="Description" value={description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} style={{ padding: 12 }} />
        <input placeholder="Lien de la photo (optionnel pour l'instant)" value={photoUrl} onChange={(e: ChangeEvent<HTMLInputElement>) => setPhotoUrl(e.target.value)} style={{ padding: 12 }} />

        <button type="submit" disabled={loading} style={{ padding: 12, cursor: "pointer", background: "#16a34a", color: "white", border: "none", borderRadius: 8 }}>
          {loading ? "Ajout..." : "Ajouter le produit"}
        </button>
      </form>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </main>
  );
}