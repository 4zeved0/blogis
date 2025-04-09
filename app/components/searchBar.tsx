'use client'

import { useState, useEffect } from 'react'

interface SearchBarProps {
  onSearch: (term: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [term, setTerm] = useState('')

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(term.trim().toLowerCase())
    }, 300) // debounce 300ms

    return () => clearTimeout(delay)
  }, [term, onSearch])

  return (
    <div className="w-full max-w-md">
      <input
        type="text"
        placeholder="Buscar post por título ou autor..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="w-full px-4 py-2 rounded-lg bg-surface text-text border border-border focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-textMuted text-sm"
      />
    </div>
  )
}
