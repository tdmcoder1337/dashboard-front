import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import {
  FaAppleAlt,
  FaArrowLeft,
  FaBolt,
  FaBoxOpen,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCommentAlt,
  FaHeart,
  FaLeaf,
  FaListUl,
  FaMapMarkerAlt,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
  FaThLarge,
  FaWeightHanging,
} from 'react-icons/fa'
import { productsApi } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
import './ProductDetails.css'
import './products.css'
import Olma from '../../assets/products-image/Olma.png'
import Banan from '../../assets/products-image/Banan.png'
import Pepsi from '../../assets/products-image/Pepsi.webp'
import Cola from '../../assets/products-image/Cola.png'
import Yog from '../../assets/products-image/Yog.png'
import Sut from '../../assets/products-image/sut.png'
import Non from '../../assets/products-image/non.png'
import Kartoshka from '../../assets/products-image/Kartoshka.png'
import Guruch from '../../assets/products-image/Guruch.png'
import Suv from '../../assets/products-image/Suv.png'

const priceFormatter = new Intl.NumberFormat('uz-UZ')

const normalizeName = (value = '') => value.trim().toLowerCase()

const productImages = {
  olma: Olma,
  banan: Banan,
  pepsi: Pepsi,
  ['coca-cola']: Cola,
  "yog'": Yog,
  sut: Sut,
  non: Non,
  kartoshka: Kartoshka,
  guruch: Guruch,
  ['suv 1.5l']: Suv,
  suv: Suv,
}

const productMeta = {
  olma: {
    rating: '4.8',
    sold: 120,
    oldPrice: 15000,
    discount: '-20%',
    badge: 'Yangi hosil',
    category: 'Mevalar',
    location: 'Namangan',
    weight: '1 kg',
  },
  banan: {
    rating: '4.7',
    sold: 98,
  },
  pepsi: {
    rating: '4.6',
    sold: 150,
  },
  ['coca-cola']: {
    rating: '4.8',
    sold: 210,
    oldPrice: 16700,
    discount: '-10%',
  },
  "yog'": {
    rating: '4.7',
    sold: 75,
    oldPrice: 26000,
    discount: '-15%',
  },
  sut: {
    rating: '4.9',
    sold: 180,
  },
  non: {
    rating: '4.6',
    sold: 65,
  },
  kartoshka: {
    rating: '4.7',
    sold: 110,
  },
  guruch: {
    rating: '4.8',
    sold: 140,
  },
  ['suv 1.5l']: {
    rating: '4.9',
    sold: 400,
    oldPrice: 5700,
    discount: '-12%',
  },
}

const toNumber = (value) => {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return 0

  const numericValue = value.replace(/[^\d.-]/g, '')
  return Number(numericValue) || 0
}

const uniqueValues = (values) => [...new Set(values.filter(Boolean))]

const buildImageList = (rawProduct, productName) => {
  const apiImages = [
    rawProduct.rasm,
    rawProduct.image,
    rawProduct.imageUrl,
    ...(Array.isArray(rawProduct.images) ? rawProduct.images : []),
    ...(Array.isArray(rawProduct.rasmlar) ? rawProduct.rasmlar : []),
  ]

  const images = uniqueValues([...apiImages, productImages[productName]])

  if (images.length === 1) {
    return [images[0], images[0], images[0], images[0]]
  }

  return images
}

const buildProductView = (rawProduct) => {
  const title = rawProduct.nomi || rawProduct.title || ''
  const productName = normalizeName(title)
  const meta = productMeta[productName] || {}
  const price = toNumber(rawProduct.narxi ?? rawProduct.price)
  const oldPrice = toNumber(rawProduct.oldPrice ?? meta.oldPrice)
  const unit = rawProduct.birlik || rawProduct.unit

  return {
    id: rawProduct._id || rawProduct.id,
    title,
    subtitle: rawProduct.haqida || rawProduct.subtitle || 'Mahsulot haqida ma’lumot yo‘q.',
    images: buildImageList(rawProduct, productName),
    price,
    oldPrice: oldPrice || null,
    discount: rawProduct.discount || meta.discount,
    rating: rawProduct.rating || meta.rating || '4.7',
    sold: rawProduct.sold || meta.sold || 0,
    badge: rawProduct.badge || meta.badge,
    category: rawProduct.category || meta.category || 'Mahsulotlar',
    location: rawProduct.location || meta.location || 'Namangan',
    weight: rawProduct.weight || meta.weight || (unit ? `1 ${unit}` : '1 dona'),
    delivery: rawProduct.delivery || 'Omborda bor',
  }
}

export default function ProductDetails() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [product, setProduct] = useState(() =>
    location.state?.product ? buildProductView(location.state.product) : null
  )
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('tavsif')

  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data } = await productsApi.getAll()
        setAllProducts(data)
        
        const found = data.find((item) => item._id === id || item.id === id)
        if (found) {
          setProduct(buildProductView(found))
        } else if (!product) {
          setError('Mahsulot topilmadi')
        }
      } catch {
        setError('Mahsulotlarni yuklashda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id])

  if (loading) {
    return (
      <div className="product-details">
        <p className="product-details__state">Yuklanmoqda...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="product-details">
        <button className="product-details__back" type="button" onClick={() => navigate('/products')}>
          <FaArrowLeft /> Orqaga
        </button>
        <p className="product-details__error">{error || 'Mahsulot topilmadi'}</p>
      </div>
    )
  }

  const handlePrevImage = () => {
    if (!product.images.length) return
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  const handleNextImage = () => {
    if (!product.images.length) return
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  return (
    <div className="product-details">
      <button className="product-details__back" type="button" onClick={() => navigate('/products')}>
        <FaArrowLeft /> Orqaga
      </button>

      <div className="product-details__card">
        <div className="product-details__left">
          <div className="product-details__image-container">
            {product.badge ? (
              <span className="product-details__badge">
                <FaLeaf /> {product.badge}
              </span>
            ) : null}
            <button
              className="product-details__wishlist"
              type="button"
              aria-label="Sevimlilarga qo'shish"
              onClick={() => toggleWishlist(product)}
              style={{ color: isInWishlist(product.id) ? '#ef4444' : '#475569' }}
            >
              {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
            </button>
            <button
              className="product-details__nav-btn product-details__nav-btn--left"
              type="button"
              onClick={handlePrevImage}
              aria-label="Oldingi rasm"
            >
              <FaChevronLeft />
            </button>
            {product.images.length > 0 ? (
              <img
                className="product-details__image"
                src={product.images[currentImageIndex]}
                alt={product.title}
              />
            ) : (
              <span className="product-details__no-image">Rasm yo'q</span>
            )}
            <button
              className="product-details__nav-btn product-details__nav-btn--right"
              type="button"
              onClick={handleNextImage}
              aria-label="Keyingi rasm"
            >
              <FaChevronRight />
            </button>
          </div>

          <div className="product-details__thumbnails">
            {product.images.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                className={`product-details__thumbnail ${idx === currentImageIndex ? 'active' : ''}`}
                onClick={() => setCurrentImageIndex(idx)}
                type="button"
                aria-label={`${idx + 1}-rasmni ko'rish`}
              >
                <img src={img} alt={`${product.title} ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        <div className="product-details__right">
          <h1 className="product-details__title">{product.title}</h1>
          <p className="product-details__subtitle">{product.subtitle}</p>

          <div className="product-details__rating">
            <div className="product-details__stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(Number(product.rating)) ? 'filled' : ''} />
              ))}
            </div>
            <span className="product-details__rating-text">{product.rating} ({product.sold} sotilgan)</span>
          </div>

          <div className="product-details__price-section">
            <div className="product-details__price-main">
              <span className="product-details__price">
                {product.price ? priceFormatter.format(product.price) : '—'} so'm
              </span>
              {product.discount && <span className="product-details__discount-badge">{product.discount}</span>}
            </div>
            {product.oldPrice && <p className="product-details__oldprice">{priceFormatter.format(product.oldPrice)} so'm</p>}
          </div>

          <div className="product-details__info-grid">
            <div className="info-card">
              <div className="info-icon"><FaThLarge /></div>
              <div className="info-text">
                <p className="info-label">Kategoriya</p>
                <p className="info-value">{product.category}</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon"><FaWeightHanging /></div>
              <div className="info-text">
                <p className="info-label">Og'irligi</p>
                <p className="info-value">{product.weight}</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon"><FaMapMarkerAlt /></div>
              <div className="info-text">
                <p className="info-label">Kelib chiqishi</p>
                <p className="info-value">{product.location}</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon"><FaBoxOpen /></div>
              <div className="info-text">
                <p className="info-label">Mavjud</p>
                <p className="info-value">{product.delivery}</p>
              </div>
            </div>
          </div>

          <div className="product-details__purchase-row">
            <div className="product-details__quantity">
              <label>Miqdor:</label>
              <div className="quantity-control">
                <button className="qty-btn" onClick={() => handleQuantityChange(-1)} type="button">−</button>
                <input type="number" value={quantity} readOnly className="qty-input" />
                <button className="qty-btn" onClick={() => handleQuantityChange(1)} type="button">+</button>
              </div>
            </div>

            <button className="product-details__buy" type="button" onClick={() => {
              for(let i=0; i<quantity; i++) addToCart(product);
            }}>
              <FaShoppingCart /> Savatga qo'shish
            </button>
          </div>

          <div className="product-details__actions">
            <button className="product-details__favorite" type="button" onClick={() => toggleWishlist(product)}>
              {isInWishlist(product.id) ? <FaHeart color="#ef4444" /> : <FaRegHeart />} Sevimlilarga qo'shish
            </button>
            <button className="product-details__delivery" type="button" onClick={() => {
              for(let i=0; i<quantity; i++) addToCart(product);
              navigate('/cart');
            }}>
              <FaBolt /> Hozir sotib olish
            </button>
          </div>
        </div>
      </div>

      <section className="product-info-section">
        <div className="product-info-section__tabs">
          <button
            type="button"
            className={`product-info-section__tab ${activeTab === 'tavsif' ? 'active' : ''}`}
            onClick={() => setActiveTab('tavsif')}
          >
            <FaBoxOpen /> Tavsif
          </button>
          <button
            type="button"
            className={`product-info-section__tab ${activeTab === 'xususiyatlar' ? 'active' : ''}`}
            onClick={() => setActiveTab('xususiyatlar')}
          >
            <FaListUl /> Xususiyatlar
          </button>
          <button
            type="button"
            className={`product-info-section__tab ${activeTab === 'sharhlar' ? 'active' : ''}`}
            onClick={() => setActiveTab('sharhlar')}
          >
            <FaCommentAlt /> Sharhlar (24)
          </button>
        </div>

        <div className="product-info-section__body">
          <div className="product-info-section__content">
            {activeTab === 'tavsif' && (
              <div className="product-info-section__description">
                <div className="product-info-section__icon">
                  <FaAppleAlt />
                </div>
                <p>{product.subtitle}</p>
              </div>
            )}

            {activeTab === 'xususiyatlar' && (
              <ul className="product-info-section__features">
                <li><FaCheckCircle /> Kategoriya: {product.category}</li>
                <li><FaCheckCircle /> Og'irligi: {product.weight}</li>
                <li><FaCheckCircle /> Kelib chiqishi: {product.location}</li>
                <li><FaCheckCircle /> Mavjudligi: {product.delivery}</li>
              </ul>
            )}

            {activeTab === 'sharhlar' && (
              <div className="product-info-section__reviews">
                <div className="product-info-section__review">
                  <div className="product-info-section__review-header">
                    <strong>Aziza K.</strong>
                    <div className="product-info-section__review-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="filled" />
                      ))}
                    </div>
                  </div>
                  <p>Juda sifatli mahsulot, tez yetkazib berishdi. Tavsiya qilaman!</p>
                </div>
                <div className="product-info-section__review">
                  <div className="product-info-section__review-header">
                    <strong>Jamshid R.</strong>
                    <div className="product-info-section__review-stars">
                      {[...Array(4)].map((_, i) => (
                        <FaStar key={i} className="filled" />
                      ))}
                      <FaStar />
                    </div>
                  </div>
                  <p>Narxiga nisbatan juda yaxshi sifat. Yana buyurtma beraman.</p>
                </div>
              </div>
            )}
          </div>

          <div className="product-info-section__why">
            <div className="product-info-section__why-content">
              <h3>Nega aynan bizning {product.title.toLowerCase()}?</h3>
              <ul>
                <li><FaCheckCircle /> 100% tabiiy mahsulot</li>
                <li><FaCheckCircle /> Kimyoviy moddalarsiz</li>
                <li><FaCheckCircle /> Yangi terilgan</li>
                <li><FaCheckCircle /> Sifat kafolati</li>
              </ul>
            </div>
            {product.images.length > 0 && (
              <img
                className="product-info-section__why-image"
                src={product.images[0]}
                alt={product.title}
              />
            )}
          </div>
        </div>
      </section>

      {allProducts.length > 0 && (
        <div className="related-products">
          <h2>O'xshash mahsulotlar</h2>
          <div className="products-grid">
            {allProducts
              .filter(p => (p._id || p.id) !== product.id)
              .slice(0, 5)
              .map(p => {
                const pv = buildProductView(p);
                return (
                  <article className="product-card" key={pv.id} onClick={() => navigate(`/products/${pv.id}`, { state: { product: p } })}>
                    <div className="product-card__image">
                      {pv.discount ? <span className="product-card__discount">{pv.discount}</span> : null}
                      <button className="product-card__favorite" type="button" onClick={(e) => { e.stopPropagation(); toggleWishlist(pv); }} style={{ color: isInWishlist(pv.id) ? '#ef4444' : '#475569' }}>
                        {isInWishlist(pv.id) ? <FaHeart /> : <FaRegHeart />}
                      </button>
                      {pv.images.length > 0 ? <img src={pv.images[0]} alt={pv.title} /> : <span>Rasm yo'q</span>}
                    </div>
                    <div className="product-card__content">
                      <h3>{pv.title}</h3>
                      <div className="product-card__rating"><FaStar /><span>{pv.rating}</span></div>
                      <div className="product-card__footer">
                        <div className="product-card__prices">
                          <strong>{priceFormatter.format(pv.price)} so'm</strong>
                        </div>
                        <button className="product-card__cart" type="button" onClick={(e) => { e.stopPropagation(); addToCart(pv); }}><FaShoppingCart /></button>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      )}
    </div>
  )
}
