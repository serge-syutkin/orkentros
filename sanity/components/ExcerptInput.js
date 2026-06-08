import { useCallback } from 'react'
import { set, unset } from 'sanity'

export function ExcerptInput({ value = '', onChange, elementProps }) {
  const handleChange = useCallback(
    (event) => {
      const val = event.currentTarget.value
      onChange(val ? set(val) : unset())
    },
    [onChange]
  )

  const count = (value || '').length
  const overLimit = count > 160

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <textarea
        {...elementProps}
        value={value || ''}
        onChange={handleChange}
        rows={3}
        style={{
          width: '100%',
          resize: 'vertical',
          padding: '8px 12px',
          borderRadius: '3px',
          border: '1px solid var(--card-border-color)',
          background: 'var(--card-bg-color)',
          color: 'var(--card-fg-color)',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          lineHeight: '1.5',
          boxSizing: 'border-box',
        }}
      />
      <div style={{
        textAlign: 'right',
        fontSize: '11px',
        color: overLimit ? '#e05c5c' : 'rgba(148,163,184,0.7)',
      }}>
        {count} / 160
      </div>
    </div>
  )
}
