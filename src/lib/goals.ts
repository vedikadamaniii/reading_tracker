import { supabase } from './supabase'
import type { Goal } from '../types'

export async function getGoal(year: number): Promise<Goal | null> {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('year', year)
    .maybeSingle()

  if (error) throw error
  return data as Goal | null
}

export async function upsertGoal(goal: Goal): Promise<Goal> {
  const { data, error } = await supabase
    .from('goals')
    .upsert(goal)
    .select()
    .single()

  if (error) throw error
  return data as Goal
}
