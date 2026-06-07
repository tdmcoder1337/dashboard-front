import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { FaArrowLeft, FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import './Wishlist.css';

const priceFormatter = new Intl.NumberFormat('uz-UZ');

export default function Wishlist() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page empty">
        <button className="back-btn" onClick={() => navigate('/products')}><FaArrowLeft /> Orqaga</button>
        <div className="empty-state">
          <FaHeart className="empty-icon" />
          <h2>Sevimlilar ro'yxati bo'sh</h2>
          <p>Siz hali hech qanday mahsulotni sevimlilarga qo'shmadingiz</p>
          <button className="continue-shopping" onClick={() => navigate('/products')}>Mahsulotlarni ko'rish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <button className="back-btn" onClick={() => navigate('/products')}><FaArrowLeft /> Orqaga</button>
        <h1>Sevimlilar</h1>
      </div>
      
      <div className="wishlist-grid">
        {wishlistItems.map(item => (
          <article className="wishlist-card" key={item.id}>
            <div className="wishlist-card__image">
              <img src={item.image || item.images?.[0] || item.rasm} alt={item.title || item.nomi} />
              <button className="remove-btn" onClick={() => toggleWishlist(item)}>
                <FaTrash />
              </button>
            </div>
            <div className="wishlist-card__content">
              <h3>{item.title || item.nomi}</h3>
              <p className="price">{priceFormatter.format(item.price || item.narxi)} so'm</p>
              <button 
                className="add-to-cart-btn" 
                onClick={() => {
                  addToCart(item);
                  toggleWishlist(item); // remove from wishlist after adding to cart
                }}
              >
                <FaShoppingCart /> Savatga o'tkazish
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
