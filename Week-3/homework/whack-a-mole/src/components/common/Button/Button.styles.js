import styled from '@emotion/styled';
import { colors, fontWeights, radius } from '@/styles/tokens';

export const StyledButton = styled.button`
  padding: 0.6rem 1.2rem;
  border-radius: ${radius.pill};

  font-size: 1rem;
  font-weight: ${fontWeights.bold};
  color: ${colors.white};

  background-color: ${colors.accent};

  transition: background-color ease 0.2s;

  &:hover {
    background-color: ${colors.accent_hover};
  }
`;
