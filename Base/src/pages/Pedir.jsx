import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MenuItemCard from "@/components/MenuItemCard";
import CartPanel from "@/components/CartPanel";

export default function Pedir() {
  const [items, setItems] = useState(null);
  const [cart, setCart] = useState([]);
  const [mesa, setMesa] = useState(new URLSearchParams(window.location.search).get("mesa") || "");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    base44.entities.MenuItem.list().then(setItems).catch(() => setItems([]));
  }, []);

  const total = useMemo(() => cart.reduce((acc, c) => acc + c.qty * c.price, 0), [cart]);

  const addToCart = (item) => {
    setSent(false);
    setCart((prev) => {
      const found = prev.find((c) => c.id === item.id);
      if (found) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((c) => c.id !== id));

  const confirmOrder = async () => {
    setSending(true);
    try {
      await base44.entities.Order.create({
        table_number: mesa,
        items: cart.map(({ name, qty, price }) => ({ name, qty, price })),
        total,
        status: "pendiente",
      });
      setCart([]);
      setSent(true);
      return true;
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-5 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <h1 className="mt-4 font-heading text-2xl font-bold">¡Pedido enviado a cocina!</h1>
        <p className="mt-2 text-muted-foreground">Mesa {mesa} · En breve te lo traemos.</p>
        <div className="mt-8 flex gap-3">
          <Link to="/" className="rounded-xl border border-border px-5 py-3 font-medium hover:bg-muted">Inicio</Link>
          <Link to={`/pagar?mesa=${encodeURIComponent(mesa)}`} className="rounded-xl bg-amber-600 px-5 py-3 font-medium text-white hover:bg-amber-700">Pagar la cuenta</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-6 pb-32">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Inicio
      </Link>
      <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight">Pedir comida</h1>
      <p className="mt-1 text-muted-foreground">Añade platos y envía tu pedido a cocina.</p>

      {!items && <div className="mt-10 text-center text-muted-foreground">Cargando carta…</div>}
      {items && (
        <div className="mt-6 space-y-6">
          {["entrantes", "principales", "postres", "bebidas"].map((cat) => {
            const group = items.filter((i) => i.category === cat);
            if (!group.length) return null;
            return (
              <section key={cat}>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground capitalize">{cat}</h2>
                <div className="space-y-3">
                  {group.map((item) => (
                    <MenuItemCard key={item.id} item={item} onAdd={addToCart} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <CartPanel
        cart={cart}
        total={total}
        tableNumber={mesa}
        onTableChange={setMesa}
        onRemove={removeFromCart}
        onConfirm={confirmOrder}
        sending={sending}
      />
    </div>
  );
}