import Modal from "@/components/common/Modal";
import { Message, ScoreText, Title } from "./GameResultModal.styles";

function GameResultModal({ isOpen, level, score, restartDelay = 2 }) {
  return (
    <Modal isOpen={isOpen}>
      <Title>Level {level} 게임 종료!</Title>
      <ScoreText>최종 점수: {score}점</ScoreText>
      <Message>{restartDelay}초 후 게임이 리셋됩니다...</Message>
    </Modal>
  );
}

export default GameResultModal;
