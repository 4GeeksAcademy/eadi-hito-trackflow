import { Carrier, Product, ProductCategory, Shipment, ShipmentStatus } from '../types/models';

export function calculateShippingCost(shipment: Shipment, product: Product, carrier: Carrier): number {
  const baseCost = carrier.baseRateUSD;
  const weightCost = product.weightKg * carrier.ratePerKgUSD * shipment.quantity;
  const distanceCost = shipment.destination.distanceKm * carrier.ratePerKmUSD;

  const prioritySurchargeRate: Record<Shipment['priority'], number> = {
    Standard: 0,
    Express: 0.3,
    'Same-day': 0.6,
  };

  const surcharge = (baseCost + weightCost + distanceCost) * prioritySurchargeRate[shipment.priority];
  const totalCost = baseCost + weightCost + distanceCost + surcharge;

  return Number(totalCost.toFixed(2));
}

export function scoreCarrierForShipment(carrier: Carrier, shipment: Shipment, product: Product): number {
  let score = 0;

  if (carrier.operatesIn.includes(shipment.destination.country)) {
    score += 20;
  }

  if (product.weightKg * shipment.quantity <= carrier.maxWeightKg) {
    score += 20;
  }

  if (carrier.acceptsPriority.includes(shipment.priority)) {
    score += 15;
  }

  if (product.isFragile) {
    score += carrier.handlesFragile ? 15 : 0;
  } else {
    score += 15;
  }

  score += carrier.onTimeRate * 0.3;

  return Number(score.toFixed(2));
}

export function selectBestCarrier(carriers: Carrier[], shipment: Shipment, product: Product): { carrier: Carrier; score: number; cost: number } | null {
  const scoredCandidates = carriers
    .map((carrier) => ({
      carrier,
      score: scoreCarrierForShipment(carrier, shipment, product),
      cost: calculateShippingCost(shipment, product, carrier),
    }))
    .filter(({ score }) => score >= 50)
    .sort((firstCandidate, secondCandidate) => firstCandidate.cost - secondCandidate.cost);

  if (scoredCandidates.length === 0) {
    return null;
  }

  const bestCandidate = scoredCandidates[0];

  return {
    carrier: bestCandidate.carrier,
    score: bestCandidate.score,
    cost: bestCandidate.cost,
  };
}

export function countProductsByCategory(products: Product[]): Record<ProductCategory, number> {
  const counts: Record<ProductCategory, number> = {
    Fashion: 0,
    Electronics: 0,
    Cosmetics: 0,
    Home: 0,
    Other: 0,
  };

  for (const product of products) {
    counts[product.category] += 1;
  }

  return counts;
}

export function calculateTotalInventoryValue(products: Product[]): number {
  const total = products.reduce((sum, product) => sum + product.stockQuantity * product.unitCostUSD, 0);
  return Number(total.toFixed(2));
}

export function calculateAverageShipmentDistance(shipments: Shipment[]): number {
  if (shipments.length === 0) {
    return 0;
  }

  const totalDistance = shipments.reduce((sum, shipment) => sum + shipment.destination.distanceKm, 0);
  return Number((totalDistance / shipments.length).toFixed(2));
}

export function groupShipmentsByStatus(shipments: Shipment[]): Record<ShipmentStatus, Shipment[]> {
  const grouped: Record<ShipmentStatus, Shipment[]> = {
    Pending: [],
    Assigned: [],
    'In transit': [],
    Delivered: [],
    Failed: [],
  };

  for (const shipment of shipments) {
    grouped[shipment.status].push(shipment);
  }

  return grouped;
}

export function findTopCarriers(shipments: Shipment[], topN: number): Array<{ carrier: string; count: number }> {
  const counts = new Map<string, number>();

  for (const shipment of shipments) {
    if (!shipment.carrier) {
      continue;
    }

    counts.set(shipment.carrier, (counts.get(shipment.carrier) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([carrier, count]) => ({ carrier, count }))
    .sort((firstCarrier, secondCarrier) => secondCarrier.count - firstCarrier.count)
    .slice(0, topN);
}
