import { supabase } from "../supabase";

export default async function Home() {
  const { data: produits } = await supabase.from("produits").select("*");

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 1000, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h1 style={{ margin: 0 }}>Benin Shop</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <a href="/ma-boutique" style={{ padding: "8px 15px", border: "1px solid #ccc", borderRadius: 8, textDecoration: "none", color: "black" }}>
            Ma boutique
          </a>
          <a href="/inscription" style={{ padding: "8px 15px", background: "#16a34a", color: "white", borderRadius: 8, textDecoration: "none" }}>
            Devenir vendeur
          </a>
        </div>
      </header>

      <p>{produits?.length || 0} produits trouvés dans Supabase</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 15 }}>
        {produits?.map(p => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: 15, borderRadius: 10 }}>
            {p.image_url && <img src={p.image_url} alt={p.nom} style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 8 }} />}
            <h3>{p.nom}</h3>
            <p style={{ fontWeight: "bold", color: "#16a34a" }}>{p.prix} FCFA</p>
            <p>{p.description}</p>
            <a
              href={`/boutique/${p.vendeur_id}`}
              style={{ fontSize: 14, color: "#666" }}
            >
              Voir la boutique du vendeur
            </a>
          </div>
        ))}
      </div>
    </main>
  );
}