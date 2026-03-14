import { PrismaClient, UserRole, ClientStatus, Platform, PlanType, SubscriptionStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('Admin123', 12);
  const operatorPassword = await bcrypt.hash('Operador123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@myview.com',
      name: 'Administrador',
      password: adminPassword,
      role: UserRole.ADMIN,
    },
  });

  const operator = await prisma.user.create({
    data: {
      email: 'operador@myview.com',
      name: 'Operador Demo',
      password: operatorPassword,
      role: UserRole.OPERATOR,
    },
  });

  const netflix = await prisma.plan.create({
    data: {
      name: 'Netflix Premium',
      platform: Platform.NETFLIX,
      type: PlanType.STREAMING,
      costPrice: 25.00,
      salePrice: 35.00,
      durationDays: 30,
      maxAccounts: 4,
      isActive: true,
    },
  });

  const spotify = await prisma.plan.create({
    data: {
      name: 'Spotify Premium',
      platform: Platform.SPOTIFY,
      type: PlanType.MUSIC,
      costPrice: 15.00,
      salePrice: 22.00,
      durationDays: 30,
      maxAccounts: 1,
      isActive: true,
    },
  });

  const disney = await prisma.plan.create({
    data: {
      name: 'Disney+',
      platform: Platform.DISNEY_PLUS,
      type: PlanType.STREAMING,
      costPrice: 18.00,
      salePrice: 28.00,
      durationDays: 30,
      maxAccounts: 4,
      isActive: true,
    },
  });

  const hbo = await prisma.plan.create({
    data: {
      name: 'HBO Max',
      platform: Platform.HBO_MAX,
      type: PlanType.STREAMING,
      costPrice: 20.00,
      salePrice: 30.00,
      durationDays: 30,
      maxAccounts: 3,
      isActive: true,
    },
  });

  const clients = await Promise.all([
    prisma.client.create({ data: { fullName: 'Juan Perez', email: 'juan@example.com', phone: '987654321', dni: '12345678', createdById: admin.id } }),
    prisma.client.create({ data: { fullName: 'Maria Lopez', email: 'maria@example.com', phone: '987654322', dni: '87654321', createdById: admin.id } }),
    prisma.client.create({ data: { fullName: 'Carlos Sanchez', email: 'carlos@example.com', phone: '987654323', dni: '11223344', createdById: admin.id } }),
    prisma.client.create({ data: { fullName: 'Ana Torres', email: 'ana@example.com', phone: '987654324', dni: '44332211', createdById: admin.id } }),
    prisma.client.create({ data: { fullName: 'Luis Ramirez', email: 'luis@example.com', phone: '987654325', dni: '55667788', createdById: admin.id } }),
    prisma.client.create({ data: { fullName: 'Carmen Ruiz', email: 'carmen@example.com', phone: '987654326', dni: '88776655', createdById: admin.id } }),
  ]);

  const now = new Date();
  
  const sub1 = await prisma.subscription.create({
    data: {
      clientId: clients[0].id,
      planId: netflix.id,
      startDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      status: SubscriptionStatus.ACTIVE,
      createdById: admin.id,
    },
  });

  const sub2 = await prisma.subscription.create({
    data: {
      clientId: clients[1].id,
      planId: spotify.id,
      startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
      status: SubscriptionStatus.ACTIVE,
      createdById: admin.id,
    },
  });

  const sub3 = await prisma.subscription.create({
    data: {
      clientId: clients[2].id,
      planId: disney.id,
      startDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      status: SubscriptionStatus.EXPIRED,
      createdById: admin.id,
    },
  });

  const sub4 = await prisma.subscription.create({
    data: {
      clientId: clients[3].id,
      planId: hbo.id,
      startDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
      status: SubscriptionStatus.PENDING,
      createdById: admin.id,
    },
  });

  await prisma.payment.create({
    data: {
      subscriptionId: sub1.id,
      amount: 35.00,
      method: PaymentMethod.YAPE,
      status: PaymentStatus.COMPLETED,
      paidAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
      recordedById: admin.id,
    },
  });

  await prisma.payment.create({
    data: {
      subscriptionId: sub2.id,
      amount: 22.00,
      method: PaymentMethod.PLIN,
      status: PaymentStatus.COMPLETED,
      paidAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      recordedById: admin.id,
    },
  });

  await prisma.payment.create({
    data: {
      subscriptionId: sub3.id,
      amount: 28.00,
      method: PaymentMethod.TRANSFER,
      status: PaymentStatus.COMPLETED,
      paidAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      dueDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
      recordedById: admin.id,
    },
  });

  await prisma.payment.create({
    data: {
      subscriptionId: sub4.id,
      amount: 30.00,
      method: PaymentMethod.CASH,
      status: PaymentStatus.PENDING,
      dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      recordedById: admin.id,
    },
  });

  await prisma.payment.create({
    data: {
      subscriptionId: sub1.id,
      amount: 35.00,
      method: PaymentMethod.OTHER,
      status: PaymentStatus.PENDING,
      dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      recordedById: admin.id,
    },
  });
}

main()
  .catch((e) => {
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
