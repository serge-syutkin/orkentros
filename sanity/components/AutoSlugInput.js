import { useCallback, useEffect, useRef } from 'react'
import { set, unset, useFormValue } from 'sanity'

function slugify(text) {
  if (!text) return ''
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function AutoSlugInput({ value, onChange, elementProps }) {
  const title = useFormValue(['title'])

  // Always-fresh ref so the effect reads current slug without stale closure
  const valueRef = useRef(value)
  valueRef.current = value

  // Tracks the last slug we auto-generated so we know if user manually edited
  const prevGeneratedRef = useRef(slugify(title || ''))

  useEffect(() => {
    if (!title) return
    const generated = slugify(title)
    const currentSlug = valueRef.current?.current || ''

    // Auto-update only if slug is empty or still matches our last auto-generated value
    if (!currentSlug || currentSlug === prevGeneratedRef.current) {
      if (generated) onChange(set({ _type: 'slug', current: generated }))
    }

    prevGeneratedRef.current = generated
  }, [title, onChange])

  const handleChange = useCallback(
    (event) => {
      const val = event.currentTarget.value
      // User manually edited — break auto-sync by updating prevGenerated to this value
      prevGeneratedRef.current = val
      onChange(val ? set({ _type: 'slug', current: val }) : unset())
    },
    [onChange]
  )

  return (
    <input
      {...elementProps}
      type="text"
      value={value?.current || ''}
      onChange={handleChange}
      placeholder="auto-generado desde el título"
      style={{
        width: '100%',
        padding: '8px 12px',
        borderRadius: '3px',
        border: '1px solid var(--card-border-color)',
        background: 'var(--card-bg-color)',
        color: 'var(--card-fg-color)',
        fontFamily: 'inherit',
        fontSize: 'inherit',
        boxSizing: 'border-box',
      }}
    />
  )
}
