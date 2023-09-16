import { defineStore } from 'pinia';
import type { ValidatedError } from '@arco-design/web-vue';
import { Message } from '@arco-design/web-vue';

import { LoginMethod, LoginStore } from '../type';

import { ssoLogin } from '@/api';
import { LoginResponse } from '@/constants/httpMsg/register/LoginStatusMsg';
import i18n from '@/locale';

const useLoginStore = defineStore('login', {
  state: (): LoginStore => ({
    loginFormInfo: {
      phoneNumber: '',
      email: '',
      password: '',
    },
    loginMethod: LoginMethod.phone,
    isRegister: false,
  }),
  actions: {
    setIsRegister(newVal: boolean) {
      this.isRegister = newVal;
    },
    handleLogin(phoneLoginRef:any,emailLoginRef:any){
      switch (this.loginMethod){
        case LoginMethod.phone:
          phoneLoginRef.validate().then((ValidatedError: ValidatedError)=>{
            if(ValidatedError){
              return;
            } else {
              const oPostData = {
                phone:this.loginFormInfo.phoneNumber,
                password:this.loginFormInfo.password,
              }
              const res:Promise<LoginResponse> = ssoLogin(oPostData);
              res.then((response) => {
                if(response!==null){
                  Message.success(i18n.global.t('login.success'));
                }
              });
            }
          })
          break;
        case LoginMethod.email:
          emailLoginRef.validate().then((ValidatedError: ValidatedError)=>{
            if(ValidatedError){
              return;
            } else {
              const oPostData = {
                email:this.loginFormInfo.email,
                password:this.loginFormInfo.password,
              }
              const res:Promise<LoginResponse> = ssoLogin(oPostData);
              res.then((response) => {
                if(response!==null){
                  Message.success(i18n.global.t('login.success'));
                }
              })
            }
          })
          break;
        default:
          break;
      }
    }
  }
});

export default useLoginStore;