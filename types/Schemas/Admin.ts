import { AdminRole } from "./AdminRole"

export interface Admin{
    firstName:string
    lastName:string
    password:string
    adminRoles:AdminRole[]
}