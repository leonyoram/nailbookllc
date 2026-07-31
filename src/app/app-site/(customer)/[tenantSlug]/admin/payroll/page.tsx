"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { 
  Banknote, 
  Search, 
  Loader2, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  Download,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { getStaff } from "@/actions/staff";
import { getTenantBySlug } from "@/actions/tenant";
import { getPayslips, generateDraftPayslip, updatePayslipStatus } from "@/actions/payroll";

export default function PayrollPage() {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;

  const [tenant, setTenant] = useState<any>(null);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [payslips, setPayslips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Generator State
  const [showGenerator, setShowGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  
  // Date logic
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const t = await getTenantBySlug(tenantSlug);
        if (t) {
          setTenant(t);
          const [s, p] = await Promise.all([
            getStaff(t.id),
            getPayslips(t.id)
          ]);
          setStaffList(s);
          setPayslips(p);
        }
      } catch (error) {
        console.error("Error fetching payroll data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [tenantSlug]);

  const handleGenerate = async () => {
    if (!tenant || !selectedStaffId || !startDate || !endDate) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsGenerating(true);
    try {
      const result = await generateDraftPayslip(tenant.id, selectedStaffId, startDate, endDate);
      if (result.success) {
        toast.success("Draft payslip generated successfully!");
        setShowGenerator(false);
        // Refresh payslips
        const updatedPayslips = await getPayslips(tenant.id);
        setPayslips(updatedPayslips);
      } else {
        toast.error(result.error || "Failed to generate payslip");
      }
    } catch (error) {
      toast.error("System error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const result = await updatePayslipStatus(id, newStatus);
      if (result.success) {
        toast.success(`Payslip marked as ${newStatus}`);
        setPayslips(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-green-100 text-green-700';
      case 'Approved': return 'bg-blue-100 text-blue-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-8rem)] relative">
      
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Banknote className="text-primary" /> Payroll Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">Generate payslips, track commissions, and manage salary payouts.</p>
        </div>
        
        <button 
          onClick={() => setShowGenerator(!showGenerator)}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shadow-sm"
        >
          <DollarSign size={18} /> Generate Payslip
        </button>
      </div>

      {/* Generator Form */}
      {showGenerator && (
        <div className="p-6 bg-gray-50 border-b border-gray-200 animate-in slide-in-from-top-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-600" /> New Payroll Run
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Staff Member</label>
              <select 
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white"
              >
                <option value="">-- Choose Staff --</option>
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.role})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 focus:border-primary outline-none bg-white"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={() => setShowGenerator(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">Cancel</button>
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !selectedStaffId}
              className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Banknote size={16} />}
              {isGenerating ? "Calculating..." : "Run Calculation"}
            </button>
          </div>
        </div>
      )}

      {/* Payslips Table */}
      <div className="flex-1 overflow-auto bg-gray-50/30">
        {payslips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
              <Banknote size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No Payslips Generated</h3>
            <p className="text-gray-500 mt-1 max-w-md text-center text-sm">Click "Generate Payslip" to automatically calculate salary, commissions, and tips for your staff.</p>
          </div>
        ) : (
          <div className="w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 text-sm font-semibold text-gray-600">Staff Member</th>
                  <th className="p-4 text-sm font-semibold text-gray-600">Period</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">Base / Comm / Tips</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">Deductions</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">Net Pay</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-center">Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payslips.map(ps => (
                  <tr key={ps.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors bg-white">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{ps.staff?.name}</div>
                      <div className="text-xs text-gray-500">{ps.staff?.role}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 whitespace-nowrap">
                      {new Date(ps.startDate).toLocaleDateString()} - {new Date(ps.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right text-sm">
                      <div className="text-gray-900">${ps.baseSalary.toFixed(2)} Base</div>
                      <div className="text-green-600">+${ps.commissionTotal.toFixed(2)} Comm</div>
                      <div className="text-purple-600">+${ps.tipsTotal.toFixed(2)} Tips</div>
                    </td>
                    <td className="p-4 text-right text-sm text-red-500">
                      -${ps.deductions.toFixed(2)}
                    </td>
                    <td className="p-4 text-right font-bold text-lg text-primary">
                      ${ps.netPay.toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${getStatusColor(ps.status)}`}>
                        {ps.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {ps.status === 'Draft' && (
                        <button 
                          onClick={() => handleUpdateStatus(ps.id, 'Approved')}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3"
                        >
                          Approve
                        </button>
                      )}
                      {ps.status === 'Approved' && (
                        <button 
                          onClick={() => handleUpdateStatus(ps.id, 'Paid')}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Mark Paid
                        </button>
                      )}
                      {ps.status === 'Paid' && (
                        <span className="text-gray-400 text-sm italic">Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
