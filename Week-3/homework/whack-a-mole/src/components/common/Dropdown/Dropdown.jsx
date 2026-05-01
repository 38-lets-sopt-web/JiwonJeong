import { useState } from "react";
import { DropdownWrapper, DropdownHeader, MenuList, MenuItem } from "./Dropdown.styles";

const DownArrowIcon = () => (
  <svg aria-hidden="true" width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1L6 6L11 1"
      stroke="#000000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    />
  </svg>
);

const Dropdown = ({ disabled = false, level, levels, onChangeLevel }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    if (disabled) {
      return;
    }

    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  const handleSelect = (levelOption) => {
    onChangeLevel(levelOption);
    setIsOpen(false);
  };

  return (
    <DropdownWrapper>
      <DropdownHeader
        type="button"
        aria-disabled={disabled}
        aria-expanded={isOpen}
        disabled={disabled}
        onClick={handleToggle}
      >
        <span className="level-text">Level {level}</span>
        <DownArrowIcon />
      </DropdownHeader>

      {isOpen && (
        <MenuList role="listbox" aria-label="레벨 선택">
          {levels.map((levelOption) => (
            <MenuItem 
              role="option"
              key={levelOption}
              aria-selected={levelOption === level}
              $isSelected={levelOption === level}
              onClick={() => handleSelect(levelOption)}
            >
              Level {levelOption}
            </MenuItem>
          ))}
        </MenuList>
      )}
    </DropdownWrapper>
  );
};

export default Dropdown;
