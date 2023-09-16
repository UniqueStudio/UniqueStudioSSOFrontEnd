export const enum LoginMethod{
  phone = 1,
  email = 2,
}

export const enum Gender{
  male = 1,
  female = 2,
  other = 3,
}

export interface LoginFormInfo {
  phoneNumber: string,
  email: string,
  password: string,
}

export interface LoginStore {
  loginFormInfo:LoginFormInfo,
  loginMethod:LoginMethod,
  isRegister:boolean,
}


export interface RegisterFormInfo {
  name:string,
  gender: Gender | null ,
  phoneNumber: string,
  email: string,
  password: string,
  validateCode:string,
}

export interface RegisterStore {
  registerFormInfo:RegisterFormInfo,
  isSendValidateCode:boolean,
  buttonContent:string,
}
