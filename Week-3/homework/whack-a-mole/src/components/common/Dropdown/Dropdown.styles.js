import { colors, fontWeights, radius, shadows } from "@/styles/tokens";
import styled from "@emotion/styled";

export const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
  font-family: pretendard, sans-serif;
`;

export const DropdownHeader = styled.button`
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0.8rem 1rem;
  border: none;
  border-radius: ${radius.round};

  background-color: ${colors.white};
  box-shadow: ${shadows.default};

  transition: all 0.2s ease;

  /* 텍스트 스타일 */
  .level-text {
    font-size: 1.1rem;
    font-weight: ${fontWeights.bold};
    color: ${colors.black};
  }
`;

export const MenuList = styled.ul`
  position: absolute;
  z-index: 10;
  top: calc(100% + 0.5rem);
  left: 0;

  overflow: hidden;

  width: 10rem;
  margin: 0;
  padding: 0.5rem;
  border-radius: ${radius.round};

  list-style: none;

  background-color: #fff;
  box-shadow: ${shadows.default};
`;

export const MenuItem = styled.li`
  cursor: pointer;

  padding: 0.8rem 1rem;
  border-radius: ${radius.round};

  font-weight: 500;
  color: ${props => props.isSelected ? colors.white : colors.black};

  background-color: ${props => props.isSelected ? colors.black : colors.white};

  transition: background-color 0.2s ease;

  &:not(:last-child) {
    margin-bottom: 2px;
  }

  &:hover {
    color: ${colors.white};
    background-color: ${props => props.isSelected ? colors.accent_neutral_hover : colors.accent_neutral};
  }
`;