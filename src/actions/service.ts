"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, unstable_cache } from "next/cache";

export async function getServices(tenantId: string) {
  try {
    const services = await prisma.service.findMany({
      where: { tenantId },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export async function createService(tenantId: string, data: any) {
  try {
    const service = await prisma.service.create({
      data: {
        tenantId,
        name: data.name,
        price: parseFloat(data.price) || 0,
        duration: parseInt(data.duration) || 30,
        categoryId: data.categoryId || null,
      },
    });

    revalidatePath("/[tenantSlug]/admin/services", "page");
    return { success: true, service: JSON.parse(JSON.stringify(service)) };
  } catch (error) {
    console.error("Failed to create service:", error);
    return { success: false, error: "System error while creating service" };
  }
}

export async function deleteService(id: string) {
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath("/[tenantSlug]/admin/services", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete service:", error);
    return { success: false, error: "System error while deleting" };
  }
}

export async function updateService(id: string, data: any) {
  try {
    const service = await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        price: parseFloat(data.price) || 0,
        duration: parseInt(data.duration) || 30,
        categoryId: data.categoryId || null,
      },
    });

    revalidatePath("/[tenantSlug]/admin/services", "page");
    return { success: true, service: JSON.parse(JSON.stringify(service)) };
  } catch (error) {
    console.error("Failed to update service:", error);
    return { success: false, error: "System error while updating" };
  }
}

export async function importServices(tenantId: string, services: any[]) {
  try {
    const dataToCreate = services.map(s => ({
      tenantId,
      name: s.name,
      price: parseFloat(s.price) || 0,
      duration: parseInt(s.duration) || 30,
      categoryId: s.categoryId || null,
    }));

    await prisma.service.createMany({
      data: dataToCreate
    });

    revalidatePath("/[tenantSlug]/admin/services", "page");
    return { success: true, count: dataToCreate.length };
  } catch (error) {
    console.error("Failed to import services:", error);
    return { success: false, error: "System error while importing services" };
  }
}

export async function getCategories(tenantId: string) {
  try {
    const categories = await prisma.category.findMany({
      where: { tenantId },
      orderBy: { name: "asc" }
    });
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Failed to get categories:", error);
    return [];
  }
}

export async function createCategory(tenantId: string, name: string) {
  try {
    const category = await prisma.category.create({
      data: { tenantId, name }
    });
    revalidatePath("/[tenantSlug]/admin/services", "page");
    return { success: true, category: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    console.error("Failed to create category:", error);
    return { success: false, error: "System error" };
  }
}

