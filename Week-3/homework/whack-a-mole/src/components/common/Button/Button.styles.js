import styled from '@emotion/styled';
import { colors, fontWeights, radius } from '@/styles/tokens';

export const StyledButton = styled.button`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: ${radius.pill};

  font-family: pretendard, sans-serif;
  font-size: 1rem;
  font-weight: ${fontWeights.normal};
  color: ${colors.white};

  background-color: ${colors.accent};

  transition: background-color ease 0.2s;

  &:hover {
    background-color: ${colors.accent_hover};
  }
`;
