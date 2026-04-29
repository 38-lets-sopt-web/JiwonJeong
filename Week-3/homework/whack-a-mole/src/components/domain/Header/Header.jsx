import {
  ButtonGroup,
  HeaderButton,
  StyledHeader,
  Title,
} from './Header.styles';

function Header() {
  return (
    <StyledHeader>
      <Title>두더지 잡기</Title>

      <ButtonGroup>
        <HeaderButton type="button">게임</HeaderButton>
        <HeaderButton type="button">랭킹</HeaderButton>
      </ButtonGroup>
    </StyledHeader>
  );
}

export default Header;
