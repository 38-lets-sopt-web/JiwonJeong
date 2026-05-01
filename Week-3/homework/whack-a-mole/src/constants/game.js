export const LEVEL_CONFIG = {
  1: { boardSize: 2, limitTime: 15 },
  2: { boardSize: 3, limitTime: 20 },
  3: { boardSize: 4, limitTime: 30 },
};

export const TILE = {
  BOMB: "bomb",
  EMPTY: "empty",
  HIT: "hit",
  MOLE: "mole",
};

export const GAME_MESSAGE = {
  FAIL: "실패! 폭탄을 클릭해서 1점 줄었습니다.",
  FINISH: "게임이 종료되었습니다.",
  INITIAL: "게임을 시작해 주세요!",
  PLAYING: "두더지와 폭탄을 클릭해 주세요!",
  SUCCESS: "성공! 점수가 1점 올랐습니다.",
};

export const TENTHS_PER_SECOND = 10;
export const TIMER_INTERVAL = 100;
export const HIT_VISIBLE_TIME = 700;
export const TILE_VISIBLE_TIME = 1400;
export const SPAWN_INTERVAL = 850;
export const BOMB_RATE = 0.25;
export const MODAL_VISIBLE_TIME = 2000;
