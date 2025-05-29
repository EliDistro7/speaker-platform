
import { useLanguage } from '@/contexts/language';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Plus, Minus, Filter, Search, BookOpen, Package, Heart, Eye, Zap, X } from 'lucide-react';
import {sampleBooks} from './data';
import {translations} from './data';


import CartModal from './CartModal';

export const BooksShop = ({ onCartUpdate }) => { // Add onCartUpdate prop
  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [books] = useState(sampleBooks);
  const [filteredBooks, setFilteredBooks] = useState(sampleBooks);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState('all');
  const [showToast, setShowToast] = useState(null);

  const categories = ['all', ...new Set(books.map(book => book.category))];

  // Toast notification function
  const showToastMessage = (message) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  // Update cart count in parent whenever cart changes
  useEffect(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (onCartUpdate) {
      onCartUpdate(totalItems);
    }
  }, [cart, onCartUpdate]);

  // Filter books based on category, search, and view mode
  useEffect(() => {
    let filtered = books;
    
    if (viewMode === 'featured') {
      filtered = filtered.filter(book => book.featured);
    } else if (viewMode === 'new') {
      filtered = filtered.filter(book => book.newArrival);
    } else if (viewMode === 'bestsellers') {
      filtered = filtered.filter(book => book.bestseller);
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBooks(filtered);
  }, [selectedCategory, searchTerm, books, viewMode]);

  const addToCart = (book, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === book.id);
      if (existingItem) {
        showToastMessage(`${book.title} ${t.addedToCart}`);
        return prevCart.map(item =>
          item.id === book.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      showToastMessage(`${book.title} ${t.addedToCart}`);
      return [...prevCart, { ...book, quantity }];
    });
  };

  const toggleWishlist = (book) => {
    setWishlist(prev => {
      const isInWishlist = prev.find(item => item.id === book.id);
      if (isInWishlist) {
        showToastMessage('Removed from wishlist');
        return prev.filter(item => item.id !== book.id);
      } else {
        showToastMessage('Added to wishlist');
        return [...prev, book];
      }
    });
  };

  const updateCartQuantity = (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== bookId));
      showToastMessage(t.removeFromCart);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === bookId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleCheckout = () => {
    showToastMessage(t.orderSuccess);
    setCart([]); // This will trigger the useEffect to update parent with 0 items
    setShowCart(false);
  };

  // Rest of your component remains the same...
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg animate-bounce">
          {showToast}
        </div>
      )}

      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-xl border-b border-neutral-200/60 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {t.shop}
              </h1>
              <p className="text-neutral-600 mt-1 text-lg">{t.continueReading}</p>
            </div>
            
            {/* Enhanced Cart Button */}
            <button
              onClick={() => setShowCart(true)}
              className="relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>{t.cart}</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          {/* Enhanced View Mode Tabs */}
          <div className="flex flex-wrap gap-2 mt-6 mb-4">
            {[
              { key: 'all', label: t.allCategories, icon: BookOpen },
              { key: 'featured', label: t.featuredBooks, icon: Star },
              { key: 'new', label: t.newArrivals, icon: Zap },
              { key: 'bestsellers', label: t.bestsellers, icon: Eye }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setViewMode(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105 ${
                  viewMode === key
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Enhanced Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
              <input
                type="text"
                placeholder={t.searchBooks}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-neutral-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-4 rounded-2xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 bg-white/80 backdrop-blur-sm"
              >
                <option value="all">{t.allCategories}</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Books Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group relative hover:-translate-y-2 hover:scale-102"
            >
              {/* Enhanced Book Cover */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={book.image} 
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay with quick actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                  <button
                    onClick={() => toggleWishlist(book)}
                    className={`p-3 rounded-full transition-colors hover:scale-110 ${
                      wishlist.find(item => item.id === book.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-3 bg-white/20 text-white rounded-full hover:bg-white/30 transition-colors hover:scale-110">
                    <Eye className="h-5 w-5" />
                  </button>
                </div>

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {!book.inStock && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {t.outOfStock}
                    </span>
                  )}
                  {book.originalPrice > book.price && (
                    <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      SALE
                    </span>
                  )}
                  {book.featured && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      FEATURED
                    </span>
                  )}
                  {book.newArrival && (
                    <span className="bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      NEW
                    </span>
                  )}
                  {book.bestseller && (
                    <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      BESTSELLER
                    </span>
                  )}
                </div>
              </div>

              {/* Enhanced Book Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-neutral-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-neutral-600 mb-2">{t.author}: {book.author}</p>
                  <span className="inline-block bg-gradient-to-r from-blue-100 to-indigo-100 text-indigo-800 text-sm font-semibold px-3 py-1 rounded-full">
                    {book.category}
                  </span>
                </div>

                {/* Enhanced Rating and Stats */}
                <div className="flex items-center justify-between text-sm text-neutral-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{book.rating}</span>
                    <span>({book.reviews} {t.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{book.pages} {t.pages}</span>
                  </div>
                </div>

                <p className="text-neutral-600 line-clamp-3 mb-4 leading-relaxed">
                  {book.description}
                </p>

                {/* Enhanced Price Display */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    TZS {book.price}
                  </span>
                  {book.originalPrice > book.price && (
                    <span className="text-neutral-500 line-through text-lg">
                      TZS {book.originalPrice}
                    </span>
                  )}
                  {book.originalPrice > book.price && (
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-bold">
                      -{Math.round((1 - book.price / book.originalPrice) * 100)}%
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6">
                  <Package className="h-4 w-4 text-neutral-500" />
                  <span className={`text-sm font-medium ${book.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {book.inStock ? `${t.inStock} (${book.stockCount})` : t.outOfStock}
                  </span>
                </div>

                {/* Enhanced Add to Cart Button */}
                <button
                  onClick={() => book.inStock && addToCart(book)}
                  disabled={!book.inStock}
                  className={`w-full py-4 px-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                    book.inStock
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-102'
                      : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {book.inStock ? t.addToCart : t.outOfStock}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Empty State */}
        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-20 w-20 text-neutral-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-neutral-700 mb-2">No books found</h3>
            <p className="text-neutral-600 text-lg">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Cart Modal Component */}
      <CartModal
        showCart={showCart}
        setShowCart={setShowCart}
        cart={cart}
        updateCartQuantity={updateCartQuantity}
        handleCheckout={handleCheckout}
        translations={translations}
      />
    </div>
  );
};

