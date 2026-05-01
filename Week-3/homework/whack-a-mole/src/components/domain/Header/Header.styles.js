import styled from "@emotion/styled";
import { StyledButton } from "@/components/common/Button";
import { colors, layout, radius, shadows } from "@/styles/tokens";

export const StyledHeader = styled.header`
  position: fixed;
  top: ${layout.headerTop};
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  gap: 1rem;
  align-items: center;

  width: calc(100% - ${layout.pagePadding} * 2);
  max-width: 120rem;
  height: ${layout.headerHeight};
  padding: 0 1rem;
  border-radius: ${radius.pill};

  background-color: ${colors.white};
  box-shadow: ${shadows.default};
`;

export const Title = styled.h1`
  margin-left: 1rem;
  font-family: dunggeunmo, sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.8rem;
  align-items: center;
`;

export const HeaderButton = styled(StyledButton)`
  color: ${({ $isActive }) => ($isActive ? colors.white : colors.accent)};
  background-color: ${({ $isActive }) => ($isActive ? colors.accent : colors.white)};

  &:hover {
    color: ${colors.white};
    background-color: ${colors.accent};
  }
`;
