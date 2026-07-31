"use client";

import { useEffect, useState } from "react";
import { Staff, useBookingStore } from "@/store/useBookingStore";
import { User, Check, Loader2 } from "lucide-react";
import { getStaff } from "@/actions/staff";

export function StepStaff({ tenant }: { tenant: any }) {
  const { selectedStaff, setStaff, nextStep, selectedServices } = useBookingStore();
  const [staffList, setStaffList] = useState<Staff[]>([{ id: "any", name: "Any Available" }]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getStaff(tenant.id);
        const formattedStaff: Staff[] = data.map((s: any) => ({
          id: s.id,
          name: s.name,
          timeOffDates: s.timeOffDates ? (typeof s.timeOffDates === 'string' ? JSON.parse(s.timeOffDates) : s.timeOffDates) : [],
          skills: s.skills ? (typeof s.skills === 'string' ? JSON.parse(s.skills) : s.skills) : null,
        }));

        const requiredCategoryIds = selectedServices
          .map(s => s.categoryId)
          .filter(Boolean) as string[];

        const eligibleStaff = formattedStaff.filter(staff => {
          if (!staff.skills || staff.skills.length === 0) return true;
          return requiredCategoryIds.every(id => staff.skills!.includes(id));
        });

        setStaffList([{ id: "any", name: "Any Available" }, ...eligibleStaff]);
      } catch (error) {
        console.error("Failed to load staff", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (tenant?.id) {
      fetchStaff();
    }
  }, [tenant?.id, selectedServices]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-3 pb-24">
        {staffList.map((staff) => {
          const isSelected = selectedStaff?.id === staff.id || (staff.id === "any" && selectedStaff === null);
          return (
            <div
              key={staff.id}
              onClick={() => setStaff(staff.id === "any" ? null : staff)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>
                <User size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-lg">{staff.name}</h3>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                  isSelected ? "bg-primary border-primary text-white" : "border-gray-300"
                }`}
              >
                {isSelected && <Check size={14} />}
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-white border-t">
        <button
          onClick={nextStep}
          className="w-full py-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-lg transition-colors shadow-lg shadow-primary/30"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
