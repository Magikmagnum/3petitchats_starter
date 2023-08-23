import React, { useState } from 'react';


import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material/';

import SelectField, { OptionType } from "../../components/Form/SelectField";
import HeaderWithCallbackComponent from "../../components/Header/HeaderWithCallbackComponent";

import { FormTypes } from '../../hook/useFormValues';
import { TrackerStepType } from '../../hook/useStepTracker';

import { raceList } from "../../helpers/race_list";

import lang_fr from '../../lang/fr';


// Définition des types des props attendues par le composant
interface InputCroquetteProps {
    trackerStep: TrackerStepType,
    formAdmin: FormTypes,
}

const FieldRaceComponent: React.FC<InputCroquetteProps> = ({
    formAdmin,
    trackerStep,
}) => {

    const { step, setStep } = trackerStep;
    const { formData, setFormData, resetFormData } = formAdmin;

    // État local pour gérer l'état de la case à cocher
    const [isChecked, setIsChecked] = useState(false);

    // Gestionnaire de changement pour la case à cocher
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    return (
        <>
            {/* Affiche le SelectField si la case à cocher est cochée */}
            {(!isChecked && step.step_croquette && !step.step_race) && (
                <>
                    <HeaderWithCallbackComponent title={lang_fr.selectionner_race_chat} onReset={() => setStep('step_croquette', false)} />
                    {/* Champ select pour la race de race */}
                    <SelectField
                        id="race-select"
                        label="Race"
                        value={formData.race}
                        options={raceList}
                        onChange={(event) => setFormData('race', event.target.value)}
                        index={false}
                    />
                    {/* Affiche le Bouton si la case à cocher est cochée */}
                    {(!isChecked && formData.race) && (
                        <>
                            <Button type="submit" variant="contained" color="primary" className='button-form' onClick={() => setStep('step_race', true)}>
                                Suivant
                            </Button>
                        </>
                    )}
                </>
            )}

            {/* Affiche le TextField si la case à cocher est cochée */}
            {(isChecked && step.step_croquette && !step.step_race) && (
                <>
                    <HeaderWithCallbackComponent title={lang_fr.inserer_race_chat} onReset={() => setStep('step_croquette', false)} />
                    <TextField
                        id="race-basic"
                        label="Race"
                        onChange={(event) => setFormData('race', event.target.value)}
                        value={formData.race}
                        fullWidth
                        variant="outlined" />
                </>
            )}

            {/* Case à cocher pour activer ou désactiver les champs précédents */}
            {(step.step_croquette && !step.step_race) && (
                <>
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                            label={"La race manque dans la liste ?"}
                        />
                    </FormGroup>
                </>
            )}

            {/* Affiche le Bouton si la case à cocher est cochée */}
            {(isChecked && step.step_croquette && !step.step_race) && (
                <>
                    {/* Bouton pour soumettre le formulaire */}
                    <Button type="submit" variant="contained" color="primary" className='button-form' onClick={() => setStep('step_croquette', false)}>
                        Envoyer
                    </Button>
                </>
            )}
        </>
    );
}

export default FieldRaceComponent;

