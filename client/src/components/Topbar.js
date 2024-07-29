import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SearchIcon from "@mui/icons-material/Search";

function Topbar() {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleResetClick = () => {
    setSearchValue('');
  };

  return (
    <Box className="topbar" textColor="#fff" backgroundColor="#333" display="flex" justifyContent="space-between" p={2}>
      {/* SEARCH BAR */}
      <Box className="search-bar hidden-row">
        <form className="form">
          <label htmlFor="search">
            <input className="input" type="text" value={searchValue} onChange={handleInputChange} required="" placeholder="Search" id="search" />
            {searchValue && (
              <button className="close-btn" type="reset" onClick={handleResetClick}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </button>
            )}
            <div className="fancy-bg"></div>
            <div className="search">
              <SearchIcon viewBox="0 0 24 24" aria-hidden="true" />
            </div>
          </label>
        </form>
      </Box>
      {/* ICONS */}
      <Box display="flex">
        <h4 style={{color: '#fff'}}>Web-Based Face Recognition System for Monitoring Event Attendance at TSU-CCS AVR</h4>
      </Box>
    </Box>
  );
}

export default Topbar;