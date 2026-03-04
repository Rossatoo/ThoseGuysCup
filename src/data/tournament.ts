export interface Team {
  name: string;
  flag: string;
  short: string;
}

export interface GroupMatch {
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  played: boolean;
}

export interface GroupStanding {
  team: string;
  flag: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface KnockoutMatch {
  id: string;
  home: string | null;
  away: string | null;
  homeScore: number | null;
  awayScore: number | null;
  homePenalties?: number | null;
  awayPenalties?: number | null;
  played: boolean;
  label: string;
}

export const teams: Record<string, Team> = {
  BRA: { name: "Luan Krein", flag: "🇧🇷", short: "BRA" },
  ARG: { name: "Luan Pedroso", flag: "🇦🇷", short: "ARG" },
  FRA: { name: "Chrystian Silva", flag: "🇫🇷", short: "FRA" },
  ALE: { name: "Matheus Rossato", flag: "🇩🇪", short: "ALE" },
  ING: { name: "Lucas Ruviaro", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", short: "ING" },
  ESP: { name: "Léo Ruviaro", flag: "🇪🇸", short: "ESP" },
  ITA: { name: "Henrique Binotto", flag: "🇮🇹", short: "ITA" },
  POR: { name: "Jogador 8", flag: "🇵🇹", short: "POR" },
};

export const groupA = {
  name: "Grupo A",
  teams: ["BRA", "FRA", "ING", "ITA"],
  matches: [
    { home: "BRA", away: "ITA", homeScore: null, awayScore: null, played: false },
    { home: "FRA", away: "ING", homeScore: null, awayScore: null, played: false },
    { home: "BRA", away: "FRA", homeScore: null, awayScore: null, played: false },
    { home: "ING", away: "ITA", homeScore: null, awayScore: null, played: false },
    { home: "BRA", away: "ING", homeScore: null, awayScore: null, played: false },
    { home: "ITA", away: "FRA", homeScore: null, awayScore: null, played: false },
  ] as GroupMatch[],
};

export const groupB = {
  name: "Grupo B",
  teams: ["ARG", "ALE", "ESP", "POR"],
  matches: [
    { home: "ARG", away: "POR", homeScore: null, awayScore: null, played: false },
    { home: "ALE", away: "ESP", homeScore: null, awayScore: null, played: false },
    { home: "ARG", away: "ALE", homeScore: null, awayScore: null, played: false },
    { home: "ESP", away: "POR", homeScore: null, awayScore: null, played: false },
    { home: "ARG", away: "ESP", homeScore: null, awayScore: null, played: false },
    { home: "POR", away: "ALE", homeScore: null, awayScore: null, played: false },
  ] as GroupMatch[],
};

export const knockout: KnockoutMatch[] = [
  { id: "sf1", home: null, away: null, homeScore: null, awayScore: null, played: false, label: "Semi Final 1" },
  { id: "sf2", home: null, away: null, homeScore: null, awayScore: null, played: false, label: "Semi Final 2" },
  { id: "final", home: null, away: null, homeScore: null, awayScore: null, played: false, label: "Final" },
];

export function calculateStandings(
  teamCodes: string[],
  matches: GroupMatch[]
): GroupStanding[] {
  const standings: Record<string, GroupStanding> = {};

  for (const code of teamCodes) {
    const team = teams[code];
    standings[code] = {
      team: code,
      flag: team.flag,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    };
  }

  for (const match of matches) {
    if (!match.played || match.homeScore === null || match.awayScore === null) continue;

    const home = standings[match.home];
    const away = standings[match.away];

    home.played++;
    away.played++;
    home.goalsFor += match.homeScore;
    home.goalsAgainst += match.awayScore;
    away.goalsFor += match.awayScore;
    away.goalsAgainst += match.homeScore;

    if (match.homeScore > match.awayScore) {
      home.won++;
      home.points += 3;
      away.lost++;
    } else if (match.homeScore < match.awayScore) {
      away.won++;
      away.points += 3;
      home.lost++;
    } else {
      home.drawn++;
      away.drawn++;
      home.points += 1;
      away.points += 1;
    }
  }

  return Object.values(standings).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    const gdA = a.goalsFor - a.goalsAgainst;
    const gdB = b.goalsFor - b.goalsAgainst;
    if (gdB !== gdA) return gdB - gdA;
    return b.goalsFor - a.goalsFor;
  });
}
