'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import InventoryShell from '../InventoryShell';
import { useLocale } from '../../../components/LocaleProvider';
import { deleteInventoryOrder, getInventoryOrders, InventoryOrder } from '../../../lib/inventory';

export default function InventoryOrdersPage() {
  const locale = useLocale();
  const [orders, setOrders] = useState<InventoryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [message, setMessage] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<InventoryOrder | null>(null);
  const detailDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!selectedOrder) return;
    detailDialog.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [selectedOrder]);
  const load = useCallback(async () => {
    setLoading(true); setError('');
    try { setOrders(await getInventoryOrders()); }
    catch (loadError) { setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el historial.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  async function removeOrder(order: InventoryOrder) {
    const prompt = locale === 'en'
      ? `Delete ${order.type === 'inbound' ? 'inbound' : 'outbound'} order for ${order.quantity} units of ${order.sku}? Stock will be recalculated.`
      : `¿Eliminar ${order.type === 'inbound' ? 'la entrada' : 'la salida'} de ${order.quantity} unidades de ${order.sku}? Se recalculará el stock.`;
    if (!window.confirm(prompt)) return;
    setDeleting(`${order.type}-${order.id}`);
    setActionError(''); setMessage('');
    try {
      await deleteInventoryOrder(order.type, order.id);
      setOrders((current) => current.filter((item) => item.type !== order.type || item.id !== order.id));
      setMessage('Movimiento eliminado. El stock se ha recalculado.');
    } catch (deleteError) {
      setActionError(deleteError instanceof Error ? deleteError.message : 'No se pudo eliminar el movimiento.');
    } finally { setDeleting(null); }
  }

  if (locale === 'en') {
    return <InventoryShell>
      <header className="topbar"><div><div className="eyebrow">Inventory · Audit</div><h1>Order history</h1><p className="inventory-intro">Recorded inbound and outbound movements</p></div><div className="inventory-header-actions"><button className="inventory-refresh" type="button" onClick={() => void load()} disabled={loading || deleting !== null}>{loading ? 'Refreshing…' : '↻ Refresh'}</button></div></header>
      {actionError && <p className="inventory-error" role="alert">{actionError}</p>}{message && <p className="inventory-success" role="status">Movement deleted. Stock has been recalculated.</p>}
      <section className="inventory-table-panel" aria-labelledby="orders-heading"><div className="inventory-toolbar"><div><p className="eyebrow">Movement log</p><h2 id="orders-heading">Stock movements</h2></div></div>
        {error && <div className="inventory-error" role="alert"><span>{error}</span><button type="button" onClick={() => void load()}>Retry</button></div>}
        {loading ? <p className="inventory-state" role="status">Loading history…</p> : !error && orders.length === 0 ? <p className="inventory-state">No movements recorded.</p> : !error && <div className="inventory-table-wrap"><table className="inventory-table inventory-full-table"><caption className="visually-hidden">Inbound and outbound orders, stock, references, and actions</caption><thead><tr><th>Date</th><th>Type</th><th>Product / SKU</th><th>Client</th><th>Quantity</th><th>Warehouse</th><th>Reference / tracking</th><th>Actions</th></tr></thead><tbody>{orders.map((order) => { const inbound = order.type === 'inbound'; const key = `${order.type}-${order.id}`; return <tr key={key}><td>{new Date(order.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td><td><span className={`status ${inbound ? 'ok' : 'warn'}`}>{inbound ? 'Inbound' : order.exit_type === 'loss' ? 'Outbound · loss' : 'Outbound · dispatch'}</span></td><td><span className="sku">{order.sku}</span><br /><span className="warehouse">{order.name}</span></td><td>{order.client_name}</td><td>{inbound ? '+' : '−'}{order.quantity}</td><td>{order.warehouse}</td><td>{order.reference ?? order.tracking_number ?? '—'}</td><td><div className="inventory-order-actions"><button className="inventory-refresh" type="button" onClick={() => setSelectedOrder(order)} aria-haspopup="dialog">View details</button><button className="inventory-refresh" type="button" disabled={deleting !== null} onClick={() => void removeOrder(order)} aria-label={`Delete ${inbound ? 'inbound' : 'outbound'} order ${order.id} for ${order.sku}`}>{deleting === key ? 'Deleting…' : 'Delete'}</button></div></td></tr>; })}</tbody></table></div>}
      </section>
      <dialog ref={detailDialog} className="inventory-order-dialog" aria-labelledby="order-detail-title" onClose={() => setSelectedOrder(null)}><header className="inventory-order-dialog-header"><h2 id="order-detail-title">Movement details</h2><button className="inventory-refresh" type="button" onClick={() => detailDialog.current?.close()} aria-label="Close details" title="Close details">×</button></header>{selectedOrder && <dl className="inventory-order-detail"><dt>Movement</dt><dd>{selectedOrder.type === 'inbound' ? 'Inbound' : 'Outbound'} #{selectedOrder.id}</dd><dt>Product</dt><dd>{selectedOrder.name} · {selectedOrder.sku} (ID {selectedOrder.sku_id})</dd><dt>Client brand</dt><dd>{selectedOrder.client_name}</dd><dt>Units / warehouse</dt><dd>{selectedOrder.quantity} · {selectedOrder.warehouse}</dd><dt>Date</dt><dd>{new Date(selectedOrder.created_at).toLocaleString('en-US')}</dd><dt>Reference</dt><dd>{selectedOrder.reference ?? '—'}</dd><dt>Outbound type</dt><dd>{selectedOrder.type === 'inbound' ? 'Not applicable' : selectedOrder.exit_type === 'loss' ? 'Loss' : 'Dispatch'}</dd><dt>Tracking</dt><dd>{selectedOrder.tracking_number ?? '—'}</dd><dt>User (UUID)</dt><dd>{selectedOrder.user_uuid}</dd></dl>}</dialog>
    </InventoryShell>;
  }

  return <InventoryShell>
    <header className="topbar"><div><div className="eyebrow">Inventario · Auditoría</div><h1>Historial de órdenes</h1><p className="inventory-intro">Entradas y salidas registradas</p></div><div className="inventory-header-actions"><button className="inventory-refresh" type="button" onClick={() => void load()} disabled={loading || deleting !== null}>{loading ? 'Actualizando…' : '↻ Actualizar'}</button><Link className="inventory-back" href="/inventory/products">← Volver a productos</Link></div></header>
    {actionError && <p className="inventory-error" role="alert">{actionError}</p>}
    {message && <p className="inventory-success" role="status">{message}</p>}
    <section className="inventory-table-panel" aria-labelledby="orders-heading">
      <div className="inventory-toolbar"><div><p className="eyebrow">Registro de movimientos</p><h2 id="orders-heading">Movimientos de stock</h2></div></div>
      {error && <div className="inventory-error" role="alert"><span>{error}</span><button type="button" onClick={() => void load()}>Reintentar</button></div>}
      {loading ? <p className="inventory-state" role="status">Cargando historial…</p> : !error && orders.length === 0 ? <p className="inventory-state">No hay movimientos registrados.</p> : !error && <div className="inventory-table-wrap">
        <table className="inventory-table inventory-full-table">
          <caption className="visually-hidden">Historial de entradas y salidas con detalles y acciones</caption>
          <thead><tr><th>Fecha</th><th>Tipo</th><th>Producto / SKU</th><th>Cliente</th><th>Cantidad</th><th>Almacén</th><th>Referencia / seguimiento</th><th>Acciones</th></tr></thead>
          <tbody>{orders.map((order) => {
            const inbound = order.type === 'inbound';
            const key = `${order.type}-${order.id}`;
            return <tr key={key}>
              <td>{new Date(order.created_at).toLocaleString('es-ES', { dateStyle: 'medium', timeStyle: 'short' })}</td>
              <td><span className={`status ${inbound ? 'ok' : 'warn'}`}>{inbound ? 'Entrada' : order.exit_type === 'loss' ? 'Salida · pérdida' : 'Salida · despacho'}</span></td>
              <td><span className="sku">{order.sku}</span><br /><span className="warehouse">{order.name}</span></td><td>{order.client_name}</td><td>{inbound ? '+' : '−'}{order.quantity}</td><td>{order.warehouse}</td><td>{order.reference ?? order.tracking_number ?? '—'}</td>
              <td><div className="inventory-order-actions"><button className="inventory-refresh" type="button" onClick={() => setSelectedOrder(order)} aria-haspopup="dialog">Ver detalle</button><button className="inventory-refresh" type="button" disabled={deleting !== null} onClick={() => void removeOrder(order)} aria-label={`Eliminar ${inbound ? 'entrada' : 'salida'} ${order.id} de ${order.sku}`}>{deleting === key ? 'Eliminando…' : 'Eliminar'}</button></div></td>
            </tr>;
          })}</tbody>
        </table>
      </div>}
    </section>
    <dialog ref={detailDialog} className="inventory-order-dialog" aria-labelledby="order-detail-title" onClose={() => setSelectedOrder(null)} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
    }}>
      <header className="inventory-order-dialog-header"><h2 id="order-detail-title">Detalle del movimiento</h2><button className="inventory-refresh" type="button" onClick={() => detailDialog.current?.close()} aria-label="Cerrar detalle" title="Cerrar detalle">&#215;</button></header>
      {selectedOrder && <dl className="inventory-order-detail">
        <dt>Movimiento</dt><dd>{selectedOrder.type === 'inbound' ? 'Entrada' : 'Salida'} #{selectedOrder.id}</dd>
        <dt>Producto</dt><dd>{selectedOrder.name} · {selectedOrder.sku} (ID {selectedOrder.sku_id})</dd>
        <dt>Marca cliente</dt><dd>{selectedOrder.client_name}</dd>
        <dt>Unidades / almacén</dt><dd>{selectedOrder.quantity} · {selectedOrder.warehouse}</dd>
        <dt>Fecha</dt><dd>{new Date(selectedOrder.created_at).toLocaleString('es-ES')}</dd>
        <dt>Referencia</dt><dd>{selectedOrder.reference ?? '—'}</dd>
        <dt>Tipo de salida</dt><dd>{selectedOrder.type === 'inbound' ? 'No aplica' : selectedOrder.exit_type === 'loss' ? 'Pérdida' : 'Despacho'}</dd>
        <dt>Seguimiento</dt><dd>{selectedOrder.tracking_number ?? '—'}</dd>
        <dt>Usuario (UUID)</dt><dd>{selectedOrder.user_uuid}</dd>
      </dl>}
    </dialog>
  </InventoryShell>;
}
