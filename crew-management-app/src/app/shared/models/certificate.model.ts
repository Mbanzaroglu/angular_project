export interface Certificate {
    id: number;
    typeId: number;
    issueDate: string;
    expiryDate: string;
    crewMemberId: number;
  }
  
export interface CertificateType {
  id: number;
  name: string;
  description: string;
}

export interface CertificateDetails {
  id : number;
  name : string;
  description : string;
  issueDate : string;
  expiryDate : string;
  crewMemberId : number;
}