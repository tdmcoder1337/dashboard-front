import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaList, FaSearch, FaShoppingCart, FaStar, FaThLarge, FaRegHeart } from 'react-icons/fa'
import { productsApi } from '../../services/api'
import { ALL_CATEGORY, PRODUCT_CATEGORIES, getProductCategory } from '../../data/categories'
import { useCart } from '../../context/CartContext'
import { useWishlist } from '../../context/WishlistContext'
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
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY)
  const navigate = useNavigate()
  const { cartCount, addToCart } = useCart()
  const { wishlistCount, toggleWishlist, isInWishlist } = useWishlist()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await productsApi.getAll()
        setProducts(data)
      } catch {
        setError('Mahsulotlarni yuklashda xatolik yuz berdi')
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const search = normalizeName(searchValue)

    return products.filter((product) => {
      const matchesSearch = !search || normalizeName(product.nomi).includes(search)
      const matchesCategory =
        activeCategory === ALL_CATEGORY || getProductCategory(product) === activeCategory

      return matchesSearch && matchesCategory
    })
  }, [products, searchValue, activeCategory])






  return (
    <div className="products">
      <header className="products-topbar">
        <div>
          <h1>Dashboard</h1>
          <p>Xush kelibsiz! Bu yerda sizning statistikalar joylashtiriladi</p>
        </div>

        <label className="products-search">
          <span className="sr-only">Mahsulot qidirish</span>
          <input
            type="search"
            placeholder="Mahsulot qidirish..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
          <FaSearch />
        </label>

        <div className="products-topbar-actions">
          <button className="products-topbar-btn" aria-label="Sevimlilar" onClick={() => navigate('/wishlist')}>
            <FaHeart />
            {wishlistCount > 0 && <span className="products-topbar-badge">{wishlistCount}</span>}
          </button>
          <button className="products-topbar-btn" aria-label="Savatcha" onClick={() => navigate('/cart')}>
            <FaShoppingCart />
            {cartCount > 0 && <span className="products-topbar-badge">{cartCount}</span>}
          </button>
        </div>
      </header>

      <section className="products-panel">
        <div className="products-header">
          <div className="products-title">
            <span className="products-title-icon">
              <FaShoppingCart />
            </span>
            <h2>Mahsulotlar</h2>
          </div>

          <div className="products-tools">
            <span>{filteredProducts.length} ta mahsulot</span>
            <button className="products-view is-active" type="button" aria-label="Grid view">
              <FaThLarge />
            </button>
            <button className="products-view" type="button" aria-label="List view">
              <FaList />
            </button>
          </div>
        </div>

        <div className="products-categories" role="tablist" aria-label="Kategoriyalar">
          {[ALL_CATEGORY, ...PRODUCT_CATEGORIES].map((category) => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              className={`products-category${activeCategory === category ? ' is-active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? <p className="products-state">Yuklanmoqda...</p> : null}
        {error ? <p className="products-error">{error}</p> : null}

        {!isLoading && !error ? (
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

                return (
                  <article
                    className="product-card"
                    key={product._id}
                    onClick={() => navigate(`/products/${product._id}`, {
                      state: {
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
                      },
                    })}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        navigate(`/products/${product._id}`, {
                          state: {
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
                          },
                        })
                      }
                    }}
                  >
                    <div className="product-card__image">
                      {meta.discount ? <span className="product-card__discount">{meta.discount}</span> : null}
                      <button
                        className="product-card__favorite"
                        type="button"
                        aria-label="Sevimlilarga qo'shish"
                        onClick={(event) => {
                          event.stopPropagation()
                          toggleWishlist(product)
                        }}
                        style={{ color: isInWishlist(product._id) ? '#ef4444' : '#475569' }}
                      >
                        {isInWishlist(product._id) ? <FaHeart /> : <FaRegHeart />}
                      </button>
                      {imageSrc ? (
                        <img src={imageSrc} alt={product.nomi} />
                      ) : (
                        <span>Rasm yo'q</span>
                      )}
                    </div>

                    <div className="product-card__content">
                      <h3>{product.nomi}</h3>
                      <div className="product-card__rating">
                        <FaStar />
                        <span>{meta.rating || '4.7'}</span>
                        <small>({meta.sold || 80} ta)</small>
                      </div>
                      <p>{product.haqida || 'Sifatli va xaridorgir mahsulot.'}</p>
                      <div className="product-card__footer">
                        <div className="product-card__prices">
                          <strong>{priceFormatter.format(product.narxi)} so'm</strong>
                          {meta.oldPrice ? <del>{priceFormatter.format(meta.oldPrice)} so'm</del> : null}
                        </div>
                        <button
                          className="product-card__cart"
                          type="button"
                          aria-label="Savatga qo'shish"
                          onClick={(event) => {
                            event.stopPropagation()
                            addToCart(product)
                          }}
                        >
                          <FaShoppingCart />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <p className="products-state">Mahsulotlar topilmadi</p>
          )
        ) : null}

      </section>
    </div>
  )
}

export default Products
