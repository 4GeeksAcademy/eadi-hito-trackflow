'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import InventoryShell from '../../InventoryShell';
import { createInboundOrder, getInventoryProducts, InventoryProduct, Warehouse } from '../../../../lib/inventory';

export default function InboundOrderPage() {
  const router = useRouter();
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [skuId, setSkuId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reference, setReference] = useState('');
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);
    setError('');
    try { setProducts(await getInventoryProducts()); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar la lista de SKU.'); }
    finally { setLoadingProducts(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void loadProducts(), 0); return () => window.clearTimeout(timer); }, [loadProducts]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(''); setMessage('');
    const selected = products.find((product) => product.id === Number(skuId));
    if (!selected) { setError('Selecciona un producto válido.'); return; }
    const token = window.localStorage.getItem('trackflow_access_token');
    if (!token) { router.replace('/login'); return; }
    setSubmitting(true);
    try {
      await createInboundOrder({ sku_id: selected.id, quantity: Number(quantity), reference: reference.trim(), warehouse: selected.warehouse as Warehouse });
      setSkuId(''); setQuantity(''); setReference('');
      setMessage('Entrada de stock registrada correctamente.');
    } catch (submitError) {
      const reason = submitError instanceof Error ? submitError.message : 'No se pudo registrar la entrada.';
      if (reason.toLowerCase().includes('sesión')) { router.replace('/login'); return; }
      setError(reason);
    } finally { setSubmitting(false); }
  }

  return <InventoryShell><header className="topbar"><div><div className="eyebrow">Inventario · Recepción de mercancía</div><h1>Registrar entrada</h1><p className="inventory-intro">Registra las unidades recibidas de una marca cliente.</p></div><Link className="inventory-back" href="/inventory/products">← Volver a productos</Link></header><section className="inventory-form-panel"><div className="inventory-form-heading"><p className="eyebrow">Nueva recepción</p><h2>Datos de la entrada</h2></div>{error && <p className="inventory-error" role="alert">{error}</p>}{message && <p className="inventory-success" role="status">{message}</p>}<form className="inventory-form" onSubmit={submit}><label>Producto / SKU<select required value={skuId} onChange={(event) => setSkuId(event.target.value)} disabled={loadingProducts || products.length === 0}><option value="">{loadingProducts ? 'Cargando productos…' : 'Selecciona un producto'}</option>{products.map((product) => <option key={product.id} value={product.id}>{product.name} · {product.sku} · {product.client_name} ({product.warehouse})</option>)}</select></label><label>Unidades recibidas<input type="number" min="1" step="1" required value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label><label>Referencia de despacho<input type="text" required minLength={1} value={reference} onChange={(event) => setReference(event.target.value)} placeholder="Ej.: PO-2026-0042" /></label><div className="inventory-form-actions"><button className="primary-button" type="submit" disabled={submitting || loadingProducts || products.length === 0}>{submitting ? 'Registrando…' : 'Registrar entrada'}</button><Link className="inventory-back" href="/inventory/orders">Ver historial</Link></div></form></section></InventoryShell>;
}
