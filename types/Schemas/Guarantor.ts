import { Candidate } from "./Candidate";

export interface guarantor{
    firstName: string;
    lastName: string;
    homeAddress: string;
    workAddress: string;
    dateOfBirth: Date;
    emailAddress: {
      data: string;
      verified: boolean;
    };
    phoneNumber: {
      data: string;
      verified: boolean;
    };

    link:{
      uuid:string
      expDate:Date
    }
    completed:boolean
  };