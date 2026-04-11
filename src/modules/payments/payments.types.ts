export type PaymentDTO = {
  id: string;
  userId: string;
  customerId: string;
  items: Array<{
    treatmentId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  summary: {
    subtotal: number;
    discount: number;
    total: number;
  };
  method: string;
  status: string;
  date: Date;
  referenceNumber: string;
};