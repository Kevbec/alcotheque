export interface FilterState {
  search: string;
  types: string[];
  locations: string[];
  showFavorites: boolean;
  status: string;
  location: string;
  minPrice: string;
  maxPrice: string;
}

export const initialFilterState: FilterState = {
  search: '',
  types: [],
  locations: [],
  showFavorites: false,
  status: 'all',
  location: 'all',
  minPrice: '',
  maxPrice: '',
};