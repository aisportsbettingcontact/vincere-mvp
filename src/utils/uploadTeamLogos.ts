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
  {
    filePath: "/logos/Leagues/NFL/NFC/NFC West/arizona-cardinals.png",
    sport: "NFL",
    league: "NFL",
    teamSlug: "arizona-cardinals",
    teamName: "Arizona Cardinals",
    division: "NFC West",
    conference: "NFC"
  },
  {
    filePath: "/logos/Leagues/NFL/NFC/NFC South/atlanta-falcons.png",
    sport: "NFL",
    league: "NFL",
    teamSlug: "atlanta-falcons",
    teamName: "Atlanta Falcons",
    division: "NFC South",
    conference: "NFC"
  },
  {
    filePath: "/logos/Leagues/NFL/NFC/NFC South/carolina-panthers.png",
    sport: "NFL",
    league: "NFL",
    teamSlug: "carolina-panthers",
    teamName: "Carolina Panthers",
    division: "NFC South",
    conference: "NFC"
  },
  {
    filePath: "/logos/Leagues/NFL/NFC/NFC North/chicago-bears.png",
    sport: "NFL",
    league: "NFL",
    teamSlug: "chicago-bears",
    teamName: "Chicago Bears",
    division: "NFC North",
    conference: "NFC"
  },
  {
    filePath: "/logos/Leagues/NFL/NFC/NFC East/dallas-cowboys.png",
    sport: "NFL",
    league: "NFL",
    teamSlug: "dallas-cowboys",
    teamName: "Dallas Cowboys",
    division: "NFC East",
    conference: "NFC"
  },
  {
    filePath: "/logos/Leagues/NFL/NFC/NFC North/detroit-lions.png",
    sport: "NFL",
    league: "NFL",
    teamSlug: "detroit-lions",
    teamName: "Detroit Lions",
    division: "NFC North",
    conference: "NFC"
  },
  {
    filePath: "/logos/Leagues/NFL/NFC/NFC North/green-bay-packers.png",
    sport: "NFL",
    league: "NFL",
    teamSlug: "green-bay-packers",
    teamName: "Green Bay Packers",
    division: "NFC North",
    conference: "NFC"
  },
  {
    filePath: "/logos/Leagues/NFL/NFC/NFC West/los-angeles-rams.png",
    sport: "NFL",
    league: "NFL",
    teamSlug: "los-angeles-rams",
    teamName: "Los Angeles Rams",
    division: "NFC West",
    conference: "NFC"
  },
  {
    filePath: "/logos/Leagues/NFL/NFC/NFC North/minnesota-vikings.png",
    sport: "NFL",
    league: "NFL",
    teamSlug: "minnesota-vikings",
    teamName: "Minnesota Vikings",
    division: "NFC North",
    conference: "NFC"
  },
  {
    filePath: "/logos/Leagues/NFL/NFC/NFC South/new-orleans-saints.png",
    sport: "NFL",
    league: "NFL",
    teamSlug: "new-orleans-saints",
    teamName: "New Orleans Saints",
    division: "NFC South",
    conference: "NFC"
  }
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
