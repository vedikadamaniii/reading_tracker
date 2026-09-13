export interface Quote {
  text: string
  author: string
  source?: string
}

// Attributions kept to lines traceable to a specific work; popular misattributions left out.
export const QUOTES: Quote[] = [
  { text: 'Beauty is terror. Whatever we call beautiful, we quiver before it.', author: 'Donna Tartt', source: 'The Secret History' },
  { text: 'A reader lives a thousand lives before he dies. The man who never reads lives only one.', author: 'George R. R. Martin', source: 'A Dance with Dragons' },
  { text: 'I have always imagined that Paradise will be a kind of library.', author: 'Jorge Luis Borges' },
  { text: 'Until I feared I would lose it, I never loved to read. One does not love breathing.', author: 'Harper Lee', source: 'To Kill a Mockingbird' },
  { text: 'The unexamined life is not worth living.', author: 'Socrates', source: 'Plato, Apology' },
  { text: 'Books are a uniquely portable magic.', author: 'Stephen King', source: 'On Writing' },
  { text: 'Whatever our souls are made of, his and mine are the same.', author: 'Emily Brontë', source: 'Wuthering Heights' },
  { text: 'I am no bird; and no net ensnares me: I am a free human being with an independent will.', author: 'Charlotte Brontë', source: 'Jane Eyre' },
  { text: 'I declare after all there is no enjoyment like reading!', author: 'Jane Austen', source: 'Pride and Prejudice' },
  { text: 'Man is condemned to be free.', author: 'Jean-Paul Sartre', source: 'Existentialism Is a Humanism' },
  { text: 'In the midst of winter, I found there was, within me, an invincible summer.', author: 'Albert Camus', source: 'Return to Tipasa' },
  { text: 'Not all those who wander are lost.', author: 'J. R. R. Tolkien', source: 'The Fellowship of the Ring' },
  { text: 'All we have to decide is what to do with the time that is given us.', author: 'J. R. R. Tolkien', source: 'The Fellowship of the Ring' },
  { text: 'I took a deep breath and listened to the old brag of my heart. I am, I am, I am.', author: 'Sylvia Plath', source: 'The Bell Jar' },
  { text: 'Hell is empty, and all the devils are here.', author: 'William Shakespeare', source: 'The Tempest' },
  { text: 'We are such stuff as dreams are made on, and our little life is rounded with a sleep.', author: 'William Shakespeare', source: 'The Tempest' },
  { text: 'The mind is its own place, and in itself can make a Heaven of Hell, a Hell of Heaven.', author: 'John Milton', source: 'Paradise Lost' },
  { text: 'Deep into that darkness peering, long I stood there wondering, fearing.', author: 'Edgar Allan Poe', source: 'The Raven' },
  { text: 'Words are, of course, the most powerful drug used by mankind.', author: 'Rudyard Kipling' },
  { text: 'The books that the world calls immoral are books that show the world its own shame.', author: 'Oscar Wilde', source: 'The Picture of Dorian Gray' },
  { text: 'Tell me, what is it you plan to do with your one wild and precious life?', author: 'Mary Oliver', source: 'The Summer Day' },
  { text: 'I cannot live without books.', author: 'Thomas Jefferson', source: 'Letter to John Adams, 1815' },
  { text: 'So we beat on, boats against the current, borne back ceaselessly into the past.', author: 'F. Scott Fitzgerald', source: 'The Great Gatsby' },
  { text: 'The world breaks everyone and afterward many are strong at the broken places.', author: 'Ernest Hemingway', source: 'A Farewell to Arms' },
  { text: 'Waste no more time arguing about what a good man should be. Be one.', author: 'Marcus Aurelius', source: 'Meditations' },
  { text: 'We suffer more often in imagination than in reality.', author: 'Seneca', source: 'Letters to Lucilius' },
  { text: 'Man is the only creature who refuses to be what he is.', author: 'Albert Camus', source: 'The Rebel' },
  { text: 'Hope is the thing with feathers that perches in the soul.', author: 'Emily Dickinson' },
  { text: 'I have spread my dreams under your feet; tread softly because you tread on my dreams.', author: 'W. B. Yeats', source: 'He Wishes for the Cloths of Heaven' },
  { text: 'Pain and suffering are always inevitable for a large intelligence and a deep heart.', author: 'Fyodor Dostoevsky', source: 'Crime and Punishment' },
  { text: 'All happy families are alike; each unhappy family is unhappy in its own way.', author: 'Leo Tolstoy', source: 'Anna Karenina' },
  { text: "If you only read the books that everyone else is reading, you can only think what everyone else is thinking.", author: 'Haruki Murakami', source: 'Norwegian Wood' },
  { text: "The past is never dead. It's not even past.", author: 'William Faulkner', source: 'Requiem for a Nun' },
  { text: 'It was the best of times, it was the worst of times.', author: 'Charles Dickens', source: 'A Tale of Two Cities' },
  { text: 'I am large, I contain multitudes.', author: 'Walt Whitman', source: 'Song of Myself' },
  { text: 'A book must be the axe for the frozen sea within us.', author: 'Franz Kafka', source: 'Letter to Oskar Pollak, 1904' },
  { text: 'And if you gaze long into an abyss, the abyss also gazes into you.', author: 'Friedrich Nietzsche', source: 'Beyond Good and Evil' },
  { text: 'Life can only be understood backwards; but it must be lived forwards.', author: 'Søren Kierkegaard', source: 'Journals' },
  { text: 'The limits of my language mean the limits of my world.', author: 'Ludwig Wittgenstein', source: 'Tractatus Logico-Philosophicus' },
  { text: 'Lock up your libraries if you like; but there is no gate, no lock, no bolt that you can set upon the freedom of my mind.', author: 'Virginia Woolf', source: 'A Room of One’s Own' },
  { text: 'One cannot think well, love well, sleep well, if one has not dined well.', author: 'Virginia Woolf', source: 'A Room of One’s Own' },
  { text: 'We accept the love we think we deserve.', author: 'Stephen Chbosky', source: 'The Perks of Being a Wallflower' },
]

const LAST_QUOTE_KEY = 'reading-tracker:last-quote'

/** A random quote, avoiding the one shown on the previous visit when possible. */
export function pickQuote(): Quote {
  let lastIndex = -1
  try {
    lastIndex = Number(localStorage.getItem(LAST_QUOTE_KEY) ?? -1)
  } catch {
    // storage unavailable (private mode etc.) — a repeat is harmless
  }

  let index = Math.floor(Math.random() * QUOTES.length)
  if (index === lastIndex) index = (index + 1) % QUOTES.length

  try {
    localStorage.setItem(LAST_QUOTE_KEY, String(index))
  } catch {
    // ignore
  }
  return QUOTES[index]
}
