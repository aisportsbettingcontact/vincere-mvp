import { motion } from "motion/react";
import type { Matchup } from "../data/sportsData";
import { getTeamLogo } from "../data/sportsData";

interface MatchupCardProps {
  matchup: Matchup;
  sport: string;
}

export function MatchupCard({ matchup, sport }: MatchupCardProps) {
  const awayLogo = getTeamLogo(sport, matchup.away.espnAbbr);
  const homeLogo = getTeamLogo(sport, matchup.home.espnAbbr);

  return (
    <div className="h-[185px] relative shrink-0 w-full" data-name="MatchupBlock">
      <div aria-hidden="true" className="absolute border-[0px_0px_0.75px] border-neutral-900 border-solid inset-0 pointer-events-none" />
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[3.996px] h-[185px] items-start pb-[0.75px] pl-[15.996px] pr-[16.008px] pt-[15.996px] relative w-full">
          <div className="h-[18.75px] relative shrink-0 w-full" data-name="Container">
            <p className="absolute font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[18.75px] left-0 not-italic text-[#d0d0d0] text-[12.5px] text-nowrap top-[-0.5px] tracking-[-0.0366px] whitespace-pre">{matchup.dateTime}</p>
          </div>
          
          <div className="h-[19.488px] relative shrink-0 w-full" data-name="ColumnHeader">
            <div className="absolute h-0 left-0 top-[9.74px] w-[135.996px]" data-name="Container" />
            <div className="absolute h-[19.488px] left-[143.99px] top-0 w-[63.996px]" data-name="Container">
              <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[19.5px] left-[32.2px] not-italic text-white/40 text-[9px] text-center text-nowrap top-[0.5px] tracking-wide translate-x-[-50%] whitespace-pre">MONEYLINE</p>
            </div>
            <div className="absolute h-[19.488px] left-[215.98px] top-0 w-[72px]" data-name="Container">
              <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[19.5px] left-[36.23px] not-italic text-white/40 text-[9px] text-center text-nowrap top-[0.5px] tracking-wide translate-x-[-50%] whitespace-pre">SPREAD</p>
            </div>
            <div className="absolute h-[19.488px] left-[295.97px] top-0 w-[73.992px]" data-name="Container">
              <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[19.5px] left-[36.57px] not-italic text-white/40 text-[9px] text-center text-nowrap top-[0.5px] tracking-wide translate-x-[-50%] whitespace-pre">TOTAL</p>
            </div>
          </div>

          <div className="h-[167.977px] relative shrink-0 w-full" data-name="MatchupGrid">
            {/* Teams */}
            <div className="absolute content-stretch flex flex-col h-[103.992px] items-start justify-center left-0 top-0 w-[135.996px]" data-name="TeamRail">
              {/* Away Team */}
              <div className="h-[19.992px] relative shrink-0 w-[135.996px]" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7.992px] h-[19.992px] items-center relative w-[135.996px]">
                  <div className="relative shrink-0 size-[19.992px]" data-name="Image">
                    <img 
                      alt={matchup.away.name} 
                      className="size-full object-contain" 
                      src={awayLogo}
                    />
                  </div>
                  <div className="relative shrink-0" data-name="Container">
                    {(sport === "CFB" || sport === "CBB") ? (
                      <div className="flex flex-col">
                        <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[14px] not-italic text-[14px] text-nowrap text-white tracking-[-0.1912px] whitespace-pre">
                          {matchup.away.fullName?.split(' ')[0] || matchup.away.name}
                        </p>
                        <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[10px] not-italic text-[10px] text-nowrap text-white/70 whitespace-pre">
                          {matchup.away.fullName?.split(' ').slice(1).join(' ') || ''}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[18px] items-start relative">
                        <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[18px] not-italic relative shrink-0 text-[14.5px] text-nowrap text-white tracking-[-0.1912px] whitespace-pre">{matchup.away.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* @ Symbol */}
              <div className="h-[21.984px] relative shrink-0 w-[135.996px]" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[21.984px] relative w-[135.996px]">
                  <p className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[18px] left-[28px] not-italic text-[#9aa0a6] text-[12px] text-nowrap top-[3.24px] whitespace-pre">@</p>
                </div>
              </div>

              {/* Home Team */}
              <div className="h-[19.992px] relative shrink-0 w-[135.996px]" data-name="Container">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex gap-[7.992px] h-[19.992px] items-center relative w-[135.996px]">
                  <div className="relative shrink-0 size-[19.992px]" data-name="Image">
                    <img 
                      alt={matchup.home.name} 
                      className="size-full object-contain" 
                      src={homeLogo}
                    />
                  </div>
                  <div className="relative shrink-0" data-name="Container">
                    {(sport === "CFB" || sport === "CBB") ? (
                      <div className="flex flex-col">
                        <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[14px] not-italic text-[14px] text-nowrap text-white tracking-[-0.1912px] whitespace-pre">
                          {matchup.home.fullName?.split(' ')[0] || matchup.home.name}
                        </p>
                        <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[10px] not-italic text-[10px] text-nowrap text-white/70 whitespace-pre">
                          {matchup.home.fullName?.split(' ').slice(1).join(' ') || ''}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[18px] items-start relative">
                        <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[18px] not-italic relative shrink-0 text-[14.5px] text-nowrap text-white tracking-[-0.1912px] whitespace-pre">{matchup.home.name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Betting Chips - Away Team */}
            <BetChip top={4} left={143.99} width={63.996} primary={matchup.away.odds.ml} />
            <BetChip top={4} left={215.98} width={72} primary={matchup.away.odds.spread} secondary={matchup.away.odds.spreadOdds} />
            <BetChip top={4} left={295.97} width={73.992} primary={matchup.away.odds.total} secondary={matchup.away.odds.totalOdds} />

            {/* Betting Chips - Home Team */}
            <BetChip top={55.99} left={143.99} width={63.996} primary={matchup.home.odds.ml} />
            <BetChip top={55.99} left={215.98} width={72} primary={matchup.home.odds.spread} secondary={matchup.home.odds.spreadOdds} />
            <BetChip top={55.99} left={295.97} width={73.992} primary={matchup.home.odds.total} secondary={matchup.home.odds.totalOdds} />
          </div>
        </div>
      </div>
    </div>
  );
}

function BetChip({ 
  top, 
  left, 
  width, 
  primary, 
  secondary 
}: { 
  top: number; 
  left: number; 
  width: number; 
  primary: string; 
  secondary?: string;
}) {
  return (
    <div 
      className="absolute bg-[#1a1a1a] h-[43.992px] rounded-[12px] hover:bg-[#242424] transition-colors cursor-pointer flex flex-col items-center justify-center"
      data-name="BetChip"
      style={{ top: `${top}px`, left: `${left}px`, width: `${width}px` }}
    >
      <div aria-hidden="true" className="absolute border-[#242424] border-[0.75px] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <p className="font-['Inter:Semi_Bold',_sans-serif] font-semibold leading-[16px] text-[14.5px] text-nowrap text-white tracking-[-0.1912px] whitespace-pre">{primary}</p>
      {secondary && (
        <p className="font-['Inter:Medium',_sans-serif] font-medium leading-[14px] text-[#9aa0a6] text-[12.5px] text-nowrap tracking-[-0.0366px] whitespace-pre">{secondary}</p>
      )}
    </div>
  );
}
