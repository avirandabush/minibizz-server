export type UserDTO = {
  id: string;
  name: string;

  contact: {
    email: string;
    phone: string;
    alternatePhone?: string;
  };

  business: {
    name: string;
    legalName: string;
    dealerNo: string;
    dealerType: 'EXEMPT' | 'LICENSED' | 'COMPANY';
    professionalField: string;
    address: string;
    website?: string;
    logoUrl?: string;
  };

  preferences: {
    language: 'he' | 'en';
    darkMode: boolean;
  };

  plan: 'SILVER' | 'GOLD' | 'PLATINUM';
  status: 'ACTIVE' | 'TRIAL' | 'SUSPENDED' | 'CANCELLED';
  lastLogin: Date;
};