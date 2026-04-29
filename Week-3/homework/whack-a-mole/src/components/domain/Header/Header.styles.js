import styled from "@emotion/styled";
import { StyledButton } from "@/components/common/Button";
import { colors, radius } from "@/styles/tokens";

export const StyledHeader = styled.header`
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  gap: 1rem;
  align-items: center;

  width: calc(100% - 4rem);
  max-width: 120rem;
  height: 4rem;
  padding: 0 1rem;
  border-radius: ${radius.pill};

  background-color: white;
  box-shadow: 0 0.8rem 2.4rem rgb(0 0 0 / 12%);
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
  background-color: ${colors.accent_neutral};

  &:hover {
    background-color: ${colors.accent_neutral_hover};
  }
`;
