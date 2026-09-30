import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MenuItemCard from "@/components/MenuItemCard";

const CATEGORIES = [
  { id: "entrantes", label: "Entrantes" },
  { id: "principales", label: "Platos principales" },
  { id: "postres", label: "Postres" },
  { id: "bebidas", label: "Bebidas" },
];

export default function Carta() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    base44.entities.MenuItem.list().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div className="mx-auto max-w-lg px-5 py-6 pb-16">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Inicio
      </Link>
      <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight">Nuestra carta</h1>

      {!items && <div className="mt-10 text-center text-muted-foreground">Cargando carta…</div>}
      {items && items.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">La carta aún no tiene platos.</p>
      )}

      {items && CATEGORIES.map(({ id, label }) => {
        const group = items.filter((i) => i.category === id);
        if (!group.length) return null;
        return (
          <section key={id} className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{label}</h2>
            <div className="space-y-3">
              {group.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}

      {items && items.length > 0 && (
        <Link
          to="/pedir"
          className="mt-10 block rounded-xl bg-amber-600 py-3 text-center font-semibold text-white hover:bg-amber-700"
        >
          Hacer un pedido
        </Link>
      )}
    </div>
  );
}