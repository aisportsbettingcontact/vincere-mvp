import { supabase } from "@/integrations/supabase/client";

interface LogoUpload {
  filePath: string;
  sport: string;
  league: string;
  teamSlug: string;
  teamName: string;
  division: string;
  conference: string;
}

const NFL_LOGOS: LogoUpload[] = [
  // AFC East
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC East/buffalo-bills.png", sport: "NFL", league: "NFL", teamSlug: "buffalo-bills", teamName: "Buffalo Bills", division: "AFC East", conference: "AFC" },
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC East/miami-dolphins.png", sport: "NFL", league: "NFL", teamSlug: "miami-dolphins", teamName: "Miami Dolphins", division: "AFC East", conference: "AFC" },
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC East/new-england-patriots.png", sport: "NFL", league: "NFL", teamSlug: "new-england-patriots", teamName: "New England Patriots", division: "AFC East", conference: "AFC" },
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC East/new-york-jets.png", sport: "NFL", league: "NFL", teamSlug: "new-york-jets", teamName: "New York Jets", division: "AFC East", conference: "AFC" },
  
  // AFC North
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC North/baltimore-ravens.png", sport: "NFL", league: "NFL", teamSlug: "baltimore-ravens", teamName: "Baltimore Ravens", division: "AFC North", conference: "AFC" },
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC North/cincinnati-bengals.png", sport: "NFL", league: "NFL", teamSlug: "cincinnati-bengals", teamName: "Cincinnati Bengals", division: "AFC North", conference: "AFC" },
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC North/cleveland-browns.png", sport: "NFL", league: "NFL", teamSlug: "cleveland-browns", teamName: "Cleveland Browns", division: "AFC North", conference: "AFC" },
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC North/pittsburgh-steelers.png", sport: "NFL", league: "NFL", teamSlug: "pittsburgh-steelers", teamName: "Pittsburgh Steelers", division: "AFC North", conference: "AFC" },
  
  // AFC South
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC South/houston-texans.png", sport: "NFL", league: "NFL", teamSlug: "houston-texans", teamName: "Houston Texans", division: "AFC South", conference: "AFC" },
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC South/indianapolis-colts.png", sport: "NFL", league: "NFL", teamSlug: "indianapolis-colts", teamName: "Indianapolis Colts", division: "AFC South", conference: "AFC" },
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC South/jacksonville-jaguars.png", sport: "NFL", league: "NFL", teamSlug: "jacksonville-jaguars", teamName: "Jacksonville Jaguars", division: "AFC South", conference: "AFC" },
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC South/tennessee-titans.png", sport: "NFL", league: "NFL", teamSlug: "tennessee-titans", teamName: "Tennessee Titans", division: "AFC South", conference: "AFC" },
  
  // AFC West
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC West/denver-broncos.png", sport: "NFL", league: "NFL", teamSlug: "denver-broncos", teamName: "Denver Broncos", division: "AFC West", conference: "AFC" },
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC West/kansas-city-chiefs.png", sport: "NFL", league: "NFL", teamSlug: "kansas-city-chiefs", teamName: "Kansas City Chiefs", division: "AFC West", conference: "AFC" },
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC West/las-vegas-raiders.png", sport: "NFL", league: "NFL", teamSlug: "las-vegas-raiders", teamName: "Las Vegas Raiders", division: "AFC West", conference: "AFC" },
  { filePath: "/logos/Logos/Leagues/NFL/AFC/AFC West/los-angeles-chargers.png", sport: "NFL", league: "NFL", teamSlug: "los-angeles-chargers", teamName: "Los Angeles Chargers", division: "AFC West", conference: "AFC" },
  
  // NFC East
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC East/dallas-cowboys.png", sport: "NFL", league: "NFL", teamSlug: "dallas-cowboys", teamName: "Dallas Cowboys", division: "NFC East", conference: "NFC" },
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC East/new-york-giants.png", sport: "NFL", league: "NFL", teamSlug: "new-york-giants", teamName: "New York Giants", division: "NFC East", conference: "NFC" },
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC East/philadelphia-eagles.png", sport: "NFL", league: "NFL", teamSlug: "philadelphia-eagles", teamName: "Philadelphia Eagles", division: "NFC East", conference: "NFC" },
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC East/washington-commanders.png", sport: "NFL", league: "NFL", teamSlug: "washington-commanders", teamName: "Washington Commanders", division: "NFC East", conference: "NFC" },
  
  // NFC North
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC North/chicago-bears.png", sport: "NFL", league: "NFL", teamSlug: "chicago-bears", teamName: "Chicago Bears", division: "NFC North", conference: "NFC" },
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC North/detroit-lions.png", sport: "NFL", league: "NFL", teamSlug: "detroit-lions", teamName: "Detroit Lions", division: "NFC North", conference: "NFC" },
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC North/green-bay-packers.png", sport: "NFL", league: "NFL", teamSlug: "green-bay-packers", teamName: "Green Bay Packers", division: "NFC North", conference: "NFC" },
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC North/minnesota-vikings.png", sport: "NFL", league: "NFL", teamSlug: "minnesota-vikings", teamName: "Minnesota Vikings", division: "NFC North", conference: "NFC" },
  
  // NFC South
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC South/atlanta-falcons.png", sport: "NFL", league: "NFL", teamSlug: "atlanta-falcons", teamName: "Atlanta Falcons", division: "NFC South", conference: "NFC" },
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC South/carolina-panthers.png", sport: "NFL", league: "NFL", teamSlug: "carolina-panthers", teamName: "Carolina Panthers", division: "NFC South", conference: "NFC" },
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC South/new-orleans-saints.png", sport: "NFL", league: "NFL", teamSlug: "new-orleans-saints", teamName: "New Orleans Saints", division: "NFC South", conference: "NFC" },
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC South/tampa-bay-buccaneers.png", sport: "NFL", league: "NFL", teamSlug: "tampa-bay-buccaneers", teamName: "Tampa Bay Buccaneers", division: "NFC South", conference: "NFC" },
  
  // NFC West
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC West/arizona-cardinals.png", sport: "NFL", league: "NFL", teamSlug: "arizona-cardinals", teamName: "Arizona Cardinals", division: "NFC West", conference: "NFC" },
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC West/los-angeles-rams.png", sport: "NFL", league: "NFL", teamSlug: "los-angeles-rams", teamName: "Los Angeles Rams", division: "NFC West", conference: "NFC" },
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC West/san-francisco-49ers.png", sport: "NFL", league: "NFL", teamSlug: "san-francisco-49ers", teamName: "San Francisco 49ers", division: "NFC West", conference: "NFC" },
  { filePath: "/logos/Logos/Leagues/NFL/NFC/NFC West/seattle-seahawks.png", sport: "NFL", league: "NFL", teamSlug: "seattle-seahawks", teamName: "Seattle Seahawks", division: "NFC West", conference: "NFC" }
];

export async function uploadTeamLogosToStorage(): Promise<{ success: boolean; message: string }> {
  try {
    const results = [];

    for (const logo of NFL_LOGOS) {
      // Fetch the file from public folder
      const response = await fetch(logo.filePath);
      const blob = await response.blob();
      
      // Create storage path
      const storagePath = `${logo.sport}/${logo.league}/${logo.teamSlug}.png`;
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('team-logos')
        .upload(storagePath, blob, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) {
        console.error(`Error uploading ${logo.teamSlug}:`, uploadError);
        results.push({ team: logo.teamSlug, success: false, error: uploadError.message });
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('team-logos')
        .getPublicUrl(storagePath);

      // Update database record
      const { error: dbError } = await supabase
        .from('team_logos' as any)
        .upsert({
          sport: logo.sport,
          league: logo.league,
          team_slug: logo.teamSlug,
          team_name: logo.teamName,
          division: logo.division,
          conference: logo.conference,
          logo_url: urlData.publicUrl,
          storage_path: storagePath
        }, {
          onConflict: 'sport,league,team_slug'
        });

      if (dbError) {
        console.error(`Error updating DB for ${logo.teamSlug}:`, dbError);
        results.push({ team: logo.teamSlug, success: false, error: dbError.message });
      } else {
        results.push({ team: logo.teamSlug, success: true });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return {
      success: failCount === 0,
      message: `Uploaded ${successCount}/${NFL_LOGOS.length} logos successfully${failCount > 0 ? `, ${failCount} failed` : ''}`
    };
  } catch (error) {
    console.error('Error uploading team logos:', error);
    return {
      success: false,
      message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
