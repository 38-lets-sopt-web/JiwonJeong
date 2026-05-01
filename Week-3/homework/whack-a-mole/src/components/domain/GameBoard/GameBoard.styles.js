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
  align-items: center;
  justify-content: center;

  width: min(80%, 44rem);
  margin: 0 auto;
`;

export const MoleHoleGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ $boardSize }) => $boardSize}, 1fr);
  gap: clamp(1rem, 2.4vw, 2rem);
  width: min(100%, ${({ $boardSize }) => ($boardSize === 4 ? "34rem" : "38rem")});
`;

export const MoleHole = styled.button`
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  aspect-ratio: 1;
  width: 100%;
  border: none;
  border-radius: 50%;

  font-family: dunggeunmo, sans-serif;

  background-color: #f7dba7;
  box-shadow: inset 0 -0.8rem 1.6rem rgb(0 0 0 / 12%);
`;

export const Mole = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 70%;
  height: 70%;
  border-radius: 50%;

  font-size: clamp(0.9rem, 1.7vw, 1.4rem);
  color: ${colors.white};

  background-color: #8b5e3c;
`;

export const HitMole = styled(Mole)`
  background-color: ${colors.accent_positive};
`;

export const Bomb = styled(Mole)`
  background-color: ${colors.black};
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
