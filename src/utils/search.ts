import { Product, Shipment } from '../types/models';

export function findProductBySKU(products: Product[], sku: string): Product | null {
  for (const product of products) {
    if (product.sku.toLowerCase() === sku.toLowerCase()) {
      return product;
    }
  }

  return null;
}

export function findShipmentById(shipments: Shipment[], id: string): Shipment | null {
  for (const shipment of shipments) {
    if (shipment.id === id) {
      return shipment;
    }
  }

  return null;
}

export function binarySearchProductByWeight(sortedProducts: Product[], targetWeight: number): number {
  let left = 0;
  let right = sortedProducts.length - 1;

  while (left <= right) {
    const middleIndex = Math.floor((left + right) / 2);
    const middleProduct = sortedProducts[middleIndex];

    if (middleProduct.weightKg === targetWeight) {
      return middleIndex;
    }

    if (middleProduct.weightKg < targetWeight) {
      left = middleIndex + 1;
    } else {
      right = middleIndex - 1;
    }
  }

  return -1;
}
