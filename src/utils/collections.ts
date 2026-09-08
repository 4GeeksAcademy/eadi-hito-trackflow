import { Carrier, Product, ProductCategory, WarehouseLocation } from '../types/models';

export function filterProductsByWarehouse(products: Product[], warehouse: WarehouseLocation): Product[] {
  return products.filter((product) => product.warehouse === warehouse);
}

export function filterProductsByCategory(products: Product[], category: ProductCategory): Product[] {
  return products.filter((product) => product.category === category);
}

export function filterLowStockProducts(products: Product[]): Product[] {
  return products.filter((product) => product.stockQuantity <= product.minStockThreshold);
}

export function sortProductsByStock(products: Product[], order: 'asc' | 'desc'): Product[] {
  return [...products].sort((firstProduct, secondProduct) => {
    const difference = firstProduct.stockQuantity - secondProduct.stockQuantity;
    return order === 'asc' ? difference : -difference;
  });
}

export function sortCarriersByReliability(carriers: Carrier[], order: 'asc' | 'desc'): Carrier[] {
  return [...carriers].sort((firstCarrier, secondCarrier) => {
    const difference = firstCarrier.onTimeRate - secondCarrier.onTimeRate;
    return order === 'asc' ? difference : -difference;
  });
}
