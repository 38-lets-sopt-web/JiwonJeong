import { useState } from "react";
import "normalize.css";
import Header from "./components/domain/Header";
import GlobalStyle from "./styles/GlobalStyle";
import RankBoard from "./components/domain/RankBoard";
import GameResultModal from "./components/domain/GameResultModal";
import useMoleGame from "./hooks/useMoleGame";
import GameView from "./components/domain/GameView";

function App() {
  const [activeView, setActiveView] = useState("game");
  const game = useMoleGame();

  return (
    <>
      <GlobalStyle />
      <Header activeView={activeView} onChangeView={setActiveView} />
      {activeView === "game" ? <GameView game={game} /> : <RankBoard />}
      <GameResultModal
        isOpen={game.resultModal.isOpen}
        level={game.resultModal.level}
        score={game.resultModal.score}
      />
    </>
  );
}

export default App;
