import { LEVEL_CONFIG, TENTHS_PER_SECOND, TILE } from "@/constants/game";

export const getLevels = () => Object.keys(LEVEL_CONFIG).map(Number);

export const getBoardSize = (level) => LEVEL_CONFIG[level].boardSize;

export const getTileCount = (level) => getBoardSize(level) ** 2;

export const getInitialTime = (level) => LEVEL_CONFIG[level].limitTime * TENTHS_PER_SECOND;

export const createEmptyTiles = (level) =>
  Array.from({ length: getTileCount(level) }, () => TILE.EMPTY);

export const clearTile = (tiles, targetIndex) =>
  tiles.map((tile, index) => (index === targetIndex ? TILE.EMPTY : tile));

export const hitTile = (tiles, targetIndex) =>
  tiles.map((tile, index) => (index === targetIndex && tile === TILE.MOLE ? TILE.HIT : tile));

export const getRemainingTenths = (deadline) =>
  Math.max(Math.ceil((deadline - Date.now()) / 100), 0);

export const getRandomTileType = (bombRate) => (Math.random() < bombRate ? TILE.BOMB : TILE.MOLE);

export const spawnTile = (tiles, bombRate) => {
  const emptyIndexes = tiles
    .map((tile, index) => (tile === TILE.EMPTY ? index : null))
    .filter((index) => index !== null);

  if (emptyIndexes.length === 0) {
    return { spawnedIndex: null, tiles };
  }

  const nextIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  const nextTiles = [...tiles];

  nextTiles[nextIndex] = getRandomTileType(bombRate);

  return { spawnedIndex: nextIndex, tiles: nextTiles };
};

export const isClearedGame = ({ failCount, successCount }) => successCount > failCount;
