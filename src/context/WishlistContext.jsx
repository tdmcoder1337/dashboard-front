import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState(() => {
    const savedWishlist = localStorage.getItem('wishlistItems');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    const productId = product.id || product._id;
    setWishlistItems((prevItems) => {
      const exists = prevItems.find((item) => item.id === productId || item._id === productId);
      if (exists) {
        return prevItems.filter((item) => item.id !== productId && item._id !== productId);
      }
      return [...prevItems, { ...product, id: productId }];
    });
  };

  const isInWishlist = (id) => {
    return wishlistItems.some((item) => item.id === id || item._id === id);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
