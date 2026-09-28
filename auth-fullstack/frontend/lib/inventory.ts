export type Warehouse = 'LA' | 'ZGZ';
export type ProductCategory = 'fashion' | 'electronics' | 'cosmetics';
export type ExitType = 'dispatch' | 'loss';

export type InventoryProduct = {
  id: number;
  name: string;
  sku: string;
  client_name: string;
  category: ProductCategory;
  warehouse: Warehouse;
  current_stock: number;
};

export type InventoryOrder = {
  type: 'inbound' | 'outbound';
  id: number;
  sku_id: number;
  sku: string;
  name: string;
  client_name: string;
  quantity: number;
  warehouse: Warehouse;
  created_at: string;
  user_uuid: string;
  reference: string | null;
  exit_type: ExitType | null;
  tracking_number: string | null;
};

export type InboundPayload = {
  sku_id: number;
  quantity: number;
  reference: string;
  warehouse: Warehouse;
};

export type OutboundPayload = {
  sku_id: number;
  quantity: number;
  exit_type: ExitType;
  tracking_number: string | null;
  warehouse: Warehouse;
};

const API_ROOT = '/api/inventory';

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem('trackflow_access_token');
}

async function inventoryRequest<T>(path: string, options: RequestInit = {}, requiresAuth = false): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  if (requiresAuth) {
    const token = getAccessToken();
    if (!token) throw new Error('Tu sesión no está activa. Inicia sesión para continuar.');
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_ROOT}${path}`, { ...options, headers, cache: 'no-store' });
  } catch {
    throw new Error('No se pudo conectar con el servicio de inventario. Inténtalo de nuevo.');
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { detail?: unknown; error?: unknown } | null;
    let message = body?.detail ?? body?.error;
    if (Array.isArray(message)) {
      message = message.map((item: { msg?: string }) => item.msg).filter(Boolean).join(' ');
    }
    throw new Error(typeof message === 'string' && message.length < 500
      ? message
      : `La solicitud de inventario no se pudo completar (HTTP ${response.status}).`);
  }

  if (response.status === 204) return undefined as T;
  try {
    return await response.json() as T;
  } catch {
    throw new Error('El servicio de inventario devolvió una respuesta no válida.');
  }
}

export function getInventoryProducts(): Promise<InventoryProduct[]> {
  return inventoryRequest<InventoryProduct[]>('/products');
}

export function getInventoryProduct(id: number): Promise<InventoryProduct> {
  return inventoryRequest<InventoryProduct>(`/products/${id}`);
}

export function getInventoryOrders(): Promise<InventoryOrder[]> {
  return inventoryRequest<InventoryOrder[]>('/orders');
}

export function createInboundOrder(payload: InboundPayload): Promise<unknown> {
  return inventoryRequest('/orders/inbound', { method: 'POST', body: JSON.stringify(payload) }, true);
}

export function createOutboundOrder(payload: OutboundPayload): Promise<unknown> {
  return inventoryRequest('/orders/outbound', { method: 'POST', body: JSON.stringify(payload) }, true);
}
