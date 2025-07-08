import { Game } from "../types/fore.js";

export const calculateHandicapDifferential = (games: Game[]): number => {
  // get the last 20 games and calculate the average of the handicap differentials
  const last20Difs = games.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  }).slice(-20).map((game) => game.handicapDifferential);
  const top8 = last20Difs.sort((a, b) => a - b).slice(0, 8);
  const handicapDifferential = top8.reduce((sum, diff) => sum + diff, 0) / 8;
  return handicapDifferential;
};
