import { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaList, FaSearch, FaShoppingCart, FaStar, FaThLarge, FaRegHeart, FaCheck } from 'react-icons/fa'
import { productsApi } from '../../services/api'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../context/LanguageContext'
import { useWishlist } from '../../context/WishlistContext'
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher'
import './products.css'
import Olma from '../../assets/products-image/Olma.png'
import Banan from '../../assets/products-image/Banan.png'
import Pepsi from '../../assets/products-image/Pepsi.webp'
import Cola from '../../assets/products-image/Cola.png'
import Yog from '../../assets/products-image/Yog.png'
import Sut from '../../assets/products-image/Sut.png'
import Non from '../../assets/products-image/non.png'
import Kartoshka from '../../assets/products-image/Kartoshka.png'
import Guruch from '../../assets/products-image/Guruch.png'
import Suv from '../../assets/products-image/Suv.png'


import Carousel from './components/Carusel/Carousel'


const priceFormatter = new Intl.NumberFormat('uz-UZ')



const normalizeName = (value = '') => value.trim().toLowerCase()

const productImages = {
  olma: Olma,
  banan: Banan,
  pepsi: Pepsi,
  ["coca-cola"]: Cola,
  "yog'": Yog,
  sut: Sut,
  non: Non,
  kartoshka: Kartoshka,
  guruch: Guruch,
  ['suv 1.5l']: Suv,
}

const productMeta = {
  olma: {
    rating: '4.8',
    sold: 120,
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
  ["yog'"]: {
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
    sold: 200,
    oldPrice: 5700,
    discount: '-12%',
  },
  suv: {
    rating: '4.9',
    sold: 200,
  },
}

function Products() {
  const { t } = useLanguage()
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [toasts, setToasts] = useState([])
  const navigate = useNavigate()
  const { cartCount, addToCart } = useCart()
  const { wishlistCount, toggleWishlist, isInWishlist } = useWishlist()
  const [selectedCategory, setSelectedCategory] = useState("Barchasi")

  const showToast = useCallback((productName) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, name: productName }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await productsApi.getAll()
        setProducts(data)
      } catch {
        setError(t('products.loadError'))
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [t])
  const filteredProducts = useMemo(() => {
    const search = normalizeName(searchValue);

    return products
      .filter((product) => {
        if (selectedCategory === "Barchasi") return true;
        return product.category === selectedCategory;
      })
      .filter((product) => {
        if (!search) return true;
        return normalizeName(product.nomi).includes(search);
      });
  }, [products, searchValue, selectedCategory]);






  return (
    <div className="products">
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className="toast">
            <span className="toast-icon"><FaCheck /></span>
            <span>{t('products.addedToCart', { name: toast.name })}</span>
          </div>
        ))}
      </div>

      <header className="products-topbar">
        <div>
          <h1>{t('products.title')}</h1>
        </div>

        <label className="products-search">
          <span className="sr-only">{t('products.searchSr')}</span>
          <input
            type="search"
            placeholder={t('products.searchPlaceholder')}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <FaSearch />
        </label>

        <div className="products-topbar-actions">
          <LanguageSwitcher />
          <button className="products-topbar-btn" aria-label={t('products.wishlistAria')} onClick={() => navigate('/wishlist')}>
            <FaHeart />
            {wishlistCount > 0 && <span className="products-topbar-badge">{wishlistCount}</span>}
          </button>
          <button className="products-topbar-btn" aria-label={t('products.cartAria')} onClick={() => navigate('/cart')}>
            <FaShoppingCart />
            {cartCount > 0 && <span className="products-topbar-badge">{cartCount}</span>}
          </button>
        </div>
      </header>
      <Carousel />
      <section className="products-panel">
        <div className="products-header">
          <div className="products-title">
            <span className="products-title-icon">
              <FaShoppingCart />
            </span>
            <h2>{t('products.title')}</h2>
          </div>

          <div className="products-tools">
            <span>{t('products.itemsCount', { n: filteredProducts.length })}</span>
            <button className="products-view is-active" type="button" aria-label="Grid view">
              <FaThLarge />
            </button>
            <button className="products-view" type="button" aria-label="List view">
              <FaList />
            </button>
          </div>
        </div>

        <div className="category-buttons">
          <button onClick={() => setSelectedCategory("Barchasi")}
            className={selectedCategory === "Barchasi" ? "active" : ""}>
            {t('products.categoryAll')}
          </button>

          <button onClick={() => setSelectedCategory("mevalar")}
            className={selectedCategory === "mevalar" ? "active" : ""}>
            {t('products.categoryFruits')}
          </button>

          <button onClick={() => setSelectedCategory("ichimliklar")}
            className={selectedCategory === "ichimliklar" ? "active" : ""}>
            {t('products.categoryDrinks')}
          </button>

          <button onClick={() => setSelectedCategory("oziq-ovqat")}
            className={selectedCategory === "oziq-ovqat" ? "active" : ""}>
            {t('products.categoryFood')}
          </button>
          <button onClick={() => setSelectedCategory("poliz-ekinlari")}
            className={selectedCategory === "poliz-ekinlari" ? "active" : ""}>
            {t('products.categoryMelons')}
          </button>
        </div>


        {isLoading ? <p className="products-state">{t('products.loading')}</p> : null}
        {error ? <p className="products-error">{error}</p> : null}

        {
          !isLoading && !error ? (
            filteredProducts.length > 0 ? (
              <div className="products-grid">
                {filteredProducts.map((product) => {
                  const productName = normalizeName(product.nomi)
                  const meta = productMeta[productName] || {}
                  const imageSrc =
                    product.rasm ||
                    product.image ||
                    product.imageUrl ||
                    productImages[productName] ||
                    ''

                  const navState = {
                    product: {
                      title: product.nomi,
                      subtitle: product.haqida,
                      haqida: product.haqida,
                      image: imageSrc,
                      price: Number(product.narxi) || 0,
                      oldPrice: meta.oldPrice || null,
                      discount: meta.discount,
                      rating: meta.rating || '4.7',
                      sold: meta.sold || 80,
                      id: product._id,
                      birlik: product.birlik,
                    },
                  }

                  return (
                    <article className="product-card" key={product._id}>
                      <div
                        className="product-card__clickable"
                        onClick={() => navigate(`/products/${product._id}`, { state: navState })}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            navigate(`/products/${product._id}`, { state: navState })
                          }
                        }}
                      >
                        <div className="product-card__image">
                          {meta.discount ? <span className="product-card__discount">{meta.discount}</span> : null}
                          <button
                            className="product-card__favorite"
                            type="button"
                            aria-label={t('products.addToWishlistAria')}
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product) }}
                            style={{ color: isInWishlist(product._id) ? '#ef4444' : '#94a3b8' }}
                          >
                            {isInWishlist(product._id) ? <FaHeart /> : <FaRegHeart />}
                          </button>
                          {imageSrc ? (
                            <img src={imageSrc} alt={product.nomi} />
                          ) : (
                            <span className="product-card__no-image">{t('products.noImage')}</span>
                          )}
                        </div>

                        <div className="product-card__body">
                          <div className="product-card__rating">
                            <FaStar />
                            <span>{meta.rating || '4.7'}</span>
                            <small>{t('products.ratingCount', { n: meta.sold || 80 })}</small>
                          </div>
                          <h3 className="product-card__title">{product.nomi}</h3>
                          <div className="product-card__prices">
                            <strong>{priceFormatter.format(product.narxi)} {t('products.currency')}</strong>
                            {meta.oldPrice ? (
                              <del>{priceFormatter.format(meta.oldPrice)} {t('products.currency')}</del>
                            ) : null}
                          </div>
                          {product.birlik && (
                            <span className="product-card__unit">1 {product.birlik}</span>
                          )}
                        </div>
                      </div>

                      <div className="product-card__footer">
                        <button
                          className="product-card__add-btn"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(product)
                            showToast(product.nomi)
                          }}
                        >
                          <FaShoppingCart />
                          {t('products.addToCart')}
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <p className="products-state">{t('products.notFound')}</p>
            )
          ) : null
        }

      </section >
    </div >
  )
}

export default Products
