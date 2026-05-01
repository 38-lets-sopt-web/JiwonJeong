import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BOMB_RATE,
  GAME_MESSAGE,
  HIT_VISIBLE_TIME,
  MODAL_VISIBLE_TIME,
  SPAWN_INTERVAL,
  TILE,
  TILE_VISIBLE_TIME,
  TIMER_INTERVAL,
} from "@/constants/game";
import {
  clearTile,
  createEmptyTiles,
  getBoardSize,
  getInitialTime,
  getLevels,
  getRemainingTenths,
  hitTile,
  isClearedGame,
  spawnTile,
} from "@/utils/game";
import { saveSuccessRanking } from "@/utils/rankingStorage";

function useMoleGame() {
  const [level, setLevel] = useState(1);
  const [timeLeft, setTimeLeft] = useState(getInitialTime(1));
  const [score, setScore] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [message, setMessage] = useState(GAME_MESSAGE.INITIAL);
  const [isPlaying, setIsPlaying] = useState(false);
  const [tiles, setTiles] = useState(() => createEmptyTiles(1));
  const [resultModal, setResultModal] = useState({ isOpen: false, level: 1, score: 0 });

  const scoreRef = useRef(score);
  const successCountRef = useRef(successCount);
  const failCountRef = useRef(failCount);
  const levelRef = useRef(level);
  const deadlineRef = useRef(null);
  const hasFinishedRef = useRef(false);
  const hitTimeoutsRef = useRef({});
  const tileTimeoutsRef = useRef({});
  const resetTimeoutRef = useRef(null);

  const boardSize = getBoardSize(level);
  const levels = useMemo(() => getLevels(), []);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    successCountRef.current = successCount;
  }, [successCount]);

  useEffect(() => {
    failCountRef.current = failCount;
  }, [failCount]);

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(
    () => () => {
      Object.values(hitTimeoutsRef.current).forEach(clearTimeout);
      Object.values(tileTimeoutsRef.current).forEach(clearTimeout);
      clearTimeout(resetTimeoutRef.current);
    },
    [],
  );

  const emptyTiles = useCallback(() => {
    setTiles(createEmptyTiles(levelRef.current));
  }, []);

  const clearTileAt = useCallback((index) => {
    setTiles((prevTiles) => clearTile(prevTiles, index));
  }, []);

  const clearHitTimeouts = () => {
    Object.values(hitTimeoutsRef.current).forEach(clearTimeout);
    hitTimeoutsRef.current = {};
  };

  const clearTileTimeouts = () => {
    Object.values(tileTimeoutsRef.current).forEach(clearTimeout);
    tileTimeoutsRef.current = {};
  };

  const resetGame = useCallback((nextLevel = levelRef.current) => {
    clearHitTimeouts();
    clearTileTimeouts();
    clearTimeout(resetTimeoutRef.current);

    hasFinishedRef.current = false;
    deadlineRef.current = null;
    setIsPlaying(false);
    setScore(0);
    setSuccessCount(0);
    setFailCount(0);
    setMessage(GAME_MESSAGE.INITIAL);
    setTimeLeft(getInitialTime(nextLevel));
    setTiles(createEmptyTiles(nextLevel));
    setResultModal({ isOpen: false, level: nextLevel, score: 0 });
  }, []);

  const finishGame = useCallback(() => {
    if (hasFinishedRef.current) {
      return;
    }

    hasFinishedRef.current = true;

    const finalScore = scoreRef.current;
    const finishedLevel = levelRef.current;
    const finalResult = {
      failCount: failCountRef.current,
      successCount: successCountRef.current,
    };

    deadlineRef.current = null;
    setIsPlaying(false);
    emptyTiles();
    setMessage(GAME_MESSAGE.FINISH);
    setResultModal({ isOpen: true, level: finishedLevel, score: finalScore });

    if (isClearedGame(finalResult)) {
      saveSuccessRanking({ level: finishedLevel, score: finalScore });
    }

    resetTimeoutRef.current = setTimeout(() => {
      setResultModal({ isOpen: false, level: finishedLevel, score: finalScore });
      resetGame(finishedLevel);
    }, MODAL_VISIBLE_TIME);
  }, [emptyTiles, resetGame]);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    const timerId = setInterval(() => {
      setTimeLeft(getRemainingTenths(deadlineRef.current));
    }, TIMER_INTERVAL);

    return () => clearInterval(timerId);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying && timeLeft === 0) {
      finishGame();
    }
  }, [finishGame, isPlaying, timeLeft]);

  useEffect(() => {
    if (!isPlaying) {
      return undefined;
    }

    const spawnId = setInterval(() => {
      setTiles((prevTiles) => {
        const result = spawnTile(prevTiles, BOMB_RATE);

        if (result.spawnedIndex === null) {
          return result.tiles;
        }

        clearTimeout(tileTimeoutsRef.current[result.spawnedIndex]);
        tileTimeoutsRef.current[result.spawnedIndex] = setTimeout(() => {
          clearTileAt(result.spawnedIndex);
          delete tileTimeoutsRef.current[result.spawnedIndex];
        }, TILE_VISIBLE_TIME);

        return result.tiles;
      });
    }, SPAWN_INTERVAL);

    return () => clearInterval(spawnId);
  }, [clearTileAt, isPlaying]);

  const changeLevel = (nextLevel) => {
    if (isPlaying) {
      return;
    }

    setLevel(nextLevel);
    resetGame(nextLevel);
  };

  const startGame = () => {
    resetGame(level);
    deadlineRef.current = Date.now() + getInitialTime(level) * TIMER_INTERVAL;
    setMessage(GAME_MESSAGE.PLAYING);
    setIsPlaying(true);
  };

  const stopGame = () => {
    resetGame(level);
  };

  const clickHole = (index) => {
    if (!isPlaying) {
      return;
    }

    const selectedTile = tiles[index];

    if (selectedTile === TILE.MOLE) {
      clearTimeout(tileTimeoutsRef.current[index]);
      delete tileTimeoutsRef.current[index];

      setScore((prevScore) => prevScore + 1);
      setSuccessCount((prevSuccessCount) => prevSuccessCount + 1);
      setMessage(GAME_MESSAGE.SUCCESS);
      setTiles((prevTiles) => hitTile(prevTiles, index));

      clearTimeout(hitTimeoutsRef.current[index]);
      hitTimeoutsRef.current[index] = setTimeout(() => {
        clearTileAt(index);
        delete hitTimeoutsRef.current[index];
      }, HIT_VISIBLE_TIME);
      return;
    }

    if (selectedTile === TILE.BOMB) {
      clearTimeout(tileTimeoutsRef.current[index]);
      delete tileTimeoutsRef.current[index];

      setScore((prevScore) => prevScore - 1);
      setFailCount((prevFailCount) => prevFailCount + 1);
      setMessage(GAME_MESSAGE.FAIL);
      clearTileAt(index);
    }
  };

  return {
    board: {
      boardSize,
      level,
      levels,
      tiles,
    },
    controls: {
      changeLevel,
      clickHole,
      isPlaying,
      startGame,
      stopGame,
    },
    resultModal,
    status: {
      failCount,
      message,
      score,
      successCount,
      timeLeft,
    },
  };
}

export default useMoleGame;
