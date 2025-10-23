"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ParsingResults } from "./parsing-results"
import { GrammarInput } from "./grammar-input"
import { StringParser } from "./sections/string-parser"

export function LR1Parser() {
  const [grammar, setGrammar] = useState("")
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleParse = async () => {
    if (!grammar.trim()) {
      setError("Por favor ingresa una gramática")
      return
    }

    setLoading(true)
    setError("")
    setResults(null)

    try {
      const response = await fetch("http://localhost:8000/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grammar: grammar,
          generate_graphs: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Error al procesar la gramática")
      }

      setResults(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al procesar la gramática")
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setGrammar("")
    setResults(null)
    setError("")
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-3xl font-bold">LR(1) Parser Analyzer</h1>
          <p className="mt-2 text-muted-foreground">
            Analiza y visualiza la construcción de tablas LR(1) para tu gramática
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Input Section */}
          <div className="space-y-4 lg:col-span-1">
            <GrammarInput value={grammar} onChange={setGrammar} />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={handleParse} disabled={loading || !grammar.trim()} className="flex-1">
                {loading ? "Procesando..." : "Analizar Gramática"}
              </Button>
              <Button onClick={handleClear} variant="outline" className="flex-1 bg-transparent">
                Limpiar
              </Button>
            </div>

            {/* Error Message */}
            {error && (
              <Card className="border-destructive bg-destructive/10 p-4">
                <p className="text-sm text-destructive">{error}</p>
              </Card>
            )}

            {results && (
              <div className="mt-6 border-t border-border pt-6">
                <StringParser grammar={grammar} />
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {results ? (
              <ParsingResults results={results} />
            ) : (
              <Card className="flex h-full items-center justify-center border-dashed p-8">
                <div className="text-center">
                  <p className="text-muted-foreground">Los resultados aparecerán aquí</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
