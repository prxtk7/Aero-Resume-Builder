import { useEffect, useRef, type ReactNode } from 'react'
import { addEntry, removeEntry, updateEntry } from '../../resume'

// A reusable editor section for lists of entries (education, projects, ...).
// It handles the "Add" and "Remove" buttons and the empty state, while each
// section decides which fields to show through `renderFields`.

type RepeatableSectionProps<T extends { id: string }> = {
  title: string
  items: T[]
  onChange: (items: T[]) => void
  createItem: () => T
  // Heading shown above each entry, e.g. the institution name.
  getItemTitle: (item: T, index: number) => string
  addLabel: string
  emptyText: string
  renderFields: (item: T, update: (changes: Partial<T>) => void) => ReactNode
}

function RepeatableSection<T extends { id: string }>({
  title,
  items,
  onChange,
  createItem,
  getItemTitle,
  addLabel,
  emptyText,
  renderFields,
}: RepeatableSectionProps<T>) {
  const listRef = useRef<HTMLDivElement>(null)
  const addButtonRef = useRef<HTMLButtonElement>(null)
  // After adding an entry, move keyboard focus to its first field.
  const focusEntryId = useRef<string | null>(null)

  useEffect(() => {
    if (!focusEntryId.current) return
    const firstField = listRef.current?.querySelector<HTMLElement>(
      `[data-entry-id="${focusEntryId.current}"] input, [data-entry-id="${focusEntryId.current}"] textarea`,
    )
    firstField?.focus()
    focusEntryId.current = null
  })

  function addItem() {
    const item = createItem()
    focusEntryId.current = item.id
    onChange(addEntry(items, item))
  }

  function removeItem(id: string) {
    onChange(removeEntry(items, id))
    // The removed entry's button disappears, so keep focus nearby.
    addButtonRef.current?.focus()
  }

  function updateItem(id: string, changes: Partial<T>) {
    onChange(updateEntry(items, id, changes))
  }

  return (
    <section className="form-section">
      <h3 className="form-section-title">{title}</h3>

      <div className="entry-list" ref={listRef}>
        {items.length === 0 && <p className="empty-text">{emptyText}</p>}

        {items.map((item, index) => {
          const itemTitle = getItemTitle(item, index)
          return (
            <div key={item.id} className="entry-card" data-entry-id={item.id}>
              <div className="entry-card-header">
                <h4>{itemTitle}</h4>
                <button
                  type="button"
                  className="button-remove"
                  aria-label={`Remove ${itemTitle}`}
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
              <div className="field-grid">
                {renderFields(item, (changes) => updateItem(item.id, changes))}
              </div>
            </div>
          )
        })}
      </div>

      <button
        ref={addButtonRef}
        type="button"
        className="button-secondary"
        onClick={addItem}
      >
        + {addLabel}
      </button>
    </section>
  )
}

export default RepeatableSection
