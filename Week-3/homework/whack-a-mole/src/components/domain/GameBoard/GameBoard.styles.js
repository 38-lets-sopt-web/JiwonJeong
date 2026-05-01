import styled from "@emotion/styled";
import { colors, fontWeights, radius, shadows } from "@/styles/tokens";
import { HStack } from "@/components/common/Hstack";
import { StyledButton } from "@/components/common/Button";

export const StyledGameBoard = styled.section`
  display: flex;
  flex-direction: column;

  width: 70%;
  height: 100%;
  padding: 2rem 1rem;
  border-radius: ${radius.round};

  box-shadow: ${shadows.default};
`;

export const GameControlBar = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const ButtonHStack = styled(HStack)`
  justify-content: flex-end;
  width: auto;
`;

export const MoleHoleWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: clamp(1rem, 2vw, 2rem);
  align-items: center;
  justify-content: center;

  width: min(80%, 42rem);
  margin: 0 auto;
`;

export const MoleHoleHStack = styled(HStack)`
  gap: clamp(1rem, 3vw, 2.5rem);
  justify-content: center;
`;

export const MoleHole = styled.div`
  aspect-ratio: 1;
  width: clamp(5rem, 12vw, 10rem);
  max-width: 10rem;
  border-radius: 50%;

  background-color: pink;
`;

export const StartButton = styled(StyledButton)`
  padding: 0.8rem 1.2rem;

  font-size: 1rem;
  font-weight: ${fontWeights.bold};
  color: ${colors.white};

  background-color: ${colors.accent_positive};

  &:hover {
    background-color: ${colors.accent_positive_hover};
  }
`;

export const StopButton = styled(StartButton)`
  background-color: ${colors.accent_negative};

  &:hover {
    background-color: ${colors.accent_negative_hover};
  }
`;
