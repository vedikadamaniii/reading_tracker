import styles from './StatBlock.module.css'

interface StatBlockProps {
  value: string | number
  label: string
}

export function StatBlock({ value, label }: StatBlockProps) {
  return (
    <div className={styles.block}>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
    </div>
  )
}
