import "normalize.css";
import Header from "./components/domain/Header";
import StatusBoard from "./components/domain/StatusBoard";
import GameBoard from "./components/domain/GameBoard";
import GlobalStyle from "./styles/GlobalStyle";
import { MainHStack } from "./App.styles";

function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <MainHStack>
        <StatusBoard />
        <GameBoard />
      </MainHStack>
    </>
  );
}

export default App;
