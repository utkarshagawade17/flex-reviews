# 📝 FlexReviews Dashboard - Technical Notes

This document provides an overview of the technical architecture, key design decisions, API structure, and mock data implementation for the FlexReviews Dashboard project.

## 🏛️ Architecture Overview

The FlexReviews Dashboard is a modern web application built using the **Next.js 14 App Router** for a full-stack approach, leveraging **React Query** for efficient data fetching and state management on the frontend. **TypeScript** is used throughout the project for type safety and improved developer experience.

### **Frontend (Client-Side):**
*   **Framework:** Next.js 14 (App Router)
*   **State Management & Data Fetching:** `@tanstack/react-query` (React Query) for server-state management, caching, and synchronization.
*   **UI Components:** Custom components built with **Tailwind CSS** for styling.
*   **Charting:** **Recharts** library for interactive data visualization (Average Rating, Category Ratings, Review Sources).
*   **Theming:** `next-themes` for dark mode support.
*   **Routing:** Next.js `next/navigation` for client-side routing.

### **Backend (API Routes - Next.js):**
*   **Framework:** Next.js API Routes (`app/api/*`)
*   **Data Source:** Currently uses in-memory mock data for reviews, tags, and trends. This allows for rapid development and demonstration without a persistent database.
*   **API Endpoints:** RESTful API endpoints for managing reviews, tags, and fetching analytics data.
*   **Authentication:** Basic mock authentication context (`AuthContext`).

## 💡 Key Design Decisions

1.  **Next.js App Router:** Chosen for its full-stack capabilities, allowing API routes and React components to coexist in a single codebase, simplifying deployment and development. Server Components (though not heavily utilized in the dashboard's interactive parts) offer future optimization potential.
2.  **React Query:** Selected for its robust features for handling asynchronous data. It provides automatic caching, background refetching, data synchronization, and error handling out-of-the-box, significantly reducing boilerplate and improving performance compared to traditional `useState`/`useEffect` for data fetching.
3.  **TypeScript:** Implemented to ensure type safety across the application, catching errors at compile-time rather than runtime, leading to more reliable and maintainable code.
4.  **In-Memory Mock Data:** For the initial development phase, mock data is used to simulate API responses. This decision allowed for rapid iteration on the UI and frontend logic without needing to set up a complex database or external API integrations. This can be easily replaced with actual database calls (e.g., Prisma, Mongoose) in the future.
5.  **Modular Component Design:** The UI is broken down into smaller, reusable components (e.g., `ReviewList`, `ReviewDetail`, `Trends`, `Sidebar`, `TagChip`) to promote maintainability and scalability.
6.  **Responsive Layout:** Tailwind CSS is used to create a responsive design that adapts to various screen sizes, ensuring a consistent user experience.

## 🔗 API Shape

The API routes are designed to be RESTful, providing endpoints for various review management operations. All API routes are prefixed with `/api/reviews`.

### **Core API Endpoints:**

*   **`GET /api/reviews`**:
    *   **Description:** Fetches a list of normalized reviews, with support for filtering, sorting, and pagination.
    *   **Query Params:** `source`, `rating`, `status`, `tags`, `search`, `sortBy`, `page`, `limit`.
    *   **Response:** `{ reviews: NormalizedReview[], total: number }`
*   **`GET /api/reviews/trends`**:
    *   **Description:** Provides aggregated data for analytics charts (monthly ratings, category ratings, review sources).
    *   **Query Params:** `range` (e.g., `180d`, `365d`).
    *   **Response:** `{ byMonth: MonthlyRating[], byCategory: CategoryRating[], bySource: ReviewSource[] }`
*   **`GET /api/reviews/tags`**:
    *   **Description:** Retrieves a list of all available tags (predefined and custom).
    *   **Response:** `{ success: true, data: ReviewTag[] }`
*   **`POST /api/reviews/tags`**:
    *   **Description:** Creates a new custom tag.
    *   **Request Body:** `{ name: string }`
    *   **Response:** `{ success: true, data: ReviewTag }`
*   **`DELETE /api/reviews/tags/[id]`**:
    *   **Description:** Deletes a custom tag by its ID.
    *   **Response:** `{ success: true, message: string }`
*   **`PATCH /api/reviews/[source]/[reviewId]`**:
    *   **Description:** Updates a specific review's properties (e.g., `approved`, `selectedForWeb`).
    *   **Request Body:** `{ approved?: boolean, selectedForWeb?: boolean }`
    *   **Response:** `{ success: true, data: NormalizedReview }`
*   **`POST /api/reviews/[source]/[reviewId]/tags`**:
    *   **Description:** Adds a tag to a specific review.
    *   **Request Body:** `{ tag: string }`
    *   **Response:** `{ success: true, data: NormalizedReview }`
*   **`DELETE /api/reviews/[source]/[reviewId]/tags/[tag]`**:
    *   **Description:** Removes a specific tag from a review.
    *   **Response:** `{ success: true, data: NormalizedReview }`
*   **`POST /api/reviews/bulk-approve`**:
    *   **Description:** Approves multiple reviews.
    *   **Request Body:** `{ reviewIds: { source: string, id: string }[] }`
*   **`POST /api/reviews/bulk-show`**:
    *   **Description:** Marks multiple reviews to be shown on the web.
    *   **Request Body:** `{ reviewIds: { source: string, id: string }[] }`
*   **`GET /api/reviews/approved`**:
    *   **Description:** Fetches only approved reviews (for property page display).
    *   **Response:** `{ reviews: NormalizedReview[] }`

## 🎭 What's Mocked

All data currently displayed in the dashboard is generated from in-memory mock data. This includes:

*   **Review Data:** `mockHostawayReviews` and `mockGoogleReviews` in `/lib/api-utils.ts` simulate reviews from different sources. These include various ratings, guest names, comments, and submission dates.
*   **Tags:** Predefined tags are loaded from `/config/tags.ts`, and custom tags are managed in-memory within the `/api/reviews/tags/route.ts` API.
*   **Trends Data:** The `/api/reviews/trends/route.ts` endpoint processes the mock review data to generate aggregated monthly ratings, category breakdowns, and source distribution. Dates in mock data are adjusted to ensure they fall within a relevant range for current trends display.
*   **User Authentication:** A basic `AuthContext` provides a mock `isLoggedIn` state and `login`/`logout` functions without actual backend authentication.

This mocking strategy allows for a fully functional frontend and API layer for demonstration purposes, with clear separation for future integration with a real database and authentication system.

## 🛠️ Process / Tooling

Notes on assistance: A general-purpose AI assistant was used to draft some boilerplate and suggest small refactors. All design/architecture decisions, data modeling, and final implementation are my own.
