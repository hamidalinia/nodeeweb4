import React from 'react';

interface ActivationFormProps {
    formState: {
        countryCode: string;
        thePhoneNumber: string;
        activationCode?: string;
        timer: number;
    };
    updateFormState: (state: Partial<{
        countryCode: string;
        thePhoneNumber: string;
        activationCode?: string;
        timer: number;
    }>) => void;
    handleActivation: (e: React.FormEvent<HTMLFormElement>) => void;
    handleWrongPhoneNumber: () => void;
    handleRegister: () => void;
    t: (key: string) => string;
    globalTimerSet: number;
}

const ActivationForm: React.FC<ActivationFormProps> = ({
                                                           formState,
                                                           updateFormState,
                                                           handleActivation,
                                                           handleWrongPhoneNumber,
                                                           handleRegister,
                                                           t,
                                                           globalTimerSet,
                                                       }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleActivation}>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">{t('your phone number')}:</span>
                        <span className="text-sm font-medium ltr">
                            +{formState.countryCode}{formState.thePhoneNumber}
                        </span>
                    </div>

                    {formState.timer > 0 && (
                        <div className="relative w-32 h-32 mx-auto mb-4">
                            {/* Replace this with a real circular progress if needed */}
                            <div
                                className="text-red-500"
                                style={{
                                    borderWidth: '2px',
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    borderColor: 'red',
                                }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center text-xl font-bold">
                                {formState.timer}
                            </div>
                        </div>
                    )}

                    <label htmlFor="activationCode" className="block text-xs text-gray-500 mb-1">
                        {t('enter sent code')}
                    </label>
                    <input
                        type="number"
                        id="activationCode"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ltr"
                        placeholder="______"
                        value={formState.activationCode || ''}
                        onChange={(e) => updateFormState({ activationCode: e.target.value })}
                        dir="ltr"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('login')}
                </button>

                <button
                    type="button"
                    onClick={handleWrongPhoneNumber}
                    className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    {t('Wrong phone number?')}
                </button>

                {formState.timer === 0 && (
                    <button
                        type="button"
                        onClick={handleRegister}
                        className="w-full text-blue-600 hover:text-blue-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors border-0"
                    >
                        {t('Send code again?')}
                    </button>
                )}
            </form>
        </div>
    );
};

export default ActivationForm;
