import React from 'react';

const RegistrationForm = ({
                              formState,
                              updateFormState,
                              savePasswordAndData,
                              Logout,
                              t,
                          }) => {
    const { firstName, lastName, extraFields = {}, registerExtraFields = [], passwordAuthentication } = formState;

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
