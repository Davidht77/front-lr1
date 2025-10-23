"use client"
import { useState } from "react"
import { Card } from "@/components/ui/card"

interface LR1AnalysisTableProps {
  parsingTable: any
}

export function LR1AnalysisTable({ parsingTable }: LR1AnalysisTableProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  const actionTable = parsingTable?.action || {}
  const gotoTable = parsingTable?.goto || {}
  const terminals = parsingTable?.headers?.terminals || []
  const nonTerminals = parsingTable?.headers?.non_terminals || []

  const getActionColor = (type: string) => {
    switch (type) {
      case "shift":
        return "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
      case "reduce":
        return "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100"
      case "accept":
        return "bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-100"
      case "goto":
        return "bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-100"
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
    }
  }

  const getTooltip = (action: any) => {
    if (action.type === "shift") {
      return `Shift al estado ${action.value}`
    } else if (action.type === "reduce") {
      return `Reduce por: ${action.production}`
    } else if (action.type === "accept") {
      return "Aceptar"
    } else if (action.type === "goto") {
      return `Ir al estado ${action.value}`
    }
    return ""
  }

  const allStates = Array.from(new Set([...Object.keys(actionTable), ...Object.keys(gotoTable)])).sort(
    (a, b) => Number.parseInt(a) - Number.parseInt(b),
  )

  const allSymbols = [...terminals, ...nonTerminals]

  return (
    <Card className="p-6">
      <h2 className="mb-4 text-xl font-bold">Tabla de Análisis LR(1)</h2>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-card/50">
              <th className="border border-border px-3 py-2 text-left font-semibold">Estado</th>
              {/* Terminales (ACTION) */}
              {terminals.map((terminal: string) => (
                <th
                  key={`term-${terminal}`}
                  className="border border-border px-3 py-2 text-center font-semibold text-green-600 dark:text-green-400"
                  title="Columna ACTION (Terminales)"
                >
                  {terminal}
                </th>
              ))}
              {/* No-terminales (GOTO) */}
              {nonTerminals.map((nt: string) => (
                <th
                  key={`nt-${nt}`}
                  className="border border-border px-3 py-2 text-center font-semibold text-purple-600 dark:text-purple-400"
                  title="Columna GOTO (No-terminales)"
                >
                  {nt}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allStates.map((state: string) => (
              <tr key={state} className="hover:bg-card/30">
                <td className="border border-border px-3 py-2 font-mono font-semibold text-primary">{state}</td>

                {/* Celdas ACTION (Terminales) */}
                {terminals.map((terminal: string) => {
                  const action = actionTable[state]?.[terminal]
                  const cellKey = `${state}-${terminal}`
                  const isHovered = hoveredCell === cellKey

                  return (
                    <td
                      key={cellKey}
                      className="relative border border-border px-3 py-2 text-center"
                      onMouseEnter={() => setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {action ? (
                        <div className="relative">
                          <span
                            className={`inline-block rounded px-2 py-1 font-mono font-semibold cursor-help ${getActionColor(
                              action.type,
                            )}`}
                          >
                            {action.display}
                          </span>
                          {isHovered && (
                            <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg z-10">
                              {getTooltip(action)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  )
                })}

                {/* Celdas GOTO (No-terminales) */}
                {nonTerminals.map((nt: string) => {
                  const gotoAction = gotoTable[state]?.[nt]
                  const cellKey = `goto-${state}-${nt}`
                  const isHovered = hoveredCell === cellKey

                  return (
                    <td
                      key={cellKey}
                      className="relative border border-border px-3 py-2 text-center"
                      onMouseEnter={() => setHoveredCell(cellKey)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {gotoAction ? (
                        <div className="relative">
                          <span
                            className={`inline-block rounded px-2 py-1 font-mono font-semibold cursor-help ${getActionColor(
                              "goto",
                            )}`}
                          >
                            {gotoAction.display}
                          </span>
                          {isHovered && (
                            <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white shadow-lg z-10">
                              Ir al estado {gotoAction.value}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block rounded bg-green-100 px-2 py-1 text-green-900 dark:bg-green-950 dark:text-green-100">
            s#
          </span>
          <span>Shift</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block rounded bg-red-100 px-2 py-1 text-red-900 dark:bg-red-950 dark:text-red-100">
            r#
          </span>
          <span>Reduce</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block rounded bg-blue-100 px-2 py-1 text-blue-900 dark:bg-blue-950 dark:text-blue-100">
            acc
          </span>
          <span>Accept</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block rounded bg-purple-100 px-2 py-1 text-purple-900 dark:bg-purple-950 dark:text-purple-100">
            #
          </span>
          <span>Goto</span>
        </div>
      </div>
    </Card>
  )
}
