export interface User {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    phone: number;
    imageprofile?: string;
    role?: string;
    isActive: boolean;
    dateCreation: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    additionalInfo?: {
      type: string;  // Le type de l'utilisateur (Avocat, Expert, Client)
      data: any;  // Contient les données supplémentaires en fonction du type
    };
    showRoleDropdown?: boolean; // Ajouter cette ligne
  }
  