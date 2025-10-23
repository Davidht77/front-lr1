"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"

interface AutomatonGraphProps {
  automaton: any
  graphs?: any
}

export function AutomatonGraph({ automaton, graphs }: AutomatonGraphProps) {
  const [showAllTransitions, setShowAllTransitions] = useState(false)

  const displayedTransitions = showAllTransitions ? automaton?.transitions : automaton?.transitions?.slice(0, 10)

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-bold">Autómata LR(1)</h2>

      <div className="space-y-6">
        {graphs?.automaton_full && (
          <div className="rounded border border-border bg-background/50 p-4">
            <p className="mb-3 text-sm font-semibold text-muted-foreground">DIAGRAMA DEL AUTÓMATA</p>
            <div className="flex justify-center overflow-x-auto">
              <img src={`data:image/png;base64,${graphs.automaton_full}`} alt="Autómata LR(1)" className="max-w-full" />
            </div>
          </div>
        )}

        <div className="rounded bg-card/50 p-4">
          <p className="mb-2 text-sm font-semibold text-muted-foreground">NÚMERO DE ESTADOS</p>
          <p className="text-2xl font-bold text-primary">{automaton?.num_states || 0}</p>
        </div>

        {/* Estados */}
        <div>
          <h3 className="mb-3 font-semibold">Estados del Autómata</h3>
          <div className="max-h-96 space-y-2 overflow-y-auto">
            {automaton?.states?.map((state: any) => (
              <div key={state.id} className="rounded border border-border bg-card/50 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-mono font-semibold text-primary">Estado {state.id}</p>
                  {state.is_accept && (
                    <span className="rounded bg-green-500/20 px-2 py-1 text-xs font-semibold text-green-600">
                      ACEPTACIÓN
                    </span>
                  )}
                </div>

                {/* Items del kernel */}
                {state.kernel_items?.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs font-semibold text-muted-foreground">Kernel:</p>
                    <div className="space-y-1">
                      {state.kernel_items.map((item: string, idx: number) => (
                        <p key={idx} className="font-mono text-xs text-muted-foreground">
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Todos los items */}
                <p className="text-xs font-semibold text-muted-foreground">Items ({state.num_items}):</p>
                <div className="space-y-1">
                  {state.items?.slice(0, 5).map((item: string, idx: number) => (
                    <p key={idx} className="font-mono text-xs text-foreground">
                      {item}
                    </p>
                  ))}
                  {state.items?.length > 5 && (
                    <p className="text-xs text-muted-foreground">... y {state.items.length - 5} más</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Transiciones ({automaton?.transitions?.length || 0})</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllTransitions(!showAllTransitions)}
              className="gap-2"
            >
              {showAllTransitions ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Contraer
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Expandir todas
                </>
              )}
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left font-semibold">Desde</th>
                  <th className="px-3 py-2 text-left font-semibold">Símbolo</th>
                  <th className="px-3 py-2 text-left font-semibold">Hacia</th>
                </tr>
              </thead>
              <tbody>
                {displayedTransitions?.map((trans: any, idx: number) => (
                  <tr key={idx} className="border-b border-border/50">
                    <td className="px-3 py-2 font-mono text-primary">{trans.from}</td>
                    <td className="px-3 py-2 font-mono">{trans.symbol}</td>
                    <td className="px-3 py-2 font-mono text-primary">{trans.to}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  )
}
