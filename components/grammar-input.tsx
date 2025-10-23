"use client"

import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface GrammarInputProps {
  value: string
  onChange: (value: string) => void
}

export function GrammarInput({ value, onChange }: GrammarInputProps) {
  return (
    <Card className="p-6">
      <div className="space-y-3">
        <div>
          <label className="text-sm font-semibold">Gramática</label>
          <p className="text-xs text-muted-foreground">Ingresa las producciones usando el formato: A -&gt; B C | D</p>
        </div>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`S -> E
E -> E + T | T
T -> T * F | F
F -> ( E ) | id`}
          className="min-h-48 font-mono text-sm"
        />
      </div>
    </Card>
  )
}
