"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { submitContactForm } from "@/app/landing-site/actions/contact";
import { getSystemSettings } from "@/lib/landing_settings";

const leadSchema = z.object({
  fullName: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
  salonName: z.string().min(2, "Tên tiệm không hợp lệ"),
  serviceType: z.string().min(1, "Vui lòng chọn loại hình dịch vụ"),
  staffCount: z.string().min(1, "Vui lòng nhập số lượng thợ/ghế"),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState({ phone: "(800) 555-0199", email: "contact@nailbookllc.com" });

  useEffect(() => {
    getSystemSettings().then(setSettings);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.fullName);
      formData.append("phone", data.phone);
      formData.append("salonName", data.salonName);
      
      const notes = `Dịch vụ: ${data.serviceType}, Quy mô: ${data.staffCount}`;
      formData.append("notes", notes);

      const res = await submitContactForm(formData);
      
      if (res.success) {
        setSuccess(true);
      } else {
        alert(res.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Liên Hệ Với Chúng Tôi</h1>
        <p className="text-center text-muted-foreground mb-12">
          Đội ngũ Nail Book LLC luôn sẵn sàng hỗ trợ bạn chuyển đổi số tiệm salon.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Thông Tin Pháp Lý</h2>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Địa Chỉ</h4>
                  <p className="text-muted-foreground">123 Innovation Drive, Tech City, TX 75001</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Hotline</h4>
                  <p className="text-muted-foreground">{settings.phone}</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-muted-foreground">{settings.email}</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-full text-primary">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold">Giờ Làm Việc</h4>
                  <p className="text-muted-foreground">Thứ 2 - Thứ 6: 9:00 - 18:00</p>
                </div>
              </li>
            </ul>

            <div className="mt-8 h-64 bg-muted rounded-xl border flex items-center justify-center">
              <span className="text-muted-foreground">[Google Maps Placeholder]</span>
            </div>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Đăng Ký Tư Vấn & Nhận Demo 1-on-1 Cùng Chuyên Viên</CardTitle>
              <CardDescription>Để lại thông tin, đội ngũ Nail Book LLC sẽ gọi lại hỗ trợ cài đặt menu & dịch vụ cho tiệm bạn trong vòng 15 phút!</CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="p-4 bg-green-50 text-green-700 rounded-md">
                  Cảm ơn bạn! Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Họ và Tên</Label>
                    <Input id="fullName" placeholder="Nhập họ và tên..." {...register("fullName")} />
                    {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" type="tel" placeholder="Nhập số điện thoại..." {...register("phone")} />
                    {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salonName">Tên Tiệm (Salon)</Label>
                    <Input id="salonName" placeholder="Tên tiệm của bạn..." {...register("salonName")} />
                    {errors.salonName && <p className="text-sm text-red-500">{errors.salonName.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceType">Mô hình tiệm của bạn</Label>
                    <select
                      id="serviceType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...register("serviceType")}
                    >
                      <option value="">-- Chọn mô hình --</option>
                      <option value="nail">Tiệm Nail</option>
                      <option value="hair">Hair Salon</option>
                      <option value="spa">Spa / Skincare</option>
                      <option value="lash_brow">Lash & Brow Studio</option>
                      <option value="barber">Barber Shop</option>
                    </select>
                    {errors.serviceType && <p className="text-sm text-red-500">{errors.serviceType.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staffCount">Quy mô nhân sự (Số lượng thợ/ghế)</Label>
                    <select
                      id="staffCount"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      {...register("staffCount")}
                    >
                      <option value="">-- Chọn quy mô --</option>
                      <option value="1-3">1 - 3 thợ</option>
                      <option value="4-8">4 - 8 thợ</option>
                      <option value="9-15">9 - 15 thợ</option>
                      <option value="chain">Chuỗi nhiều tiệm</option>
                    </select>
                    {errors.staffCount && <p className="text-sm text-red-500">{errors.staffCount.message}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Đang gửi..." : "Đăng Ký Nhận Tư Vấn"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
