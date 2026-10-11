import type { Goal } from '../types'

// Yearly goals ship with the site, like the library (see books.ts).
// Changes made on the page last until the page is reloaded.
const goals = new Map<number, Goal>([[2026, { year: 2026, target_count: 100 }]])

export async function getGoal(year: number): Promise<Goal | null> {
  return goals.get(year) ?? null
}

export async function upsertGoal(goal: Goal): Promise<Goal> {
  goals.set(goal.year, goal)
  return goal
}
