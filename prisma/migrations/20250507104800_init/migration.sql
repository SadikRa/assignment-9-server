-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "paymentGatewayData" JSONB,
ALTER COLUMN "currency" SET DEFAULT 'BDT';
