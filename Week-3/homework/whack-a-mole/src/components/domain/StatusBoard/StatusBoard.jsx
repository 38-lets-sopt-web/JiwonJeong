import {
  StyledStatusBoard,
  Board,
  Title,
  ValueText,
  Text,
  SuccessTitle,
  FailTitle,
  StatusHStack,
} from "./StatusBoard.styles";

const getStatusCards = ({ score, timeLeft }) => [
  { title: "남은 시간", value: (timeLeft / 10).toFixed(1) },
  { title: "총 점수", value: score },
];

function StatusBoard({ failCount, message, score, successCount, timeLeft }) {
  const statusCards = getStatusCards({ score, timeLeft });

  return (
    <StyledStatusBoard>
      {statusCards.map(({ title, value }) => (
        <Board key={title}>
          <Title>{title}</Title>
          <ValueText>{value}</ValueText>
        </Board>
      ))}
      <StatusHStack>
        <Board>
          <SuccessTitle>성공</SuccessTitle>
          <ValueText>{successCount}</ValueText>
        </Board>
        <Board>
          <FailTitle>실패</FailTitle>
          <ValueText>{failCount}</ValueText>
        </Board>
      </StatusHStack>
      <Board>
        <Title>안내 메세지</Title>
        <Text>{message}</Text>
      </Board>
    </StyledStatusBoard>
  );
}

export default StatusBoard;
