import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const slug = 'demo-salon';
  
  // Find or create tenant
  let tenant = await prisma.tenant.findUnique({ where: { slug } });
  
  if (!tenant) {
    console.log(`Tenant '${slug}' not found. Creating a new one...`);
    tenant = await prisma.tenant.create({
      data: {
        slug,
        name: 'Demo Salon',
        adminEmail: 'admin@demosalon.com',
        adminPassword: 'hashed_password_placeholder', // Dummy password for now
      }
    });
  }
  
  const tenantId = tenant.id;
  
  // 5 Staff members
  const staffData = [
    { name: 'Anna Smith', role: 'Senior Stylist', phone: '123-456-7890' },
    { name: 'John Doe', role: 'Barber', phone: '123-456-7891' },
    { name: 'Maria Garcia', role: 'Colorist', phone: '123-456-7892' },
    { name: 'Linda Johnson', role: 'Nail Technician', phone: '123-456-7893' },
    { name: 'James Wilson', role: 'Massage Therapist', phone: '123-456-7894' }
  ];
  
  console.log('Creating 5 staff members...');
  for (const staff of staffData) {
    await prisma.staff.create({
      data: {
        tenantId,
        name: staff.name,
        role: staff.role,
        phone: staff.phone
      }
    });
  }
  
  // 20 Services
  const servicesData = [
    { name: 'Men\'s Haircut', price: 25, duration: 30, category: 'Hair' },
    { name: 'Women\'s Haircut', price: 45, duration: 45, category: 'Hair' },
    { name: 'Kid\'s Haircut', price: 20, duration: 30, category: 'Hair' },
    { name: 'Hair Wash & Blow Dry', price: 30, duration: 30, category: 'Hair' },
    { name: 'Root Touch Up', price: 60, duration: 60, category: 'Color' },
    { name: 'Full Hair Color', price: 120, duration: 90, category: 'Color' },
    { name: 'Highlights', price: 150, duration: 120, category: 'Color' },
    { name: 'Balayage', price: 180, duration: 150, category: 'Color' },
    { name: 'Keratin Treatment', price: 200, duration: 180, category: 'Treatment' },
    { name: 'Scalp Massage', price: 25, duration: 20, category: 'Treatment' },
    { name: 'Classic Manicure', price: 20, duration: 30, category: 'Nails' },
    { name: 'Gel Manicure', price: 35, duration: 45, category: 'Nails' },
    { name: 'Classic Pedicure', price: 30, duration: 45, category: 'Nails' },
    { name: 'Gel Pedicure', price: 45, duration: 60, category: 'Nails' },
    { name: 'Acrylic Nails Full Set', price: 55, duration: 90, category: 'Nails' },
    { name: 'Basic Facial', price: 60, duration: 45, category: 'Spa' },
    { name: 'Deep Cleansing Facial', price: 85, duration: 60, category: 'Spa' },
    { name: 'Anti-Aging Facial', price: 110, duration: 75, category: 'Spa' },
    { name: 'Swedish Massage (60 min)', price: 80, duration: 60, category: 'Massage' },
    { name: 'Deep Tissue Massage (60 min)', price: 95, duration: 60, category: 'Massage' }
  ];
  
  console.log('Creating 20 services...');
  for (const service of servicesData) {
    let category = await prisma.category.findUnique({
      where: { tenantId_name: { tenantId, name: service.category } }
    });
    if (!category) {
      category = await prisma.category.create({
        data: { tenantId, name: service.category }
      });
    }

    await prisma.service.create({
      data: {
        tenantId,
        name: service.name,
        price: service.price,
        duration: service.duration,
        categoryId: category.id
      }
    });
  }
  
  console.log('Done! 5 Staff members and 20 Services have been added to demo-salon.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
