import { searchContainerStyle, inputStyle, buttonStyle } from "./SearchFieldStyle";

const SearchField = ({ search, handleSearchChange, handleSearchClick }) => {
  return (
    <div css={searchContainerStyle}>
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="검색어를 입력하세요"
        css={inputStyle}
      />
      <button css={buttonStyle} onClick={handleSearchClick}>
        검색
      </button>
    </div>
  );
};

export default SearchField;
