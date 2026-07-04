import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { openWhatsApp } from '../utils/whatsapp';
import { 
  Users, 
  Search, 
  Phone, 
  MessageSquare, 
  Download, 
  Trash2, 
  Lock, 
  CheckCircle, 
  Clock, 
  Building, 
  Filter,
  Save,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Mail
} from 'lucide-react';

interface Lead {
  id: string;
  customerName: string;
  customerEmail?: string;
  contactNumber: string;
  inquiryType: string;
  targetBranch: string;
  message: string;
  status: 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Lost' | string;
  note: string;
  submittedAt: string;
}

const springTransition = {
  type: "spring",
  stiffness: 75,
  damping: 17,
  mass: 0.9
};

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorContent, setErrorContent] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterInquiry, setFilterInquiry] = useState('All');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [activeNoteText, setActiveNoteText] = useState('');

  // Automatically check localStorage for stored passcode on mount
  useEffect(() => {
    const savedPasscode = localStorage.getItem('micmag_admin_passcode');
    if (savedPasscode) {
      verifyAndLoadLeads(savedPasscode);
    }
  }, []);

  const verifyAndLoadLeads = async (codeToVerify: string) => {
    setLoading(true);
    setErrorContent('');
    try {
      const res = await fetch(`/api/leads?passcode=${encodeURIComponent(codeToVerify)}`);
      if (res.status === 401) {
        throw new Error('Invalid Admin Passcode. Please try again.');
      }
      if (!res.ok) {
        throw new Error('Failed to load leads from database.');
      }
      const data = await res.json();
      setLeads(data);
      setPasscode(codeToVerify);
      setIsAuthenticated(true);
      localStorage.setItem('micmag_admin_passcode', codeToVerify);
    } catch (err: any) {
      setErrorContent(err.message || 'Verification failed');
      setIsAuthenticated(false);
      localStorage.removeItem('micmag_admin_passcode');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    verifyAndLoadLeads(passcode);
  };

  const handleLogout = () => {
    localStorage.removeItem('micmag_admin_passcode');
    setIsAuthenticated(false);
    setLeads([]);
    setPasscode('');
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
         },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      } else {
        alert('Failed to update lead status on database.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating status.');
    }
  };

  const saveLeadNote = async (id: string) => {
    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({ note: activeNoteText }),
      });
      if (res.ok) {
        setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, note: activeNoteText } : lead));
        setEditingNoteId(null);
      } else {
        alert('Failed to save follow-up note.');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving note.');
    }
  };

  const deleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this lead from records?')) return;
    try {
      const res = await fetch(`/api/leads?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          'x-admin-passcode': passcode
        }
      });
      if (res.ok) {
        setLeads(prev => prev.filter(lead => lead.id !== id));
      } else {
        alert('Failed to delete lead from server.');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting lead.');
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;
    
    // Headers setup
    const headers = ['Submission Date', 'Customer Name', 'Phone Number', 'Inquiry Type', 'Target Branch', 'Status', 'Custom Admin Notes', 'Message'];
    const rows = leads.map(l => [
      new Date(l.submittedAt).toLocaleString(),
      l.customerName,
      l.contactNumber,
      l.inquiryType,
      l.targetBranch,
      l.status || 'New',
      (l.note || '').replace(/"/g, '""'),
      (l.message || '').replace(/"/g, '""')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `micmag_leads_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search computation
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contactNumber.includes(searchQuery) ||
      (lead.message || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.note || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || (lead.status || 'New') === filterStatus;
    const matchesInquiry = filterInquiry === 'All' || lead.inquiryType === filterInquiry;

    return matchesSearch && matchesStatus && matchesInquiry;
  });

  // KPI calculations
  const totalInquiries = leads.length;
  const newCount = leads.filter(l => (l.status || 'New') === 'New').length;
  const contactedCount = leads.filter(l => l.status === 'Contacted' || l.status === 'In Progress').length;
  const convertedCount = leads.filter(l => l.status === 'Converted').length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-brand-cream px-5 py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={springTransition}
          className="max-w-md w-full bg-white rounded-lg shadow-sm border border-brand-sand/15 p-8 text-center"
        >
          <motion.div 
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
            className="mx-auto w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mb-6"
          >
            <Lock className="w-8 h-8 text-brand-red" />
          </motion.div>
          <h2 className="font-serif text-2xl font-bold text-brand-charcoal mb-2">Micmag Admin Hub</h2>
          <p className="text-[0.85rem] text-brand-mid font-light mb-6">
            Enter your secure corporate passcode to manage received paint and fittings orders & store enquiries.
          </p>

          <AnimatePresence>
            {errorContent && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-brand-red/5 border border-brand-red/20 text-brand-red text-xs rounded p-3 mb-4 text-left overflow-hidden"
              >
                <span className="font-semibold">⚠️ {errorContent}</span>
                <div className="mt-1 text-[10px] text-brand-mid font-normal">
                  Default helper passcode is <code className="font-mono bg-brand-red/5 px-1 rounded">micmag2026</code> unless overridden in cloud secrets.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full bg-brand-cream border border-brand-sand/40 rounded px-4 py-3 text-center tracking-widest text-brand-charcoal focus:border-brand-red focus:bg-white outline-none font-mono"
                required
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full text-xs font-bold uppercase tracking-wider py-3.5 rounded transition duration-200 outline-none flex items-center justify-center gap-2 cursor-pointer hover:brightness-105"
              style={{
                backgroundColor: 'var(--color-brand-red)',
                color: 'var(--color-brand-text-on-primary)',
              }}
            >
              {loading ? 'Verifying access...' : 'Unlock CRM Dashboard →'}
            </motion.button>
          </form>
          <div className="mt-6 pt-4 border-t border-neutral-100 text-[11px] text-brand-mid font-light">
            Secure browser session encryption enabled
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#faf8f5] py-24 px-5 md:px-[5%]"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 text-left">
          <div>
            <span className="text-brand-red text-xs font-bold tracking-widest uppercase bg-brand-red/5 px-3 py-1 rounded">CRM Network Console</span>
            <h1 className="font-serif text-3xl font-black text-brand-charcoal mt-2">Leads Pipeline</h1>
            <p className="text-brand-mid text-xs font-light mt-1">
              Live tracking customer responses for SANDTEX & CAPLUX premium paints and coatings in Nigeria.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <motion.button 
              onClick={exportToCSV}
              disabled={leads.length === 0}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-brand-charcoal text-white hover:bg-black text-[0.76rem] font-bold uppercase tracking-wider px-4 py-3 rounded transition-colors duration-200 disabled:opacity-40 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export CSV (Excel/Sheets)
            </motion.button>
            <motion.button 
              onClick={handleLogout}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="border border-neutral-300 bg-white hover:bg-neutral-50 text-brand-charcoal text-[0.76rem] font-bold uppercase tracking-wider px-4 py-3 rounded transition-colors duration-200 cursor-pointer"
            >
              Lock Console
            </motion.button>
          </div>
        </div>

        {/* Stats KPIs Rows */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-left">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0.05 }}
            className="bg-white p-5 rounded border border-brand-sand/10 hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-mid">Total Leads</span>
              <div className="p-1 px-2 rounded-full bg-brand-charcoal/5 text-brand-charcoal text-[11px] font-bold"><Users className="w-3.5 h-3.5 inline mr-1" /> All</div>
            </div>
            <p className="text-3xl font-bold text-brand-charcoal">{totalInquiries}</p>
            <p className="text-[11px] text-brand-mid leading-relaxed mt-1 font-light">Stored customer responses</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0.1 }}
            className="bg-white p-5 rounded border border-brand-sand/10 hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-mid">Unattended / New</span>
              <div className="p-1 px-2 rounded-full bg-brand-red/10 text-brand-red text-[11px] font-bold"><Clock className="w-3.5 h-3.5 inline mr-1" /> Pending</div>
            </div>
            <p className="text-3xl font-bold text-brand-red">{newCount}</p>
            <p className="text-[11px] text-brand-mid leading-relaxed mt-1 font-light">Awaiting sales team call</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0.15 }}
            className="bg-white p-5 rounded border border-brand-sand/10 hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-mid">In Conversation</span>
              <div className="p-1 px-2 rounded-full bg-orange-100 text-orange-800 text-[11px] font-bold"><Filter className="w-3.5 h-3.5 inline mr-1" /> Active</div>
            </div>
            <p className="text-3xl font-bold text-orange-700">{contactedCount}</p>
            <p className="text-[11px] text-brand-mid leading-relaxed mt-1 font-light">Negotiating final estimates</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...springTransition, delay: 0.2 }}
            className="bg-white p-5 rounded border border-brand-sand/10 hover:shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-brand-mid">Closed Deals</span>
              <div className="p-1 px-2 rounded-full bg-green-100 text-green-800 text-[11px] font-bold"><CheckCircle className="w-3.5 h-3.5 inline mr-1" /> Won</div>
            </div>
            <p className="text-3xl font-bold text-green-700">{convertedCount}</p>
            <p className="text-[11px] text-brand-mid leading-relaxed mt-1 font-light">Paints or fittings delivered</p>
          </motion.div>
        </div>

        {/* Searching and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.25 }}
          className="bg-white border border-brand-sand/15 p-5 rounded mb-8 shadow-sm flex flex-col md:flex-row items-center gap-4 text-left"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-brand-mid absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone format, branch, notes, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-brand-cream pl-10 pr-4 py-2.5 rounded text-[0.85rem] placeholder-brand-mid outline-none border border-neutral-200 focus:border-brand-red focus:bg-white transition-colors"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto whitespace-nowrap">
            <div>
              <span className="text-[10px] font-bold uppercase text-brand-mid block mb-1">State:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-brand-cream border border-neutral-200 text-xs rounded p-2 text-brand-charcoal outline-none focus:border-brand-red cursor-pointer font-bold"
              >
                <option value="All">All Pipelines</option>
                <option value="New">New Deals (Awaiting)</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress (Negotiation)</option>
                <option value="Converted">Converted (Closed Won)</option>
                <option value="Lost">Lost / Archived</option>
              </select>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-brand-mid block mb-1">Inquiry:</span>
              <select
                value={filterInquiry}
                onChange={(e) => setFilterInquiry(e.target.value)}
                className="bg-brand-cream border border-neutral-200 text-xs rounded p-2 text-brand-charcoal outline-none focus:border-brand-red cursor-pointer font-bold"
              >
                <option value="All">All Inquiries</option>
                <option value="SANDTEX Paints">SANDTEX Paints Only</option>
                <option value="CAPLUX Paints & Primers">CAPLUX Paints Only</option>
                <option value="Both Paint Systems">Both Paint Systems</option>
                <option value="Bulk / Project Order">Bulk Orders</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Lead Table / Feed View */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springTransition, delay: 0.3 }}
          className="bg-white rounded border border-brand-sand/15 overflow-hidden shadow-sm"
        >
          <div className="px-6 py-4 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
            <h2 className="font-serif text-[1rem] font-bold text-brand-charcoal flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-brand-red" />
              Customer Inquiry Feed ({filteredLeads.length})
            </h2>
            <span className="text-[10px] text-brand-mid">Updated Live</span>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="py-20 text-center px-10">
              <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-neutral-400">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-brand-charcoal">No customer records matching your set filters</p>
              <p className="text-xs text-brand-mid mt-1 font-light">Try adjusting your search criteria or resetting filters.</p>
            </div>
          ) : (
            <motion.div layout className="divide-y divide-neutral-100">
              <AnimatePresence mode="popLayout">
                {filteredLeads.map((lead) => {
                  const submittedDateStr = new Date(lead.submittedAt).toLocaleDateString('en-NG', {
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  });

                  return (
                    <motion.div 
                      key={lead.id} 
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={springTransition}
                      className="p-6 md:p-8 hover:bg-neutral-50/40 transition flex flex-col lg:flex-row lg:items-start justify-between gap-6"
                    >
                      
                      {/* Left Frame: Customer & Requirement Info */}
                      <div className="flex-1 space-y-4 text-left">
                        
                        {/* Sub-Header Row */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                            (lead.status || 'New') === 'New' ? 'bg-brand-red/10 text-brand-red border border-brand-red/15' :
                            lead.status === 'Contacted' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            lead.status === 'In Progress' ? 'bg-brand-yellow/15 text-brand-charcoal border border-[#FF6B00]/30' :
                            lead.status === 'Converted' ? 'bg-brand-red text-white font-bold border border-brand-red/15' :
                            'bg-neutral-100 text-neutral-600'
                          }`}>
                            {lead.status || 'New'}
                          </span>

                          <span className="text-[10px] text-brand-mid bg-brand-cream border border-brand-sand/15 rounded px-2 py-0.5 font-medium flex items-center gap-1">
                            <Building className="w-3 h-3 text-brand-red" /> {lead.targetBranch || 'Shorn of Location'}
                          </span>

                          <span className="text-[10px] text-brand-mid uppercase font-mono tracking-wider ml-auto lg:ml-0">
                            {lead.inquiryType}
                          </span>
                        </div>

                        {/* Customer Core Detail */}
                        <div>
                          <h3 className="font-serif text-lg font-bold text-brand-charcoal">{lead.customerName}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5">
                            <a 
                              href={`tel:${lead.contactNumber}`} 
                              className="text-xs font-bold text-brand-charcoal hover:text-brand-red flex items-center gap-1 bg-brand-cream border border-neutral-200/60 transition px-2.5 py-1 rounded"
                            >
                              <Phone className="w-3 h-3" /> {lead.contactNumber}
                            </a>

                            {lead.customerEmail && (
                              <a 
                                href={`mailto:${lead.customerEmail}`} 
                                className="text-xs font-bold text-brand-charcoal hover:text-brand-red flex items-center gap-1 bg-brand-cream border border-neutral-200/60 transition px-2.5 py-1 rounded"
                              >
                                <Mail className="w-3 h-3 text-neutral-500" /> {lead.customerEmail}
                              </a>
                            )}
                            
                            {/* Direct Whatsapp CRM link */}
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                const text = `Hello ${lead.customerName}! This is Micmag Homes & Fittings support. In response to your request for: ${lead.inquiryType}`;
                                openWhatsApp(lead.contactNumber, text);
                              }}
                              className="text-xs font-bold text-green-700 bg-green-50 hover:bg-green-100 border border-green-150 flex items-center gap-1 transition-colors duration-200 px-2.5 py-1 rounded cursor-pointer"
                            >
                              <MessageSquare className="w-3 h-3" /> Chat WhatsApp
                            </motion.button>
                          </div>
                        </div>

                        {/* Inquiry Message */}
                        {lead.message ? (
                          <div className="bg-brand-cream/40 p-4 rounded border border-neutral-150/50">
                            <p className="text-xs font-medium text-brand-mid uppercase tracking-wide mb-1 flex items-center gap-1">
                              <span>📝 Client's Project Message</span>
                            </p>
                            <p className="text-[0.88rem] leading-relaxed text-brand-charcoal font-light italic">
                              "{lead.message}"
                            </p>
                          </div>
                        ) : (
                          <p className="text-xs italic text-brand-mid">No custom message submitted.</p>
                        )}

                        {/* Created Date details */}
                        <p className="text-[10px] text-brand-mid flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" /> Received: {submittedDateStr}
                        </p>

                      </div>

                      {/* Right Frame: CRM Action Controls & Notes editing */}
                      <div className="w-full lg:w-[320px] bg-neutral-50/50 p-4 rounded border border-neutral-200/50 flex flex-col justify-between gap-4 text-left">
                        
                        {/* Pipeline Status Action Dropdown */}
                        <div>
                          <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-mid mb-1.5">Update Pipeline Status</label>
                          <div className="flex flex-wrap gap-1">
                            {['New', 'Contacted', 'In Progress', 'Converted', 'Lost'].map(statusOption => (
                              <motion.button
                                key={statusOption}
                                whileTap={{ scale: 0.93 }}
                                onClick={() => updateLeadStatus(lead.id, statusOption)}
                                className={`text-[9px] font-bold px-2 py-1 rounded border transition-colors duration-150 cursor-pointer ${
                                  (lead.status || 'New') === statusOption
                                    ? 'bg-brand-red text-white border-brand-red shadow-sm'
                                    : 'bg-white text-brand-charcoal border-neutral-200 hover:border-neutral-300'
                                }`}
                              >
                                {statusOption}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Live Admin Remark Remark Remarks */}
                        <div className="border-t border-neutral-200/60 pt-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-[9px] font-bold uppercase tracking-wider text-brand-mid">Internal Remarks & Notes</label>
                            {editingNoteId !== lead.id ? (
                              <button 
                                onClick={() => {
                                  setEditingNoteId(lead.id);
                                  setActiveNoteText(lead.note || '');
                                }}
                                className="text-[10px] hover:underline text-brand-red font-medium"
                              >
                                {lead.note ? 'Edit Remarks' : '+ Add Notes'}
                              </button>
                            ) : null}
                          </div>

                          <AnimatePresence mode="wait">
                            {editingNoteId === lead.id ? (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 overflow-hidden"
                              >
                                <textarea
                                  value={activeNoteText}
                                  onChange={(e) => setActiveNoteText(e.target.value)}
                                  placeholder="Add follow-up estimates, client budget, Paint color codes, visit schedule detail..."
                                  className="w-full text-xs p-2 bg-white border border-neutral-300 rounded outline-none focus:border-brand-red min-h-[60px]"
                                />
                                <div className="flex justify-end gap-1.5">
                                  <button 
                                    onClick={() => setEditingNoteId(null)}
                                    className="text-[10px] font-bold px-2 py-1 bg-white text-brand-charcoal border border-neutral-200 rounded cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button 
                                    onClick={() => saveLeadNote(lead.id)}
                                    className="text-[10px] font-bold px-2.5 py-1 bg-brand-charcoal text-white rounded flex items-center gap-1 cursor-pointer"
                                  >
                                    <Save className="w-3 h-3" /> Save Note
                                  </button>
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-brand-cream/55 p-3 rounded border border-dashed border-brand-sand/20 min-h-[42px] flex items-center justify-center"
                              >
                                {lead.note ? (
                                  <p className="text-[0.78rem] text-brand-charcoal font-light w-full">
                                    {lead.note}
                                  </p>
                                ) : (
                                  <p className="text-[0.72rem] text-brand-mid text-center italic font-light">
                                    No follow-up remarks recorded. Click above to add some.
                                  </p>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Lead Deletion */}
                        <div className="border-t border-neutral-200/50 pt-3 flex justify-end">
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="text-[10px] font-semibold text-brand-red/70 hover:text-brand-red flex items-center gap-1 transition-colors duration-150 py-1 px-1.5 rounded hover:bg-brand-red/5"
                          >
                            <Trash2 className="w-3 h-3" /> Delete Lead Record
                          </button>
                        </div>

                      </div>

                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>

        {/* Info Guide Guide for Owner */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-8 bg-neutral-900 text-white p-6 rounded shadow flex flex-col md:flex-row items-center justify-between gap-6 text-left"
        >
          <div className="space-y-1">
            <h4 className="font-serif text-[1rem] font-bold leading-normal text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand-red" />
              Securing & Synchronizing with Live CRM databases
            </h4>
            <p className="text-sm font-light text-neutral-300">
               For security, change your `ADMIN_PASSCODE` secret. WhatsApp chat is fully encrypted and instant.
            </p>
          </div>
          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="whitespace-nowrap px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer hover:brightness-105"
            style={{
              backgroundColor: 'var(--color-brand-red)',
              color: 'var(--color-brand-text-on-primary)',
            }}
          >
            Go to client form <ArrowRight className="w-3 h-3" />
          </motion.a>
        </motion.div>

      </div>
    </motion.div>
  );
}
