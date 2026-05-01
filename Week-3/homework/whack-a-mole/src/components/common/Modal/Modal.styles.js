import styled from "@emotion/styled";
import { colors, radius, shadows } from "@/styles/tokens";

export const Overlay = styled.div`
  position: fixed;
  z-index: 100;
  inset: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgb(0 0 0 / 58%);
`;

export const ModalBox = styled.div`
  min-width: 18rem;
  padding: 2rem 3rem;
  border-radius: ${radius.round};

  text-align: center;

  background-color: ${colors.white};
  box-shadow: ${shadows.default};
`;
