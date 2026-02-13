export interface FormData {
  // Identity
  fullName: string;
  email: string;
  phone: string;
  
  // Logic
  clientType: 'active' | 'new' | null;
  
  // Conditional
  businessName?: string;
  industry?: string;
  requestedService: string;
  
  // Details
  budgetRange: string;
  message: string;
  
  // Legal
  consent: boolean;
}

export type FormErrors = Partial<Record<keyof FormData, string>>;

export const INDUSTRIES = [
  "E-Commerce",
  "Servicios Profesionales",
  "Agencia / Marketing",
  "Salud / Bienestar",
  "Bienes Raíces",
  "Tecnología / SaaS",
  "Educación",
  "Finanzas",
  "Otro"
];

export const SERVICE_OPTIONS = [
  "Automatización de Procesos",
  "Agentes de IA",
  "Desarrollo Web / Landing",
  "Integraciones CRM",
  "Consultoría Estratégica",
  "Otro"
];

export const BUDGET_RANGES = [
  "$60 - $150 USD",
  "$150 - $300 USD",
  "$300 - $600 USD",
  "$600 - $1,000 USD",
  "+ $1,000 USD"
];