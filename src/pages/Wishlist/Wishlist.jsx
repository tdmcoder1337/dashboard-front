import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';
import { FaArrowLeft, FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import './Wishlist.css';

export default function Wishlist() {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t, locale } = useLanguage();
  const navigate = useNavigate();
  const priceFormatter = new Intl.NumberFormat(locale === 'ru-RU' ? 'ru-RU' : 'uz-UZ');

  if (wishlistItems.length === 0) {
    return (
      <div className="wishlist-page empty">
        <button className="back-btn" onClick={() => navigate('/products')}><FaArrowLeft /> {t('wishlist.back')}</button>
        <div className="empty-state">
          <FaHeart className="empty-icon" />
          <h2>{t('wishlist.emptyTitle')}</h2>
          <p>{t('wishlist.emptyText')}</p>
          <button className="continue-shopping" onClick={() => navigate('/products')}>{t('wishlist.viewProducts')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <button className="back-btn" onClick={() => navigate('/products')}><FaArrowLeft /> {t('wishlist.back')}</button>
        <h1>{t('wishlist.title')}</h1>
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
              <p className="price">{priceFormatter.format(item.price || item.narxi)} {t('wishlist.currency')}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => {
                  addToCart(item);
                  toggleWishlist(item);
                }}
              >
                <FaShoppingCart /> {t('wishlist.moveToCart')}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
