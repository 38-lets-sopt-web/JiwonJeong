const RANKING_STORAGE_KEY = "ranking";

const getStorage = () => window.localStorage;

const normalizeRanking = (ranking) => ({
  level: Number(ranking.level),
  score: Number(ranking.score),
  successTime: ranking.successTime ?? ranking.recordedAt ?? new Date().toISOString(),
});

export const compareRankings = (previousRanking, nextRanking) => {
  if (nextRanking.level !== previousRanking.level) {
    return nextRanking.level - previousRanking.level;
  }

  if (nextRanking.score !== previousRanking.score) {
    return nextRanking.score - previousRanking.score;
  }

  return new Date(previousRanking.successTime) - new Date(nextRanking.successTime);
};

export const formatSuccessTime = (successTime) => {
  const date = new Date(successTime);

  if (Number.isNaN(date.getTime())) {
    return successTime;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
};

export const loadRankings = () => {
  const storage = getStorage();
  const savedRanking = storage.getItem(RANKING_STORAGE_KEY);

  if (!savedRanking) {
    return [];
  }

  try {
    const parsedRanking = JSON.parse(savedRanking);

    if (!Array.isArray(parsedRanking)) {
      return [];
    }

    return parsedRanking.map(normalizeRanking);
  } catch {
    return [];
  }
};

export const saveSuccessRanking = ({ level, score, successTime = new Date().toISOString() }) => {
  const rankings = loadRankings();
  const nextRankings = [...rankings, normalizeRanking({ level, score, successTime })];
  const storage = getStorage();

  storage.setItem(RANKING_STORAGE_KEY, JSON.stringify(nextRankings));
};

export const clearRankings = () => {
  const storage = getStorage();

  storage.removeItem(RANKING_STORAGE_KEY);
};
