import { useState } from 'react';
import { DropdownWrapper, DropdownHeader, MenuList, MenuItem } from "./Dropdown.styles";

const DownArrowIcon = () => (
  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '12px' }}>
    <path d="M1 1L6 6L11 1" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Dropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState('Level 1');

  const levels = ['Level 1', 'Level 2', 'Level 3'];

  return (
    <DropdownWrapper>
      <DropdownHeader onClick={() => setIsOpen(!isOpen)}>
        <span className="level-text">{currentLevel}</span>
        <DownArrowIcon />
      </DropdownHeader>

      {isOpen && (
        <MenuList>
          {levels.map((level) => (
            <MenuItem 
              key={level} 
              isSelected={level === currentLevel}
              onClick={() => {
                setCurrentLevel(level);
                setIsOpen(false);
              }}
            >
              {level}
            </MenuItem>
          ))}
        </MenuList>
      )}
    </DropdownWrapper>
  );
};

export default Dropdown;