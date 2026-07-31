"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Star, MessageSquare, Loader2, User, Calendar, CheckCircle } from "lucide-react";
import { getTenantBySlug } from "@/actions/tenant";
import { getReviews, updateReviewStatus } from "@/actions/review";

export default function ReviewsPage() {
  const { tenantSlug } = useParams() as { tenantSlug: string };
  const [tenant, setTenant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const t = await getTenantBySlug(tenantSlug);
      if (t) {
        setTenant(t);
        const res = await getReviews(t.id);
        setReviews(res || []);
      }
    } catch (err) {
      console.error("Reviews page data fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [tenantSlug]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (!tenant?.id) return;
    try {
      const res = await updateReviewStatus(id, newStatus, tenant.id);
      if (res.success) {
        setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
      }
    } catch (e) {
      alert("Failed to update status");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
        <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center">
          <Star size={24} fill="currentColor" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Feedback</h1>
          <p className="text-gray-500">Manage 1 to 4-star ratings and customer comments.</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No feedback yet</h3>
          <p className="text-gray-500 mt-2">When customers leave 1-4 star ratings, they will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 pr-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User size={18} className="text-gray-500" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{review.customer?.name || "Unknown Customer"}</div>
                    <div className="text-sm text-gray-500">{review.customer?.phone || ""}</div>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span>{new Date(review.createdAt).toLocaleDateString()} at {new Date(review.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {review.booking?.service && (
                    <div className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-500" />
                      <span>Service: {review.booking.service.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={18} 
                        className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} 
                      />
                    ))}
                  </div>
                  <div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      review.status === 'Hidden' ? 'bg-gray-100 text-gray-700' :
                      review.status === 'Published' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {review.status === 'Hidden' ? 'Handled' : review.status}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm italic border border-gray-100 flex-1">
                  "{review.comment || "No comment provided."}"
                </div>

                <div className="mt-4 flex gap-2 justify-end">
                  {review.status !== 'Hidden' && (
                    <button 
                      onClick={() => handleUpdateStatus(review.id, 'Hidden')}
                      className="px-4 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                      Mark as Handled
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
