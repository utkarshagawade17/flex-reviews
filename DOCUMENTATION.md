# Flex Reviews Dashboard - Technical Documentation

## 🏗️ Architecture Overview

### System Components
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **API Layer**: Next.js API routes with comprehensive filtering
- **Database**: Neon PostgreSQL with Prisma ORM
- **Charts**: Recharts for analytics visualization

### Data Flow
1. **Review Ingestion**: Hostaway API → Normalization → Database
2. **Manager Dashboard**: Database → Filtering → UI Display
3. **Public Pages**: Database → Approved Reviews → Public Display
4. **Analytics**: Database → Aggregation → Charts

## 🗄️ Database Schema

### Core Tables
```sql
-- Review Approvals
CREATE TABLE ReviewApproval (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  reviewId INTEGER NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  selectedForWeb BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(source, reviewId)
);

-- Tags
CREATE TABLE Tag (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  color VARCHAR(20) DEFAULT 'bg-gray-800',
  kind VARCHAR(20) DEFAULT 'custom',
  createdAt TIMESTAMP DEFAULT NOW()
);

-- Review Tags
CREATE TABLE ReviewTag (
  id SERIAL PRIMARY KEY,
  reviewApprovalId INTEGER REFERENCES ReviewApproval(id),
  tagId INTEGER REFERENCES Tag(id),
  createdAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(reviewApprovalId, tagId)
);
```

## 🔌 API Design

### RESTful Endpoints
- `GET /api/reviews/hostaway` - List reviews with filters
- `PATCH /api/reviews/hostaway` - Update review status
- `GET /api/reviews/approved` - Get approved reviews for public
- `GET /api/reviews/trends` - Analytics data
- `GET /api/reviews/tags` - List all tags
- `POST /api/reviews/tags` - Create tag
- `POST /api/reviews/:source/:id/tags` - Assign/unassign tags

### Filtering System
```typescript
interface ReviewFilters {
  status?: string;
  rating?: number;
  channel?: string;
  sentiment?: string;
  listing?: string;
  tags?: string[];
  search?: string;
  timeWindow?: string;
  sortBy?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating';
}
```

## 📊 Analytics Implementation

### Trends Data
- **Monthly Ratings**: 12 months of average ratings with line chart
- **Category Breakdown**: Average rating per category with bar chart
- **Channel Mix**: Review distribution with pie chart

### Chart Components
- **Line Chart**: Monthly rating trends
- **Bar Chart**: Category performance
- **Pie Chart**: Channel distribution

## 🎨 UI/UX Design

### Design System
- **Colors**: Primary blue (#2563eb), gray scale, status colors
- **Typography**: Consistent heading and body text styles
- **Components**: Reusable card, button, and form patterns

### Responsive Design
- **Mobile**: Collapsible sidebar, modal detail panel
- **Desktop**: Split view layout with side-by-side panels
- **Touch**: 44px minimum touch targets

## 🏷️ Tag System

### Tag Types
- **System Tags**: Predefined (wifi, cleanliness, noise, location, etc.)
- **Custom Tags**: User-created for specific needs
- **Color Coding**: Consistent visual representation

### Tag Management
- **Assignment**: Multi-select tag assignment to reviews
- **Filtering**: Filter reviews by selected tags
- **Persistence**: Database storage with unique constraints

## 🔍 Search & Filtering

### Text Search
- **Multi-field**: Guest name, review text, listing name
- **Case-insensitive**: Lowercase matching
- **Real-time**: Debounced search input

### Advanced Filters
- **Rating**: Exact star rating match
- **Time Window**: Last 7/30/90 days or all time
- **Sorting**: Newest, oldest, highest/lowest rating
- **Combination**: All filters work together

## 📱 Responsive Implementation

### Mobile Adaptations
- **Sidebar**: Overlay on mobile with backdrop
- **Detail Panel**: Full-screen modal
- **Charts**: Responsive sizing with mobile tooltips
- **Navigation**: Collapsible menu

### Desktop Features
- **Split View**: Side-by-side layout
- **Keyboard Navigation**: Full keyboard support
- **Hover States**: Rich interactions
- **Drag & Drop**: Tag assignment

## 🚀 Performance Optimization

### Code Splitting
- **Dynamic Imports**: Lazy load heavy components
- **Route-based**: Split by page routes
- **Component-based**: Split large components

### Memoization
- **useMemo**: Expensive calculations
- **useCallback**: Event handlers
- **React.memo**: Component re-renders

### API Optimization
- **Debouncing**: Search input debouncing
- **Caching**: Response caching strategies
- **Pagination**: Large dataset handling

## 🔒 Security

### Input Validation
- **Sanitization**: XSS prevention
- **Type Checking**: TypeScript strict mode
- **Parameter Validation**: API input validation

### Database Security
- **SQL Injection**: Parameterized queries
- **Access Control**: Row-level security
- **Encryption**: Sensitive data encryption

## 🧪 Testing Strategy

### Unit Tests
- **Components**: React Testing Library
- **Utils**: Jest unit tests
- **API**: API route testing

### Integration Tests
- **User Flows**: End-to-end workflows
- **API Integration**: Database operations
- **Error Handling**: Error scenarios

## 🚀 Deployment

### Vercel Deployment
1. **Repository**: GitHub integration
2. **Environment**: Production environment variables
3. **Database**: Neon production database
4. **Monitoring**: Error tracking and analytics

### Environment Variables
```env
DATABASE_URL="postgresql://..."
GOOGLE_PLACES_API_KEY="AIza..."
HOSTAWAY_API_KEY="your_production_key"
```

## 🎯 Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: ML insights
- **Bulk Operations**: Enhanced bulk editing
- **Export**: CSV/PDF export
- **Mobile App**: React Native app

### Technical Improvements
- **Caching**: Redis layer
- **Search**: Elasticsearch
- **Microservices**: Service architecture
- **GraphQL**: Flexible API
- **PWA**: Progressive Web App

---

**Version**: 1.0.0  
**Last Updated**: December 2023