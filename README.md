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

For questions or support, please contact the development team.)


## Troubleshooting & Notes

### If things break during setup:

1. **Getting dependency errors on `npm i`?**
   If npm throws a fit about peer dependencies, just bypass it with the legacy flag. It happens because of some mismatched package versions:
   ```bash
   npm install --legacy-peer-deps

   2. **Ports already in use?**
Sometimes Vite gets stubborn and throws a "port 5173 is already in use" error.
If you see this, just kill the terminal process or run `npx kill-port 5173`.
Alternatively, you can just let Vite pick the next available port, but watch out because it might mess with your CORS setup.

3. **CORS issues during local dev**
If the frontend refuses to talk to the backend, double-check your `.env` file first.
Make sure `VITE_API_URL` matches exactly where your local server is running.
Watch out for trailing slashes! They break the axios interceptors right now.

### Known Quirks & Bugs
- The mobile navigation menu sometimes jitters a bit on iOS Safari.
- Dark mode toggle might flash white for a split second on initial page load.
- Uploading a profile picture larger than 5MB fails silently (we really need to add error toasts here).

### What's Next
Honestly, the main priority right now is getting our test coverage up.
We also want to eventually migrate the messy state management over to Redux Toolkit.
That's a pretty massive refactor though, so it's sitting on the backburner for now.
Drop a message in the Discord channel if you get completely stuck setting things up!

---

## ⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables. Create a `.env` file in the root directory and add the following:

`VITE_API_URL` - The base URL for the backend API (e.g., `http://localhost:5000/api`)
`VITE_MAPS_API_KEY` - Google Maps or Mapbox API key for live delivery tracking
`VITE_STRIPE_PUBLIC_KEY` - Public key for Stripe payment gateway integration
`VITE_IMAGE_BUCKET_URL` - URL for the cloud storage bucket hosting product images

---

## 🔌 API Integration Mockup

The frontend communicates with a RESTful backend API. Below are the primary endpoints expected by the frontend services:

### Auth Endpoints
- `POST /api/auth/register` - Register a new user (Admin, Customer, Delivery)
- `POST /api/auth/login` - Authenticate user and receive JWT
- `GET /api/auth/profile` - Get current user profile details using Bearer token

### Customer Endpoints
- `GET /api/products` - Fetch all available food items and categories
- `GET /api/products/:id` - Fetch single food item details and reviews
- `POST /api/orders` - Place a new food order with cart data
- `GET /api/orders/my-orders` - Fetch the authenticated user's order history

### Delivery Partner Endpoints
- `GET /api/delivery/assigned` - Get orders currently assigned to the partner
- `PUT /api/delivery/status/:orderId` - Update delivery status (e.g., Picked Up, Delivered)

### Admin Endpoints
- `POST /api/admin/products` - Add a new product (Requires Admin Role)
- `PUT /api/admin/products/:id` - Update an existing product
- `DELETE /api/admin/products/:id` - Remove a product from the catalog
- `GET /api/admin/dashboard-stats` - Get overall platform revenue and user statistics

---

## 🧠 State Management Architecture

We utilize React's Context API combined with `useReducer` for complex state management. This avoids prop drilling while maintaining a lightweight bundle size.

### StoreContext (`/src/context/StoreContext.jsx`)
Handles the global e-commerce state:
- **Cart State**: Tracks items, quantities, subtotal, and tax calculations.
- **Product Catalog**: Caches the list of fetched products to minimize redundant API calls.
- **Search & Filters**: Maintains active search queries, price ranges, and category filters.

### AuthContext (`/src/context/AuthContext.jsx`)
Manages session data and role verification:
#### 👨‍💼 Admin Features
- Comprehensive dashboard with real-time sales and order metrics
- Manage restaurant inventory (add, edit, or delete food items)
- Oversee delivery partner assignments and active delivery routes
- View and resolve customer support tickets and refunds

---

## 🛠️ Tech Stack

**Frontend Framework & Styling:**
- **React.js (Vite)** - For a fast, component-driven user interface
- **Tailwind CSS** - For responsive, utility-first styling and animations
- **React Router DOM** - For seamless client-side navigation and protected routes

**State Management & Integration:**
- **Context API** - For lightweight global state (Auth & Cart)
- **Axios** - For intercepting and handling backend API requests
- **Stripe.js** - For secure, client-side payment tokenization

---

## 📂 Folder Structure

```text
quickbite-frontend/
├── public/            # Static assets (favicons, web manifest)
├── src/
│   ├── assets/        # Local images, icons, and global stylesheets
│   ├── components/    # Reusable UI components (Buttons, Cards, Modals)
│   ├── context/       # Global state providers (AuthContext, StoreContext)
│   ├── pages/         # Route-level components (Home, Cart, AdminDashboard)
│   ├── services/      # API integration and Axios configuration
│   ├── utils/         # Helper functions, formatters, and constants
│   ├── App.jsx        # Root application component with route definitions
│   └── main.jsx       # React application entry point
├── .env.example       # Template for required environment variables
├── package.json       # Project dependencies and NPM scripts
└── vite.config.js     # Vite bundler and plugin configuration



