import { notFound, redirect } from 'next/navigation';
import EnglishHomePage from '../../../components/EnglishHomePage';
import LoginPage from '../../login/page';
import RegisterPage from '../../register/page';
import ForgotPasswordPage from '../../forgot-password/page';
import ResetPasswordPage from '../../reset-password/page';
import ChangePasswordPage from '../../account/change-password/page';
import OpsPage from '../../ops/page';
import InventoryProductsPage from '../../inventory/products/page';
import InventoryOrdersPage from '../../inventory/orders/page';
import InboundOrderPage from '../../inventory/orders/inbound/page';
import OutboundOrderPage from '../../inventory/orders/outbound/page';
import NewIncidentPage from '../../incidents/new/page';
import SuppliersPage from '../../suppliers/page';
import CandidatesPage from '../../candidates/page';
import CandidateDetailPage from '../../candidates/[id]/page';
import EnglishIncidentsPage from '../../../components/EnglishIncidentsPage';

type EnglishRouteProps = { params: Promise<{ segments?: string[] }> };

export default async function EnglishRoute({ params }: EnglishRouteProps) {
  const segments = (await params).segments ?? [];
  const path = segments.join('/');

  switch (path) {
    case '': return <EnglishHomePage />;
    case 'login': return <LoginPage />;
    case 'register': return <RegisterPage />;
    case 'forgot-password': return <ForgotPasswordPage />;
    case 'reset-password': return <ResetPasswordPage />;
    case 'account/change-password': return <ChangePasswordPage />;
    case 'ops': return <OpsPage />;
    case 'inventory': redirect('/en/inventory/products');
    case 'inventory/products': return <InventoryProductsPage />;
    case 'inventory/orders': return <InventoryOrdersPage />;
    case 'inventory/orders/inbound': return <InboundOrderPage />;
    case 'inventory/orders/outbound': return <OutboundOrderPage />;
    case 'incidents': return <EnglishIncidentsPage />;
    case 'incidents/new': return <NewIncidentPage />;
    case 'suppliers': return <SuppliersPage />;
    case 'candidates': return <CandidatesPage />;
    default:
      if (segments.length === 2 && segments[0] === 'candidates') return <CandidateDetailPage />;
      notFound();
  }
}