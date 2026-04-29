import {
  StyledStatusBoard,
  Board,
  HStack,
  Title,
  ValueText,
  Text,
  SuccessTitle,
  FailTitle,
} from "./StatusBoard.styles";

function StatusBoard() {
  return (
    <StyledStatusBoard>
      <Board>
        <Title>남은 시간</Title>
        <ValueText>0</ValueText>
      </Board>
      <Board>
        <Title>총 점수</Title>
        <ValueText>0</ValueText>
      </Board>
      <HStack>
        <Board>
          <SuccessTitle>성공</SuccessTitle>
          <ValueText>0</ValueText>
        </Board>
        <Board>
          <FailTitle>실패</FailTitle>
          <ValueText>0</ValueText>
        </Board>
      </HStack>
      <Board>
        <Title>안내 메세지</Title>
        <Text>게임을 시작해 주세요!</Text>
      </Board>
    </StyledStatusBoard>
  );
}

export default StatusBoard;
