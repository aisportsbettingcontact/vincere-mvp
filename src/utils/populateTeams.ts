import { supabase } from "@/integrations/supabase/client";
import teamDataCsv from "@/data/teamdata.csv?raw";

interface TeamData {
  sport: string;
  league: string;
  conference: string;
  division: string;
  team_city: string;
  team_nickname: string;
  arena_name: string;
  arena_city: string;
  arena_state: string;
  primary_color: string;
  primary_hex_code: string;
  secondary_color: string;
  secondary_hex_code: string;
  tertiary_color: string;
  tertiary_hex_code: string;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

export async function populateTeamsData(): Promise<{ success: boolean; message: string }> {
  try {
    const lines = teamDataCsv.split('\n').filter(line => line.trim());
    const headers = parseCsvLine(lines[0]);
    
    const teams: TeamData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      if (values.length !== headers.length) continue;
      
      const team: any = {};
      headers.forEach((header, index) => {
        team[header] = values[index] || null;
      });
      teams.push(team as TeamData);
    }
    
    // Insert teams in batches
    const batchSize = 50;
    for (let i = 0; i < teams.length; i += batchSize) {
      const batch = teams.slice(i, i + batchSize);
      const { error } = await supabase
        .from('teams')
        .upsert(batch, { 
          onConflict: 'sport,team_city,team_nickname',
          ignoreDuplicates: false 
        });
      
      if (error) {
        console.error('Error inserting batch:', error);
        throw error;
      }
    }
    
    return { 
      success: true, 
      message: `Successfully populated ${teams.length} teams` 
    };
  } catch (error) {
    console.error('Error populating teams:', error);
    return { 
      success: false, 
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}
