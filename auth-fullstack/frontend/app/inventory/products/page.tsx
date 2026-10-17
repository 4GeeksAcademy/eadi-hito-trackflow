'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InventoryShell from '../InventoryShell';
import KpiCard from '../../../components/KpiCard';
import { getInventoryOrders, getInventoryProducts, InventoryOrder, InventoryProduct, ProductCategory, Warehouse } from '../../../lib/inventory';

const warehouseNames: Record<Warehouse, string> = { LA: 'Los Ángeles', ZGZ: 'Zaragoza' };
const categoryNames: Record<ProductCategory, string> = { fashion: 'Moda', electronics: 'Electrónica', cosmetics: 'Cosmética' };

export default function InventoryProductsPage() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [orders, setOrders] = useState<InventoryOrder[]>([]);
  const [search, setSearch] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [loadedProducts, loadedOrders] = await Promise.all([getInventoryProducts(), getInventoryOrders()]);
      setProducts(loadedProducts);
      setOrders(loadedOrders);
    }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los productos.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('es');
    return products.filter((product) => {
      const matchesWarehouse = !warehouse || product.warehouse === warehouse;
      const text = `${product.sku} ${product.name} ${product.client_name} ${categoryNames[product.category]}`.toLocaleLowerCase('es');
      return matchesWarehouse && (!term || text.includes(term));
    });
  }, [products, search, warehouse]);

  const stockMetrics = useMemo(() => products.reduce((summary, product) => {
    summary.totalUnits += product.current_stock;
    if (product.current_stock < 20) summary.lowStockCount += 1;
    return summary;
  }, { totalUnits: 0, lowStockCount: 0 }), [products]);
  const recentOrders = orders.slice(0, 6);

  return <InventoryShell>
    <header className="topbar"><div><div className="eyebrow">TrackFlow Ops · Almacenes de Los Ángeles y Zaragoza</div><h1>Inventario</h1></div><div className="inventory-header-actions"><button className="inventory-refresh" type="button" onClick={() => void load()} disabled={loading}>{loading ? 'Actualizando…' : '↻ Actualizar'}</button></div></header>
    <div className="kpi-grid inventory-kpis"><KpiCard label="SKU registrados" value={products.length} note="Catálogo de inventario" /><KpiCard label="Unidades en stock" value={stockMetrics.totalUnits.toLocaleString('es-ES')} note="Stock actual total" /><KpiCard label="Stock bajo" value={stockMetrics.lowStockCount} note="SKU por debajo de 20 unidades" noteVariant="alert" /><KpiCard label="Movimientos" value={orders.length} note="Entradas y salidas registradas" /></div>
    <section className="inventory-table-panel" aria-labelledby="products-heading"><div className="inventory-toolbar"><div><p className="eyebrow">Existencias</p><h2 id="products-heading">SKU registrados</h2></div><div className="inventory-filters"><label className="visually-hidden" htmlFor="product-search">Buscar SKU, producto o marca cliente</label><input id="product-search" type="search" placeholder="Buscar SKU, producto o marca" value={search} onChange={(event) => setSearch(event.target.value)} /><label className="visually-hidden" htmlFor="product-warehouse">Filtrar almacén</label><select id="product-warehouse" value={warehouse} onChange={(event) => setWarehouse(event.target.value)}><option value="">Todos los almacenes</option><option value="LA">Los Ángeles</option><option value="ZGZ">Zaragoza</option></select></div></div>
      {error && <div className="inventory-error" role="alert"><span>{error}</span><button type="button" onClick={() => void load()}>Reintentar</button></div>}
      {loading ? <p className="inventory-state" role="status">Cargando productos…</p> : !error && filtered.length === 0 ? <p className="inventory-state">{products.length ? 'No hay productos que coincidan con la búsqueda.' : 'No hay SKU registrados. Comprueba la carga de datos de desarrollo.'}</p> : !error && <div className="inventory-table-wrap"><table className="inventory-table inventory-full-table"><caption className="visually-hidden">SKU, nombre, marca cliente, almacén, categoría y stock actual</caption><thead><tr><th>SKU / Producto</th><th>Marca cliente</th><th>Almacén</th><th>Categoría</th><th>Stock actual</th><th>Órdenes</th></tr></thead><tbody>{filtered.map((product) => {
        // El umbral de alerta de la vista es menos de 20 unidades; el backend no define un umbral por SKU.
        const lowStock = product.current_stock < 20;
        return <tr key={product.id}><td><span className="sku">{product.sku}</span><br /><span className="warehouse">{product.name}</span></td><td>{product.client_name}</td><td>{warehouseNames[product.warehouse]}</td><td>{categoryNames[product.category]}</td><td><span className={`status ${lowStock ? 'warn' : 'ok'}`}>{lowStock ? '⚠ Stock bajo · ' : '✓ Saludable · '}{product.current_stock}</span></td><td><div className="inventory-row-actions"><Link href="/inventory/orders/inbound">Entrada</Link><Link href="/inventory/orders/outbound">Salida</Link></div></td></tr>;
      })}</tbody></table></div>}
      {!loading && !error && filtered.length > 0 && <p className="inventory-result-count">Mostrando {filtered.length} de {products.length} SKU</p>}
    </section>
    <div className="content-grid inventory-lower-grid"><section className="panel inventory-recent-panel"><div className="panel-heading"><h2>Órdenes recientes</h2><Link className="inventory-open-link" href="/inventory/orders">Ver historial →</Link></div>{loading ? <p className="inventory-state" role="status">Cargando órdenes…</p> : recentOrders.length === 0 ? <p className="inventory-state">No hay movimientos registrados.</p> : <div className="inventory-table-wrap"><table className="inventory-table inventory-full-table"><thead><tr><th>SKU / Producto</th><th>Tipo</th><th>Cantidad</th><th>Fecha</th></tr></thead><tbody>{recentOrders.map((order) => <tr key={`${order.type}-${order.id}`}><td><span className="sku">{order.sku}</span><br /><span className="warehouse">{order.name}</span></td><td><span className={`status ${order.type === 'inbound' ? 'ok' : 'warn'}`}>{order.type === 'inbound' ? 'Entrada' : 'Salida'}</span></td><td>{order.type === 'inbound' ? '+' : '−'}{order.quantity}</td><td>{new Date(order.created_at).toLocaleDateString('es-ES')}</td></tr>)}</tbody></table></div>}</section><section className="inventory-promo"><span aria-hidden="true">↗</span><div><strong>Gestiona los movimientos de stock</strong><p>Registra recepciones y salidas con trazabilidad.</p></div><Link className="primary-button" href="/inventory/orders/inbound">Crear una entrada</Link></section></div>
  </InventoryShell>;
}
