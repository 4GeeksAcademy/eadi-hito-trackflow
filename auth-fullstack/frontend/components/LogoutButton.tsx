'use client';

export default function LogoutButton() {
  return <form action="/api/auth/logout" method="post" onSubmit={() => localStorage.removeItem('trackflow_access_token')}><button className="side-link" type="submit">Cerrar sesión</button></form>;
}