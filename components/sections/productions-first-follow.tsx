import { Card } from "@/components/ui/card"

interface ProductionsFirstFollowProps {
  productions: any[]
  firstFollow: any
  symbols: any
}

export function ProductionsFirstFollow({ productions, firstFollow, symbols }: ProductionsFirstFollowProps) {
  return (
    <Card className="p-6">
      <h2 className="mb-6 text-xl font-bold">Producciones y Conjuntos FIRST/FOLLOW</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Producciones */}
        <div>
          <h3 className="mb-3 font-semibold text-primary">Producciones</h3>
          <div className="space-y-2">
            {productions?.map((prod: any, idx: number) => (
              <div key={idx} className="rounded bg-card/50 p-2 font-mono text-sm">
                <span className="font-semibold text-primary">{prod.id}.</span>
                <span className="ml-2 text-foreground">
                  {prod.lhs} → {prod.rhs_str}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* FIRST y FOLLOW */}
        <div className="space-y-4">
          {/* FIRST */}
          <div>
            <h3 className="mb-3 font-semibold text-primary">FIRST</h3>
            <div className="space-y-2">
              {symbols?.non_terminals?.map((nt: string) => (
                <div key={`first-${nt}`} className="rounded bg-card/50 p-2 text-sm">
                  <span className="font-mono font-semibold text-primary">FIRST({nt})</span>
                  <span className="ml-2 text-muted-foreground">
                    = {"{"}
                    {firstFollow?.first?.[nt]?.join(", ") || ""}
                    {"}"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FOLLOW */}
          <div>
            <h3 className="mb-3 font-semibold text-primary">FOLLOW</h3>
            <div className="space-y-2">
              {symbols?.non_terminals?.map((nt: string) => (
                <div key={`follow-${nt}`} className="rounded bg-card/50 p-2 text-sm">
                  <span className="font-mono font-semibold text-primary">FOLLOW({nt})</span>
                  <span className="ml-2 text-muted-foreground">
                    = {"{"}
                    {firstFollow?.follow?.[nt]?.join(", ") || ""}
                    {"}"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Símbolos */}
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">NO TERMINALES</p>
          <div className="flex flex-wrap gap-2">
            {symbols?.non_terminals?.map((nt: string) => (
              <span key={nt} className="rounded bg-primary/10 px-2 py-1 font-mono text-sm text-primary">
                {nt}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">TERMINALES</p>
          <div className="flex flex-wrap gap-2">
            {symbols?.terminals?.map((t: string) => (
              <span key={t} className="rounded bg-accent/10 px-2 py-1 font-mono text-sm text-accent-foreground">
                {t}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">SÍMBOLO INICIAL</p>
          <div className="flex flex-wrap gap-2">
            <span className="rounded bg-green-500/10 px-2 py-1 font-mono text-sm text-green-600">
              {symbols?.start_symbol}
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}
