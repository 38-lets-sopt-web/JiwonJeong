import {
  Bomb,
  GameControlBar,
  HitMole,
  MoleHoleWrapper,
  MoleHole,
  MoleHoleGrid,
  Mole,
  StyledGameBoard,
  StartButton,
  StopButton,
  ButtonHStack,
} from "./GameBoard.styles";
import Dropdown from "@/components/common/Dropdown";
import { TILE } from "@/constants/game";

const renderTileContent = (tile) => {
  const tileContent = {
    [TILE.BOMB]: <Bomb>폭탄</Bomb>,
    [TILE.HIT]: <HitMole>성공</HitMole>,
    [TILE.MOLE]: <Mole>두더지</Mole>,
  };

  return tileContent[tile] ?? null;
};

function GameBoard({ board, controls }) {
  const { boardSize, level, levels, tiles } = board;
  const { changeLevel, clickHole, isPlaying, startGame, stopGame } = controls;

  return (
    <StyledGameBoard>
      <GameControlBar>
        <Dropdown
          disabled={isPlaying}
          level={level}
          levels={levels}
          onChangeLevel={changeLevel}
        />
        <ButtonHStack>
          <StartButton type="button" onClick={startGame}>
            시작
          </StartButton>
          <StopButton type="button" onClick={stopGame}>
            중단
          </StopButton>
        </ButtonHStack>
      </GameControlBar>
      <MoleHoleWrapper>
        <MoleHoleGrid $boardSize={boardSize}>
          {tiles.map((tile, index) => (
            <MoleHole type="button" key={index} onClick={() => clickHole(index)}>
              {renderTileContent(tile)}
            </MoleHole>
          ))}
        </MoleHoleGrid>
      </MoleHoleWrapper>
    </StyledGameBoard>
  );
}

export default GameBoard;
