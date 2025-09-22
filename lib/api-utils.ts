import { NormalizedReview } from '@/types/review';

// Mock data for Hostaway reviews
const mockHostawayReviews: NormalizedReview[] = [
  {
    id: "1",
    source: "hostaway",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "hostaway",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-08-15T10:30:00Z",
    rating: 5,
    categories: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "Absolutely fantastic stay! The apartment was spotless, beautifully decorated, and had everything we needed. The location was perfect - close to all the main attractions but still quiet at night. The host was incredibly responsive and helpful throughout our stay. Would definitely recommend and will be back!",
    guestName: "Jerome Calloway",
    approved: true,
    selectedForWeb: true,
    tags: ["location", "host_response", "featured", "cleanliness", "wifi"]
  },
  {
    id: "2",
    source: "hostaway",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "hostaway",
    type: "host_to_guest",
    status: "published",
    submittedAt: "2024-08-14T14:30:00Z",
    rating: 5,
    categories: {
      cleanliness: 5,
      communication: 5,
      respect: 5,
      follow_rules: 5
    },
    text: "Excellent guest! Very respectful of the property and left everything in perfect condition. Great communication throughout their stay. Would welcome them back anytime.",
    guestName: "Flex Living Host",
    approved: true,
    selectedForWeb: true,
    tags: ["host_response", "cleanliness"]
  },
  {
    id: "3",
    source: "hostaway",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "hostaway",
    type: "guest_to_host",
    status: "pending",
    submittedAt: "2024-08-13T09:15:00Z",
    rating: 3,
    categories: {
      cleanliness: 4,
      communication: 4,
      location: 4,
      value: 3
    },
    text: "The apartment was okay, but the wifi was a bit slow. Good location though. Could be cleaner.",
    guestName: "Sarah Johnson",
    approved: false,
    selectedForWeb: false,
    tags: ["wifi", "maintenance"]
  },
  {
    id: "4",
    source: "hostaway",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "hostaway",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-07-12T16:45:00Z",
    rating: 4,
    categories: {
      cleanliness: 4,
      communication: 5,
      location: 4,
      value: 4
    },
    text: "Great location and the apartment was well-equipped. The host was very helpful with local recommendations. Would stay again!",
    guestName: "Michael Brown",
    approved: true,
    selectedForWeb: false,
    tags: ["location", "host_response"]
  },
  {
    id: "5",
    source: "hostaway",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "hostaway",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-07-11T11:20:00Z",
    rating: 5,
    categories: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "Perfect stay! Everything was exactly as described. The apartment was spotless and the location couldn't be better. Highly recommend!",
    guestName: "Emma Wilson",
    approved: true,
    selectedForWeb: true,
    tags: ["cleanliness", "location", "featured"]
  },
  {
    id: "6",
    source: "hostaway",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "hostaway",
    type: "host_to_guest",
    status: "published",
    submittedAt: "2024-07-10T08:30:00Z",
    rating: 5,
    categories: {
      cleanliness: 5,
      communication: 5,
      respect: 5,
      follow_rules: 5
    },
    text: "Outstanding guest! Very clean and respectful. Great communication and left the place in perfect condition.",
    guestName: "Flex Living Host",
    approved: true,
    selectedForWeb: true,
    tags: ["cleanliness", "host_response"]
  },
  {
    id: "7",
    source: "hostaway",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "hostaway",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-07-09T14:15:00Z",
    rating: 4,
    categories: {
      cleanliness: 4,
      communication: 4,
      location: 5,
      value: 4
    },
    text: "Good stay overall. The location was excellent and the apartment was comfortable. Minor issues with the heating but otherwise great.",
    guestName: "David Lee",
    approved: true,
    selectedForWeb: false,
    tags: ["location", "maintenance"]
  },
  {
    id: "8",
    source: "hostaway",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "hostaway",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-07-08T19:00:00Z",
    rating: 5,
    categories: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "Amazing experience! The apartment exceeded our expectations. Beautiful, clean, and in a perfect location. The host was incredibly helpful and responsive.",
    guestName: "Lisa Chen",
    approved: true,
    selectedForWeb: true,
    tags: ["cleanliness", "location", "host_response", "featured"]
  },
  {
    id: "9",
    source: "hostaway",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "hostaway",
    type: "guest_to_host",
    status: "pending",
    submittedAt: "2024-07-07T12:30:00Z",
    rating: 2,
    categories: {
      cleanliness: 2,
      communication: 3,
      location: 4,
      value: 2
    },
    text: "Disappointing stay. The apartment was not as clean as expected and there were some maintenance issues. The location was good though.",
    guestName: "Robert Taylor",
    approved: false,
    selectedForWeb: false,
    tags: ["maintenance", "cleanliness"]
  },
  {
    id: "10",
    source: "hostaway",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "hostaway",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-07-06T15:45:00Z",
    rating: 4,
    categories: {
      cleanliness: 4,
      communication: 4,
      location: 4,
      value: 4
    },
    text: "Solid stay. The apartment was clean and well-located. Good value for money and the host was responsive to our needs.",
    guestName: "Jennifer Martinez",
    approved: true,
    selectedForWeb: false,
    tags: ["value", "host_response"]
  }
];

// Mock data for Google reviews
const mockGoogleReviews: NormalizedReview[] = [
  {
    id: "g1",
    source: "google",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "google",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-08-10T14:30:00Z",
    rating: 5,
    categories: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "Amazing experience! The place was exactly as described, very clean and comfortable. Great location, easy to get around. Highly recommend!",
    guestName: "Alice Wonderland",
    approved: true,
    selectedForWeb: true,
    tags: ["location", "cleanliness"]
  },
  {
    id: "g2",
    source: "google",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "google",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-08-08T09:15:00Z",
    rating: 4,
    categories: {
      cleanliness: 4,
      communication: 4,
      location: 5,
      value: 4
    },
    text: "Good stay overall. The apartment was nice, but the check-in process was a bit confusing. Otherwise, no complaints.",
    guestName: "Bob The Builder",
    approved: true,
    selectedForWeb: false,
    tags: ["check-in"]
  },
  {
    id: "g3",
    source: "google",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "google",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-08-05T16:45:00Z",
    rating: 3,
    categories: {
      cleanliness: 3,
      communication: 4,
      location: 4,
      value: 3
    },
    text: "Decent place. A bit noisy at night and the bed wasn't very comfortable. Good value for money though.",
    guestName: "Charlie Chaplin",
    approved: false,
    selectedForWeb: false,
    tags: ["noise", "comfort"]
  },
  {
    id: "g4",
    source: "google",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "google",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-08-03T11:20:00Z",
    rating: 5,
    categories: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "Exceptional stay! The apartment was immaculate and the location was perfect. The host was very helpful and responsive. Will definitely return!",
    guestName: "Diana Prince",
    approved: true,
    selectedForWeb: true,
    tags: ["cleanliness", "location", "host_response", "featured"]
  },
  {
    id: "g5",
    source: "google",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "google",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-08-01T13:30:00Z",
    rating: 4,
    categories: {
      cleanliness: 4,
      communication: 4,
      location: 4,
      value: 4
    },
    text: "Great location and comfortable stay. The apartment was clean and well-equipped. Minor issue with the wifi but overall good experience.",
    guestName: "Edward Norton",
    approved: true,
    selectedForWeb: false,
    tags: ["location", "wifi"]
  },
  {
    id: "g6",
    source: "google",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "google",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-08-29T10:15:00Z",
    rating: 5,
    categories: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "Perfect stay! Everything was exactly as described. The apartment was spotless, beautifully decorated, and in an excellent location. Highly recommend!",
    guestName: "Fiona Green",
    approved: true,
    selectedForWeb: true,
    tags: ["cleanliness", "location", "featured"]
  },
  {
    id: "g7",
    source: "google",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "google",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-08-27T15:45:00Z",
    rating: 3,
    categories: {
      cleanliness: 3,
      communication: 3,
      location: 4,
      value: 3
    },
    text: "Average stay. The location was good but the apartment could have been cleaner. The host was responsive to issues though.",
    guestName: "George Lucas",
    approved: false,
    selectedForWeb: false,
    tags: ["cleanliness", "host_response"]
  },
  {
    id: "g8",
    source: "google",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "google",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-08-25T12:00:00Z",
    rating: 4,
    categories: {
      cleanliness: 4,
      communication: 4,
      location: 4,
      value: 4
    },
    text: "Good stay overall. The apartment was comfortable and well-located. The host was helpful and the check-in process was smooth.",
    guestName: "Helen Troy",
    approved: true,
    selectedForWeb: false,
    tags: ["location", "host_response"]
  },
  {
    id: "g9",
    source: "google",
    listingId: "1",
    listingName: "2B N1 A - 29 Shoreditch Heights",
    channel: "google",
    type: "guest_to_host",
    status: "published",
    submittedAt: "2024-08-23T09:30:00Z",
    rating: 5,
    categories: {
      cleanliness: 5,
      communication: 5,
      location: 5,
      value: 5
    },
    text: "Outstanding experience! The apartment was perfect in every way - clean, comfortable, and beautifully decorated. The location was ideal and the host was incredibly helpful. Will definitely book again!",
    guestName: "Ivan Petrov",
    approved: true,
    selectedForWeb: true,
    tags: ["cleanliness", "location", "host_response", "featured"]
  }
];

export async function fetchHostawayReviews(): Promise<NormalizedReview[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockHostawayReviews;
}

export async function fetchGoogleReviews(): Promise<NormalizedReview[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockGoogleReviews;
}
