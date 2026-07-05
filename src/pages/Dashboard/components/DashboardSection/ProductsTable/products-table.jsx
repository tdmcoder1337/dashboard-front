import { useEffect, useState } from 'react'
import { productsApi } from '../../../../../services/api'
import { useLanguage } from '../../../../../context/LanguageContext'
import './products.css'

function ProductsTable() {
  const { t, locale } = useLanguage()
  const priceFormatter = new Intl.NumberFormat(locale === 'ru-RU' ? 'ru-RU' : 'uz-UZ')
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const { data } = await productsApi.getAll()
        setProducts(data)
      } catch {
        setError(t('dashTable.loadError'))
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [t])

  return (
    <div className="products-wrapper">
      <div className="products-header">
        <h2 className="products-title">{t('dashTable.title')}</h2>
        <span>{t('dashTable.itemsCount', { n: products.length })}</span>
      </div>

      {isLoading ? <p className="products-state">{t('dashTable.loading')}</p> : null}
      {error ? <p className="products-error">{error}</p> : null}

      {!isLoading && !error ? (
        <>
          <table className="products-table">
            <thead>
              <tr>
                <th>{t('dashTable.colProduct')}</th>
                <th>{t('dashTable.colPrice')}</th>
                <th>{t('dashTable.colUnit')}</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.nomi}</td>
                  <td>{priceFormatter.format(product.narxi)} {t('dashTable.currency')}</td>
                  <td>{product.birlik}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 ? (
            <p className="products-state">{t('dashTable.empty')}</p>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default ProductsTable
