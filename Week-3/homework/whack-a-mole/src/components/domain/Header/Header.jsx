import {
  ButtonGroup,
  HeaderButton,
  StyledHeader,
  Title,
} from "./Header.styles";

const NAV_ITEMS = [
  { label: "게임", value: "game" },
  { label: "랭킹", value: "rank" },
];

function Header({ activeView, onChangeView }) {
  return (
    <StyledHeader>
      <Title>두더지 잡기</Title>

      <ButtonGroup>
        {NAV_ITEMS.map(({ label, value }) => (
          <HeaderButton
            type="button"
            key={value}
            $isActive={activeView === value}
            onClick={() => onChangeView(value)}
          >
            {label}
          </HeaderButton>
        ))}
      </ButtonGroup>
    </StyledHeader>
  );
}

export default Header;
