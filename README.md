# 📊 FlexReviews Dashboard

A modern, full-featured review management dashboard built with Next.js 14, React Query, and TypeScript. Manage reviews from multiple sources, analyze trends, and maintain your property reputation with ease.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React Query](https://img.shields.io/badge/React%20Query-5.0-orange)

## ✨ Features

### 🎯 Core Functionality
- **Multi-Source Review Management**: Handle reviews from Hostaway, Google, Airbnb, and Booking.com
- **Advanced Filtering**: Search, filter by source, rating, status, and tags
- **Review Actions**: Approve, feature, and show reviews on your website
- **Tag Management**: Create, edit, and delete custom tags for better organization
- **Analytics Dashboard**: Beautiful charts showing rating trends and review sources
- **Dark Mode**: Complete dark/light theme support

### 🚀 Technical Features
- **Real-time Updates**: Instant UI feedback with optimistic updates
- **Responsive Design**: Mobile-first approach with full-screen layout
- **Performance Optimized**: React Query caching and efficient rendering
- **Type Safety**: Full TypeScript implementation
- **Error Handling**: Graceful error states and recovery
- **API Testing**: Built-in comprehensive test suite

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **State Management**: React Query for server state
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Theme**: next-themes

### Project Structure
```
flexreviews/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   └── reviews/             # Review-related endpoints
│   ├── dashboard/                # Main dashboard page
│   ├── tags/                     # Tag management page
│   ├── properties/               # Property listings
│   └── property/[id]/            # Individual property pages
├── components/                   # Reusable components
│   ├── dashboard/                # Dashboard-specific components
│   └── ui/                       # UI components
├── types/                        # TypeScript definitions
├── lib/                          # Utility functions
└── config/                       # Configuration files
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flexreviews
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Dashboard
- **Main Dashboard**: `/dashboard` - Full-featured review management
- **Tag Management**: `/tags` - Create and manage custom tags
- **Properties**: `/properties` - Property listings
- **API Testing**: `/api-test-comprehensive` - Test all API endpoints

### Key Features

#### Review Management
1. **View Reviews**: Scrollable list with all reviews
2. **Filter Reviews**: Use sidebar filters for source, rating, status, tags
3. **Select Review**: Click any review to see details
4. **Approve Reviews**: Click "Approve" to approve reviews
5. **Show on Web**: Click "Show on Web" to display publicly
6. **Feature Reviews**: Click "Feature" to highlight important reviews
7. **Add Tags**: Tag reviews for better organization

#### Analytics
1. **View Charts**: See rating trends and review sources
2. **Refresh Data**: Click "Refresh" button to update analytics
3. **Interactive Charts**: Hover for detailed information

#### Tag Management
1. **Create Tags**: Add new custom tags with colors and descriptions
2. **Edit Tags**: Modify existing tags
3. **Delete Tags**: Remove unused tags
4. **Predefined Tags**: System tags for common categories

## 🔧 API Endpoints

### Core Endpoints
```
GET    /api/reviews              # List and filter reviews
PATCH  /api/reviews/[source]/[id] # Update single review
POST   /api/reviews/bulk-approve  # Bulk approve reviews
POST   /api/reviews/bulk-show     # Bulk show on web
GET    /api/reviews/approved      # Get approved reviews
GET    /api/reviews/trends        # Analytics data
```

### Tag Management
```
GET    /api/reviews/tags         # Get all tags
POST   /api/reviews/tags         # Create new tag
DELETE /api/reviews/tags?id=...  # Delete tag
```

### Review Tags
```
POST   /api/reviews/[source]/[id]/tags     # Add tag to review
DELETE /api/reviews/[source]/[id]/tags/[tag] # Remove tag from review
```

## 🎨 UI Components

### Dashboard Layout
```
┌─────────────────────────────────────────────────────────┐
│ Header (Navigation + Theme Toggle)                   │
├─────────────────────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│ │ Sidebar │ │   Review List   │ │  Detail Panel   │    │
│ │Filters  │ │   (Scrollable)  │ │  (Review Info)  │    │
│ │         │ │                 │ │                 │    │
│ └─────────┘ └─────────────────┘ └─────────────────┘    │
├─────────────────────────────────────────────────────────┤
│ Analytics Section (Charts & Trends)                     │
└─────────────────────────────────────────────────────────┘
```

### Key Components
- **DashboardPage**: Main dashboard container
- **Sidebar**: Filter controls and search
- **ReviewList**: Scrollable review list
- **DetailPanel**: Review details and actions
- **Trends**: Analytics charts
- **TagSelector**: Tag management interface

## 🎯 Data Models

### Review Structure
```typescript
interface NormalizedReview {
  id: string;                    // Unique identifier
  source: "hostaway" | "google"; // Data source
  listingId: string;             // Property ID
  listingName: string;           // Property name
  type: "host_to_guest" | "guest_to_host";
  status: "published" | "hidden" | "pending";
  submittedAt: string;           // ISO date
  rating: number | null;         // 1-5 scale
  categories: Record<string, number>; // Category ratings
  text: string;                   // Review content
  guestName: string | null;       // Guest name
  approved: boolean;             // Approval status
  selectedForWeb: boolean;       // Public display status
  tags: string[];                // Associated tags
}
```

### Filter Options
```typescript
interface FilterState {
  q?: string;                    // Search query
  source?: string[];             // Source filter
  rating?: number[];             // Rating filter
  status?: string[];             // Status filter
  tags?: string[];               // Tag filter
  sortBy?: string;               // Sort field
  sortOrder?: 'asc' | 'desc';    // Sort direction
}
```

## 🚀 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Development Workflow
1. **Start Development Server**: `npm run dev`
2. **Open Browser**: Navigate to `http://localhost:3000`
3. **Make Changes**: Edit files and see hot reload
4. **Test Features**: Use the built-in API test suite
5. **Build for Production**: `npm run build`

### Code Structure
- **Components**: Reusable UI components in `/components`
- **Pages**: Next.js pages in `/app`
- **API Routes**: Server-side logic in `/app/api`
- **Types**: TypeScript definitions in `/types`
- **Utils**: Helper functions in `/lib`

## 🧪 Testing

### API Testing
Visit `/api-test-comprehensive` to test all API endpoints:
- **Reviews API**: Test filtering and pagination
- **Review Updates**: Test approve/show on web
- **Bulk Operations**: Test bulk approve/show
- **Tag Management**: Test tag CRUD operations
- **Analytics**: Test trends data

### Component Testing
- **User Interactions**: Button clicks, form submissions
- **State Updates**: Local state synchronization
- **API Integration**: Mock data integration
- **Error Scenarios**: Error boundary testing

## 🎨 Styling & Theming

### Design System
- **Colors**: Blue primary, green success, red error, gray neutral
- **Typography**: Inter font family with proper hierarchy
- **Spacing**: Consistent 4px grid system
- **Shadows**: Layered shadows for depth
- **Border Radius**: Consistent rounded corners

### Dark Mode
- **Theme Provider**: next-themes integration
- **CSS Variables**: Dynamic color switching
- **Component Adaptation**: All components support both themes
- **Toggle**: Header theme switcher

## 📊 Analytics & Charts

### Chart Types
1. **Average Rating**: Area chart showing rating trends over time
2. **Category Ratings**: Horizontal bar chart for category performance
3. **Review Sources**: Progress bars showing source distribution

### Data Visualization
- **Recharts Library**: Professional chart components
- **Responsive Design**: Charts adapt to container size
- **Interactive Tooltips**: Hover for detailed information
- **Gradient Styling**: Beautiful visual appeal

## 🔒 Security & Performance

### Security Features
- **Input Validation**: All API inputs validated
- **Error Handling**: Graceful error states
- **Type Safety**: Full TypeScript implementation
- **XSS Protection**: Sanitized user inputs

### Performance Optimizations
- **React Query Caching**: Prevents unnecessary API calls
- **Code Splitting**: Route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Optimization**: Tree shaking and purging

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Component Structure**: Reusable and maintainable

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Next.js Team**: For the amazing framework
- **React Query Team**: For excellent state management
- **Tailwind CSS**: For the utility-first CSS framework
- **Recharts**: For beautiful chart components
- **Lucide**: For the icon library

## 📞 Support

For support, questions, or feature requests:
- **Issues**: Create an issue on GitHub
- **Documentation**: Check the `/docs` folder
- **API Testing**: Use the built-in test suite at `/api-test-comprehensive`

---

**Built with ❤️ using Next.js, React Query, and TypeScript**