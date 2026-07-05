import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import './Cart.css';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { t, locale } = useLanguage();
  const navigate = useNavigate();
  const priceFormatter = new Intl.NumberFormat(locale === 'ru-RU' ? 'ru-RU' : 'uz-UZ');

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    alert(t('cart.checkoutSuccess'));
    clearCart();
    navigate('/products');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty">
        <button className="back-btn" onClick={() => navigate('/products')}><FaArrowLeft /> {t('cart.back')}</button>
        <div className="empty-state">
          <FaShoppingCart className="empty-icon" />
          <h2>{t('cart.emptyTitle')}</h2>
          <p>{t('cart.emptyText')}</p>
          <button className="continue-shopping" onClick={() => navigate('/products')}>{t('cart.continueShopping')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate('/products')}><FaArrowLeft /> {t('cart.back')}</button>
        <h1>{t('cart.title')}</h1>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.image || item.images?.[0]} alt={item.title || item.nomi} />
              <div className="cart-item-details">
                <h3>{item.title || item.nomi}</h3>
                <p>{priceFormatter.format(item.price || item.narxi)} {t('cart.currency')}</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-total">
                {priceFormatter.format((item.price || item.narxi) * item.quantity)} {t('cart.currency')}
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>{t('cart.summaryTitle')}</h2>
          <div className="summary-row">
            <span>{t('cart.products')}</span>
            <span>{priceFormatter.format(cartTotal)} {t('cart.currency')}</span>
          </div>
          <div className="summary-row">
            <span>{t('cart.delivery')}</span>
            <span>{t('cart.deliveryFree')}</span>
          </div>
          <div className="summary-row total">
            <span>{t('cart.total')}</span>
            <span>{priceFormatter.format(cartTotal)} {t('cart.currency')}</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            {t('cart.checkout')}
          </button>
        </div>
      </div>
    </div>
  );
}
