"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Download, AlertCircle } from "lucide-react"

interface AutomatonGraphProps {
  automaton: any
  graphs?: any
}

export function AutomatonGraph({ automaton, graphs }: AutomatonGraphProps) {
  const [showAllTransitions, setShowAllTransitions] = useState(false)
  const [activeGraph, setActiveGraph] = useState<"afn" | "afd">("afn")
  const [hasImages, setHasImages] = useState(false)
  const [debugInfo, setDebugInfo] = useState("")

  useEffect(() => {
    const debugMessage = `
Graphs object: ${graphs ? "exists" : "null"}
automaton_afn: ${graphs?.automaton_afn ? `exists (${graphs.automaton_afn.substring(0, 50)}...)` : "missing"}
automaton_afd: ${graphs?.automaton_afd ? `exists (${graphs.automaton_afd.substring(0, 50)}...)` : "missing"}
    `.trim()

    setDebugInfo(debugMessage)
    console.log("[v0] Automaton Graph Debug:", debugMessage)
    console.log("[v0] Full graphs object:", graphs)

    setHasImages(!!(graphs?.automaton_afn || graphs?.automaton_afd))
  }, [graphs])

  const displayedTransitions = showAllTransitions ? automaton?.transitions : automaton?.transitions?.slice(0, 10)

  const downloadImage = (base64: string, filename: string) => {
    const link = document.createElement("a")
    link.href = `data:image/png;base64,${base64}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-bold">Autómata LR(1)</h2>

      <div className="space-y-6">
        {!hasImages && (
          <div className="rounded border border-yellow-200 bg-yellow-50 p-4">
            <div className="mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Las imágenes del autómata no están disponibles</span>
            </div>
            <p className="mb-3 text-sm text-yellow-700">
              Verifica que el backend esté retornando los datos correctamente. Abre la consola (F12) para ver los
              detalles.
            </p>
            <div className="rounded bg-yellow-100 p-3 font-mono text-xs text-yellow-900">
              <pre>{debugInfo}</pre>
            </div>
          </div>
        )}

        {hasImages && (
          <div className="rounded border border-border bg-background/50 p-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-muted-foreground">DIAGRAMAS DEL AUTÓMATA</p>
              <div className="flex gap-2">
                <Button
                  variant={activeGraph === "afn" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveGraph("afn")}
                >
                  AFD
                </Button>
                <Button
                  variant={activeGraph === "afd" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveGraph("afd")}
                >
                  AFN
                </Button>
              </div>
            </div>

            <div className="flex justify-center overflow-x-auto">
              {activeGraph === "afn" && graphs?.automaton_afn && (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={`data:image/png;base64,${graphs.automaton_afn}`}
                    alt="Autómata AFD"
                    className="max-w-full"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => downloadImage(graphs.automaton_afn, "automata-afd.png")}
                  >
                    <Download className="h-4 w-4" />
                    Descargar AFD
                  </Button>
                </div>
              )}
              {activeGraph === "afd" && graphs?.automaton_afd && (
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={`data:image/png;base64,${graphs.automaton_afd}`}
                    alt="Autómata AFN"
                    className="max-w-full"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => downloadImage(graphs.automaton_afd, "automata-afn.png")}
                  >
                    <Download className="h-4 w-4" />
                    Descargar AFN
                  </Button>
                </div>
              )}
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
