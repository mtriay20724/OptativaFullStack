import { Link } from "react-router-dom";
import { BookOpen, UtensilsCrossed, CreditCard, ChevronRight, QrCode } from "lucide-react";

const OPTIONS = [
  { to: "/carta", label: "Ver la carta", desc: "Explora nuestros platos y bebidas", Icon: BookOpen },
  { to: "/pedir", label: "Pedir comida", desc: "Pide directamente desde tu mesa", Icon: UtensilsCrossed },
  { to: "/pagar", label: "Pagar la cuenta", desc: "Revisa y paga sin esperar al camarero", Icon: CreditCard },
];

export default function Home() {
  const mesa = new URLSearchParams(window.location.search).get("mesa") || "";
  const qs = mesa ? `?mesa=${encodeURIComponent(mesa)}` : "";

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-5 py-10">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <QrCode className="h-4 w-4" />
        <span className="text-sm">Escanea el código de tu mesa para empezar</span>
      </div>
      <h1 className="mt-4 text-center font-heading text-4xl font-bold tracking-tight">La Mesa</h1>
      {mesa && (
        <p className="mt-2 text-center text-sm text-muted-foreground">Mesa {mesa}</p>
      )}
      <p className="mt-2 text-center text-muted-foreground">Bienvenido. ¿Qué quieres hacer?</p>

      <div className="mt-8 space-y-4">
        {OPTIONS.map(({ to, label, desc, Icon }) => (
          <Link
            key={to}
            to={`${to}${qs}`}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-amber-500 hover:shadow-md"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Icon className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-foreground">{label}</h2>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}