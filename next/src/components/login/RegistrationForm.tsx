import React, {ReactNode} from 'react';
import { useTranslation } from 'next-i18next';
import { setPassWithPhoneNumber } from '@/functions';
import { checkCodeMeli,just_persian } from '@/utils';
import {toast} from "sonner";

interface ExtraField {
    name: string;
    label: string;
    require?: boolean;
}

interface FormState {
    firstName: string;
    lastName: string;
    countryCode: string;
    firstNameError: string;
    lastNameError: string;
    phoneNumber: string,
    password?: string;
    email?: string;
    internationalCode?: string;
    internationalCodeClass?: string;
    sessionId?: string;
    address?: any;
    webSite?: string;
    userWasInDbBefore?: boolean;
    passwordAuthentication?: boolean;
    extraFields?: Record<string, string>;
    registerExtraFields?: ExtraField[];
}

interface RegistrationFormProps {
    formState: FormState;
    updateFormState: (update: Partial<RegistrationFormProps['formState']>) => any | ReactNode | null;

}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
                                                               formState,
                                                               updateFormState=()=>{}
                                                           }) => {

    const { t } = useTranslation();
    const Logout = async (e: any) => {}
    const scrollTop = async () => {}
    const savePasswordAndData = async (e: any) => {
        e.preventDefault();

        const {
            countryCode,
            phoneNumber,
            firstName,
            lastName,
            email,
            registerExtraFields,
            userWasInDbBefore,
            webSite,
            password,
            extraFields,
            internationalCode,
            internationalCodeClass,
            address,
            sessionId,
        } = formState;

        let addres = address;
        if (!addres) {
            addres = []
        }
        let fd = countryCode || '98';
        console.log(firstName, !firstName);
        console.log(webSite, !webSite);
        console.log(lastName, !lastName);
        console.log(password, !password);
        console.log(extraFields);
        // console.log(internationalCode, !internationalCode);
        // console.log(internationalCodeClass, internationalCodeClass != true);
        if (!firstName || firstName == '') {
            console.log('firstName', firstName, !firstName);
            toast.error(t('fill everything!'));
            return;
        }
        console.log(lastName, !lastName);
        if (formState.firstNameError || formState.lastNameError) {
            toast.error(t('please check again first name or last name!'));
            return;
        }
        if (!lastName || lastName == '') {
            console.log('lastName', lastName, !lastName);
            toast.error(t('fill everything!'));
            return;
        }
        // if (!userWasInDbBefore &&( !webSite || webSite == '')) {
        //   toast(t('fill everything!'), {
        //     type: 'error',
        //   });
        //   return;
        // }
        scrollTop();

        // if (webSite?.title && !userWasInDbBefore) {
        //     // Regular expression to match any character that is not a letter (a-z) or number (0-9)
        //     const regex = /[^a-zA-Z0-9]/;
        //
        //     // Test the title against the regex
        //     if (regex.test(webSite.title)) {
        //         toast.error(t('Domain format is incorrect!'));
        //         return;
        //     }
        // }
        if (formState.passwordAuthentication)
            if (!password || password == undefined || password == '') {
                console.log('password', password, !password);

                toast.error(t('fill everything!'));
                return;
            }
        if (registerExtraFields) {
            console.log(registerExtraFields.length, registerExtraFields)
            // let exk=Object.keys(extraFields)
            for (let i = 0; i <= registerExtraFields?.length; i++) {
                let label = registerExtraFields[i]?.name;
                let require = registerExtraFields[i]?.require;
                if (require && label == 'address') {
                    let x:any = {
                        StreetAddress: extraFields?.[label]
                    }
                    if (extraFields?.['PostalCode'])
                        x['PostalCode'] = extraFields['PostalCode'];
                    if (extraFields?.['postalCode'])
                        x['PostalCode'] = extraFields['postalCode'];
                    if (extraFields?.['postalcode'])
                        x['PostalCode'] = extraFields['postalcode'];
                    addres.push(x);

                }
                if (require && label == 'internationalCode') {
                    if (!extraFields?.[label] || extraFields?.[label] == undefined || extraFields?.[label] == "") {
                        console.log("internationalCode", extraFields?.[label], !extraFields?.[label]);

                        toast.error(t("fill internationalCode!"));
                        return;
                    }

                    if (!internationalCodeClass || internationalCodeClass == undefined || internationalCodeClass == "") {
                        console.log("internationalCodeClass", internationalCodeClass, !internationalCodeClass);
                        if (internationalCode) {
                            if (checkCodeMeli(internationalCode)) {

                            } else {
                                toast.error(t("fill internationalCode!"));
                                return;
                            }
                        } else {
                            toast.error(t("fill internationalCode!"));
                            return;
                        }
                    }
                }
                if (require && label !== 'internationalCode' && label !== 'address') {
                    if (!extraFields?.[label] || extraFields?.[label] == undefined || extraFields?.[label] == "") {
                        console.log("every thing", extraFields?.[label], !extraFields?.[label]);

                        toast.error(t("fill every thing!"));
                        return;
                    }
                }
                console.log(extraFields?.[label])
            }

        }

        // return;




        if (formState.language == 'fa' && !just_persian(firstName)) {
            toast.error(t('Enter first name in persian!'));
            return;
        }
        if (formState.language == 'fa' && !just_persian(lastName)) {
            toast.error(t('Enter last name in persian!'));
            return;
        }
        console.log('setPassWithPhoneNumber...', {
            phoneNumber: fd + phoneNumber,
            firstName,
            lastName,
            webSite,
            address: addres,
            email,
            data: extraFields,
            internationalCode,
            password,
        });
        // return;
        // if (webSite?.title && !userWasInDbBefore) {
        //     let something = {title: `${webSite.title.toLowerCase()}.webruno.com`}
        //     checkDomainIsAvailable({website: something}).then((r) => {
        //         if (r.success) {
        //
        //             setPassWithPhoneNumber({
        //                 phoneNumber: fd + phoneNumber,
        //                 firstName,
        //                 lastName,
        //                 webSite: {title: `${webSite.title.toLowerCase()}.webruno.com`},
        //                 address: addres,
        //                 email,
        //                 data: extraFields,
        //                 internationalCode,
        //                 password,
        //             }).then((res) => {
        //                 console.log(' res after setpassword', res)
        //                 if (res.success || (res.customer.firstName && res.customer.lastName && res.customer.webSite)) {
        //                     scrollTop();
        //
        //                     updateFormState({
        //                         // token: res.token,
        //                         setPassword: false,
        //                         goToSiteBuilder: true,
        //                         // goToProfile: true,
        //                     });
        //                 } else {
        //                     if (res.domainIsExist) {
        //                         toast.error(t('website already exist!'))
        //                     }
        //                 }
        //             });
        //         } else if (r?.message?.error) {
        //             console.log(' r message error: ', r.message.error)
        //             if (r.message.error == 'User exists.\n') {
        //                 toast.error(t('website already exist!'))
        //             }
        //         }
        //     })
        // }
        else if (!userWasInDbBefore) {
            setPassWithPhoneNumber({
                phoneNumber: fd + phoneNumber,
                firstName,
                lastName,
                address: addres,
                email,
                data: extraFields,
                internationalCode,
                password,
            }).then((res) => {
                console.log(' res after setpassword', res)
                if (res.success || (res.customer.firstName && res.customer.lastName)) {
                    scrollTop();

                    updateFormState({
                        // token: res.token,
                        setPassword: false,
                        goToProfile: true,
                        // goToProfile: true,
                    });
                } else {
                    if (res.domainIsExist) {
                        toast.error(t('website already exist!'))
                    }
                }
            });
        }
        else if (userWasInDbBefore) {
            console.log('user was in db before')
            setPassWithPhoneNumber({
                phoneNumber: fd + phoneNumber,
                firstName,
                lastName,
                address: addres,
                email,
                data: extraFields,
                internationalCode,
                password,
            }).then((res) => {
                console.log(' res after setpassword', res)
                if (res.success) {
                    scrollTop();

                    updateFormState({
                        // token: res.token,
                        setPassword: false,
                        goToProfile: true,
                        // goToProfile: true,
                    });
                }
            });
        }

    };

    const {
        firstName,
        lastName,
        extraFields = {},
        registerExtraFields = [],
        passwordAuthentication,
    } = formState;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={savePasswordAndData}>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Your first name')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 rtl"
                            placeholder={t('First name (persian)')}
                            value={firstName}
                            onChange={(e) => updateFormState({ firstName: e.target.value })}
                            dir="rtl"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                            {t('Your last name')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 rtl"
                            placeholder={t('Last name (persian)')}
                            value={lastName}
                            onChange={(e) => updateFormState({ lastName: e.target.value })}
                            dir="rtl"
                        />
                    </div>

                    {registerExtraFields.map((item) => (
                        <div key={item.name}>
                            <label htmlFor={item.name} className="block text-sm font-medium text-gray-700 mb-1">
                                {item.label} {item.require && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type="text"
                                id={item.name}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                    item.name === 'internationalCode' ? 'ltr' : 'rtl'
                                    }`}
                                placeholder={item.label}
                                value={extraFields[item.name] || ''}
                                onChange={(e) => {
                                    const newFields = { ...extraFields, [item.name]: e.target.value };
                                    updateFormState({ extraFields: newFields });
                                }}
                                dir={item.name === 'internationalCode' ? 'ltr' : 'rtl'}
                            />
                        </div>
                    ))}

                    {passwordAuthentication && (
                        <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                {t('set new password')}
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ltr"
                                placeholder="******"
                                onChange={(e) => updateFormState({ password: e.target.value })}
                                dir="ltr"
                            />
                        </div>
                    )}
                </div>

                <div className="mt-6 space-y-2">
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        {t('Register')}
                    </button>
                    <button
                        type="button"
                        onClick={Logout}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        {t('Logout')}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;
