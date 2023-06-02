import React, { useState, useEffect } from 'react';
import './Analyse.scss';
import "./SkillClient.scss";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
} from '@mui/material/';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { SelectChangeEvent } from '@mui/material/';
import axios from 'axios'

import { raceList } from "../../helpers/race_list";
import { activityList } from "../../helpers/activity_list";
import { ageList } from "../../helpers/age_list";
import { morphplogieList } from "../../helpers/morphplogie_list";
import { steriliseList } from "../../helpers/sterilise_list";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar } from '../../components/Opinion/Opinion';
import { Header } from '../../components/Header/Header';




ChartJS.register(ArcElement, Tooltip, Legend);

const lng_analyse = {
    "Attente_analyse": "En attente d'analyse ...",
    "acheter_croquette": "Acheter une croquette",
    "Protéine": "",
    "Lipide": "",
    "Glucide": "",
    "Mauvai": "",
    "Fibre": "",
    "Excellen": "",
    "Eau": "",
    "calories_chat_besion": "Les calories dont votre chat a besion",
    "apport_nutritif_croquettes": "Apport nutritif des croquettes",
    "a_savoir": "À savoir",
    "explication_besion": `Le besoin énergétique de votre chat est de,`,
    "explication_apport": `tandis que l'apport énergétique des croquettes est de,`,
}

export const data = {
    labels: ['Proteine', 'Glucide', 'Lipide', 'Fibre', 'Eau', 'Cendres'],
    datasets: [
        {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                '#009007cf',
                '#000',
                '#aaa',
                '#ff9800ba',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
                '#009007cf',
                '#000',
                '#aaa',
                '#ff9800ba',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
            ],
            // borderColor: '#009007',
            pointBorderColor: '#000',
            pointBorderWidth: 0,
            //tension: 1,
            borderRadius: 100,
            spacing: 14,
            cutout: '88%',
            hoverBackgroundColor: '#000',
            hoverBorderColor: '#000',
            borderWidth: 1,
        },
    ],
};

const besoin_energetique = 400;




// Définition de l'interface des valeurs du formulaire
interface FormValuesTypes {
    marque: string;
    croquette: string;
    race: string;
    stade: string;
    activite: string;
    morphologie: string;
    sterilite: string;
}

// Définition de l'interface du tableau de marques
interface BrandTypes {
    value: string;
    key: string;
}


// Définition de l'interface du tableau de croquette
interface CroquetteTypes {
    value: string;
    key: number;
}

// interface AnalyseDataRequestTypes {
//     animal: string;
//     race: string;
//     stade: string;
//     activite: string;
//     morphologie: string;
//     sterilite: boolean;
// }

interface AnalyseDataResponseTypes {
    status: number;
    success: boolean;
    message: string;
    data: {
        marque: string;
        name: string;
        sterilise: boolean;
        energie_metabolisable: number; //(en_kcal/100g)
        analyse_quantitatif_nutriment: {
            proteine: boolean;
            lipide: boolean;
            ENA: boolean;
        };
        quantite_Journaliere: number;  //(en_g/jour)
        url: string;
        urlimage: string;
        element_nutritif: {
            ENA: number;
            proteine: number;
            lipide: number;
            fibre: number;
            cendres: number;
            eau: number;
        };
        score: number;
        commentaire: string;
    };
}






const Form: React.FC = () => {

    // Définition des states pour les valeurs du formulaire et les données de la table
    const [formData, setFormData] = useState<FormValuesTypes>({ race: '', marque: '', croquette: '', stade: '', morphologie: '', sterilite: '', activite: '' });
    const [tableData, setTableData] = useState<FormValuesTypes[]>([]);

    const [brandList, setBrandList] = useState<BrandTypes[]>([]);
    const [croquetteList, setCroquetteList] = useState<CroquetteTypes[]>([]);
    const [response, setResponse] = useState<AnalyseDataResponseTypes | {}>({});

    // const [useDataDo, setUserDataDo] = useState({
    //     labels: 2023,
    //     datasets: [{
    //         label: "User gain",
    //         data: [12, 19, 3,],
    //         fill: true, // permet de faire apparaitre le backgroundColor 
    //         //backgroundColor: '#0090071f',
    //         backgroundColor: [
    //             '#009007cf',
    //             '#000',
    //             '#aaa',
    //             '#ff9800ba'
    //         ],
    //         borderColor: '#009007',
    //         pointBorderColor: '#000',
    //         pointBorderWidth: 0,
    //         //tension: 1,
    //         borderRadius: 100,
    //         spacing: 14,
    //         cutout: '88%',
    //         hoverBackgroundColor: '#000',
    //         hoverBorderColor: '#000',
    //         borderWidth: 0,

    //     }]
    // });





    // Recuperer la list des marques depuis le serveur
    async function getBrandList() {
        try {
            const response = await axios.get('https://api-comparateur.3ptits-chats.fr/api/v1/brand');


            const brandsSelect: BrandTypes[] = [];

            response.data.data.forEach(function (brands: any) {
                brandsSelect.push({
                    value: brands.name,//parseInt(brands.id),
                    key: brands.name,
                })
            });
            setBrandList(brandsSelect);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getBrandList();
    }, [])

    // Recuperer la list des marques depuis le serveur
    async function getCroquetteList(brand: string) {
        try {
            const response = await axios.get('https://api-comparateur.3ptits-chats.fr/api/v1/croquette_by_brand/' + brand);


            const croquettesSelect: CroquetteTypes[] = [];

            response.data.data.forEach(function (Croquettes: any) {
                croquettesSelect.push({
                    value: Croquettes.name,
                    key: parseInt(Croquettes.id),
                })
            });
            setCroquetteList(croquettesSelect);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (formData.marque) {
            getCroquetteList(formData.marque);
        }
    }, [formData.marque])

    // Recuperer la list des marques depuis le serveur
    async function getAnalyse(data: FormValuesTypes) {
        try {

            const { croquette, marque, ...parametre } = data;

            axios.post("https://api-comparateur.3ptits-chats.fr/api/v1/analyse/" + croquette, {
                race: parametre.race,
                stade: parametre.stade,
                activite: parametre.activite,
                morphologie: parametre.morphologie,
                sterilite: parametre.sterilite
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(responses => {
                    //console.log(responses.data);
                    setResponse(responses.data);

                    // Réinitialise les valeurs du formulaire
                    //setFormData({ race: '', marque: '', croquette: '', stade: '', morphologie: '', sterilite: '', activite: '' });

                })
                .catch(error => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
    }

    // Gestionnaires de changement pour les champs de texte et le select
    const handleAgeChange = (event: SelectChangeEvent<string>) => {
        // Met à jour la valeur du formulaire
        setFormData({ ...formData, stade: event.target.value });
    };

    // Gestionnaires de changement pour les champs de texte et le select
    const handleActiveChange = (event: SelectChangeEvent<string>) => {
        // Met à jour la valeur du formulaire
        setFormData({ ...formData, activite: event.target.value });
    };

    // Gestionnaires de changement pour les champs de texte et le select
    const handleMorphologieChange = (event: SelectChangeEvent<string>) => {
        // Met à jour la valeur du formulaire
        setFormData({ ...formData, morphologie: event.target.value });
    };

    // Gestionnaires de changement pour les champs de texte et le select
    const handleSteriliteChange = (event: SelectChangeEvent<string>) => {
        // Met à jour la valeur du formulaire
        setFormData({ ...formData, sterilite: event.target.value });
    };

    // Gestionnaires de changement pour les champs de texte et le select
    const handleRaceChange = (event: SelectChangeEvent<string>) => {
        // Met à jour la valeur du formulaire
        setFormData({ ...formData, race: event.target.value });
    };

    // Gestionnaires de changement pour les champs de texte et le select
    const handleMarqueChange = (event: SelectChangeEvent<string>) => {
        // Met à jour la valeur du formulaire
        setFormData({ ...formData, marque: event.target.value });
    };

    // Gestionnaires de changement pour les champs de texte et le select
    const handleCroquetteChange = (event: SelectChangeEvent<string>) => {
        // Met à jour la valeur du formulaire
        setFormData({ ...formData, croquette: event.target.value });
    };

    // Gestionnaire de soumission du formulaire
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Ajoute les valeurs du formulaire actuel aux données de la table
        setTableData([...tableData, formData]);

        getAnalyse(formData);
    };

    const handleButtonBuyClick = () => {
        if ('data' in response && 'url' in response.data && response.data.url !== '') {
            window.location.href = response.data.url;
        }
    };

    return (

        <section className="content reverse">
            <form className="left" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px', paddingTop: '24px' }}>
                {/* Champ select pour la ville */}
                <FormControl fullWidth>
                    <InputLabel id="brand-select-label">Marque</InputLabel>
                    <Select
                        labelId="brand-select-label"
                        id="brand-select"
                        value={formData.marque}
                        label="Marque"
                        onChange={handleMarqueChange}
                        fullWidth
                    >
                        {/* Options pour le champ select */}
                        {brandList.map((brand) => (
                            <MenuItem key={brand.key} value={brand.value}>
                                {brand.value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Champ select pour la ligne de croquette */}
                <FormControl fullWidth>
                    <InputLabel id="croquette-select-label">Croquette</InputLabel>
                    <Select
                        labelId="croquette-select-label"
                        id="croquette-select"
                        value={formData.croquette}
                        label="Croquette"
                        onChange={handleCroquetteChange}
                        fullWidth
                    >
                        {/* Options pour le champ select */}
                        {croquetteList.map((croquette) => (
                            <MenuItem key={croquette.key} value={croquette.key}>
                                {croquette.value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Champ select pour la race de race */}
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Race</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={formData.race}
                        label="Ville"
                        onChange={handleRaceChange}
                        fullWidth
                    >
                        {/* Options pour le champ select */}
                        {raceList.map((race) => (
                            <MenuItem key={race.key} value={race.value}>
                                {race.value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Champ select pour la ligne de âge */}
                <FormControl fullWidth>
                    <InputLabel id="age-select-label" >Âge</InputLabel>
                    <Select
                        labelId="age-select-label"
                        id="age-select"
                        value={formData.stade}
                        label="Age"
                        onChange={handleAgeChange}
                        fullWidth
                    >
                        {/* Options pour le champ select */}
                        {ageList.map((age) => (
                            <MenuItem key={age.key} value={age.value}>
                                {age.value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Champ select pour la ligne de Sterilite */}
                <FormControl fullWidth>
                    <InputLabel id="sterilite-select-label">Stérilisé</InputLabel>
                    <Select
                        labelId="sterilite-select-label"
                        id="sterilite-select"
                        value={formData.sterilite}
                        label="Sterilite"
                        onChange={handleSteriliteChange}
                        fullWidth
                    >
                        {/* Options pour le champ select */}
                        {steriliseList.map((sterilite) => (
                            <MenuItem key={sterilite.key} value={sterilite.key}>
                                {sterilite.value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Champ select pour la ligne de activité */}
                <FormControl fullWidth>
                    <InputLabel id="active-select-label">Activité</InputLabel>
                    <Select
                        labelId="active-select-label"
                        id="active-select"
                        value={formData.activite}
                        label="Active"
                        onChange={handleActiveChange}
                        fullWidth
                    >
                        {/* Options pour le champ select */}
                        {activityList.map((active) => (
                            <MenuItem key={active.key} value={active.value}>
                                {active.value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Champ select pour la ligne de croquette */}
                <FormControl fullWidth>
                    <InputLabel id="morphologie-select-label">Morphologie</InputLabel>
                    <Select
                        labelId="morphologie-select-label"
                        id="morphologie-select"
                        value={formData.morphologie}
                        label="Morphologie"
                        onChange={handleMorphologieChange}
                        fullWidth
                    >
                        {/* Options pour le champ select */}
                        {morphplogieList.map((morphologie) => (
                            <MenuItem key={morphologie.key} value={morphologie.value}>
                                {morphologie.value}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* Bouton pour soumettre le formulaire */}
                <Button type="submit" variant="contained" color="primary" className='button-form'>
                    Analyser
                </Button>
            </form>


            <section className="right" >

                {(Object.keys(response).length !== 0) && ((response as AnalyseDataResponseTypes).status === 200 && (response as AnalyseDataResponseTypes).data !== null) ? (
                    <>
                        <section className="profil" >
                            <div style={{ flex: "2" }}>
                                <Header srcImg={(response as AnalyseDataResponseTypes).data.urlimage} title={(response as AnalyseDataResponseTypes).data.name} subtitle={(response as AnalyseDataResponseTypes).data.marque} description={(response as AnalyseDataResponseTypes).data.analyse_quantitatif_nutriment.proteine ? 'Croquettes pour chat stérilisé' : 'Croquettes pour chat non-stérilisé'} styleImage='avatarSqareMax' styleContent='headerCmpCenter' styleTitle='headerTitle' />
                                {('data' in response && 'url' in response.data && response.data.url !== '') ? <Button type="submit" variant="contained" color="primary" className='button-bay' onClick={handleButtonBuyClick}>
                                    {lng_analyse.acheter_croquette /* Acheter une croquette */}
                                </Button> : ''}
                            </div>
                            <div className="noteBox" style={{ flex: "2" }}>
                            </div>
                        </section>


                        <section className="profil" >
                            <div className="noteBox">
                                <div className="title titleCard">
                                    {lng_analyse.apport_nutritif_croquettes /* Les nutriments dont votre chat a besoin */}
                                </div>
                                <Bar title="Proteine" value={(response as AnalyseDataResponseTypes).data.element_nutritif.proteine / 10} status={(response as AnalyseDataResponseTypes).data.analyse_quantitatif_nutriment.proteine} />
                                <Bar title="Lipide" value={(response as AnalyseDataResponseTypes).data.element_nutritif.lipide / 10} status={(response as AnalyseDataResponseTypes).data.analyse_quantitatif_nutriment.lipide} />
                                <Bar title="Glucide" value={(response as AnalyseDataResponseTypes).data.element_nutritif.ENA / 10} status={(response as AnalyseDataResponseTypes).data.analyse_quantitatif_nutriment.ENA} />
                                <Bar title="Fibre" value={(response as AnalyseDataResponseTypes).data.element_nutritif.fibre / 10} status={true} />
                                <Bar title="Eau" value={(response as AnalyseDataResponseTypes).data.element_nutritif.eau / 10} status={true} />
                            </div>
                            <div className="noteBox">
                                <div className="title titleCard">
                                    {lng_analyse.calories_chat_besion /* Les calories dont votre chat a besion */}
                                </div>
                                <text className='scrore'> {(response as AnalyseDataResponseTypes).data.energie_metabolisable} / {besoin_energetique} </text><text>*</text>

                                <Alert severity="warning">
                                    <AlertTitle>{lng_analyse.a_savoir /* A savoir */}</AlertTitle>
                                    {(response as AnalyseDataResponseTypes).data.commentaire}
                                </Alert>
                            </div>
                        </section>
                        <section className="profil" >
                            <p className='description'>
                                * {lng_analyse.explication_besion /* Le besoin énergétique de votre chat est de  */}
                                <text className='red txt-bold'> {besoin_energetique} </text>
                                <text className='subTitle'>kcal/g</text>, {lng_analyse.explication_apport /* tandis que l'apport énergétique des croquettes est de   */}
                                <text className='green txt-bold'> {(response as AnalyseDataResponseTypes).data.energie_metabolisable}  </text><text className='subTitle'>kcal/g</text>.</p>
                        </section>
                    </>
                ) : (
                    <div className='waiter'>
                        <img src={require("../../images/avatar/chat.png")} className="waiter-img" alt="chat" />
                        <p>{lng_analyse.Attente_analyse /* En attente d'analyse .. */}.</p>
                    </div>
                )}
            </section>
        </section>
    );
};

export default Form;