import React, { useState } from 'react';


import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { SelectChangeEvent } from '@mui/material/Select';
import { Button } from '@mui/material/';

import SelectField, { OptionType } from "./SelectField";

import useBrandList from '../../api/useBrandList';
import useCroquetteList from '../../api/useCroquetteList';
import { FormValuesTypes } from '../../hook/useFormValues';
import { TrackerStepType } from '../../hook/useStepTracker';

import lang_fr from '../../lang/fr';

// Définition des types des props attendues par le composant
interface InputCroquetteProps {
    formData: FormValuesTypes,
    resetForm: () => void,
    onChange: (fieldName: string, value: string) => void,
    trackerStep: TrackerStepType
}


const FieldCroquetteComponent: React.FC<InputCroquetteProps> = ({
    formData,
    resetForm,
    onChange,
    trackerStep,
}) => {


    // Utiliser le hook pour obtenir la liste des marques et croquettes
    const { brandList } = useBrandList();
    const croquetteList = useCroquetteList(formData.marque);

    const { step, setStep } = trackerStep;;

    // État local pour gérer l'état de la case à cocher
    const [isChecked, setIsChecked] = useState(false);

    // Gestionnaire de changement pour la case à cocher
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    return (
        <>
            {/* Affiche le SelectField si la case à cocher est cochée */}
            {(!isChecked && !step.step_croquette) && (
                <>
                    <div className="title titleCard">
                        {lang_fr.selectionner_marque_croquette /* Les nutriments dont votre chat a besoin */}
                    </div>
                    {/* Champ select pour la marque de race */}
                    <SelectField
                        id="marque-select"
                        label="Marque"
                        value={formData.marque}
                        options={brandList}
                        onChange={(event) => onChange('marque', event.target.value)}
                        index={false}
                    />


                    {(!isChecked && formData.marque) && (
                        <>
                            {/* Champ select pour la croquette de race */}
                            <SelectField
                                id="croquette-select"
                                label="Croquette"
                                value={formData.croquette}
                                options={croquetteList}
                                onChange={(event) => onChange('croquette', event.target.value)}
                                index={true}
                            />

                            {/* Affiche le Bouton si la case à cocher est cochée */}
                            {(!isChecked && formData.croquette) && (
                                <>
                                    <Button type="submit" variant="contained" color="primary" className='button-form' onClick={() => setStep('step_croquette', true)}>
                                        Suivant
                                    </Button>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
            {/* Affiche le TextField si la case à cocher est cochée */}
            {(isChecked && !step.step_croquette) && (
                <>
                    <div className="title titleCard">
                        {lang_fr.inserer_marque_croquette /* Les nutriments dont votre chat a besoin */}
                    </div>
                    <TextField
                        id="marque-input"
                        variant="outlined"
                        label="Marque"
                        onChange={(event) => { onChange('marque', event.target.value) }}
                        value={formData.marque}
                        fullWidth />

                    <TextField
                        id="croquette-input"
                        variant="outlined"
                        label="Croquette"
                        onChange={(event) => { onChange('croquette', event.target.value) }}
                        value={formData.croquette}
                        fullWidth />
                </>
            )}
            {/* Case à cocher pour activer ou désactiver les champs précédents */}
            {(!step.step_croquette) && (
                <>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                            label={!formData.marque ? "La marque manque dans la liste ?" : "La croquette manque dans la liste ?"}
                        />
                    </FormGroup>
                </>
            )}

            {/* Affiche le Bouton si la case à cocher est cochée */}
            {(isChecked && !step.step_croquette) && (
                <>
                    {/* Bouton pour soumettre le formulaire */}
                    <Button type="submit" variant="contained" color="primary" className='button-form' onClick={() => resetForm()}>
                        Envoyer
                    </Button>
                </>
            )}
        </>
    );
}

export default FieldCroquetteComponent;

