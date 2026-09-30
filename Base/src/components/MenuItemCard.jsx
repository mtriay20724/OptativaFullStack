import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";

export default function MenuItemCard({ item, onAdd }) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-3 shadow-sm">
      {item.image_url && (
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image src={item.image_url} alt={item.name} className="h-full w-full" fittingType="fill" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-foreground">{item.name}</h3>
          <span className="shrink-0 font-mono text-sm font-semibold text-amber-600">
            {item.price.toFixed(2)} €
          </span>
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
      </div>
      {onAdd && (
        <Button size="icon" variant="outline" aria-label={`Añadir ${item.name}`} onClick={() => onAdd(item)}>
          <Plus className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}