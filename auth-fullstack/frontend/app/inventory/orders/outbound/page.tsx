'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import InventoryShell from '../../InventoryShell';
import { createOutboundOrder, ExitType, getInventoryProduct, getInventoryProducts, InventoryProduct, Warehouse } from '../../../../lib/inventory';

export default function OutboundOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [skuId, setSkuId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [exitType, setExitType] = useState<ExitType>('dispatch');
  const [tracking, setTracking] = useState('');
  const [stockProductId, setStockProductId] = useState<number | null>(null);
  const [currentStock, setCurrentStock] = useState<number | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingStock, setLoadingStock] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quantityError, setQuantityError] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const selectedProduct = useMemo(() => products.find((product) => product.id === Number(skuId)), [products, skuId]);
  const quantityNumber = Number(quantity);
  const isStockReady = selectedProduct !== undefined && stockProductId === selectedProduct.id && !loadingStock;
  const displayedStock = isStockReady ? currentStock : null;
  const exceedsStock = displayedStock !== null && quantityNumber > displayedStock;
  const invalidTracking = exitType === 'dispatch' && tracking.trim().length === 0;

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true); setError('');
    try { const loaded = await getInventoryProducts(); setProducts(loaded); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar la lista de SKU.'); }
    finally { setLoadingProducts(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void loadProducts(), 0); return () => window.clearTimeout(timer); }, [loadProducts]);

  useEffect(() => {
    if (!selectedProduct) return;
    let active = true;
    const productId = selectedProduct.id;
    const timer = window.setTimeout(() => {
      setLoadingStock(true); setStockProductId(null); setQuantityError('');
      getInventoryProduct(productId).then((product) => { if (active) { setCurrentStock(product.current_stock); setStockProductId(productId); } })
        .catch((stockError) => { if (active) { setCurrentStock(null); setStockProductId(productId); setQuantityError(stockError instanceof Error ? stockError.message : 'No se pudo consultar el stock actual.'); } })
        .finally(() => { if (active) setLoadingStock(false); });
    }, 0);
    return () => { active = false; window.clearTimeout(timer); };
  }, [selectedProduct]);

  function updateQuantity(value: string) {
    setQuantity(value); setQuantityError(''); setError('');
    const parsed = Number(value);
    if (value && parsed > 0 && displayedStock !== null && parsed > displayedStock) {
      setQuantityError(`La cantidad supera el stock actual (${displayedStock} unidades).`);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setMessage(''); setQuantityError('');
    if (!selectedProduct) { setError('Selecciona un producto válido.'); return; }
    if (loadingStock || !isStockReady || currentStock === null) { setQuantityError('Espera a que se consulte el stock actual antes de continuar.'); return; }
    if (!Number.isInteger(quantityNumber) || quantityNumber <= 0) { setQuantityError('Introduce una cantidad entera mayor que cero.'); return; }
    if (quantityNumber > currentStock) { setQuantityError(`La cantidad supera el stock actual (${currentStock} unidades).`); return; }
    if (invalidTracking) { setError('El número de seguimiento es obligatorio para un despacho.'); return; }
    const token = window.localStorage.getItem('trackflow_access_token');
    if (!token) { router.replace('/login'); return; }
    setSubmitting(true);
    try {
      await createOutboundOrder({ sku_id: selectedProduct.id, quantity: quantityNumber, exit_type: exitType, tracking_number: exitType === 'dispatch' ? tracking.trim() : null, warehouse: selectedProduct.warehouse as Warehouse });
      setQuantity(''); setTracking(''); setMessage('Salida de stock registrada correctamente.');
      const refreshed = await getInventoryProduct(selectedProduct.id);
      setCurrentStock(refreshed.current_stock); setStockProductId(selectedProduct.id);
    } catch (submitError) {
      const reason = submitError instanceof Error ? submitError.message : 'No se pudo registrar la salida.';
      if (reason.toLowerCase().includes('sesión')) { router.replace('/login'); return; }
      if (reason.toLowerCase().includes('stock') || reason.toLowerCase().includes('insuficiente') || reason.toLowerCase().includes('existencia')) setQuantityError(reason);
      else setError(reason);
      getInventoryProduct(selectedProduct.id).then((product) => { setCurrentStock(product.current_stock); setStockProductId(selectedProduct.id); }).catch(() => undefined);
    } finally { setSubmitting(false); }
  }

  return <InventoryShell><header className="topbar"><div><div className="eyebrow">Inventario · Despacho o ajuste</div><h1>Registrar salida</h1><p className="inventory-intro">El stock actual se consulta al seleccionar el SKU.</p></div><Link className="inventory-back" href="/inventory/products">← Volver a productos</Link></header><section className="inventory-form-panel"><div className="inventory-form-heading"><p className="eyebrow">Nueva salida</p><h2>Datos de la salida</h2></div>{error && <p className="inventory-error" role="alert">{error}</p>}{message && <p className="inventory-success" role="status">{message}</p>}<form className="inventory-form" onSubmit={submit}><label>Producto / SKU<select required value={skuId} onChange={(event) => { setSkuId(event.target.value); setStockProductId(null); setLoadingStock(false); setCurrentStock(null); setQuantityError(''); setError(''); setMessage(''); }} disabled={loadingProducts || products.length === 0}><option value="">{loadingProducts ? 'Cargando productos…' : 'Selecciona un producto'}</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · {product.sku} · {product.client_name} ({product.warehouse})</option>)}</select></label><div className="inventory-stock-summary" aria-live="polite"><span>Stock actual</span><strong>{!selectedProduct ? 'Selecciona un producto' : !isStockReady && loadingStock ? 'Consultando…' : !isStockReady ? 'Consultando…' : currentStock === null ? 'No disponible' : `${currentStock} unidades`}</strong>{selectedProduct && <span className="warehouse">{selectedProduct.name} · {selectedProduct.warehouse}</span>}</div><label>Unidades a retirar<input type="number" min="1" step="1" required value={quantity} onChange={(event) => updateQuantity(event.target.value)} aria-invalid={Boolean(quantityError || exceedsStock)} aria-describedby={quantityError || exceedsStock ? 'outbound-quantity-error' : undefined} /></label>{(quantityError || exceedsStock) && <p id="outbound-quantity-error" className="inventory-inline-error" role="alert">{quantityError || `La cantidad supera el stock actual (${displayedStock} unidades).`}</p>}<label>Tipo de salida<select value={exitType} onChange={(event) => { setExitType(event.target.value as ExitType); setError(''); }}><option value="dispatch">Despacho</option><option value="loss">Pérdida</option></select></label>{exitType === 'dispatch' && <label>Número de seguimiento<input type="text" required value={tracking} onChange={(event) => setTracking(event.target.value)} placeholder="Ej.: TRK-458190" /></label>}<div className="inventory-form-actions"><button className="primary-button" type="submit" disabled={submitting || loadingProducts || products.length === 0 || loadingStock || !isStockReady || Boolean(quantityError) || exceedsStock || currentStock === null}>{submitting ? 'Registrando…' : 'Registrar salida'}</button><Link className="inventory-back" href="/inventory/orders">Ver historial</Link></div></form></section></InventoryShell>;
}
