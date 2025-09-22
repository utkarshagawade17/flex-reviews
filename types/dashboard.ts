export interface FilterState {
  q?: string;
  source?: string[];
  tags?: string[];
  type?: string[];
  ratingMin?: number;
  sort?: string;
  limit?: number;
  cursor?: string;
}

