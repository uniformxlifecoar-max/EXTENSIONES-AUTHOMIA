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
  socialLinks: string[]; // New field for URLs
  
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

// Updated Premium Services List
export const SERVICES_LIST = [
  { id: 'lead-acquisition', title: 'Lead Acquisition Automation', desc: 'Captación Inteligente de Leads' },
  { id: 'customer-experience', title: 'Customer Experience Automation', desc: 'Atención al Cliente Automatizada' },
  { id: 'sales-admin', title: 'Sales Administration Automation', desc: 'Administrador de Ventas Digital' },
  { id: 'appointment-setter', title: 'Appointment Setter System', desc: 'Sistema Automatizado de Agendamiento' },
  { id: 'personal-brand', title: 'Personal Brand Automation', desc: 'Marca Personal & Publicación' },
  { id: 'ai-secretary', title: 'AI Secretary Agent', desc: 'Agente Secretario Digital' },
  { id: 'custom-solution', title: 'Custom Automation Solution', desc: 'Solución 100% a Medida' },
  { id: 'not-sure', title: "I'm Not Sure Yet", desc: 'Consultoría de Exploración' },
];

// Keep for backward compatibility if needed, but UI uses SERVICES_LIST
export const SERVICE_OPTIONS = SERVICES_LIST.map(s => s.title);

export const BUDGET_RANGES = [
  "$60 - $150 USD",
  "$150 - $300 USD",
  "$300 - $600 USD",
  "$600 - $1,000 USD",
  "+ $1,000 USD"
];