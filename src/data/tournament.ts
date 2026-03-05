export interface Team {
  name: string;
  logo: string;
  short: string;
}

export interface Game {
  home: number;
  away: number;
}

export interface GroupMatch {
  home: string;
  away: string;
  games: Game[];
  played: boolean;
}

export interface GroupStanding {
  team: string;
  logo: string;
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
  KREIN: { name: "Luan Krein", logo: "/teams/liverpool.png", short: "KREIN" },
  LUAN: { name: "Luan Pedroso", logo: "/teams/real.png", short: "LUAN" },
  CHRYS: { name: "Chrystian Silva", logo: "/teams/psg.png", short: "CHRYS" },
  ROS: { name: "Matheus Rossato", logo: "/teams/bayern.png", short: "ROS" },
  LUCAS: { name: "Lucas Ruviaro", logo: "/teams/chelsea.png", short: "LUCAS" },
  LEO: { name: "Léo Ruviaro", logo: "/teams/barcelona.png", short: "LEO" },
  BIN: { name: "Henrique Binotto", logo: "/teams/arsenal.png", short: "BIN" },
  POR: { name: "Jogador 8", logo: "/teams/city.png", short: "POR" },
};

export const groupA = {
  name: "Grupo A",
  teams: ["KREIN", "CHRYS", "LUCAS", "BIN"],
  matches: [
    {
  home: "KREIN",
  away: "BIN",
  games: [
    { home: 7, away: 5 },
    { home: 15, away: 5 },
    { home: 0, away: 0 }
  ],
  played: true
},
    {
  home: "CHRYS",
  away: "LUCAS",
  games: [
    { home: 2, away: 3 },
    { home: 1, away: 4 },
    { home: 0, away: 0 }
  ],
  played: true
},
     {
  home: "KREIN",
  away: "CHRYS",
  games: [
    { home: 3, away: 4 },
    { home: 4, away: 2 },
    { home: 11, away: 1 }
  ],
  played: true
},
        {
  home: "LUCAS",
  away: "BIN",
  games: [
    { home: 2, away: 3 },
    { home: 3, away: 4 },
    { home: 0, away: 0 }
  ],
  played: true
},
        {
  home: "KREIN",
  away: "LUCAS",
  games: [
    { home: 8, away: 10 },
    { home: 0, away: 0 },
    { home: 0, away: 0 }
  ],
  played: true
},
        {
  home: "BIN",
  away: "CHRYS",
  games: [],
  played: false
},
  ] as GroupMatch[],
};

export const groupB = {
  name: "Grupo B",
  teams: ["LUAN", "ROS", "LEO", "POR"],
  matches: [
        {
  home: "LUAN",
  away: "POR",
  games: [],
  played: false
},
        {
  home: "ROS",
  away: "LEO",
  games: [],
  played: false
},
        {
  home: "LUAN",
  away: "ROS",
  games: [],
  played: false
},
       {
  home: "LEO",
  away: "POR",
  games: [],
  played: false
},
        {
  home: "LUAN",
  away: "LEO",
  games: [],
  played: false
},
        {
  home: "POR",
  away: "ROS",
  games: [],
  played: false
},
  ] as GroupMatch[],
};

export const knockout: KnockoutMatch[] = [
  { id: "sf1", home: null, away: null, homeScore: null, awayScore: null, played: false, label: "Semi Final 1" },
  { id: "sf2", home: null, away: null, homeScore: null, awayScore: null, played: false, label: "Semi Final 2" },
  { id: "final", home: null, away: null, homeScore: null, awayScore: null, played: false, label: "Final" },
];

function getSeriesResult(match: GroupMatch) {
  let homeWins = 0;
  let awayWins = 0;

  for (const game of match.games) {
    if (game.home > game.away) homeWins++;
    if (game.away > game.home) awayWins++;
  }

  return { homeWins, awayWins };
}

export function calculateStandings(
  teamCodes: string[],
  matches: GroupMatch[]
): GroupStanding[] {
  const standings: Record<string, GroupStanding> = {};

  for (const code of teamCodes) {
    const team = teams[code];
    standings[code] = {
      team: code,
      logo: team.logo,
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
  if (!match.played || match.games.length === 0) continue;

  const home = standings[match.home];
  const away = standings[match.away];

  const { homeWins, awayWins } = getSeriesResult(match);

  home.played++;
  away.played++;

  home.goalsFor += homeWins;
  home.goalsAgainst += awayWins;
  away.goalsFor += awayWins;
  away.goalsAgainst += homeWins;

  if (homeWins > awayWins) {
    home.won++;
    home.points += 3;
    away.lost++;
  } else if (awayWins > homeWins) {
    away.won++;
    away.points += 3;
    home.lost++;
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
