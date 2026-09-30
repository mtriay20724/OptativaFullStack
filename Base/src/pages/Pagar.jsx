import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ReceiptText, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Pagar() {
  const [mesa, setMesa] = useState(new URLSearchParams(window.location.search).get("mesa") || "");
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const loadOrders = async () => {
    if (!mesa) return;
    setLoading(true);
    try {
      const all = await base44.entities.Order.list();
      setOrders(all.filter((o) => o.table_number === mesa && o.status !== "pagado"));
    } finally {
      setLoading(false);
    }
  };

  const lines = useMemo(() => (orders || []).flatMap((o) => o.items || []), [orders]);
  const total = useMemo(() => lines.reduce((acc, l) => acc + l.qty * l.price, 0), [lines]);

  const pay = async () => {
    setPaying(true);
    try {
      await base44.entities.Order.bulkUpdate(orders.map((o) => ({ id: o.id, status: "pagado" })));
      setPaid(true);
    } finally {
      setPaying(false);
    }
  };

  if (paid) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-5 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <h1 className="mt-4 font-heading text-2xl font-bold">¡Pago completado!</h1>
        <p className="mt-2 text-muted-foreground">Gracias por tu visita. ¡Hasta pronto!</p>
        <Link to="/" className="mt-8 rounded-xl bg-amber-600 px-5 py-3 font-medium text-white hover:bg-amber-700">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-6">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Inicio
      </Link>
      <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight">Pagar la cuenta</h1>
      <p className="mt-1 text-muted-foreground">Consulta lo consumido en tu mesa y paga al instante.</p>

      <div className="mt-6 flex gap-2">
        <Input
          inputMode="numeric"
          placeholder="Número de mesa"
          value={mesa}
          onChange={(e) => setMesa(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && loadOrders()}
        />
        <Button onClick={loadOrders} disabled={loading || !mesa}>
          <Search className="mr-1 h-4 w-4" /> {loading ? "Buscando…" : "Ver cuenta"}
        </Button>
      </div>

      {orders && orders.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">No hay consumiciones pendientes para la mesa {mesa}.</p>
      )}

      {orders && orders.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <ReceiptText className="h-4 w-4" /> Detalle de la cuenta · Mesa {mesa}
          </div>
          <ul className="mt-3 divide-y divide-border rounded-xl border border-border bg-card">
            {lines.map((l, idx) => (
              <li key={idx} className="flex items-center justify-between px-4 py-3 text-sm">
                <span>{l.qty}× {l.name}</span>
                <span className="font-mono text-muted-foreground">{(l.qty * l.price).toFixed(2)} €</span>
              </li>
            ))}
            <li className="flex items-center justify-between px-4 py-3 font-semibold">
              <span>Total</span>
              <span className="font-mono">{total.toFixed(2)} €</span>
            </li>
          </ul>
          <Button size="lg" className="mt-4 w-full" onClick={pay} disabled={paying}>
            {paying ? "Procesando pago…" : `Pagar ${total.toFixed(2)} €`}
          </Button>
        </div>
      )}
    </div>
  );
}