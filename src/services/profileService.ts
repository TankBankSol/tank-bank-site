import { supabase, type CommanderProfile } from '../lib/supabase'

export class ProfileService {
  /**
   * Check if a commander profile exists for the given wallet address
   */
  static async checkProfileExists(walletAddress: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('commander_profiles')
        .select('id')
        .eq('wallet_address', walletAddress)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned, which is expected for new users
        console.error('Error checking profile:', error)
        return false
      }

      return !!data
    } catch (error) {
      console.error('Error checking profile existence:', error)
      return false
    }
  }

  /**
   * Create a new commander profile
   */
  static async createProfile(walletAddress: string, commanderName: string): Promise<CommanderProfile | null> {
    try {
      const { data, error } = await supabase
        .from('commander_profiles')
        .insert({
          wallet_address: walletAddress,
          commander_name: commanderName,
          rank: 'Recruit',
          missions_completed: 0,
          total_score: 0
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        return null
      }

      return data as CommanderProfile
    } catch (error) {
      console.error('Error creating profile:', error)
      return null
    }
  }

  /**
   * Check if commander name is available
   */
  static async isNameAvailable(commanderName: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('commander_profiles')
        .select('id')
        .eq('commander_name', commanderName)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned, which means name is available
        console.error('Error checking name availability:', error)
        return false
      }

      return !data // If no data found, name is available
    } catch (error) {
      console.error('Error checking name availability:', error)
      return false
    }
  }

  /**
   * Get commander profile by wallet address
   */
  static async getProfile(walletAddress: string): Promise<CommanderProfile | null> {
    try {
      const { data, error } = await supabase
        .from('commander_profiles')
        .select('*')
        .eq('wallet_address', walletAddress)
        .single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 = no rows returned, which is expected when profile doesn't exist
        console.error('Error fetching profile:', error)
        return null
      }

      return data as CommanderProfile
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  /**
   * Update commander profile
   */
  static async updateProfile(
    walletAddress: string,
    updates: Partial<Omit<CommanderProfile, 'id' | 'wallet_address' | 'created_at' | 'updated_at'>>
  ): Promise<CommanderProfile | null> {
    try {
      const { data, error } = await supabase
        .from('commander_profiles')
        .update(updates)
        .eq('wallet_address', walletAddress)
        .select()
        .single()

      if (error) {
        console.error('Error updating profile:', error)
        return null
      }

      return data as CommanderProfile
    } catch (error) {
      console.error('Error updating profile:', error)
      return null
    }
  }

  /**
   * Delete commander profile
   */
  static async deleteProfile(walletAddress: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('commander_profiles')
        .delete()
        .eq('wallet_address', walletAddress)

      if (error) {
        console.error('Error deleting profile:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting profile:', error)
      return false
    }
  }

  /**
   * Get leaderboard (top commanders by score)
   */
  static async getLeaderboard(limit: number = 10): Promise<CommanderProfile[]> {
    try {
      const { data, error } = await supabase
        .from('commander_profiles')
        .select('*')
        .order('total_score', { ascending: false })
        .order('missions_completed', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching leaderboard:', error)
        return []
      }

      return data as CommanderProfile[]
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
      return []
    }
  }
}