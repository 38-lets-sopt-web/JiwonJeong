import styled from "@emotion/styled";
import { colors, fontWeights } from "@/styles/tokens";

export const Title = styled.h2`
  font-family: pretendard, sans-serif;
  font-size: 1.1rem;
  font-weight: ${fontWeights.bold};
  color: ${colors.black};
`;

export const ScoreText = styled.p`
  margin-top: 1rem;

  font-family: pretendard, sans-serif;
  font-size: 1.5rem;
  font-weight: ${fontWeights.black};
  color: ${colors.accent};
`;

export const Message = styled.p`
  margin-top: 1.4rem;

  font-family: pretendard, sans-serif;
  font-size: 0.9rem;
  font-weight: ${fontWeights.normal};
  color: ${colors.black};
`;
