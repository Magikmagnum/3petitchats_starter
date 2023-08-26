import React, { useState } from 'react';


import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material/';

import SelectField from "../../components/Form/SelectField";
import HeaderWithCallbackComponent from "../../components/Header/HeaderWithCallbackComponent";

import { FormTypes } from '../../hook/useFormValues';
import { TrackerStepType } from '../../hook/useStepTracker';

import useCatList from '../../api/useCatList';
import useCatAdd from '../../api/useCatAdd';

import lang_fr from '../../lang/fr';


// Définition des types des props attendues par le composant
interface FieldFormeTypes {
    trackerStep: TrackerStepType,
    formAdmin: FormTypes,
}

const FieldRaceComponent: React.FC<FieldFormeTypes> = ({
    formAdmin,
    trackerStep,
}) => {

    const { formData, setFormData, resetFormData } = formAdmin;
    const [isChecked, setIsChecked] = useState(false);
    const { isSuccess, error, send } = useCatAdd();
    const { step, setStep } = trackerStep;
    const { catList } = useCatList();


    return (
        <>
            {(!isChecked) && (
                <>
                    {(step.step_croquette && !step.step_race) && (
                        <>
                            <HeaderWithCallbackComponent title={lang_fr.selectionner_race_chat} onReset={() => setStep('step_croquette', false)} />
                            {/* Champ select pour la race de race */}
                            <SelectField
                                id="race-select"
                                label="Race"
                                value={formData.race}
                                options={catList}
                                onChange={(event) => setFormData('race', event.target.value)}
                                index={false}
                            />
                            {/* Case à cocher pour activer ou désactiver les champs précédents */}
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox checked={isChecked} onChange={(event) => setIsChecked(event.target.checked)} />}
                                    label={"La race manque dans la liste ?"}
                                />
                            </FormGroup>
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
                </>
            )}

            {(isChecked) && (
                <>
                    {/* Affiche le Bouton si la case à cocher est cochée */}
                    {(step.step_croquette && !step.step_race) && (
                        <>
                            <HeaderWithCallbackComponent title={lang_fr.inserer_race_chat} onReset={() => setStep('step_croquette', false)} />
                            {/* Affiche le TextField si la case à cocher est cochée */}
                            <TextField
                                id="race-basic"
                                label="Race"
                                onChange={(event) => setFormData('race', event.target.value)}
                                value={formData.race}
                                fullWidth
                                variant="outlined"
                            />
                            {/* Case à cocher pour activer ou désactiver les champs précédents */}
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox checked={isChecked} onChange={(event) => setIsChecked(event.target.checked)} />}
                                    label={"La race manque dans la liste ?"}
                                />
                            </FormGroup>
                            {/* Bouton pour soumettre le formulaire */}
                            <Button type="submit" variant="contained" color="primary" className='button-form' onClick={() => send(formData.race)}>
                                Envoyer
                            </Button>
                        </>
                    )}
                </>
            )}

        </>
    );
}

export default FieldRaceComponent;

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             