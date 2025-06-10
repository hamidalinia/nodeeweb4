import React from 'react';

const PhoneForm = ({ formState, updateFormState, t }) => {
    const handleRegister = (e) => {
        e.preventDefault();
        console.log('==> handleRegister()');
        // Your registration logic here
    };

    const handleSendCodeAgain = (e) => {
        e?.preventDefault(); // Optional chaining in case it's called without event
        console.log('==> handleSendCodeAgain()');
        handleRegister(e); // Call handleRegister with the event
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleRegister}>
                <div className="flex" dir="ltr">
                    <select
                        className="w-20 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => updateFormState({ countryCode: e.target.value })}
                        value={formState.countryCode}
                    >
                        <option value="98">+98</option>
                    </select>
                    <input
                        type="tel"
                        id="phoneNumber"
                        className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t('phone number')}
                        value={formState.phoneNumber || ''}
                        onChange={(e) => updateFormState({ phoneNumber: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    onClick={handleRegister}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('get enter code')}
                </button>
            </form>

            {/* Example of how you might use handleSendCodeAgain elsewhere */}
            {formState.timer === 0 && (
                <button
                    onClick={handleSendCodeAgain}
                    className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('Send code again?')}
                </button>
            )}
        </div>
    );
};

export default PhoneForm;