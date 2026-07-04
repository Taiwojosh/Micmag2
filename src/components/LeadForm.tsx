import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, AlertTriangle, Send } from 'lucide-react';
import TrustPill from './TrustPill';
import { openWhatsApp } from '../utils/whatsapp';

const BRANCHES = [
  'Oworonshoki (Headquarters Depot)',
  'Sangotedo (Island Store)',
  'Alakija Store',
  'Ikorodu Store',
  'Ogombo Store',
  'Bogije Store',
];

export default function LeadForm() {
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    contactNumber: '',
    inquiryType: 'Both Paint Systems',
    targetBranch: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [touchedFields, setTouchedFields] = useState<{ [key: string]: boolean }>({});

  // Auto-load values from interactive paint studio events
  useEffect(() => {
    const handleApplyEstimate = (e: any) => {
      if (e.detail) {
        setFormData(prev => ({
          ...prev,
          inquiryType: e.detail.inquiryType || 'SANDTEX Paints',
          message: e.detail.message || ''
        }));
      }
    };
    window.addEventListener('applyPaintEstimate', handleApplyEstimate);
    return () => {
      window.removeEventListener('applyPaintEstimate', handleApplyEstimate);
    };
  }, []);

  const validateField = (name: string, value: string) => {
    let errorMsg = '';
    
    if (name === 'customerName') {
      if (!value.trim()) {
        errorMsg = 'Full Name is required';
      } else if (value.trim().length < 3) {
        errorMsg = 'Name must be at least 3 characters';
      }
    } else if (name === 'customerEmail') {
      if (!value.trim()) {
        errorMsg = 'Email address is required';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errorMsg = 'Enter a valid email address';
        }
      }
    } else if (name === 'contactNumber') {
      if (!value.trim()) {
        errorMsg = 'Phone number is required';
      } else {
        const nigerianPhoneRegex = /^((\+234|234|0)[789][01]\d{8})$/;
        const cleanedPhone = value.replace(/\s/g, '');
        if (!nigerianPhoneRegex.test(cleanedPhone)) {
          errorMsg = 'Valid Nigerian mobile required (e.g. 08031234567)';
        }
      }
    } else if (name === 'targetBranch') {
      if (!value) {
        errorMsg = 'Please select your nearest branch depot';
      }
    }
    
    return errorMsg;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (touchedFields[name]) {
      const err = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: err
      }));
    }
  };

  const handleBlur = (name: string) => {
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    const err = validateField(name, formData[name as keyof typeof formData] || '');
    setFieldErrors(prev => ({
      ...prev,
      [name]: err
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Touched triggers for all required fields
    const allTouched = {
      customerName: true,
      customerEmail: true,
      contactNumber: true,
      targetBranch: true,
    };
    setTouchedFields(allTouched);

    const errors = {
      customerName: validateField('customerName', formData.customerName),
      customerEmail: validateField('customerEmail', formData.customerEmail),
      contactNumber: validateField('contactNumber', formData.contactNumber),
      targetBranch: validateField('targetBranch', formData.targetBranch),
    };

    setFieldErrors(errors);

    const hasErrors = Object.values(errors).some(err => err !== '');
    if (hasErrors) {
      setError('Please correct the highlighted validation errors before submitting.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // 1. Post to local database server API (leads.json backend)
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          contactNumber: formData.contactNumber,
          inquiryType: formData.inquiryType,
          targetBranch: formData.targetBranch || 'Main HQ (Oworonshoki)',
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Could not submit inquiry to server database.');
      }

      setSuccess(true);
      
      // 2. Format Whatsapp message and open standard chat redirect
      const text = `Hello Micmag!\n\nName: ${formData.customerName}\nEmail: ${formData.customerEmail}\nPhone: ${formData.contactNumber}\nNearest Branch: ${formData.targetBranch || 'GeneralHQ'}\nInterested in: ${formData.inquiryType}\n\nMessage: ${formData.message || 'No message'}`;
      
      openWhatsApp('2347052940445', text);
      
      setFormData({
        customerName: '',
        customerEmail: '',
        contactNumber: '',
        inquiryType: 'Both Paint Systems',
        targetBranch: '',
        message: '',
      });
      setTouchedFields({});
      setFieldErrors({});
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-5 md:px-[5%] bg-[#F5F4F0] border-b border-neutral-200">
      <div className="max-w-3xl mx-auto">
        
        {/* Contact Form Complex */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 70, damping: 17 }}
          className="bg-white p-8 md:p-12 rounded-2xl border-2 border-[#1c1917] shadow-[6px_6px_0px_0px_#1e3a5f] flex flex-col justify-between"
        >
          <div className="space-y-6 text-left">
            <h3 className="font-serif text-2xl md:text-3xl font-black text-brand-charcoal">
              Submit Sizing & Color Schedules
            </h3>
            
            {success && (
              <div className="bg-brand-yellow/10 border border-[#FF6B00]/40 text-brand-charcoal rounded-[4px] p-4 text-xs font-semibold flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-bold">Inquiry Broadcast Complete</h5>
                  <p className="text-[11px] text-amber-900 font-light mt-1">
                    Your details are preserved in our central leads file. We have initiated the WhatsApp redirection to assign your paint formulation expert.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-[#d32f2f] rounded-[4px] p-4 text-xs font-semibold flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-[#d32f2f] mt-0.5 flex-shrink-0" />
                <div>
                  <h5 className="font-bold">Verification Error</h5>
                  <p className="text-[11px] text-red-700 font-light mt-1">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-mid">
                      Contact Full Name <span className="text-brand-red">*</span>
                    </label>
                    {touchedFields.customerName && fieldErrors.customerName && (
                      <span className="text-[9px] font-mono text-red-500 font-bold">{fieldErrors.customerName}</span>
                    )}
                  </div>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('customerName')}
                    required
                    placeholder="Chukwuemeka Obi"
                    className={`w-full bg-neutral-50 border rounded-lg p-3 text-xs text-brand-charcoal focus:bg-white outline-none transition-all font-bold ${
                      touchedFields.customerName && fieldErrors.customerName
                        ? 'border-red-400 focus:border-red-600 bg-red-50/10'
                        : 'border-neutral-200 focus:border-neutral-950'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-mid">
                      Email Address <span className="text-brand-red">*</span>
                    </label>
                    {touchedFields.customerEmail && fieldErrors.customerEmail && (
                      <span className="text-[9px] font-mono text-red-500 font-bold">{fieldErrors.customerEmail}</span>
                    )}
                  </div>
                  <input
                    type="email"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('customerEmail')}
                    required
                    placeholder="obichukwu@gmail.com"
                    className={`w-full bg-neutral-50 border rounded-lg p-3 text-xs text-brand-charcoal focus:bg-white outline-none transition-all font-bold ${
                      touchedFields.customerEmail && fieldErrors.customerEmail
                        ? 'border-red-400 focus:border-red-600 bg-red-50/10'
                        : 'border-neutral-200 focus:border-neutral-950'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-mid">
                      Nigerian Phone Number <span className="text-brand-red">*</span>
                    </label>
                    {touchedFields.contactNumber && fieldErrors.contactNumber && (
                      <span className="text-[9px] font-mono text-red-500 font-bold">{fieldErrors.contactNumber}</span>
                    )}
                  </div>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('contactNumber')}
                    required
                    placeholder="e.g. 08031234567"
                    className={`w-full bg-neutral-50 border rounded-lg p-3 text-xs text-brand-charcoal focus:bg-white outline-none transition-all font-mono ${
                      touchedFields.contactNumber && fieldErrors.contactNumber
                        ? 'border-red-400 focus:border-red-600 bg-red-50/10'
                        : 'border-neutral-200 focus:border-neutral-950'
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-mid">
                    Interest Scope
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-brand-charcoal focus:border-neutral-950 focus:bg-white outline-none transition-all font-bold cursor-pointer"
                  >
                    <option value="SANDTEX Paints">SANDTEX Premium Paints</option>
                    <option value="CAPLUX Paints & Primers">CAPLUX Paints & Primers</option>
                    <option value="Both Paint Systems">Both Sandtex & Caplux Paints</option>
                    <option value="Bulk / Project Order">Commercial Bulk Developer Rate</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-mid">
                    Depot of Proximity <span className="text-brand-red">*</span>
                  </label>
                  {touchedFields.targetBranch && fieldErrors.targetBranch && (
                    <span className="text-[9px] font-mono text-red-500 font-bold">{fieldErrors.targetBranch}</span>
                  )}
                </div>
                <select
                  name="targetBranch"
                  value={formData.targetBranch}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('targetBranch')}
                  required
                  className={`w-full bg-neutral-50 border rounded-lg p-3 text-xs text-brand-charcoal focus:border-neutral-950 focus:bg-white outline-none transition-all font-bold cursor-pointer ${
                    touchedFields.targetBranch && fieldErrors.targetBranch
                      ? 'border-red-400 focus:border-red-600 bg-red-50/10'
                      : 'border-neutral-200 focus:border-neutral-950'
                  }`}
                >
                  <option value="">Select a depot branch</option>
                  {BRANCHES.map((b, idx) => (
                    <option key={idx} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono font-bold tracking-wider uppercase text-brand-mid">
                  Architectural Schedules / Specifications
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="State your required liters, color tint codes, satin/matt selections, basin specs etc..."
                  className="w-full min-h-[140px] bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-xs text-brand-charcoal focus:border-neutral-950 focus:bg-white outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 text-xs font-bold tracking-[0.15em] uppercase disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md hover:brightness-105"
                style={{
                  backgroundColor: 'var(--color-brand-red)',
                  color: 'var(--color-brand-text-on-primary)',
                  border: '1px solid var(--color-brand-red-deep)',
                  borderRadius: '15px'
                }}
              >
                {loading ? 'Transmitting Inquiries...' : 'Secure Submit & Consult Advisor'} <Send className="w-4 h-4" />
              </button>

            </form>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
