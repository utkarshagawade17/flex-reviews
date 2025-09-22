import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NormalizedReview } from '@/types/review';

interface ReviewFilters {
  q?: string;
  source?: string[];
  tags?: string[];
  type?: string[];
  ratingMin?: number;
  sort?: string;
  limit?: number;
  cursor?: string;
}

export function useReviews(filters: ReviewFilters) {
  const queryClient = useQueryClient();

  // Build query parameters
  const queryParams = new URLSearchParams();
  if (filters.q) queryParams.append('q', filters.q);
  if (filters.source?.length) queryParams.append('source', filters.source.join(','));
  if (filters.tags?.length) queryParams.append('tags', filters.tags.join(','));
  if (filters.type?.length) queryParams.append('type', filters.type.join(','));
  if (filters.ratingMin) queryParams.append('ratingMin', filters.ratingMin.toString());
  if (filters.sort) queryParams.append('sort', filters.sort);
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.cursor) queryParams.append('cursor', filters.cursor);

  const query = useQuery({
    queryKey: ['reviews', filters],
    queryFn: async () => {
      const response = await fetch(`/api/reviews?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const updateReviewMutation = useMutation({
    mutationFn: async ({ source, reviewId, updates }: { 
      source: string; 
      reviewId: string; 
      updates: Partial<NormalizedReview> 
    }) => {
      const response = await fetch(`/api/reviews/${source}/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update review');
      }
      
      return response.json();
    },
    onMutate: async ({ source, reviewId, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['reviews'] });

      // Snapshot previous value
      const previousReviews = queryClient.getQueryData(['reviews', filters]);

      // Optimistically update
      queryClient.setQueryData(['reviews', filters], (old: any) => {
        if (!old?.data?.reviews) return old;
        
        return {
          ...old,
          data: {
            ...old.data,
            reviews: old.data.reviews.map((review: NormalizedReview) =>
              review.source === source && review.id === reviewId
                ? { ...review, ...updates }
                : review
            )
          }
        };
      });

      return { previousReviews };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousReviews) {
        queryClient.setQueryData(['reviews', filters], context.previousReviews);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const bulkApproveMutation = useMutation({
    mutationFn: async ({ items, value }: { items: Array<{ source: string; reviewId: string }>; value: boolean }) => {
      const response = await fetch('/api/reviews/bulk-approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, value })
      });
      
      if (!response.ok) {
        throw new Error('Failed to bulk approve reviews');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const bulkShowMutation = useMutation({
    mutationFn: async ({ items, value }: { items: Array<{ source: string; reviewId: string }>; value: boolean }) => {
      const response = await fetch('/api/reviews/bulk-show', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, value })
      });
      
      if (!response.ok) {
        throw new Error('Failed to bulk show reviews');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const addTagMutation = useMutation({
    mutationFn: async ({ source, reviewId, tag }: { source: string; reviewId: string; tag: string }) => {
      const response = await fetch(`/api/reviews/${source}/${reviewId}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add tag');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  const removeTagMutation = useMutation({
    mutationFn: async ({ source, reviewId, tag }: { source: string; reviewId: string; tag: string }) => {
      const response = await fetch(`/api/reviews/${source}/${reviewId}/tags/${tag}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove tag');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });

  return {
    reviews: query.data?.data?.reviews || [],
    totalCount: query.data?.data?.count || 0,
    cursor: query.data?.data?.cursor,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    updateReview: updateReviewMutation.mutate,
    bulkApprove: bulkApproveMutation.mutate,
    bulkShow: bulkShowMutation.mutate,
    addTag: addTagMutation.mutate,
    removeTag: removeTagMutation.mutate,
    isUpdating: updateReviewMutation.isPending,
    isBulkOperating: bulkApproveMutation.isPending || bulkShowMutation.isPending,
  };
}

