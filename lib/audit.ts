import { prisma } from './prisma';

interface AuditParams {
  userId: string;
  userEmail: string;
  userRole: string;
  action: 'create' | 'update' | 'delete';
  entityType: 'participant' | 'session' | 'barrier' | 'assignment';
  entityId: string;
  changes?: Record<string, any>;
}

export async function logAudit(params: AuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        userEmail: params.userEmail,
        userRole: params.userRole,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        changes: params.changes ? JSON.stringify(params.changes) : null,
      },
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
    // Don't throw - audit logging should not break the main operation
  }
}

export async function getAuditTrail(entityType: string, entityId: string) {
  return await prisma.auditLog.findMany({
    where: {
      entityType,
      entityId,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
}

export async function getRecentAudits(userId?: string, limit: number = 50) {
  return await prisma.auditLog.findMany({
    where: userId ? { userId } : undefined,
    orderBy: {
      timestamp: 'desc',
    },
    take: limit,
  });
}
