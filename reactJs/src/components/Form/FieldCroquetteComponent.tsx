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

import lang_fr from '../../lang/fr';


// Définition des types des props attendues par le composant
interface InputCroquetteProps {
    formData: FormValuesTypes,
    resetForm: () => void,
    onChange: (field: string) => (event: SelectChangeEvent<string>) => void;
}

const FieldCroquetteComponent: React.FC<InputCroquetteProps> = ({
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
            {(!isChecked && !formData.croquette) && (
                <>
                    <div className="title titleCard">
                        {lang_fr.selectionner_marque_croquette /* Les nutriments dont votre chat a besoin */}
                    </div>
                    {/* Champ select pour la marque de race */}
                    <SelectField
                        id="race-select"
                        label="Marque"
                        value={formData.marque}
                        options={brandList}
                        onChange={onChange('marque')}
                        index={false}
                    />


                    {(!isChecked && formData.marque) && (
                        <>
                            {/* Champ select pour la croquette de race */}
                            <SelectField
                                id="race-select"
                                label="Croquette"
                                value={formData.croquette}
                                options={croquetteList}
                                onChange={onChange('croquette')}
                                index={true}
                            />

                        </>
                    )}



                </>
            )}
            {/* Affiche le TextField si la case à cocher est cochée */}
            {(isChecked && !formData.croquette) && (
                <>
                    <div className="title titleCard">
                        {lang_fr.inserer_marque_croquette /* Les nutriments dont votre chat a besoin */}
                    </div>
                    <TextField
                        id="race-select"
                        variant="outlined"
                        label="Marque"
                        onChange={() => { onChange('marque'); }}
                        value={formData.marque}
                        fullWidth />

                    <TextField
                        id="race-select"
                        variant="outlined"
                        label="Croquette"
                        onChange={() => { onChange('croquette'); }}
                        value={formData.croquette}
                        fullWidth />
                </>
            )}
            {/* Case à cocher pour activer ou désactiver les champs précédents */}
            {(!formData.croquette) && (
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
            {(isChecked && !formData.croquette) && (
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

