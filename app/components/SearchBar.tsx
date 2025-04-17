'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (term: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [term, setTerm] = useState('')

  const handleSearch = () => {
    onSearch(term.trim().toLowerCase())
  }

  const handleClear = () => {
    setTerm('')
    onSearch('') // também limpa o filtro de busca
  }

  return (
    <div className="w-full flex gap-2 items-center">
      <input
        type="text"
        placeholder="Buscar post por título ou autor..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="w-full px-4 py-2 rounded bg-surface text-text border border-border focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-textMuted text-sm"
      />

      {term && (
        <button
          onClick={handleClear}
          className="text-sm text-muted-foreground px-3 py-2 rounded hover:text-primary transition"
          type="button"
          title="Limpar"
        >
          ✕
        </button>
      )}

      <button
        onClick={handleSearch}
        className="bg-primary hover:bg-primary/80 text-white px-5 py-2 rounded shadow transition-all duration-200 focus:ring-2 focus:ring-primary"
        type="button"
      >
        Pesquisar
      </button>
    </div>
  )
}
