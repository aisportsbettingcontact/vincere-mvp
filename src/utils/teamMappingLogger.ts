/**
 * Team Mapping Logger
 * 
 * Tracks and reports missing team mappings to help maintain complete coverage
 */

interface MissingTeamReport {
  slug: string;
  sport: string;
  count: number;
  lastSeen: string;
}

class TeamMappingLogger {
  private missingTeams: Map<string, MissingTeamReport> = new Map();
  private sessionStart: string = new Date().toISOString();
  
  /**
   * Log a missing team mapping
   */
  logMissing(slug: string, sport: string) {
    const key = `${sport}:${slug}`;
    
    if (this.missingTeams.has(key)) {
      const existing = this.missingTeams.get(key)!;
      existing.count++;
      existing.lastSeen = new Date().toISOString();
    } else {
      this.missingTeams.set(key, {
        slug,
        sport,
        count: 1,
        lastSeen: new Date().toISOString()
      });
    }
  }
  
  /**
   * Get all missing team reports
   */
  getMissingTeams(): MissingTeamReport[] {
    return Array.from(this.missingTeams.values())
      .sort((a, b) => b.count - a.count);
  }
  
  /**
   * Print a summary report to console
   */
  printReport() {
    const missing = this.getMissingTeams();
    
    if (missing.length === 0) {
      console.log('\n✅ [TEAM MAPPING REPORT] No missing team mappings detected!');
      return;
    }
    
    console.log('\n📊 [TEAM MAPPING REPORT] Missing Team Mappings Summary');
    console.log(`📊 Session started: ${this.sessionStart}`);
    console.log(`📊 Total unique missing teams: ${missing.length}\n`);
    
    const bySport: Record<string, MissingTeamReport[]> = {};
    missing.forEach(team => {
      if (!bySport[team.sport]) {
        bySport[team.sport] = [];
      }
      bySport[team.sport].push(team);
    });
    
    Object.entries(bySport).forEach(([sport, teams]) => {
      console.log(`\n🏈 ${sport} (${teams.length} missing):`);
      teams.slice(0, 10).forEach(team => {
        console.log(`   - "${team.slug}" (seen ${team.count}x)`);
      });
      if (teams.length > 10) {
        console.log(`   ... and ${teams.length - 10} more`);
      }
    });
    
    console.log('\n💡 [TEAM MAPPING REPORT] To add these teams:');
    console.log('   1. Open src/utils/teamMappings.ts');
    console.log('   2. Add entries to the appropriate sport mapping');
    console.log('   3. Add team colors to src/utils/teamColors.ts');
    console.log('   4. Optionally add logo paths to src/utils/teamLogos.ts\n');
  }
  
  /**
   * Clear the report
   */
  clear() {
    this.missingTeams.clear();
    this.sessionStart = new Date().toISOString();
  }
}

// Singleton instance
export const teamMappingLogger = new TeamMappingLogger();

// Auto-print report every 5 minutes in development
if (import.meta.env.DEV) {
  setInterval(() => {
    teamMappingLogger.printReport();
  }, 5 * 60 * 1000);
}
