export default function LoginForm() {
    return 'login'
}

//  // Required for client-side interactivity in Next.js 13+
//
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useTranslation } from 'next-i18next';
// import { toast } from 'sonner';
// import  PhoneForm  from '@/components/login/AuthenticationForm';
// import  ActivationForm  from '@/components/login/ActivationForm';
//  import PasswordForm from "@/components/login/PasswordForm";
//  import RegistrationForm from "@/components/login/RegistrationForm";
//
// // import { CircularProgress } from '@mui/material';
//
// const globalTimerSet = 120;
//
// export default function LoginForm({ fromPage }) {
//     const router = useRouter();
//     const { t } = useTranslation();
//
//     // State management
//     const [formState, setFormState] = useState({
//         captcha: false,
//         phoneNumber: null,
//         thePhoneNumber: null,
//         activationCode: null,
//         enterActivationCodeMode: false,
//         showSecondForm: false,
//         userWasInDbBefore: true,
//         isDisplay: true,
//         setPassword: false,
//         countryCode: '98', // Default country code
//         getPassword: false,
//         firstName: '',
//         lastName: '',
//         passwordAuthentication: true,
//         registerExtraFields: [],
//         extraFields: {},
//         internationalCode: '',
//         email: '',
//         goToProfile: false,
//         loginMethod: 'sms',
//         token: null,
//         CameFromPost: false,
//         goToProduct: null,
//         goToCheckout: false,
//         goToChat: false,
//         timer: globalTimerSet,
//         password: '',
//     });
//
//     const [isLoading, setIsLoading] = useState(false);
//
//
//     // Timer effect
//     useEffect(() => {
//         let interval;
//         if (formState.enterActivationCodeMode || formState.getPassword) {
//             interval = setInterval(() => {
//                 setFormState(prev => ({
//                     ...prev,
//                     timer: prev.timer > 0 ? prev.timer - 1 : handleClearInterval()
//                 }));
//             }, 1000);
//         }
//         return () => clearInterval(interval);
//     }, [formState.enterActivationCodeMode, formState.getPassword]);
//
//     const handleClearInterval = () => {
//         return 0;
//     };
//
//
//     // Helper functions
//     const updateFormState = (updates) => {
//         setFormState(prev => ({ ...prev, ...updates }));
//     };
//
//     // Registration handler
//     const handleRegister = async (e) => {
//         e.preventDefault();
//
//         const { countryCode, phoneNumber, loginMethod } = formState;
//
//         if (!phoneNumber) {
//             toast(t('Please enter your phone number'), { type: 'error' });
//             return;
//         }
//
//         try {
//             const number = phoneNumber.substring(phoneNumber.length - 10);
//             const phoneNumberFull = countryCode + number;
//
//             // Replace with your actual API call
//             const r = await register(phoneNumberFull, countryCode, loginMethod);
//
//             if (r?.success === false && r.message) {
//                 toast(t(r.message), { type: 'error' });
//                 return;
//             }
//
//             updateFormState({
//                 thePhoneNumber: number,
//                 phoneNumber: number,
//                 enterActivationCodeMode: r?.shallWeSetPass,
//                 isDisplay: !r?.shallWeSetPass,
//                 userWasInDbBefore: r?.userWasInDbBefore,
//                 getPassword: !r?.shallWeSetPass && r?.userWasInDbBefore,
//                 timer: globalTimerSet
//             });
//
//         } catch (error) {
//             toast(t('Registration failed'), { type: 'error' });
//             console.error(error);
//         }
//     };
//
//     // Activation code handler
//     const handleActivation = async (e) => {
//         e.preventDefault();
//         const { activationCode, countryCode, phoneNumber } = formState;
//
//         if (!activationCode) {
//             toast(t('Please enter activation code'), { type: 'error' });
//             return;
//         }
//
//         try {
//             const req = {
//                 activationCode,
//                 phoneNumber: countryCode + phoneNumber,
//             };
//
//             // Replace with your actual API call
//             const res = await active(req);
//
//             if (!res.success) {
//                 toast.error(t(res.message));
//                 return;
//             }
//
//             toast.success(t('Welcome'));
//
//             updateFormState({
//                 token: res.token,
//                 enterActivationCodeMode: false,
//                 setPassword: res.shallWeSetPass,
//                 firstName: res.firstName || formState.firstName,
//                 lastName: res.lastName || formState.lastName,
//                 userWasInDbBefore: res.userWasInDbBefore
//             });
//
//         } catch (error) {
//             toast.error(t('Activation failed'));
//             console.error(error);
//         }
//     };
//
//     // Password submission handler
//     const handlePassword = async (e) => {
//         e.preventDefault();
//         const { countryCode, phoneNumber, password } = formState;
//
//         try {
//             // Replace with your actual API call
//             const res = await authCustomerWithPassword({
//                 phoneNumber: countryCode + phoneNumber,
//                 password
//             });
//
//             if (res.success) {
//                 updateFormState({
//                     token: res.customer.token,
//                     firstName: res.customer.firstName || null,
//                     lastName: res.customer.lastName || null,
//                     goToCheckout: formState.goToCheckout,
//                     goToProfile: !formState.goToCheckout
//                 });
//             } else {
//                 toast(t(res.message || 'Login failed'), { type: 'error' });
//             }
//         } catch (error) {
//             toast(t(error.message || 'Login failed'), { type: 'error' });
//             console.error(error);
//         }
//     };
//
//     // Forgot password handler
//     const handleForgotPass = async (e) => {
//         e.preventDefault();
//         const { countryCode, phoneNumber, loginMethod } = formState;
//
//         try {
//             // Replace with your actual API call
//             const r = await authCustomerForgotPass(
//                 countryCode + phoneNumber,
//                 countryCode,
//                 loginMethod
//             );
//
//             updateFormState({
//                 enterActivationCodeMode: true,
//                 isDisplay: false,
//                 getPassword: false,
//                 firstName: r.firstName || formState.firstName,
//                 lastName: r.lastName || formState.lastName,
//                 timer: globalTimerSet
//             });
//
//         } catch (error) {
//             toast(t('Password reset failed'), { type: 'error' });
//             console.error(error);
//         }
//     };
//
//     // Reset form handler
//     const handleWrongPhoneNumber = (e) => {
//         e.preventDefault();
//         updateFormState({
//             phoneNumber: null,
//             activationCode: null,
//             enterActivationCodeMode: false,
//             showSecondForm: false,
//             isDisplay: true,
//             setPassword: false,
//             getPassword: false,
//             goToProfile: false,
//             timer: globalTimerSet
//         });
//     };
//
//     // Navigation effects
//     useEffect(() => {
//         if (!formState.token) return;
//
//         if (formState.token && formState.goToProduct) {
//             router.push(`/submit-order/${formState.goToProduct}`);
//             return;
//         }
//
//         if (formState.token && formState.goToCheckout &&
//             formState.firstName && formState.lastName && !formState.setPassword) {
//             router.push('/checkout');
//             return;
//         }
//
//         if (formState.token && !formState.goToCheckout && fromPage && !formState.setPassword) {
//             router.push(`${fromPage}/`);
//             return;
//         }
//
//         if (formState.token && formState.goToChat) {
//             router.push('/chat');
//             return;
//         }
//
//         if (formState.token && formState.CameFromPost && !formState.setPassword) {
//             router.push('/add-new-post/publish');
//             return;
//         }
//
//         if ((formState.token && !formState.CameFromPost && !formState.setPassword &&
//             formState.firstName && formState.lastName) || formState.goToProfile) {
//             router.push('/profile');
//         }
//     }, [formState, router, fromPage]);
//
//  // Continue to Part 4...
//     // Continue from Part 3...
//
//     // Main render function
//     return (
//         <div className="max-w-md mx-auto my-8">
//             {formState.isDisplay && (
//                 <PhoneForm
//                     formState={formState}
//                     updateFormState={updateFormState}
//                     handleRegister={handleRegister}
//                     t={t}
//                 />
//             )}
//
//             {formState.enterActivationCodeMode && (
//                 <ActivationForm
//                     formState={formState}
//                     updateFormState={updateFormState}
//                     handleActivation={handleActivation}
//                     handleWrongPhoneNumber={handleWrongPhoneNumber}
//                     handleRegister={handleRegister}
//                     globalTimerSet={globalTimerSet}
//                     t={t}
//                 />
//             )}
//
//             {formState.setPassword && (
//                 <RegistrationForm
//                     formState={formState}
//                     updateFormState={updateFormState}
//                     savePasswordAndData={savePasswordAndData}
//                     Logout={Logout}
//                     t={t}
//                 />
//             )}
//
//             {formState.getPassword && (
//                 <PasswordForm
//                     formState={formState}
//                     updateFormState={updateFormState}
//                     handlePassword={handlePassword}
//                     handleForgotPass={handleForgotPass}
//                     handleWrongPhoneNumber={handleWrongPhoneNumber}
//                     t={t}
//                 />
//             )}
//         </div>
//     );
// }
//  //
//  // // Helper functions (replace with your actual implementations)
//  // async function register(phoneNumber, countryCode, method) {
//  //     // Your implementation
//  // }
//  //
//  // async function active(request) {
//  //     // Your implementation
//  // }
//  //
//  // async function authCustomerWithPassword(credentials) {
//  //     // Your implementation
//  // }
//  //
//  // async function authCustomerForgotPass(phoneNumber, countryCode, method) {
//  //     // Your implementation
//  // }
//  //
//  // async function setPassWithPhoneNumber(data) {
//  //     // Your implementation
//  // }
//  //
//  // function Logout() {
//  //     // Your implementation
//  // }
//  //
//  // function savePost(data) {
//  //     // Your implementation
//  // }