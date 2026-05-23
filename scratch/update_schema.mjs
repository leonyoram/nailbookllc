import fs from 'fs';

let schema = fs.readFileSync('d:/Antigravity/prisma/schema.prisma', 'utf8');

// 1. Update Tenant model
if (!schema.includes('defaultSalaryCycle')) {
  schema = schema.replace(
    /locale                 String    @default\("vi"\)/,
    'locale                 String    @default("vi")\n  defaultSalaryCycle     String    @default("Monthly")'
  );
  
  schema = schema.replace(
    /promotions        Promotion\[\]/,
    'promotions        Promotion[]\n  payslips          Payslip[]'
  );
}

// 2. Update Staff model
if (!schema.includes('baseSalary     Float')) {
  schema = schema.replace(
    /commissionRate Float    @default\(0\) \/\/ percentage/,
    'commissionRate Float    @default(0) // percentage\n  baseSalary     Float    @default(0)\n  salaryCycle    String   @default("Monthly")\n  salaryType     String   @default("Commission")'
  );
  
  schema = schema.replace(
    /commissions Commission\[\]/,
    'commissions Commission[]\n  payslips    Payslip[]'
  );
}

// 3. Update Booking model
if (!schema.includes('tipAmount     Float')) {
  schema = schema.replace(
    /depositAmount Float         @default\(0\)/,
    'depositAmount Float         @default(0)\n  tipAmount     Float         @default(0)'
  );
}

// 4. Add Payslip model
if (!schema.includes('model Payslip')) {
  schema += `\n\nmodel Payslip {
  id              String   @id @default(uuid())
  tenantId        String
  staffId         String
  startDate       DateTime @db.Date
  endDate         DateTime @db.Date
  baseSalary      Float    @default(0)
  commissionTotal Float    @default(0)
  tipsTotal       Float    @default(0)
  deductions      Float    @default(0) // Penalties for absent/late
  allowances      Float    @default(0) // Bonuses
  netPay          Float    @default(0) // Final amount
  status          String   @default("Draft") // Draft, Approved, Paid
  paymentDate     DateTime?
  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  staff  Staff  @relation(fields: [staffId], references: [id], onDelete: Cascade)

  @@unique([staffId, startDate, endDate])
  @@index([tenantId, status])
}\n`;
}

fs.writeFileSync('d:/Antigravity/prisma/schema.prisma', schema);
console.log("Schema updated successfully.");
