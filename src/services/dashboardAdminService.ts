import api from '../lib/api';

/* ------------------------------------------------------------------ */
/* Types                                                              */
/* ------------------------------------------------------------------ */
export interface ClientRequest {
  id: number;
  user_id: number;
  user: {
    id: number;
    fullName: string;
    email: string;
    // ⇧ ajoute d'autres champs utilisateur si besoin
  };
}

export interface Partner {
  id: number;
  user_id: number;
}

export interface Organizer {
  id: number;
  user_id: number;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */
const withAuth = (token: string) => ({
  headers: { Authorization: `Bearer ${token}` },
});

/* ------------------------------------------------------------------ */
/* PARTNER                                                            */
/* ------------------------------------------------------------------ */
export const fetchPartnerRequests = (token: string) =>
  api.get<ClientRequest[]>('/admin/partners', withAuth(token));

export const acceptPartnerRequest = (clientId: number, token: string) =>
  api.post<{ partner: Partner; message: string }>(
    '/admin/accept-partners-request',
    { clientId },
    withAuth(token),
  );

export const declinePartnerRequest = (clientId: number, token: string) =>
  api.post<{ message: string }>(
    '/admin/decline-partners-request',
    { clientId },
    withAuth(token),
  );

export const sendPartnerRequest = (token: string) =>
  api.post<{ message: string }>(
    '/client/request-partner',
    withAuth(token),
  );

/* ------------------------------------------------------------------ */
/* ORGANIZER                                                          */
/* ------------------------------------------------------------------ */
export const fetchOrganizerRequests = (token: string) =>
  api.get<ClientRequest[]>('/admin/organizers', withAuth(token));

export const acceptOrganizerRequest = (clientId: number, token: string) =>
  api.post<{ organizer: Organizer; message: string }>(
    '/admin/accept-organizers-request',
    { clientId },
    withAuth(token),
  );

export const declineOrganizerRequest = (clientId: number, token: string) =>
  api.post<{ message: string }>(
    '/admin/decline-organizers-request',
    { clientId },
    withAuth(token),
  );

export const sendOrganizerRequest = (token: string, formData?: any) =>
  api.post<{ message: string }>(
    '/client/request-organizer',
    formData || {},
    withAuth(token),
  );
