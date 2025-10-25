"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ClosureTableProps {
  closureTable: any[]
}

export function ClosureTable({ closureTable }: ClosureTableProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Tabla de Clausura</h2>
        <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="gap-2">
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Contraer
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Expandir
            </>
          )}
        </Button>
      </div>

      {isExpanded && (
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
      )}

      {!isExpanded && (
        <div className="rounded bg-card/50 p-4">
          <p className="text-sm text-muted-foreground">
            Tabla de clausura con <span className="font-semibold text-foreground">{closureTable?.length || 0}</span>{" "}
            estados
          </p>
        </div>
      )}
    </Card>
  )
}
