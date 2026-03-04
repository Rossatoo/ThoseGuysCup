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
  KREIN: { name: "Luan Krein", flag: "🇧🇷", short: "KREIN" },
  LUAN: { name: "Luan Pedroso", flag: "🇦🇷", short: "LUAN" },
  CHRYS: { name: "Chrystian Silva", flag: "🇫🇷", short: "CHRYS" },
  ROS: { name: "Matheus Rossato", flag: "🇩🇪", short: "ROS" },
  LUCAS: { name: "Lucas Ruviaro", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", short: "LUCAS" },
  LEO: { name: "Léo Ruviaro", flag: "🇪🇸", short: "LEO" },
  BIN: { name: "Henrique Binotto", flag: "🇮🇹", short: "BIN" },
  POR: { name: "Jogador 8", flag: "🇵🇹", short: "POR" },
};

export const groupA = {
  name: "Grupo A",
  teams: ["KREIN", "CHRYS", "LUCAS", "BIN"],
  matches: [
    { home: "KREIN", away: "BIN", homeScore: null, awayScore: null, played: false },
    { home: "CHRYS", away: "LUCAS", homeScore: null, awayScore: null, played: false },
    { home: "KREIN", away: "CHRYS", homeScore: null, awayScore: null, played: false },
    { home: "LUCAS", away: "BIN", homeScore: null, awayScore: null, played: false },
    { home: "KREIN", away: "LUCAS", homeScore: null, awayScore: null, played: false },
    { home: "BIN", away: "CHRYS", homeScore: null, awayScore: null, played: false },
  ] as GroupMatch[],
};

export const groupB = {
  name: "Grupo B",
  teams: ["LUAN", "ROS", "LEO", "POR"],
  matches: [
    { home: "LUAN", away: "POR", homeScore: null, awayScore: null, played: false },
    { home: "ROS", away: "LEO", homeScore: null, awayScore: null, played: false },
    { home: "LUAN", away: "ROS", homeScore: null, awayScore: null, played: false },
    { home: "LEO", away: "POR", homeScore: null, awayScore: null, played: false },
    { home: "LUAN", away: "LEO", homeScore: null, awayScore: null, played: false },
    { home: "POR", away: "ROS", homeScore: null, awayScore: null, played: false },
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
