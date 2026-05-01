import styled from "@emotion/styled";
import { HStack } from "@/components/common/Hstack";
import { layout } from "@/styles/tokens";

export const MainHStack = styled(HStack)`
  height: calc(100% - ${layout.headerTop} - ${layout.headerHeight} - ${layout.pagePadding});
  margin-top: calc(${layout.headerTop} + ${layout.headerHeight} + ${layout.pagePadding});
  margin-left: ${layout.pagePadding};
`;
