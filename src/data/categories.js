export const ALL_CATEGORY = 'Barchasi'

export const PRODUCT_CATEGORIES = [
  'Mevalar',
  'Ichimliklar',
  'Oziq-ovqat',
  'Poliz-ekinlari',
]

const normalize = (value = '') => value.trim().toLowerCase()

// Mahsulot nomi bo'yicha kategoriya (joriy bazadagi mahsulotlar uchun)
const nameToCategory = {
  olma: 'Mevalar',
  banan: 'Mevalar',
  pepsi: 'Ichimliklar',
  'coca-cola': 'Ichimliklar',
  cola: 'Ichimliklar',
  suv: 'Ichimliklar',
  'suv 1.5l': 'Ichimliklar',
  sut: 'Oziq-ovqat',
  non: 'Oziq-ovqat',
  "yog'": 'Oziq-ovqat',
  guruch: 'Oziq-ovqat',
  kartoshka: 'Poliz-ekinlari',
}

// Backend enum qiymatlarini frontend kategoriyalarga moslash
const backendToCategory = {
  Mevalar: 'Mevalar',
  Ichimliklar: 'Ichimliklar',
  'Sut mahsulotlari': 'Oziq-ovqat',
  'Non mahsulotlari': 'Oziq-ovqat',
  Sabzavotlar: 'Poliz-ekinlari',
}

export const getProductCategory = (product = {}) => {
  const byName = nameToCategory[normalize(product.nomi)]
  if (byName) {
    return byName
  }

  const byBackend = backendToCategory[product.kategoriya]
  if (byBackend) {
    return byBackend
  }

  return null
}
