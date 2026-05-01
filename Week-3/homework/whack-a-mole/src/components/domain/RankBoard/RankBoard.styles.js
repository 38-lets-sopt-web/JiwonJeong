import styled from "@emotion/styled";
import { StyledButton } from "@/components/common/Button";
import { colors, fontWeights, layout, radius, shadows } from "@/styles/tokens";

export const StyledRankBoard = styled.section`
  width: 80%;
  height: calc(100% - ${layout.headerTop} - ${layout.headerHeight} - ${layout.pagePadding});
  margin: calc(${layout.headerTop} + ${layout.headerHeight} + ${layout.pagePadding}) auto 0;
  padding: ${layout.pagePadding};
  border-radius: ${radius.round};

  font-family: pretendard, sans-serif;
  color: ${colors.black};

  background-color: ${colors.white};
  box-shadow: ${shadows.default};
`;

export const RankHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
`;

export const Title = styled.h2`
  font-family: dunggeunmo, sans-serif;
  font-size: 1.4rem;
  font-weight: ${fontWeights.bold};
`;

export const ResetButton = styled(StyledButton)`
  padding: 0.7rem 1.1rem;
  font-size: 0.9rem;
  font-weight: ${fontWeights.bold};
  background-color: ${colors.accent_negative};

  &:hover {
    background-color: ${colors.accent_negative_hover};
  }
`;

export const Table = styled.table`
  overflow: hidden;
  border-collapse: collapse;
  width: 100%;
  border-radius: ${radius.round};
`;

export const TableHead = styled.thead`
  background-color: ${colors.accent};
`;

export const TableHeader = styled.th`
  padding: 1rem;

  font-size: 0.95rem;
  font-weight: ${fontWeights.bold};
  color: ${colors.white};
  text-align: center;
`;

export const TableCell = styled.td`
  padding: 1.1rem 1rem;
  border-bottom: 0.1rem solid rgb(255 255 255 / 70%);

  font-size: 0.9rem;
  font-weight: ${fontWeights.normal};
  text-align: center;
`;

export const EmptyCell = styled(TableCell)`
  padding: 4rem 1rem;
  color: ${colors.accent_neutral_hover};
`;
