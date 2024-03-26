import { adminNote } from "./AdminNote";
import { guarantor } from "./Guarantor";
import { PostingTitle } from "./PostingTitle";

export interface Candidate {
  credentials: {
    password: string;
    email: string;
  };
  
  documentData: {
    uid:string
    firstName: string;
    lastName: string;
    phoneNumber: {
      data: string;
      verified: boolean;
    };
    address?: string;
    email: {
      data: string;
      verified: boolean;
    };
    stateOfOrigin?: string;
    lgaOfOrigin?: string;
    dateOfBirth?: string;
    gender:string;
    role?: string;
    guarantors?: guarantor[];
  };
}
