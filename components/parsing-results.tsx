"use client"
import { ProductionsFirstFollow } from "./sections/productions-first-follow"
import { AutomatonGraph } from "./sections/automaton-graph"
import { LR1AnalysisTable } from "./sections/lr1-analysis-table"
import { ClosureTable } from "./sections/closure-table"

interface ParsingResultsProps {
  results: any
}

export function ParsingResults({ results }: ParsingResultsProps) {
  return (
    <div className="space-y-6">
      {/* 1. Producciones y FIRST/FOLLOW */}
      <ProductionsFirstFollow
        productions={results.grammar?.productions}
        firstFollow={results.first_follow}
        symbols={results.symbols}
      />

      {/* 2. Imagen del Autómata */}
      <AutomatonGraph automaton={results.automaton} graphs={results.graphs} />

      {/* 3. Tabla de Análisis LR(1) */}
      <LR1AnalysisTable parsingTable={results.parsing_table} />

      {/* 4. Tabla de Clausura */}
      <ClosureTable closureTable={results.closure_table} />
    </div>
  )
}
