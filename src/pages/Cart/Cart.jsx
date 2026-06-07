import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { FaTrash, FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import './Cart.css';

const priceFormatter = new Intl.NumberFormat('uz-UZ');

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    
    // Proceed with checkout
    alert("Buyurtma muvaffaqiyatli rasmiylashtirildi!");
    clearCart();
    navigate('/products');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty">
        <button className="back-btn" onClick={() => navigate('/products')}><FaArrowLeft /> Orqaga</button>
        <div className="empty-state">
          <FaShoppingCart className="empty-icon" />
          <h2>Savatcha bo'sh</h2>
          <p>Siz hali hech narsa qo'shmadingiz</p>
          <button className="continue-shopping" onClick={() => navigate('/products')}>Xarid qilishda davom etish</button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <button className="back-btn" onClick={() => navigate('/products')}><FaArrowLeft /> Orqaga</button>
        <h1>Savatcha</h1>
      </div>
      
      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <img src={item.image || item.images?.[0]} alt={item.title || item.nomi} />
              <div className="cart-item-details">
                <h3>{item.title || item.nomi}</h3>
                <p>{priceFormatter.format(item.price || item.narxi)} so'm</p>
              </div>
              <div className="quantity-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-total">
                {priceFormatter.format((item.price || item.narxi) * item.quantity)} so'm
              </div>
              <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2>Buyurtma xulosasi</h2>
          <div className="summary-row">
            <span>Mahsulotlar:</span>
            <span>{priceFormatter.format(cartTotal)} so'm</span>
          </div>
          <div className="summary-row">
            <span>Yetkazib berish:</span>
            <span>Bepul</span>
          </div>
          <div className="summary-row total">
            <span>Jami:</span>
            <span>{priceFormatter.format(cartTotal)} so'm</span>
          </div>
          <button className="checkout-btn" onClick={handleCheckout}>
            Rasmiylashtirish (Auth Check)
          </button>
        </div>
      </div>
    </div>
  );
}
