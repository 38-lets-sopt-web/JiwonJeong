import styled from "@emotion/styled";
import { colors, fontWeights, radius, shadows } from "@/styles/tokens";

export const StyledStatusBoard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-around;

  width: 20%;
  min-width: 10rem;
  height: calc(100% - 2rem - 4rem - 2rem);
  margin-top: calc(2rem + 4rem + 2rem);
  margin-left: 2rem;
`;

export const Board = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: center;
  justify-content: center;

  min-height: 8rem;
  padding: 1rem;
  border-radius: ${radius.round};

  font-family: dunggeunmo, sans-serif;

  background-color: ${colors.white};
  box-shadow: ${shadows.default};
`;

export const HStack = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;

  & > * {
    flex: 1;
    min-width: 0;
  }
`;

export const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: ${fontWeights.bold};
`;

export const SuccessTitle = styled(Title)`
  color: ${colors.accent_positive};
`;

export const FailTitle = styled(Title)`
  color: ${colors.accent_negative};
`;

export const ValueText = styled.p`
  font-size: 3rem;
  font-weight: ${fontWeights.black};
`;

export const Text = styled.p`
  margin-top: 0.5rem;
`;
