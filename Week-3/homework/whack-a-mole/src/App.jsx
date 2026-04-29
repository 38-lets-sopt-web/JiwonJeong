import Header from './components/domain/Header';
import StatusBoard from './components/domain/StatusBoard';
import 'normalize.css';
import GlobalStyle from './styles/GlobalStyle';

function App() {
  return (
    <>
      <GlobalStyle />
      <Header />
      <StatusBoard />
    </>
  );
}

export default App;
