import { useState } from "react";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function CartPanel({ cart, total, tableNumber, onTableChange, onRemove, onConfirm, sending }) {
  const [open, setOpen] = useState(false);
  const count = cart.reduce((acc, c) => acc + c.qty, 0);
  if (count === 0) return null;

  const handleConfirm = async () => {
    const ok = await onConfirm();
    if (ok) setOpen(false);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card p-4 shadow-lg">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="w-full">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Ver mi pedido ({count}) · {total.toFixed(2)} €
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tu pedido</DialogTitle>
          </DialogHeader>
          <ul className="space-y-2">
            {cart.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex-1">
                  {c.qty}× {c.name}
                </span>
                <span className="font-mono text-muted-foreground">{(c.qty * c.price).toFixed(2)} €</span>
                <Button size="icon" variant="ghost" aria-label={`Quitar ${c.name}`} onClick={() => onRemove(c.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          <div className="space-y-2 border-t border-border pt-3">
            <label className="text-sm font-medium" htmlFor="mesa-pedido">Número de mesa</label>
            <Input id="mesa-pedido" inputMode="numeric" placeholder="Ej. 5" value={tableNumber} onChange={(e) => onTableChange(e.target.value)} />
          </div>
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span>
            <span className="font-mono">{total.toFixed(2)} €</span>
          </div>
          <Button className="w-full" size="lg" onClick={handleConfirm} disabled={sending || !tableNumber}>
            {sending ? "Enviando…" : "Enviar a cocina"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}