import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ArrowLeft, CheckCircle2, Loader2, 
  Building2, User, Sparkles, Search, ChevronDown, Check
} from 'lucide-react';
import emailjs from '@emailjs/browser';
import { FormData, FormErrors, INDUSTRIES, SERVICE_OPTIONS, BUDGET_RANGES } from '../types';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { TextArea } from './ui/TextArea';

// --- Constants ---
const COUNTRIES = [
  { name: "Perú", code: "+51", flag: "🇵🇪" },
  { name: "México", code: "+52", flag: "🇲🇽" },
  { name: "Colombia", code: "+57", flag: "🇨🇴" },
  { name: "Chile", code: "+56", flag: "🇨🇱" },
  { name: "Argentina", code: "+54", flag: "🇦🇷" },
  { name: "España", code: "+34", flag: "🇪🇸" },
  { name: "Estados Unidos", code: "+1", flag: "🇺🇸" },
  { name: "Ecuador", code: "+593", flag: "🇪🇨" },
  { name: "Venezuela", code: "+58", flag: "🇻🇪" },
  { name: "Bolivia", code: "+591", flag: "🇧🇴" },
  { name: "Uruguay", code: "+598", flag: "🇺🇾" },
  { name: "Paraguay", code: "+595", flag: "🇵🇾" },
  { name: "Panamá", code: "+507", flag: "🇵🇦" },
  { name: "Costa Rica", code: "+506", flag: "🇨🇷" },
  { name: "Rep. Dominicana", code: "+1-809", flag: "🇩🇴" },
  { name: "Guatemala", code: "+502", flag: "🇬🇹" },
  { name: "Honduras", code: "+504", flag: "🇭🇳" },
  { name: "El Salvador", code: "+503", flag: "🇸🇻" },
  { name: "Nicaragua", code: "+505", flag: "🇳🇮" },
  { name: "Brasil", code: "+55", flag: "🇧🇷" },
  { name: "Canadá", code: "+1", flag: "🇨🇦" },
  { name: "Reino Unido", code: "+44", flag: "🇬🇧" },
  { name: "Francia", code: "+33", flag: "🇫🇷" },
  { name: "Alemania", code: "+49", flag: "🇩🇪" },
  { name: "Italia", code: "+39", flag: "🇮🇹" },
  { name: "Australia", code: "+61", flag: "🇦🇺" },
  { name: "Japón", code: "+81", flag: "🇯🇵" },
  { name: "China", code: "+86", flag: "🇨🇳" },
  { name: "India", code: "+91", flag: "🇮🇳" },
  { name: "Otro", code: "+", flag: "🌍" },
];

const INITIAL_DATA: FormData = {
  fullName: '', email: '', phone: '',
  clientType: null, businessName: '', industry: '',
  requestedService: '', budgetRange: '',
  message: '', consent: false,
};

// --- Animations ---
const fadeVariants = {
  hidden: { opacity: 0, x: 20, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    x: 0, 
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    x: -20, 
    filter: "blur(10px)",
    transition: { duration: 0.4 }
  }
};

export const ContactForm: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Intro, 1: ID, 2: Type, 3: Details, 4: Budget/Msg, 5: Success
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Country Selector State
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]); // Default to Peru
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Close country dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter countries
  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) || 
    c.code.includes(countrySearch)
  );

  // --- Helpers ---
  const updateData = (field: keyof FormData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (currentStep === 1) { // Identity
      if (!data.fullName.trim()) newErrors.fullName = "Nombre requerido";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!data.email.trim()) newErrors.email = "Email requerido";
      else if (!emailRegex.test(data.email)) newErrors.email = "Email inválido";
      if (!data.phone.trim()) newErrors.phone = "Teléfono requerido";
    }
    else if (currentStep === 2) { // Type
      if (!data.clientType) newErrors.clientType = "Debes seleccionar una opción";
    }
    else if (currentStep === 3) { // Logic based details
      if (data.clientType === 'active') {
        if (!data.businessName?.trim()) newErrors.businessName = "Nombre de empresa requerido";
        if (!data.industry) newErrors.industry = "Industria requerida";
      }
      if (!data.requestedService) newErrors.requestedService = "Selecciona un servicio de interés";
    }
    else if (currentStep === 4) { // Final
      if (!data.budgetRange) { newErrors.budgetRange = "Selecciona un rango"; isValid = false; }
      if (!data.consent) { newErrors.consent = "Debes aceptar los términos"; isValid = false; }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && isValid;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(step)) return;

    setIsSubmitting(true);
    
    // Construct params for EmailJS template
    const templateParams = {
      fullName: data.fullName,
      email: data.email,
      phone: `(${selectedCountry.code}) ${data.phone}`,
      clientType: data.clientType === 'active' ? 'Empresa Activa' : 'Nuevo Proyecto',
      businessName: data.clientType === 'active' ? data.businessName : 'N/A',
      industry: data.clientType === 'active' ? data.industry : 'N/A',
      requestedService: data.requestedService,
      budgetRange: data.budgetRange,
      message: data.message || 'Sin mensaje adicional',
      time: new Date().toLocaleString()
    };

    try {
      await emailjs.send(
        'service_7ieot2b',
        'template_1g2lhne',
        templateParams,
        'UdYJxT79gfFalNHtU'
      );
      setStep(5);
    } catch (e) {
      console.error(e);
      alert("Hubo un error de conexión. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Steps ---

  const renderIntro = () => (
    <div className="text-center space-y-12 py-12 relative z-10 flex flex-col items-center">
       <motion.div 
         initial={{ opacity: 0, scale: 0.9 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ duration: 0.8 }}
         className="w-full flex justify-center mb-4"
       >
         {/* Decorative Badge */}
         <div className="px-4 py-1.5 rounded-full border border-authomia-blueLight/30 bg-authomia-blue/20 backdrop-blur-md">
           <span className="text-[10px] uppercase tracking-[0.3em] text-authomia-text font-medium">Protocolo de Inicio</span>
         </div>
       </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium text-white tracking-tight leading-[0.9]">
          ELEVATE YOUR <br />
          <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-authomia-text via-gray-300 to-gray-500">
            BUSINESS
          </span>
        </h2>
        <p className="text-authomia-subtext max-w-lg mx-auto text-sm leading-relaxed tracking-wide font-light border-t border-authomia-blueLight/20 pt-8 mt-4">
          Un sistema inteligente para filtrar, conectar y escalar.
        </p>
      </motion.div>
      
      <motion.button 
        onClick={() => setStep(1)}
        whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(21, 46, 77, 0.6)" }}
        whileTap={{ scale: 0.98 }}
        className="group relative inline-flex items-center gap-6 px-12 py-5 bg-gradient-to-r from-authomia-blue to-[#152e4d] text-white font-display font-semibold text-xs tracking-[0.2em] uppercase rounded-lg shadow-glow-blue transition-all duration-500 border border-authomia-blueLight/30 overflow-hidden"
      >
        <span className="relative z-10">Iniciar Diagnóstico</span>
        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
      </motion.button>
    </div>
  );

  const renderIdentity = () => (
    <div className="space-y-8">
      <div className="mb-8">
        <h3 className="text-3xl font-display font-bold text-white tracking-wide">Identidad</h3>
        <p className="text-sm text-authomia-subtext mt-2">Paso 01 — Cuéntanos quién eres para comenzar.</p>
      </div>
      <div className="space-y-6">
        <Input label="Nombre Completo" value={data.fullName} onChange={e => updateData('fullName', e.target.value)} error={errors.fullName} autoFocus />
        <Input label="Correo Electrónico" type="email" value={data.email} onChange={e => updateData('email', e.target.value)} error={errors.email} />
        
        {/* Custom Phone Input with Country Selector */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2 w-full group relative z-50"
        >
          <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-authomia-subtext flex justify-between group-focus-within:text-authomia-blueLight transition-colors duration-300">
            WhatsApp / Teléfono
          </label>
          
          <div className="flex gap-2">
            {/* Country Dropdown Trigger */}
            <div className="relative" ref={countryDropdownRef}>
              <button
                type="button"
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                className={`
                  flex items-center gap-2 h-full bg-authomia-input border border-authomia-border rounded-lg px-4 py-4
                  text-authomia-text font-sans text-sm min-w-[120px] justify-between
                  hover:border-gray-700 transition-all duration-300
                  focus:outline-none focus:border-authomia-blueLight
                  ${isCountryOpen ? 'border-authomia-blueLight bg-[#131b26]' : ''}
                `}
              >
                <span className="text-lg">{selectedCountry.flag}</span>
                <span className="font-medium text-gray-300">{selectedCountry.code}</span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isCountryOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Content */}
              <AnimatePresence>
                {isCountryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-[300px] max-h-[300px] bg-[#0F1115] border border-authomia-border rounded-xl shadow-2xl overflow-hidden flex flex-col z-[100]"
                  >
                    {/* Search Bar */}
                    <div className="p-3 border-b border-authomia-border sticky top-0 bg-[#0F1115] z-10">
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input 
                          type="text"
                          placeholder="Buscar país..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full bg-[#1A1D24] border border-authomia-border rounded-md py-2 pl-9 pr-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-authomia-blueLight"
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto custom-scrollbar flex-1 p-1">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <button
                            key={country.name}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setIsCountryOpen(false);
                              setCountrySearch("");
                            }}
                            className={`
                              w-full flex items-center justify-between px-3 py-2.5 rounded-md text-left transition-colors
                              ${selectedCountry.code === country.code ? 'bg-authomia-blue/20 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{country.flag}</span>
                              <span className="text-xs font-medium">{country.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{country.code}</span>
                              {selectedCountry.code === country.code && <Check size={12} className="text-authomia-blueLight" />}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-4 text-center text-xs text-gray-500">
                          No se encontraron resultados
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Phone Number Input */}
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => {
                // Only allow numbers and basic symbols
                const val = e.target.value.replace(/[^0-9\s-]/g, '');
                updateData('phone', val);
              }}
              placeholder="999 999 999"
              className={`
                flex-1 bg-authomia-input border border-authomia-border rounded-lg px-5 py-4
                text-authomia-text placeholder-gray-600 transition-all duration-300
                font-sans tracking-wide text-sm shadow-sm
                focus:outline-none focus:border-authomia-blueLight focus:bg-[#131b26] focus:shadow-glow-blue
                hover:border-gray-700
                ${errors.phone ? 'border-red-800 focus:border-red-600 focus:shadow-glow-red text-red-100' : ''}
              `}
            />
          </div>
          {errors.phone && <span className="text-[10px] text-red-400 mt-1 pl-1 font-semibold uppercase tracking-wider">{errors.phone}</span>}
        </motion.div>
      </div>
    </div>
  );

  const renderClientType = () => (
    <div className="space-y-8">
       <div className="mb-8">
        <h3 className="text-3xl font-display font-bold text-white tracking-wide">Contexto</h3>
        <p className="text-sm text-authomia-subtext mt-2">Paso 02 — ¿En qué etapa se encuentra tu proyecto?</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.button
          whileHover={{ y: -8, borderColor: '#7A0F1A', boxShadow: "0 0 30px rgba(122, 15, 26, 0.3)" }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => updateData('clientType', 'active')}
          className={`
            p-8 border rounded-xl flex flex-col items-center text-center gap-4 transition-all duration-300 relative overflow-hidden group
            ${data.clientType === 'active' 
              ? 'bg-authomia-blue/20 border-authomia-red shadow-glow-red' 
              : 'bg-authomia-input border-authomia-border hover:bg-authomia-blue/5 hover:border-authomia-red/50'}
          `}
        >
          <div className={`p-4 rounded-full transition-colors duration-300 ${data.clientType === 'active' ? 'bg-authomia-red text-white' : 'bg-authomia-border text-gray-400 group-hover:text-white group-hover:bg-authomia-red/80'}`}>
             <Building2 size={28} />
          </div>
          <div className="space-y-2">
            <span className="text-lg font-display font-bold text-white block group-hover:text-authomia-redLight transition-colors">Empresa Activa</span>
            <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300">Ya operamos y buscamos optimizar procesos o escalar.</p>
          </div>
          {/* Subtle sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </motion.button>
        
        <motion.button
          whileHover={{ y: -8, borderColor: '#1E4060', boxShadow: "0 0 30px rgba(30, 64, 96, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={() => updateData('clientType', 'new')}
           className={`
            p-8 border rounded-xl flex flex-col items-center text-center gap-4 transition-all duration-300 relative overflow-hidden group
            ${data.clientType === 'new' 
              ? 'bg-authomia-blue/20 border-authomia-blueLight shadow-glow-blue' 
              : 'bg-authomia-input border-authomia-border hover:bg-authomia-blue/5 hover:border-authomia-blueLight/50'}
          `}
        >
          <div className={`p-4 rounded-full transition-colors duration-300 ${data.clientType === 'new' ? 'bg-authomia-blueLight text-white' : 'bg-authomia-border text-gray-400 group-hover:text-white group-hover:bg-authomia-blueLight/80'}`}>
            <User size={28} />
          </div>
          <div className="space-y-2">
             <span className="text-lg font-display font-bold text-white block group-hover:text-authomia-blueLight transition-colors">Nuevo Proyecto</span>
             <p className="text-xs text-gray-400 leading-relaxed group-hover:text-gray-300">Tengo una idea o estoy comenzando desde cero.</p>
          </div>
          {/* Subtle sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </motion.button>
      </div>
      {errors.clientType && <p className="text-center text-red-500 text-xs font-medium mt-4">{errors.clientType}</p>}
    </div>
  );

  const renderDetails = () => (
    <div className="space-y-8">
      <div className="mb-8">
        <h3 className="text-3xl font-display font-bold text-white tracking-wide">Detalles</h3>
        <p className="text-sm text-authomia-subtext mt-2">Paso 03 — Profundicemos en tus necesidades.</p>
      </div>

      <AnimatePresence mode="wait">
        {data.clientType === 'active' ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Input label="Nombre de la Empresa" value={data.businessName} onChange={e => updateData('businessName', e.target.value)} error={errors.businessName} />
            <Select label="Industria / Sector" options={INDUSTRIES} value={data.industry} onChange={e => updateData('industry', e.target.value)} error={errors.industry} />
            <Select label="Servicio de Interés" options={SERVICE_OPTIONS} value={data.requestedService} onChange={e => updateData('requestedService', e.target.value)} error={errors.requestedService} />
          </motion.div>
        ) : (
           <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-4 bg-authomia-blue/10 border border-authomia-blueLight/30 rounded-lg mb-4">
              <p className="text-sm text-gray-300 italic">"Todo gran proyecto comienza con una visión clara."</p>
            </div>
            <Select label="¿Qué deseas implementar?" options={SERVICE_OPTIONS} value={data.requestedService} onChange={e => updateData('requestedService', e.target.value)} error={errors.requestedService} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderFinal = () => (
    <div className="space-y-8">
       <div className="mb-6">
        <h3 className="text-3xl font-display font-bold text-white tracking-wide">Cierre</h3>
        <p className="text-sm text-authomia-subtext mt-2">Paso 04 — Definamos la inversión y el mensaje.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-[11px] font-medium uppercase tracking-[0.15em] text-authomia-subtext mb-3 block">Rango de Inversión Estimada</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BUDGET_RANGES.map((range) => (
              <label 
                key={range}
                className={`
                  flex items-center px-4 py-3 border rounded-lg cursor-pointer transition-all duration-300 group
                  ${data.budgetRange === range 
                    ? 'bg-authomia-red/10 border-authomia-red text-white shadow-[0_0_15px_rgba(122,15,26,0.3)]' 
                    : 'bg-authomia-input border-authomia-border text-gray-500 hover:border-gray-500 hover:text-gray-300 hover:bg-white/5'}
                `}
              >
                <input 
                  type="radio" 
                  name="budget" 
                  className="hidden" 
                  value={range}
                  checked={data.budgetRange === range}
                  onChange={(e) => updateData('budgetRange', e.target.value)}
                />
                 <div className={`w-3 h-3 rounded-full mr-3 border transition-colors ${data.budgetRange === range ? 'bg-authomia-red border-authomia-red shadow-[0_0_8px_rgba(213,0,0,0.8)]' : 'border-gray-600 group-hover:border-gray-400'}`}></div>
                <span className="text-xs font-medium tracking-wide">{range}</span>
              </label>
            ))}
          </div>
          {errors.budgetRange && <span className="text-red-500 text-xs mt-2 block">{errors.budgetRange}</span>}
        </div>

        <TextArea 
          label="Cuéntanos brevemente qué tienes en mente"
          value={data.message}
          onChange={e => updateData('message', e.target.value)}
          placeholder="Describe tu visión, objetivos o dudas actuales..."
        />

        <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center pt-0.5">
                <input 
                  type="checkbox" 
                  className="peer sr-only"
                  checked={data.consent}
                  onChange={(e) => updateData('consent', e.target.checked)}
                />
                <div className={`w-5 h-5 border rounded transition-all duration-300 flex items-center justify-center ${data.consent ? 'bg-authomia-blue border-authomia-blueLight shadow-glow-blue' : 'border-gray-600 group-hover:border-gray-400'}`}>
                  {data.consent && <CheckCircle2 size={12} className="text-white" />}
                </div>
              </div>
              <span className="text-xs text-gray-400 leading-tight select-none group-hover:text-gray-300 transition-colors">
                 Acepto que Authomia Agency se comunique conmigo vía correo electrónico para responder esta solicitud y compartir información relacionada con sus servicios.
              </span>
            </label>
            {errors.consent && <span className="text-red-500 text-xs mt-2 block ml-8">{errors.consent}</span>}
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-20 flex flex-col items-center justify-center min-h-[400px]">
      <motion.div 
        initial={{ scale: 0, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 1.5 }}
        className="w-24 h-24 rounded-full bg-gradient-to-tr from-authomia-blue to-authomia-red flex items-center justify-center mb-8 shadow-glow-blue relative"
      >
        <div className="absolute inset-0 rounded-full animate-pulse-slow bg-white/20 blur-xl"></div>
        <Sparkles size={40} className="text-white relative z-10" />
      </motion.div>
      <h2 className="text-4xl font-display font-bold text-white mb-6 tracking-tight">SOLICITUD RECIBIDA</h2>
      <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-authomia-redLight to-transparent mb-8"></div>
      <p className="text-gray-400 max-w-md mx-auto mb-10 text-sm leading-relaxed">
        Hemos recibido tu información correctamente.
        <br/><br/>
        Un especialista de Authomia analizará tu perfil y se pondrá en contacto contigo a la brevedad.
      </p>
      <motion.button 
        whileHover={{ scale: 1.05, color: "#fff" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => { setData(INITIAL_DATA); setStep(0); }}
        className="text-white/70 hover:text-white uppercase tracking-[0.2em] text-[10px] font-bold transition-colors border-b border-white/20 hover:border-white pb-1"
      >
        Volver al inicio
      </motion.button>
    </div>
  );

  // --- Main Layout ---

  return (
    <div className="w-full max-w-2xl mx-auto min-h-[600px] flex flex-col justify-center relative px-6 md:px-0">
      
      {/* Progress Dots */}
      {step > 0 && step < 5 && (
        <div className="absolute top-0 left-0 right-0 flex justify-center gap-2 mb-8">
          {[1, 2, 3, 4].map((i) => (
             <motion.div 
                key={i}
                initial={false}
                animate={{ 
                  backgroundColor: step >= i ? '#7A0F1A' : '#1F2937',
                  scale: step === i ? 1.5 : 1,
                  boxShadow: step === i ? "0 0 10px rgba(122, 15, 26, 0.8)" : "none"
                }}
                className="w-2 h-2 rounded-full transition-all duration-500"
             />
          ))}
        </div>
      )}

      <div className="relative pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            {step === 0 && renderIntro()}
            {step === 1 && renderIdentity()}
            {step === 2 && renderClientType()}
            {step === 3 && renderDetails()}
            {step === 4 && renderFinal()}
            {step === 5 && renderSuccess()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      {step > 0 && step < 5 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center mt-12 pt-8 border-t border-authomia-border"
        >
          <motion.button
            whileHover={{ x: -3, color: "#fff" }}
            onClick={prevStep}
            className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors px-4 py-2 uppercase text-[10px] tracking-[0.2em] font-medium"
          >
            <ArrowLeft size={14} />
            <span>Atrás</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(122, 15, 26, 0.5)" }}
            whileTap={{ scale: 0.98 }}
            onClick={step === 4 ? handleSubmit : nextStep}
            disabled={isSubmitting}
            className={`
              flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-xs tracking-[0.2em] uppercase transition-all duration-300 relative overflow-hidden group
              ${isSubmitting 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-authomia-blue to-authomia-red text-white shadow-lg border border-transparent hover:border-authomia-redLight/50'}
            `}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <span className="relative z-10">{step === 4 ? "Enviar Solicitud" : "Continuar"}</span>
                {step !== 4 && <ArrowRight size={14} className="relative z-10 group-hover:translate-x-1 transition-transform" />}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0"></div>
              </>
            )}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};