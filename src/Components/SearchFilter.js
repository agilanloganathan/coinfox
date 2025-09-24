import React, { useState } from 'react';
import styled from 'styled-components';

const SearchFilterContainer = styled.div`
  margin: 20px;
  padding: 20px;
  background: #303032;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  box-sizing: border-box;
`;

const SearchInput = styled.input`
  width: 100% !important;
  padding: 12px 16px !important;
  margin: 0 0 16px 0 !important;
  border: 1px solid #555 !important;
  border-radius: 8px;
  background: #404042 !important;
  color: white !important;
  font-size: 16px;
  box-sizing: border-box;
  height: auto !important;
  
  &::placeholder {
    color: #aaa !important;
  }
  
  &:focus {
    outline: none !important;
    border-color: #21ce99 !important;
    box-shadow: 0 0 0 2px rgba(33, 206, 153, 0.2) !important;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
  align-items: center;
`;

const FilterButton = styled.button`
  padding: 8px 16px !important;
  border: 1px solid #555 !important;
  border-radius: 20px;
  background: ${props => props.active ? '#21ce99' : 'transparent'} !important;
  color: ${props => props.active ? 'white' : '#aaa'} !important;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-family: inherit;
  min-height: auto !important;
  height: auto !important;
  
  &:hover {
    background: ${props => props.active ? '#21ce99' : '#404042'} !important;
    border-color: #21ce99 !important;
  }
  
  &:focus {
    outline: none !important;
    border-color: #21ce99 !important;
  }
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
`;

const SortLabel = styled.span`
  color: #aaa;
  font-size: 14px;
`;

const SortSelect = styled.select`
  padding: 8px 12px !important;
  border: 1px solid #555 !important;
  border-radius: 6px;
  background: #404042 !important;
  color: white !important;
  cursor: pointer;
  height: auto !important;
  margin: 0 !important;
  font-size: 14px;
  font-family: inherit;
  
  &:focus {
    outline: none !important;
    border-color: #21ce99 !important;
  }
  
  option {
    background: #404042;
    color: white;
  }
`;

const SearchFilter = ({ onSearch, onFilter, onSort, searchTerm, activeFilter, sortBy }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');
  const [localActiveFilter, setLocalActiveFilter] = useState(activeFilter || 'all');
  const [localSortBy, setLocalSortBy] = useState(sortBy || 'value');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (filter) => {
    setLocalActiveFilter(filter);
    onFilter(filter);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setLocalSortBy(value);
    onSort(value);
  };

  return (
    <SearchFilterContainer>
      <SearchInput
        type="text"
        placeholder="Search coins in your portfolio..."
        value={localSearchTerm}
        onChange={handleSearchChange}
      />

      <FilterContainer>
        <FilterButton
          active={localActiveFilter === 'all'}
          onClick={() => handleFilterChange('all')}
        >
          All Coins
        </FilterButton>
        <FilterButton
          active={localActiveFilter === 'gaining'}
          onClick={() => handleFilterChange('gaining')}
        >
          Gaining
        </FilterButton>
        <FilterButton
          active={localActiveFilter === 'losing'}
          onClick={() => handleFilterChange('losing')}
        >
          Losing
        </FilterButton>
        <FilterButton
          active={localActiveFilter === 'favorites'}
          onClick={() => handleFilterChange('favorites')}
        >
          Favorites
        </FilterButton>
      </FilterContainer>

      <SortContainer>
        <SortLabel>Sort by:</SortLabel>
        <SortSelect value={localSortBy} onChange={handleSortChange}>
          <option value="value">Portfolio Value</option>
          <option value="name">Coin Name</option>
          <option value="performance">Performance</option>
          <option value="quantity">Quantity</option>
        </SortSelect>
      </SortContainer>
    </SearchFilterContainer>
  );
};

export default SearchFilter;

