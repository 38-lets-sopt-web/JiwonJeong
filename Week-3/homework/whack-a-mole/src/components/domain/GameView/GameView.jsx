import GameBoard from "@/components/domain/GameBoard";
import StatusBoard from "@/components/domain/StatusBoard";
import { MainHStack } from "./GameView.styles";

function GameView({ game }) {
  return (
    <MainHStack>
      <StatusBoard {...game.status} />
      <GameBoard board={game.board} controls={game.controls} />
    </MainHStack>
  );
}

export default GameView;
