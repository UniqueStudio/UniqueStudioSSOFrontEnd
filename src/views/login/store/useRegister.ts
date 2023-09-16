import { defineStore } from 'pinia';
import { RegisterStore } from '../type';
import type { ValidatedError } from '@arco-design/web-vue';
import { Message } from '@arco-design/web-vue';
import type { RegisterRequest, RegisterResponse } from '@/constants/httpMsg/register/RegisterStatusMsg';
import type { ValidateCodeRequest, ValidateCodeResponse } from '@/constants/httpMsg/register/ValidateStatusMsg';

import { register, sendValidateCode } from '@/api';
import i18n from '@/locale';

const useRegisterStore = defineStore('register', {
  state: (): RegisterStore => ({
    registerFormInfo: {
      name: '',
      gender: null,
      phoneNumber: '',
      email: '',
      password: '',
      validateCode: ''
    },
    isSendValidateCode: false,
    buttonContent: i18n.global.t('register.getValidateCode'),
  }),
  actions: {
    handleRegister(registerFormRef: any) {
      registerFormRef.validate().then((ValidatedError: ValidatedError) => {
        if (ValidatedError) {
          return;
        } else {
          const oPostData: RegisterRequest = {
            name: this.registerFormInfo.name,
            gender: this.registerFormInfo.gender!,
            phone: this.registerFormInfo.phoneNumber,
            email: this.registerFormInfo.email,
            password: this.registerFormInfo.password,
            validate_code: this.registerFormInfo.validateCode,
          };
          const res:Promise<RegisterResponse> = register(oPostData);
          res.then((response)=>{
            if(response !== null){
              Message.success(i18n.global.t('register.success'));
            }
          });
        }
      })
    },
    handleValidateCode(registerFormRef: any) {
      registerFormRef.validateField('phoneNumber').then((ValidatedError: ValidatedError) => {
        if (ValidatedError) {
          return;
        } else {
          const oPostData: ValidateCodeRequest = {
            phone: this.registerFormInfo.phoneNumber,
          }
          const res:Promise< ValidateCodeResponse> = sendValidateCode (oPostData);
          res.then((response)=>{
            if(response !== null){
              Message.success(i18n.global.t('register.getValidateCode.success'));
            }
          });
          this.isSendValidateCode = true;

          let countDown: number = 60;
          const timeInterval = setInterval(() => {
            countDown--;
            if (countDown > 0) {
              this.buttonContent = String(countDown);
            } else {
              this.buttonContent = i18n.global.t('register.getValidateCode');
              this.isSendValidateCode = false;
              clearInterval(timeInterval);
            }
          }, 1000);
        }
      })
    }
  }
});

export default useRegisterStore;