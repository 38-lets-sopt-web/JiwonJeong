import {
  GameControlBar,
  MoleHoleWrapper,
  MoleHole,
  MoleHoleHStack,
  StyledGameBoard,
  StartButton,
  StopButton,
  ButtonHStack,
} from "./GameBoard.styles";
import Dropdown from "@/components/common/Dropdown";

function GameBoard() {
  return (
    <StyledGameBoard>
      <GameControlBar>
        <Dropdown />
        <ButtonHStack>
          <StartButton>시작</StartButton>
          <StopButton>중단</StopButton>
        </ButtonHStack>
      </GameControlBar>
      <MoleHoleWrapper>
        <MoleHoleHStack>
          <MoleHole />
          <MoleHole />
          <MoleHole />
        </MoleHoleHStack>
        <MoleHoleHStack>
          <MoleHole />
          <MoleHole />
          <MoleHole />
        </MoleHoleHStack>
        <MoleHoleHStack>
          <MoleHole />
          <MoleHole />
          <MoleHole />
        </MoleHoleHStack>
      </MoleHoleWrapper>
    </StyledGameBoard>
  );
}

export default GameBoard;
