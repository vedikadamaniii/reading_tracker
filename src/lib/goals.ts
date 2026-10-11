import type { Goal } from '../types'

// Like books, goals live in memory for now (see books.ts).
const goals = new Map<number, Goal>()

export async function getGoal(year: number): Promise<Goal | null> {
  return goals.get(year) ?? null
}

export async function upsertGoal(goal: Goal): Promise<Goal> {
  goals.set(goal.year, goal)
  return goal
}
