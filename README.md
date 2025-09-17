# QuickBite - Unified Food Delivery Application

A comprehensive food delivery application with role-based authentication supporting three user types: Customers, Delivery Partners, and Administrators.

## Features

### 🔐 Authentication System
- **Role-based login and signup**
- **Three user types**: Customer, Delivery Partner, Admin
- **Protected routes** based on user roles
- **Persistent authentication** using localStorage

### 👥 User Roles

#### 🍕 Customer Features
- Browse food items and restaurants
- Search functionality with real-time results
- Add items to cart with quantity management
- Place orders with delivery details
- Track order history
- View about and contact information

#### 🚚 Delivery Partner Features
- Dashboard with delivery statistics
- View assigned orders
- Update order status (Picked up, Delivered)
- Customer contact information
- Delivery tracking and management

#### 👨‍💼 Admin Features
- Product management (Add, Edit, View, Delete)
- Order management and tracking
- Customer management
- Delivery partner management
- Complete admin dashboard

## Technology Stack

- **Frontend**: React 19.1.1 with Vite
- **Routing**: React Router DOM
- **Styling**: CSS3 with modern layouts
- **State Management**: React Context API
- **Notifications**: React Toastify
- **HTTP Client**: Axios

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QuickBite-Unified
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## Demo Credentials

### Admin Access
- **Email**: admin@quickbite.com
- **Password**: admin123

### Delivery Partner Access
- **Email**: delivery@quickbite.com
- **Password**: delivery123

### Customer Access
- **Email**: user@quickbite.com
- **Password**: user123

## Project Structure

```
QuickBite-Unified/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/          # Images and static files
│   ├── components/
│   │   ├── Auth/        # Login/Signup components
│   │   └── User/        # Customer-facing components
│   ├── context/
│   │   ├── AuthContext.jsx    # Authentication state
│   │   └── StoreContext.jsx   # Shopping cart state
│   ├── layouts/
│   │   ├── UserLayout.jsx     # Customer layout
│   │   ├── AdminLayout.jsx    # Admin layout
│   │   └── DeliveryLayout.jsx # Delivery layout
│   ├── pages/
│   │   ├── User/        # Customer pages
│   │   ├── Admin/       # Admin pages
│   │   └── Delivery/    # Delivery partner pages
│   ├── App.jsx          # Main app component with routing
│   ├── App.css          # Global styles
│   ├── index.css        # Base styles
│   └── main.jsx         # Entry point
├── package.json
├── vite.config.js
└── README.md
```

## Routing Structure

### Public Routes
- `/login` - Login page
- `/signup` - Registration page

### Customer Routes (`/user/*`)
- `/user/` - Home page with food catalog
- `/user/cart` - Shopping cart
- `/user/placeorder` - Order placement
- `/user/myorders` - Order history

### Admin Routes (`/admin/*`)
- `/admin/` - Admin dashboard
- `/admin/add-product` - Add new products
- `/admin/view-products` - Manage products
- `/admin/view-orders` - Order management
- `/admin/view-customers` - Customer management
- `/admin/view-delivery-partners` - Delivery partner management

### Delivery Routes (`/delivery/*`)
- `/delivery/` - Delivery dashboard
- `/delivery/assigned-orders` - Assigned delivery orders

## Key Features

### Authentication Context
- Manages user login/logout state
- Role-based access control
- Persistent sessions

### Store Context
- Shopping cart management
- Product catalog
- Order processing

### Responsive Design
- Mobile-friendly layouts
- Adaptive navigation
- Touch-optimized interfaces

### Role-Based UI
- Different navigation menus per role
- Role-specific dashboards
- Protected components

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features
1. Create components in appropriate directories
2. Add routes in `App.jsx`
3. Update context if needed
4. Test with different user roles

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.
