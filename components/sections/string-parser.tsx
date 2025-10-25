"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, XCircle } from "lucide-react"

const BACKEND_URL = "https://backend-lr1-production.up.railway.app"

interface StringParserProps {
  grammar: string
}

interface ParsingStep {
  step: number
  stack: number[]
  symbol_stack: string[]
  remaining_input: string
  current_state: number
  current_token: string
  action: string
  action_detail: string
  production_id?: number
  production_lhs?: string
  production_rhs?: string[]
}

interface ParsingResult {
  accepted: boolean
  error: string | null
  steps: ParsingStep[]
  summary: {
    total_steps: number
    input_tokens: string[]
    input_length: number
    accepted: boolean
  }
}

export function StringParser({ grammar }: StringParserProps) {
  const [inputString, setInputString] = useState("")
  const [result, setResult] = useState<ParsingResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [expandedStep, setExpandedStep] = useState<number | null>(null)

  const handleParse = async () => {
    if (!inputString.trim()) {
      setError("Por favor ingresa una cadena de entrada")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch(`${BACKEND_URL}/parse/string`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grammar: grammar,
          input_string: inputString,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        const errorMessage = data.error || data.message || "Error al parsear la cadena"
        setError(errorMessage)
        setResult(null)
        return
      }

      setResult(data.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error de conexión con el servidor"
      setError(errorMessage)
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "shift":
        return "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
      case "reduce":
        return "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100"
      case "accept":
        return "bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-100"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    }
  }

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-bold">Parsear Cadena de Entrada</h2>

      {/* Input Section */}
      <div className="mb-4 space-y-3">
        <div>
          <label className="block text-sm font-medium mb-2">Cadena de entrada:</label>
          <input
            type="text"
            value={inputString}
            onChange={(e) => setInputString(e.target.value)}
            placeholder="Ej: c c d d"
            className="w-full rounded border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyPress={(e) => e.key === "Enter" && handleParse()}
          />
        </div>

        <Button onClick={handleParse} disabled={loading || !inputString.trim()} className="w-full">
          {loading ? "Parseando..." : "Parsear Cadena"}
        </Button>

        {error && (
          <div className="rounded border border-destructive bg-destructive/10 p-4 flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive mb-1">Error en el parsing</p>
              <p className="text-sm text-destructive/90">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-4">
          <div
            className="rounded-lg border-2 p-4 flex items-center justify-between"
            style={{
              borderColor: result.accepted ? "#22c55e" : "#ef4444",
              backgroundColor: result.accepted ? "rgba(34, 197, 94, 0.05)" : "rgba(239, 68, 68, 0.05)",
            }}
          >
            <div className="flex items-center gap-3">
              {result.accepted ? (
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
              <div>
                <p className="text-sm text-muted-foreground">Estado del parsing:</p>
                <p className="font-semibold text-lg">
                  {result.accepted ? (
                    <span className="text-green-600 dark:text-green-400">Cadena Aceptada ✓</span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400">Cadena Rechazada ✗</span>
                  )}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total de pasos:</p>
              <p className="font-semibold text-lg">{result.summary.total_steps}</p>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded bg-card/50 p-4">
            <p className="mb-2 text-sm font-semibold">Resumen:</p>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-muted-foreground">Tokens:</span>{" "}
                <span className="font-mono">{result.summary.input_tokens.join(" ")}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Longitud:</span> {result.summary.input_length}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold">Pasos del Parsing:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50 border-b-2 border-border">
                    <th className="px-3 py-2 text-left font-semibold">Paso</th>
                    <th className="px-3 py-2 text-left font-semibold">Pila</th>
                    <th className="px-3 py-2 text-left font-semibold">Entrada Actual</th>
                    <th className="px-3 py-2 text-left font-semibold">Acción</th>
                    <th className="px-3 py-2 text-left font-semibold">Detalles</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((step, idx) => (
                    <tr
                      key={step.step}
                      className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors"
                      onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
                    >
                      <td className="px-3 py-2 font-mono font-semibold text-primary">{step.step}</td>
                      <td className="px-3 py-2 font-mono text-xs">
                        <span className="text-muted-foreground">[</span>
                        {step.stack.join(", ")}
                        <span className="text-muted-foreground">]</span>
                      </td>
                      <td className="px-3 py-2 font-mono text-xs">
                        {step.remaining_input || <span className="text-muted-foreground italic">$</span>}
                      </td>
                      <td className="px-3 py-2">
                        <Badge className={getActionColor(step.action)}>{step.action.toUpperCase()}</Badge>
                      </td>
                      <td className="px-3 py-2 text-xs text-muted-foreground truncate">{step.action_detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {expandedStep !== null && result.steps.find((s) => s.step === expandedStep) && (
              <div className="mt-4 rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="font-semibold">Detalles del Paso {expandedStep}</p>
                  <button
                    onClick={() => setExpandedStep(null)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cerrar
                  </button>
                </div>
                {result.steps.find((s) => s.step === expandedStep) && (
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded bg-background/50 p-3">
                        <p className="text-xs text-muted-foreground font-semibold mb-1">Stack de Estados</p>
                        <p className="font-mono text-xs">
                          [{result.steps.find((s) => s.step === expandedStep)?.stack.join(", ")}]
                        </p>
                      </div>
                      <div className="rounded bg-background/50 p-3">
                        <p className="text-xs text-muted-foreground font-semibold mb-1">Stack de Símbolos</p>
                        <p className="font-mono text-xs">
                          [{result.steps.find((s) => s.step === expandedStep)?.symbol_stack.join(", ")}]
                        </p>
                      </div>
                    </div>
                    <div className="rounded bg-background/50 p-3">
                      <p className="text-xs text-muted-foreground font-semibold mb-1">Entrada Restante</p>
                      <p className="font-mono text-xs">
                        {result.steps.find((s) => s.step === expandedStep)?.remaining_input || "$"}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded bg-background/50 p-3">
                        <p className="text-xs text-muted-foreground font-semibold mb-1">Estado Actual</p>
                        <p className="font-mono text-xs">
                          {result.steps.find((s) => s.step === expandedStep)?.current_state}
                        </p>
                      </div>
                      <div className="rounded bg-background/50 p-3">
                        <p className="text-xs text-muted-foreground font-semibold mb-1">Token Actual</p>
                        <p className="font-mono text-xs">
                          {result.steps.find((s) => s.step === expandedStep)?.current_token}
                        </p>
                      </div>
                    </div>
                    {result.steps.find((s) => s.step === expandedStep)?.production_id !== undefined && (
                      <div className="rounded bg-background/50 p-3">
                        <p className="text-xs text-muted-foreground font-semibold mb-1">Producción Aplicada</p>
                        <p className="font-mono text-xs">
                          {result.steps.find((s) => s.step === expandedStep)?.production_lhs} →{" "}
                          {result.steps.find((s) => s.step === expandedStep)?.production_rhs?.join(" ")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}
