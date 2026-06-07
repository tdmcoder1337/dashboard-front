import { useEffect, useState } from 'react'
import { productsApi } from '../../../../../services/api'
import './products.css'

const priceFormatter = new Intl.NumberFormat('uz-UZ')

function ProductsTable() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

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

  return (
    <div className="products-wrapper">
      <div className="products-header">
        <h2 className="products-title">Mahsulotlar sotuvi</h2>
        <span>{products.length} ta mahsulot</span>
      </div>

      {isLoading ? <p className="products-state">Yuklanmoqda...</p> : null}
      {error ? <p className="products-error">{error}</p> : null}

      {!isLoading && !error ? (
        <>
          <table className="products-table">
            <thead>
              <tr>
                <th>Mahsulot</th>
                <th>Narx</th>
                <th>Birlik</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.nomi}</td>
                  <td>{priceFormatter.format(product.narxi)} so'm</td>
                  <td>{product.birlik}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 ? (
            <p className="products-state">Mahsulotlar hali yo'q</p>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

export default ProductsTable
