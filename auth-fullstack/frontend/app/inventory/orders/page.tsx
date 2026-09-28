'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import InventoryShell from '../InventoryShell';
import { getInventoryOrders, InventoryOrder } from '../../../lib/inventory';

export default function InventoryOrdersPage() {
  const [orders, setOrders] = useState<InventoryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setOrders(await getInventoryOrders()); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el historial.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  return <InventoryShell><header className="topbar"><div><div className="eyebrow">Inventario · Auditoría</div><h1>Historial de órdenes</h1><p className="inventory-intro">Consulta los movimientos registrados; esta vista es de solo lectura.</p></div><div className="inventory-header-actions"><button className="inventory-refresh" type="button" onClick={() => void load()} disabled={loading}>{loading ? 'Actualizando…' : '↻ Actualizar'}</button><Link className="inventory-back" href="/inventory/products">← Volver a productos</Link></div></header><nav className="inventory-actions" aria-label="Acciones de inventario"><Link className="inventory-action" href="/inventory/orders/inbound">＋ Registrar entrada</Link><Link className="inventory-action" href="/inventory/orders/outbound">− Registrar salida</Link></nav><section className="inventory-table-panel" aria-labelledby="orders-heading"><div className="inventory-toolbar"><div><p className="eyebrow">Registro auditable</p><h2 id="orders-heading">Movimientos de stock</h2></div></div>{error && <div className="inventory-error" role="alert"><span>{error}</span><button type="button" onClick={() => void load()}>Reintentar</button></div>}{loading ? <p className="inventory-state" role="status">Cargando historial…</p> : !error && orders.length === 0 ? <p className="inventory-state">No hay movimientos registrados.</p> : !error && <div className="inventory-table-wrap"><table className="inventory-table inventory-full-table"><caption className="visually-hidden">Historial de entradas y salidas con producto, cantidad, fecha y usuario</caption><thead><tr><th>Fecha</th><th>Tipo</th><th>Producto / SKU</th><th>Cliente</th><th>Cantidad</th><th>Almacén</th><th>Referencia / seguimiento</th><th>Usuario (UUID)</th></tr></thead><tbody>{orders.map((order) => { const inbound = order.type === 'inbound'; return <tr key={`${order.type}-${order.id}`}><td>{new Date(order.created_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</td><td><span className={`status ${inbound ? 'ok' : 'warn'}`}>{inbound ? 'Entrada' : order.exit_type === 'loss' ? 'Salida · pérdida' : 'Salida · despacho'}</span></td><td><span className="sku">{order.sku}</span><br /><span className="warehouse">{order.name}</span></td><td>{order.client_name}</td><td>{inbound ? '+' : '−'}{order.quantity}</td><td>{order.warehouse}</td><td>{order.reference ?? order.tracking_number ?? '—'}</td><td><code className="inventory-user-id">{order.user_uuid}</code></td></tr>; })}</tbody></table></div>}</section></InventoryShell>;
}
