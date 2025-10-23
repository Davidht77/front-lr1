import { Card } from "@/components/ui/card"

interface ClosureTableProps {
  closureTable: any[]
}

export function ClosureTable({ closureTable }: ClosureTableProps) {
  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-bold">Tabla de Clausura</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-border bg-card/50">
              <th className="border border-border px-4 py-3 text-left font-semibold">Estado</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Etiqueta GOTO</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Kernel</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Clausura</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Items</th>
              <th className="border border-border px-4 py-3 text-left font-semibold">Transiciones GOTO</th>
            </tr>
          </thead>
          <tbody>
            {closureTable?.map((closure: any, idx: number) => (
              <tr key={closure.state_id} className={idx % 2 === 0 ? "bg-background/30" : ""}>
                <td className="border border-border px-4 py-3 font-mono font-semibold text-primary">
                  {closure.state_id}
                </td>
                <td className="border border-border px-4 py-3 text-xs font-mono text-muted-foreground">
                  {closure.goto_label || "-"}
                </td>
                <td className="border border-border px-4 py-3">
                  <p className="font-mono text-xs text-foreground">{closure.kernel_display || "-"}</p>
                </td>
                <td className="border border-border px-4 py-3">
                  <p className="font-mono text-xs text-muted-foreground">{closure.closure_display || "-"}</p>
                </td>
                <td className="border border-border px-4 py-3 text-center font-mono text-xs font-semibold text-primary">
                  {closure.num_items}
                </td>
                <td className="border border-border px-4 py-3">
                  {closure.goto_transitions && closure.goto_transitions.length > 0 ? (
                    <div className="space-y-1">
                      {closure.goto_transitions.map((trans: any[], i: number) => (
                        <p key={i} className="font-mono text-xs">
                          goto({trans[0]}, {trans[1]})
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">-</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
