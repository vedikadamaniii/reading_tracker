import styles from './TabNav.module.css'

export type TabKey = 'library' | 'tbr' | 'progress'

const TABS: { key: TabKey; numeral: string; label: string }[] = [
  { key: 'library', numeral: 'I', label: 'Library' },
  { key: 'tbr', numeral: 'II', label: 'To Be Read' },
  { key: 'progress', numeral: 'III', label: 'Progress' },
]

interface TabNavProps {
  active: TabKey
  onChange: (tab: TabKey) => void
}

export function TabNav({ active, onChange }: TabNavProps) {
  return (
    <nav className={styles.nav}>
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`${styles.tab} ${active === tab.key ? styles.active : ''}`}
          onClick={() => onChange(tab.key)}
          aria-current={active === tab.key ? 'page' : undefined}
        >
          <span className={styles.numeral}>{tab.numeral}</span>
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
