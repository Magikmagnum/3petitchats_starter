import { useState } from 'react';

export interface FormValuesTypes {
    race: string;
    marque: string;
    croquette: string;
    stade: string;
    morphologie: string;
    sterilite: string;
    activite: string;
}

const useFormValues = () => {
    const initialValues: FormValuesTypes = {
        race: '',
        marque: '',
        croquette: '',
        stade: '',
        morphologie: '',
        sterilite: '',
        activite: '',
    };
    const [formData, setFormData] = useState<FormValuesTypes>(initialValues);

    const resetFormData = (valuesToReset?: (keyof FormValuesTypes)[]) => {
        const resetValues = initialValues;

        if (valuesToReset) {
            for (const key of valuesToReset) {
                resetValues[key] = initialValues[key];
            }

            setFormData((prevFormData) => ({
                ...prevFormData,
                ...resetValues,
            }));
        }
    };

    return { formData, setFormData, resetFormData };
};

export default useFormValues;
