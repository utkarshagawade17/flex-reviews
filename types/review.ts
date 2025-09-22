export interface ReviewCategory {
  category: string;
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: 'host-to-guest' | 'guest-to-host';
  status: 'published' | 'pending' | 'rejected';
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
}

export interface HostawayApiResponse {
  status: string;
  result: HostawayReview[];
}

export interface NormalizedReview {
  id: string;                 // provider id e.g. "7453"
  source: "hostaway" | "google" | "airbnb" | "booking";
  listingId?: string | number;
  listingName: string;

  channel: string;            // duplicates source for UI chips if you like
  type: "host_to_guest" | "guest_to_host";
  status: "published" | "hidden" | "pending";

  submittedAt: string;        // ISO
  rating: number | null;      // FINAL: 1–5 (convert provider scales)
  categories: Record<string, number>; // 0–10 (bars), or convert to 1–5 consistently

  text: string;
  guestName: string | null;

  approved: boolean;          // dashboard state
  selectedForWeb: boolean;    // public display
  tags: string[];             // e.g., ["wifi","featured"]
}

export interface ReviewTag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

export interface TagAssignment {
  source: string;
  reviewId: number;
  tags: string[];
}

export interface ReviewFilters {
  status?: string;
  rating?: number;
  channel?: string;
  sentiment?: string;
  listing?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  search?: string;
  timeWindow?: string;
  sortBy?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating';
  // New canonical API filters
  source?: string;
  listingId?: string;
  type?: string;
  ratingMin?: number;
  ratingMax?: number;
  limit?: number;
  cursor?: string;
  q?: string;
}

export interface DashboardStats {
  totalReviews: number;
  averageRating: number;
  pendingReviews: number;
  featuredReviews: number;
  myReviews: number;
  assignedReviews: number;
  closedReviews: number;
  spamReviews: number;
}

// New API interfaces
export interface ReviewApproval {
  source: string;
  reviewId: string;
  approved: boolean;
  selectedForWeb: boolean;
}

export interface BulkOperation {
  items: Array<{ source: string; reviewId: string }>;
  value: boolean;
}

export interface TagResponse {
  predefined: string[];
  custom: string[];
}

export interface TrendsData {
  byMonth: Array<{ month: string; avgRating: number; count: number }>;
  byCategory: Array<{ name: string; avg: number }>;
  bySource: Array<{ source: string; count: number }>;
}
