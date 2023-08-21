import React, { useState } from 'react';


import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import { SelectChangeEvent } from '@mui/material/Select';
import { Button } from '@mui/material/';

import SelectField, { OptionType } from "../../components/Form/SelectField";
import HeaderWithCallbackComponent from "../../components/Header/HeaderWithCallbackComponent";

import useBrandList from '../../api/useBrandList';
import useCroquetteList from '../../api/useCroquetteList';
import { FormValuesTypes } from '../../hook/useFormValues';

import { raceList } from "../../helpers/race_list";

import lang_fr from '../../lang/fr';


// Définition des types des props attendues par le composant
interface InputCroquetteProps {
    formData: FormValuesTypes,
    resetForm: () => void,
    onChange: (field: string) => (event: SelectChangeEvent<string>) => void;
}

const FieldRaceComponent: React.FC<InputCroquetteProps> = ({
    formData,
    resetForm,
    onChange,
}) => {


    // Utiliser le hook pour obtenir la liste des marques et croquettes
    const { brandList } = useBrandList();
    const croquetteList = useCroquetteList(formData.marque);


    // État local pour gérer l'état de la case à cocher
    const [isChecked, setIsChecked] = useState(false);

    // Gestionnaire de changement pour la case à cocher
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
    };

    return (
        <>
            {/* Affiche le SelectField si la case à cocher est cochée */}
            {(!isChecked && formData.croquette && !formData.race) && (
                <>
                    <HeaderWithCallbackComponent title={lang_fr.selectionner_race_chat} onReset={resetForm} resetValue={['race', 'croquette']} />
                    {/* Champ select pour la race de race */}
                    <SelectField
                        id="race-select"
                        label="Race"
                        value={formData.race}
                        options={raceList}
                        onChange={onChange('race')}
                        index={false}
                    />
                </>
            )}

            {/* Affiche le TextField si la case à cocher est cochée */}
            {(isChecked && formData.croquette && !formData.race) && (
                <>
                    <HeaderWithCallbackComponent title={lang_fr.selectionner_race_chat} onReset={resetForm} resetValue={['race', 'croquette']} />
                    <TextField
                        id="race-basic"
                        label="Race"
                        onChange={() => { onChange('race'); }}
                        value={formData.race}
                        fullWidth
                        variant="outlined" />
                </>
            )}

            {/* Case à cocher pour activer ou désactiver les champs précédents */}
            {(formData.croquette && !formData.race) && (
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
            {(isChecked && formData.croquette && !formData.race) && (
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

export default FieldRaceComponent;

