import { pickQuote } from '../lib/quotes'
import styles from './Epigraph.module.css'

const quote = pickQuote()

export function Epigraph() {
  return (
    <figure className={styles.epigraph}>
      <blockquote className={styles.text}>{quote.text}</blockquote>
      <figcaption className={styles.attribution}>
        {quote.author}
        {quote.source && (
          <>
            , <cite>{quote.source}</cite>
          </>
        )}
      </figcaption>
    </figure>
  )
}
