export type TreatmentDTO = {
  id: string;
  userId: string;
  name: string;
  description: string;
  isFavorite: boolean;
  isActive: boolean;

  specs: {
    price: number;
    durationMinutes: number;
    bufferMinutes?: number;
  };

  color: string;
};