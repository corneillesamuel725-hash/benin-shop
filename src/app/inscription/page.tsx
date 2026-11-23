"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { supabase } from "../../supabase";

export default function InscriptionVendeur() {
  const [nomBoutique, setNomBoutique] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [accepte, setAccepte] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!accepte) {
      setMessage("Tu dois accepter les conditions pour continuer.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("vendeurs")
      .insert([
        {
          nom_boutique: nomBoutique,
          whatsapp: whatsapp.replace(/\s/g, ""),
          email: email || null,
        },
      ])
      .select()
      .single();

    setLoading(false);

    if (error) {
      setMessage("Erreur : " + error.message);
      return;
    }

    localStorage.setItem("vendeur_id", data.id);
    localStorage.setItem("vendeur_whatsapp", data.whatsapp);
    localStorage.setItem("nom_boutique", data.nom_boutique);

    setMessage("Boutique créée avec succès ! Redirection vers ta boutique...");

    setTimeout(() => {
      window.location.href = "/ma-boutique";
    }, 1000);
  }

  return (
    <main style={{ maxWidth: 500, margin: "40px auto", padding: 20, fontFamily: "sans-serif" }}>
      <h1>Créer ma boutique</h1>
      <p>Inscris-toi avec ton numéro WhatsApp et commence à vendre.</p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          placeholder="Nom de la boutique"
          value={nomBoutique}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNomBoutique(e.target.value)}
          required
          style={{ padding: 12 }}
        />

        <input
          placeholder="Numéro WhatsApp (ex: 22997000000)"
          value={whatsapp}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setWhatsapp(e.target.value)}
          required
          style={{ padding: 12 }}
        />

        <input
          placeholder="Email (optionnel)"
          type="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          style={{ padding: 12 }}
        />

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={accepte} onChange={(e: ChangeEvent<HTMLInputElement>) => setAccepte(e.target.checked)} />
          J'accepte les conditions de Benin Shop
        </label>

        <button type="submit" disabled={loading} style={{ padding: 12, cursor: "pointer", background: "#16a34a", color: "white", border: "none", borderRadius: 8 }}>
          {loading ? "Création..." : "Créer ma boutique"}
        </button>
      </form>

      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </main>
  );
}