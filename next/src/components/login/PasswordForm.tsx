import React from 'react';

const PasswordForm = ({
                          formState,
                          updateFormState,
                          handlePassword,
                          handleForgotPass,
                          handleWrongPhoneNumber,
                          t,
                      }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handlePassword}>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm text-gray-600">{t('your phone number')}:</span>
                        <span className="text-sm font-medium ltr">
              +{formState.countryCode}
                            {formState.thePhoneNumber}
            </span>
                    </div>

                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        {t('Enter password')}
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ltr"
                        placeholder="******"
                        value={formState.password || ''}
                        onChange={(e) => updateFormState({ password: e.target.value })}
                        dir="ltr"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('Login')}
                </button>

                <button
                    type="button"
                    onClick={handleForgotPass}
                    className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('Forgot Password')}
                </button>

                <button
                    type="button"
                    onClick={handleWrongPhoneNumber}
                    className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('Wrong phone number?')}
                </button>
            </form>
        </div>
    );
};

export default PasswordForm;
