'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import InventoryShell from '../InventoryShell';
import KpiCard from '../../../components/KpiCard';
import { useLocale } from '../../../components/LocaleProvider';
import { getInventoryOrders, getInventoryProducts, InventoryOrder, InventoryProduct, ProductCategory, Warehouse } from '../../../lib/inventory';
import { localizedPath } from '../../../lib/i18n';

const warehouseNames: Record<Warehouse, string> = { LA: 'Los Ángeles', ZGZ: 'Zaragoza' };
const categoryNames: Record<ProductCategory, string> = { fashion: 'Moda', electronics: 'Electrónica', cosmetics: 'Cosmética' };

export default function InventoryProductsPage() {
  const locale = useLocale();
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

  if (locale === 'en') {
    return <InventoryShell>
      <header className="topbar"><div><div className="eyebrow">TrackFlow Ops · Los Angeles and Zaragoza warehouses</div><h1>Inventory</h1></div><div className="inventory-header-actions"><button className="inventory-refresh" type="button" onClick={() => void load()} disabled={loading}>{loading ? 'Refreshing…' : '↻ Refresh'}</button></div></header>
      <div className="kpi-grid inventory-kpis"><KpiCard label="Registered SKUs" value={products.length} note="Inventory catalog" /><KpiCard label="Units in stock" value={stockMetrics.totalUnits.toLocaleString('en-US')} note="Current total stock" /><KpiCard label="Low stock" value={stockMetrics.lowStockCount} note="SKUs below 20 units" noteVariant="alert" /><KpiCard label="Movements" value={orders.length} note="Inbound and outbound records" /></div>
      <section className="inventory-table-panel" aria-labelledby="products-heading"><div className="inventory-toolbar"><div><p className="eyebrow">Stock on hand</p><h2 id="products-heading">Registered SKUs</h2></div><div className="inventory-filters"><label className="visually-hidden" htmlFor="product-search">Search SKU, product, or client brand</label><input id="product-search" type="search" placeholder="Search SKU, product, or brand" value={search} onChange={(event) => setSearch(event.target.value)} /><label className="visually-hidden" htmlFor="product-warehouse">Filter warehouse</label><select id="product-warehouse" value={warehouse} onChange={(event) => setWarehouse(event.target.value)}><option value="">All warehouses</option><option value="LA">Los Angeles</option><option value="ZGZ">Zaragoza</option></select></div></div>
        {error && <div className="inventory-error" role="alert"><span>{error}</span><button type="button" onClick={() => void load()}>Retry</button></div>}
        {loading ? <p className="inventory-state" role="status">Loading products…</p> : !error && filtered.length === 0 ? <p className="inventory-state">{products.length ? 'No products match your search.' : 'No SKUs are registered.'}</p> : !error && <div className="inventory-table-wrap"><table className="inventory-table inventory-full-table"><caption className="visually-hidden">SKU, product name, client brand, warehouse, category, and current stock</caption><thead><tr><th>SKU / Product</th><th>Client brand</th><th>Warehouse</th><th>Category</th><th>Current stock</th><th>Orders</th></tr></thead><tbody>{filtered.map((product) => <tr key={product.id}><td><span className="sku">{product.sku}</span><br /><span className="warehouse">{product.name}</span></td><td>{product.client_name}</td><td>{product.warehouse === 'LA' ? 'Los Angeles' : 'Zaragoza'}</td><td>{product.category === 'fashion' ? 'Fashion' : product.category === 'electronics' ? 'Electronics' : 'Cosmetics'}</td><td><span className={`status ${product.current_stock < 20 ? 'warn' : 'ok'}`}>{product.current_stock < 20 ? '⚠ Low stock · ' : '✓ Healthy · '}{product.current_stock}</span></td><td><div className="inventory-row-actions"><Link href={`${localizedPath('/inventory/orders/inbound', 'en')}?sku_id=${product.id}`}>Inbound</Link><Link href={`${localizedPath('/inventory/orders/outbound', 'en')}?sku_id=${product.id}`}>Outbound</Link></div></td></tr>)}</tbody></table></div>}
        {!loading && !error && filtered.length > 0 && <p className="inventory-result-count">Showing {filtered.length} of {products.length} SKUs</p>}
      </section>
      <div className="content-grid inventory-lower-grid"><section className="panel inventory-recent-panel"><div className="panel-heading"><h2>Recent orders</h2><Link className="inventory-open-link" href={localizedPath('/inventory/orders', 'en')}>View history →</Link></div>{loading ? <p className="inventory-state" role="status">Loading orders…</p> : recentOrders.length === 0 ? <p className="inventory-state">No movements recorded.</p> : <div className="inventory-table-wrap"><table className="inventory-table inventory-full-table"><thead><tr><th>SKU / Product</th><th>Type</th><th>Quantity</th><th>Date</th></tr></thead><tbody>{recentOrders.map((order) => <tr key={`${order.type}-${order.id}`}><td><span className="sku">{order.sku}</span><br /><span className="warehouse">{order.name}</span></td><td><span className={`status ${order.type === 'inbound' ? 'ok' : 'warn'}`}>{order.type === 'inbound' ? 'Inbound' : 'Outbound'}</span></td><td>{order.type === 'inbound' ? '+' : '−'}{order.quantity}</td><td>{new Date(order.created_at).toLocaleDateString('en-US')}</td></tr>)}</tbody></table></div>}</section><section className="inventory-promo"><span aria-hidden="true">↗</span><div><strong>Manage stock movements</strong><p>Record receipts and outbound movements with full traceability.</p></div><Link className="primary-button" href={localizedPath('/inventory/orders/inbound', 'en')}>Create inbound order</Link></section></div>
    </InventoryShell>;
  }

  return <InventoryShell>
    <header className="topbar"><div><div className="eyebrow">TrackFlow Ops · Almacenes de Los Ángeles y Zaragoza</div><h1>Inventario</h1></div><div className="inventory-header-actions"><button className="inventory-refresh" type="button" onClick={() => void load()} disabled={loading}>{loading ? 'Actualizando…' : '↻ Actualizar'}</button></div></header>
    <div className="kpi-grid inventory-kpis"><KpiCard label="SKU registrados" value={products.length} note="Catálogo de inventario" /><KpiCard label="Unidades en stock" value={stockMetrics.totalUnits.toLocaleString('es-ES')} note="Stock actual total" /><KpiCard label="Stock bajo" value={stockMetrics.lowStockCount} note="SKU por debajo de 20 unidades" noteVariant="alert" /><KpiCard label="Movimientos" value={orders.length} note="Entradas y salidas registradas" /></div>
    <section className="inventory-table-panel" aria-labelledby="products-heading"><div className="inventory-toolbar"><div><p className="eyebrow">Existencias</p><h2 id="products-heading">SKU registrados</h2></div><div className="inventory-filters"><label className="visually-hidden" htmlFor="product-search">Buscar SKU, producto o marca cliente</label><input id="product-search" type="search" placeholder="Buscar SKU, producto o marca" value={search} onChange={(event) => setSearch(event.target.value)} /><label className="visually-hidden" htmlFor="product-warehouse">Filtrar almacén</label><select id="product-warehouse" value={warehouse} onChange={(event) => setWarehouse(event.target.value)}><option value="">Todos los almacenes</option><option value="LA">Los Ángeles</option><option value="ZGZ">Zaragoza</option></select></div></div>
      {error && <div className="inventory-error" role="alert"><span>{error}</span><button type="button" onClick={() => void load()}>Reintentar</button></div>}
      {loading ? <p className="inventory-state" role="status">Cargando productos…</p> : !error && filtered.length === 0 ? <p className="inventory-state">{products.length ? 'No hay productos que coincidan con la búsqueda.' : 'No hay SKU registrados. Comprueba la carga de datos de desarrollo.'}</p> : !error && <div className="inventory-table-wrap"><table className="inventory-table inventory-full-table"><caption className="visually-hidden">SKU, nombre, marca cliente, almacén, categoría y stock actual</caption><thead><tr><th>SKU / Producto</th><th>Marca cliente</th><th>Almacén</th><th>Categoría</th><th>Stock actual</th><th>Órdenes</th></tr></thead><tbody>{filtered.map((product) => {
        // El umbral de alerta de la vista es menos de 20 unidades; el backend no define un umbral por SKU.
        const lowStock = product.current_stock < 20;
        return <tr key={product.id}><td><span className="sku">{product.sku}</span><br /><span className="warehouse">{product.name}</span></td><td>{product.client_name}</td><td>{warehouseNames[product.warehouse]}</td><td>{categoryNames[product.category]}</td><td><span className={`status ${lowStock ? 'warn' : 'ok'}`}>{lowStock ? '⚠ Stock bajo · ' : '✓ Saludable · '}{product.current_stock}</span></td><td><div className="inventory-row-actions"><Link href={`/inventory/orders/inbound?sku_id=${product.id}`}>Entrada</Link><Link href={`/inventory/orders/outbound?sku_id=${product.id}`}>Salida</Link></div></td></tr>;
      })}</tbody></table></div>}
      {!loading && !error && filtered.length > 0 && <p className="inventory-result-count">Mostrando {filtered.length} de {products.length} SKU</p>}
    </section>
    <div className="content-grid inventory-lower-grid"><section className="panel inventory-recent-panel"><div className="panel-heading"><h2>Órdenes recientes</h2><Link className="inventory-open-link" href="/inventory/orders">Ver historial →</Link></div>{loading ? <p className="inventory-state" role="status">Cargando órdenes…</p> : recentOrders.length === 0 ? <p className="inventory-state">No hay movimientos registrados.</p> : <div className="inventory-table-wrap"><table className="inventory-table inventory-full-table"><thead><tr><th>SKU / Producto</th><th>Tipo</th><th>Cantidad</th><th>Fecha</th></tr></thead><tbody>{recentOrders.map((order) => <tr key={`${order.type}-${order.id}`}><td><span className="sku">{order.sku}</span><br /><span className="warehouse">{order.name}</span></td><td><span className={`status ${order.type === 'inbound' ? 'ok' : 'warn'}`}>{order.type === 'inbound' ? 'Entrada' : 'Salida'}</span></td><td>{order.type === 'inbound' ? '+' : '−'}{order.quantity}</td><td>{new Date(order.created_at).toLocaleDateString('es-ES')}</td></tr>)}</tbody></table></div>}</section><section className="inventory-promo"><span aria-hidden="true">↗</span><div><strong>Gestiona los movimientos de stock</strong><p>Registra recepciones y salidas con trazabilidad.</p></div><Link className="primary-button" href="/inventory/orders/inbound">Crear una entrada</Link></section></div>
  </InventoryShell>;
}
