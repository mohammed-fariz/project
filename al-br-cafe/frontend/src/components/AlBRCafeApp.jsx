import React, { useState, useEffect } from 'react';
import { MapPin, Phone, ShoppingCart, Plus, Minus, ArrowLeft, Coffee, Utensils } from 'lucide-react';

// Menu Data based on your images
const menuData = {
  sandwiches: [
    { id: 'corn-sandwich', name: 'Corn Sandwich', price: 50, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'veg-sandwich', name: 'Veg Sandwich', price: 50, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'paneer-sandwich', name: 'Paneer Sandwich', price: 60, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'chicken-sandwich', name: 'Chicken Sandwich', price: 60, category: 'non-veg', image: '/api/placeholder/200/150' },
    { id: 'crispy-chicken-sandwich', name: 'Crispy Chicken Sandwich', price: 70, category: 'non-veg', image: '/api/placeholder/200/150' }
  ],
  fries: [
    { id: 'french-fries', name: 'French Fries', price: 50, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'malasa-peri-fries', name: 'Malasa Peri Peri Fries', price: 60, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'salted-fries', name: 'Salted Fries', price: 50, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'special-cheese-fries', name: 'Special Cheese Fries', price: 70, category: 'veg', image: '/api/placeholder/200/150' }
  ],
  shawarma: [
    { id: 'shawarma', name: 'Shawarma', price: 60, category: 'non-veg', image: '/api/placeholder/200/150' },
    { id: 'br-special-shawarma', name: 'B R Special Shawarma', price: 80, category: 'non-veg', image: '/api/placeholder/200/150' },
    { id: 'plater-shawarma', name: 'Plater Shawarma', price: 100, category: 'non-veg', image: '/api/placeholder/200/150' }
  ],
  tikka: [
    { id: 'malai-tikka', name: 'Malai Tikka', price: 140, category: 'non-veg', image: '/api/placeholder/200/150' },
    { id: 'chicken-tikka', name: 'Chicken Tikka', price: 140, category: 'non-veg', image: '/api/placeholder/200/150' },
    { id: 'hariyali-tikka', name: 'Hariyali Tikka', price: 140, category: 'non-veg', image: '/api/placeholder/200/150' },
    { id: 'rashmi-tikka', name: 'Rashmi Tikka', price: 140, category: 'non-veg', image: '/api/placeholder/200/150' },
    { id: 'tangdi-kabab', name: 'Tangdi Kabab', price: 120, category: 'non-veg', image: '/api/placeholder/200/150' }
  ],
  pizza: [
    { id: 'veg-pizza', name: 'Veg Pizza', price: 150, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'corn-pizza', name: 'Corn Pizza', price: 180, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'paneer-pizza', name: 'Paneer Pizza', price: 180, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'chicken-pizza', name: 'Chicken Pizza', price: 200, category: 'non-veg', image: '/api/placeholder/200/150' }
  ],
  burgers: [
    { id: 'veg-burger', name: 'Veg Burger', price: 50, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'paneer-burger', name: 'Paneer Burger', price: 60, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'spl-paneer-burger', name: 'SPL Paneer Burger', price: 80, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'chicken-burger', name: 'Chicken Burger', price: 60, category: 'non-veg', image: '/api/placeholder/200/150' }
  ],
  beverages: [
    { id: 'cold-coffee', name: 'Cold Coffee', price: 60, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'kit-kat-coffee', name: 'Kit Kat Coffee', price: 60, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'ocean-blue-mojito', name: 'Ocean Blue Mojito', price: 60, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'chocolate-shake', name: 'Chocolate Shake', price: 60, category: 'veg', image: '/api/placeholder/200/150' }
  ],
  icecream: [
    { id: 'vanilla-ice', name: 'Vanilla Ice', price: 60, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'mango-ice', name: 'Mango Ice', price: 60, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'strawberry-ice', name: 'Strawberry Ice', price: 60, category: 'veg', image: '/api/placeholder/200/150' },
    { id: 'chocolate-ice', name: 'Chocolate Ice', price: 60, category: 'veg', image: '/api/placeholder/200/150' }
  ]
};

const AlBRCafeApp = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('sandwiches');
  const [cart, setCart] = useState({});
  const [userLocation, setUserLocation] = useState(null);

  // Phone number formatting function
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // If it starts with 91, remove it as we'll add +91 prefix
    let phoneDigits = cleaned;
    if (cleaned.startsWith('91') && cleaned.length > 2) {
      phoneDigits = cleaned.substring(2);
    }
    
    // Limit to 10 digits
    return phoneDigits.slice(0, 10);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  // Login Page Component
  const LoginPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Coffee className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">AL BR CAFE</h1>
          <p className="text-gray-600">& RESTAURANT</p>
        </div>
        
        {!otp ? (
          <div>
            <h2 className="text-xl font-semibold mb-6 text-center">Enter Phone Number</h2>
            <div className="mb-6">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                  +91
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full p-4 pl-16 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-lg"
                  maxLength="10"
                  autoComplete="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                We'll send you an OTP to verify your number
              </p>
            </div>
            <button
              onClick={() => setOtp('1234')}
              disabled={phoneNumber.length !== 10}
              className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {phoneNumber.length === 10 ? 'Send OTP' : `Enter ${10 - phoneNumber.length} more digits`}
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Enter OTP</h2>
            <p className="text-center text-gray-600 mb-6">
              We've sent a 4-digit OTP to <br />
              <span className="font-semibold">+91 {phoneNumber}</span>
            </p>
            <div className="mb-6">
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                  setOtp(value);
                }}
                placeholder="Enter 4-digit OTP"
                className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-center text-2xl tracking-widest"
                maxLength="4"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            <button
              onClick={() => setCurrentPage('address')}
              disabled={otp.length !== 4}
              className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {otp.length === 4 ? 'Verify OTP' : `Enter ${4 - otp.length} more digits`}
            </button>
            <button
              onClick={() => {
                setOtp('');
                setPhoneNumber('');
              }}
              className="w-full mt-3 text-orange-500 py-2 text-sm hover:text-orange-600 transition-colors"
            >
              Change Phone Number
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Address Page Component
  const AddressPage = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <MapPin className="mr-2 text-orange-500" />
            Delivery Address
          </h2>
          
          <div className="mb-4">
            <button
              onClick={() => {
                navigator.geolocation.getCurrentPosition((position) => {
                  setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                  });
                  setAddress('Current Location Detected');
                });
              }}
              className="w-full bg-blue-500 text-white py-3 rounded-lg mb-4 hover:bg-blue-600 transition-colors"
            >
              Use Current Location
            </button>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your complete address"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              rows="3"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Landmark *</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Enter landmark (required)"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>
          
          <button
            onClick={() => setCurrentPage('menu')}
            disabled={!address || !landmark}
            className="w-full bg-orange-500 text-white py-4 rounded-lg font-semibold hover:bg-orange-600 disabled:bg-gray-300 transition-colors"
          >
            Continue to Menu
          </button>
        </div>
      </div>
    </div>
  );

  // Menu Page Component
  const MenuPage = () => {
    const categories = [
      { key: 'sandwiches', label: 'Sandwiches', icon: '🥪' },
      { key: 'fries', label: 'French Fries', icon: '🍟' },
      { key: 'shawarma', label: 'Shawarma', icon: '🌯' },
      { key: 'tikka', label: 'Chicken Tikka', icon: '🍗' },
      { key: 'pizza', label: 'Pizza', icon: '🍕' },
      { key: 'burgers', label: 'Burgers', icon: '🍔' },
      { key: 'beverages', label: 'Beverages', icon: '🥤' },
      { key: 'icecream', label: 'Ice Cream', icon: '🍦' }
    ];

    const updateCartQuantity = (itemId, change) => {
      setCart(prev => ({
        ...prev,
        [itemId]: Math.max(0, (prev[itemId] || 0) + change)
      }));
    };

    const getTotalItems = () => {
      return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
    };

    const getTotalPrice = () => {
      let total = 0;
      Object.entries(cart).forEach(([itemId, qty]) => {
        const item = Object.values(menuData).flat().find(i => i.id === itemId);
        if (item) total += item.price * qty;
      });
      return total;
    };

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm sticky top-0 z-40">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Coffee className="w-8 h-8 text-orange-500 mr-3" />
              <div>
                <h1 className="text-lg font-bold">AL BR CAFE</h1>
                <p className="text-xs text-gray-600">& RESTAURANT</p>
              </div>
            </div>
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-orange-500" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white shadow-sm sticky top-16 z-30">
          <div className="flex overflow-x-auto p-2 space-x-2">
            {categories.map(category => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.key
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.icon} {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuData[selectedCategory]?.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold text-gray-800 flex-1">{item.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${
                      item.category === 'veg' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <p className="text-lg font-bold text-orange-600 mb-3">₹{item.price}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-orange-500 rounded-lg">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="p-2 text-orange-500 hover:bg-orange-50"
                        disabled={!cart[item.id]}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-semibold">
                        {cart[item.id] || 0}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="p-2 text-orange-500 hover:bg-orange-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Summary */}
        {getTotalItems() > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-orange-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold">{getTotalItems()} items</p>
                <p className="text-sm">₹{getTotalPrice()}</p>
              </div>
              <button className="bg-white text-orange-500 px-6 py-2 rounded-lg font-semibold">
                View Cart
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Main App Render
  switch (currentPage) {
    case 'login':
      return <LoginPage />;
    case 'address':
      return <AddressPage />;
    case 'menu':
      return <MenuPage />;
    default:
      return <LoginPage />;
  }
};

export default AlBRCafeApp;