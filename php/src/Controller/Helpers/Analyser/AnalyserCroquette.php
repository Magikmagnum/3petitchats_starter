<?php


namespace App\Controller\Helpers\Analyser;

/**
 * 
 * Le code en dessous est un programme écrit en PHP 
 * pour l'analyse de la composition nutritionnelle des croquettes pour chats. 
 * 
 * Il s'agit d'une classe nommée "AnalyserCroquette" 
 * qui contient plusieurs méthodes pour l'analyse des croquettes 
 * et le calcul des besoins nutritionnels d'un chat.
 * 
 * 
 * Dévelloper par Eric Gansa, ericgansa01@gmail.com
 * Pour 3ptitsChats 
 * 
 * 
 * 
 * 
 * Les besoins énergétiques et l'énergie métabolisable sont deux concepts différents 
 * liés à la quantité d'énergie nécessaire à l'organisme, 
 * mais ils se réfèrent à des aspects distincts :
 * 
 * 
 * 
 * Besoins énergétiques : 
 * 
 * Les besoins énergétiques désignent la quantité totale d'énergie dont un individu 
 * a besoin pour maintenir ses fonctions vitales, son métabolisme de base et ses activités physiques. 
 * Les besoins énergétiques varient en fonction de différents facteurs, 
 * tels que l'âge, le sexe, le poids, la taille, le niveau d'activité physique, le métabolisme individuel, etc. 
 * Ils sont généralement exprimés en kilocalories (kcal) ou en joules (J). 
 * Les recommandations nutritionnelles et les équations de calcul sont utilisées pour estimer 
 * les besoins énergétiques d'une personne en fonction de ces facteurs. 
 * 
 * 
 * 
 * Énergie métabolisable : 
 * L'énergie métabolisable fait référence à la quantité d'énergie contenue 
 * dans les aliments qui est réellement disponible pour l'organisme après la digestion et l'absorption. 
 * Elle représente la quantité d'énergie utilisable par l'organisme pour ses fonctions physiologiques, 
 * la production de chaleur, l'activité physique, etc. 
 * L'énergie métabolisable tient compte des pertes d'énergie dues à la digestion et au métabolisme des aliments. 
 * Elle est mesurée en kilocalories (kcal) et varie en fonction des macronutriments (glucides, lipides, protéines) 
 * présents dans l'alimentation.
 * 
 * 
 */

class AnalyserCroquette
{
    // Parametre a modifier pour les chat 

    // Le taux de protéines conseillé pour le chat est de 40 % minimum et peut aller sans problème au-delà des 50 % dans la composition du produit.
    private const PROTEINE_VALUE = ['min' => 40, 'max' => 60];
    // Doit rester présent en petite quantité
    private const GLUCIDE_VALUE = ['min' => 0, 'max' => 20];
    // Si les graisses animales sont bénéfiques pour la santé du chat, les graisses végétales doivent être totalement proscrites.
    private const LIPIDE_VALUE = ['min' => 12, 'max' => 20];


    private $exposantBEE; // exposant utilisé dans le calcul des besoins énergétiques de l'animal
    private $coeffBEE = 100; // coefficient utilisé dans le calcul des besoins énergétiques de l'animal.
    private $K1 = 1;
    private $K2 = 1;
    private $K3 = 1;
    private $facteurActivite = 1;
    private $poidIdeal = 4; // en killogram 

    //  Tableau utilisé pour stocker des analyses qualitatives des croquettes 
    private $analyseQualitatifs = [];

    // Attribut energetique
    private float $bee;
    private float $be;
    private float $ena;
    private float $em;

    // Attribut de digestibilité
    private float $alimentEntrant;
    private float $excrement;
    private float $tauxDigestibilite;

    //  liste des croquettes analyser
    private $list_croquettes;


    /**
     * Le constructeur de la classe AnalyserCroquette 
     *
     * @param $data
     * @param $list_croquettes
     */
    public function __construct($data, $list_croquettes)
    {
        $this->list_croquettes = $list_croquettes;

        if ($data->animal == 'chat') {
            $this->setChatParameter($data->race, $data->stade, $data->activite, $data->morphologie, $data->sterilite);
            $this->besoinEnergetiqueEntretien();
            $this->besionEnergetique();
        }
    }


    /**
     * Analyse quantitative des croquette
     *
     * @return array
     */
    public function getAnalyse(): array
    {
        $list_croquettes = [];
        foreach ($this->list_croquettes as $data) {
            $list_croquettes[] = $this->module_analyse($data);
        }
        return $this->orderBySocre($list_croquettes);
    }


    /**
     * Analyse quantitative d'une marque de croquette
     *
     * @return array
     */
    public function getAnalyseOne(): array
    {
        return  $this->module_analyse($this->list_croquettes);
    }


    /**
     * Besoin énergétique d’entretien (BEE)
     * 
     * C'est la quantité d'énergie qu'un animal doit ingérer 
     * pour couvrir ses dépenses énergétiques 
     * et maintenir son poids idéal.
     *
     * @return float
     */
    private  function besoinEnergetiqueEntretien(): float
    {
        $this->bee = $this->coeffBEE * pow($this->poidIdeal, $this->exposantBEE);
        return $this->bee;
    }



    /**
     * Besoin énergétique propre à l’animal étudié
     *
     * @return float
     */
    private  function besionEnergetique(): float
    {
        $facteur = $this->K1 * $this->K2 * $this->K3 * $this->facteurActivite;

        if ($facteur < 0.5) {
            $facteur = 0.5;
        }

        $this->be = $this->besoinEnergetiqueEntretien() * $facteur;
        return $this->be;
    }



    /**
     * Energie brute
     *
     * @param float $proteine
     * @param float $lipide
     * @param float $ena
     * @param float $fibre
     * @return float
     */
    private function energieBrut(float $proteine, float $lipide, float $ena, float $fibre): float
    {
        return 5.7 * $proteine + 9.4 * $lipide + 4.1 * ($ena + $fibre);
    }



    /**
     * Calculer le pourcentage de digestibilité
     *
     * @param float $eau
     * @param float $fibre
     * @return float
     */
    private function pourcentageDigestibiliteChat(float $eau, float $fibre): float
    {
        return 87.9 - (0.88 * $fibre * 100) / (100 - $eau);
    }



    /**
     * Renvoie la quantité d’énergie digérée et absorbée par l’animal
     *
     * @param float $proteine
     * @param float $lipide
     * @param float $ena
     * @param float $fibre
     * @param float $eau
     * @return float
     */
    private function energieDigestible(float $proteine, float $lipide, float $ena, float $fibre, float $eau)
    {
        $energieBrut = $this->energieBrut($proteine, $lipide, $ena, $fibre) * $this->pourcentageDigestibiliteChat($eau, $fibre) / 100;
        return $energieBrut;
    }



    /**
     * Renvoie la teneur en glucides (hors fibres) est appelée ENA
     *
     * @param float $prot
     * @param float $lip
     * @param float $fibre
     * @param float $cendres
     * @param float $eau
     * @return float
     */
    private function ENA(float $prot, float $lip, float $fibre, float $cendres, float $eau): float
    {
        $this->ena = 100 - ($prot + $lip + $fibre + $cendres + $eau);
        return $this->ena;
    }


    /**
     * Undocumented function
     *
     * @param float $prot
     * @param float $lip
     * @return float
     */
    private function energieMetabolisable(float $proteine, float $lipide, float $ena, float $fibre, float $eau): float
    {
        $this->em = (float) $this->energieDigestible($proteine, $lipide, $ena, $fibre, $eau) - (0.77 * $proteine);
        return round($this->em);
    }



    /**
     * Undocumented function
     *
     * @param float $prot
     * @param float $lip
     * @param float $ENA
     * @return array
     */
    private function analyseQualitatif(float $prot, float $lip, float $ENA): array
    {
        $analyseQualitatif = [];

        if ($prot <= self::PROTEINE_VALUE['max'] && $prot >= self::PROTEINE_VALUE['min']) {
            $analyseQualitatif['proteine'] = true;
        } else {
            $analyseQualitatif['proteine'] = false;
        }


        if ($lip <= self::LIPIDE_VALUE['max'] &&  $lip >= self::LIPIDE_VALUE['min']) {
            $analyseQualitatif['lipide'] = true;
        } else {
            $analyseQualitatif['lipide'] = false;
        }


        if ($ENA <= self::GLUCIDE_VALUE['max']  &&  $ENA  >= self::GLUCIDE_VALUE['max']) {
            $analyseQualitatif['ENA'] = true;
        } else {
            $analyseQualitatif['ENA'] = false;
        }

        $this->analyseQualitatifs[] = $analyseQualitatif;
        return $analyseQualitatif;
    }



    /**
     * QUANTITÉ DE CROQUETTE À DISTRIBUER PAR JOUR:
     *
     * @return float
     */
    private function quantiteJournaliere(): float
    {
        // Valeur en kcal/jour
        return  $this->be * 100 /  $this->em;
    }


    /**
     * Undocumented function
     *
     * @param string $race
     * @param string $stade
     * @param string $activite
     * @param string $morphologie
     * @param boolean $sterilite
     * @return void
     */
    private function setChatParameter(string $race, string $stade, string $activite, string $morphologie, bool $sterilite)
    {
        $this->exposantBEE = 0.75; //0.67;
        $this->coeffBEE = 130; //100;

        if ($race == "Abyssin" || $race == "Sphynx") {
            $this->K1 = 1.2;
        } elseif ($race == "Bengal" || $race == "Oriental Shorthair" || $race == "Savannah" || $race == "Sphynx" || $race == "Devon Rex" || $race == "Scottish Fold" || $race == "Maine Coon" || $race == "Siamois") {
            $this->K1 = 1.1;
        } else {
            $this->K1 = 1;
        }


        if ($stade == "De 2 à 4 mois") {
            $this->K2 = 2;
        } elseif ($stade == "De 4 à 6 mois") {
            $this->K2 = 1.6;
        } elseif ($stade == "De 6 à 8 mois") {
            $this->K2 = 1.3;
        } elseif ($stade == "De 8 à 12 mois") {
            $this->K2 = 1.1;
        } else {
            $this->K2 = 1;
        }


        if ($morphologie == "Surpoids") {
            $this->K3 = 1;
        } elseif ($morphologie == "Obèse") {
            $this->K3 = 0.85;
        } elseif ($morphologie == "Mince") {
            $this->K3 = 0.7;
        } elseif ($morphologie == "Maigre") {
            $this->K3 = 1.1;
        } else {
            $this->K3 = 1.3;
        }


        /*

            Méthode de l'entretien ajusté : Cette méthode prend en compte 
            le niveau d'activité physique de votre chat en plus de son poids, 
            en multipliant le résultat de la méthode de l'entretien par 
            un facteur correspondant au niveau d'activité physique :
            
            
            Chat peu actif : Besoins énergétiques x 1,2
            Chat modérément actif : Besoins énergétiques x 1,4
            Chat très actif : Besoins énergétiques x 1,6

        */

        if ($activite == "Calme") {
            $this->facteurActivite = 0.9;
        } elseif ($activite == "Très Calme") {
            $this->facteurActivite = 0.8;
        } elseif ($activite == "Agité") {
            $this->facteurActivite = 1.1;
        } else {
            $this->facteurActivite = 1;
        }
    }


    /**
     * La fonction ordonne les données en par rapport au score
     *
     * @param array $list_croquettes
     * @return array
     */
    private function orderBySocre(array $list_croquettes): array
    {
        $filter = [];

        foreach ($list_croquettes as $croquette) {

            $score = $this->getSocre($croquette);
            switch ($score) {
                case 1:
                    $filter['tres_bon'][] = $croquette;
                    break;
                case 2:
                    $filter['bon'][] = $croquette;
                    break;
                case 3:
                    $filter['assez_bon'][] = $croquette;
                    break;
                case 4:
                    $filter['mauvais'][] = $croquette;
                    break;
            }
        }
        return $filter;
    }



    /**
     * il fait l'analyse des croquette
     *
     * @param $data
     * @return array
     */
    private function module_analyse($data): array
    {

        $croquette['marque'] = (string) $data->getBrand()->getName();
        $croquette['name'] = (string) $data->getName();
        $data->isSterilise() == "false" ? $croquette['sterilise'] = (bool)  false  : $croquette['sterilise'] = (bool)  true;

        // Energie metabolisable en kcal/100g
        $croquette['energie_metabolisable'] = $this->energieMetabolisable($data->getCharacteristic()->getProteine(), $data->getCharacteristic()->getLipide(), $this->ENA($data->getCharacteristic()->getProteine(), $data->getCharacteristic()->getLipide(), $data->getCharacteristic()->getFibre(), $data->getCharacteristic()->getCendres(), $data->getCharacteristic()->getEau()), $data->getCharacteristic()->getFibre(), $data->getCharacteristic()->getEau());
        $croquette['besoin_energetique'] = $this->be;
        $croquette['analyse_quantitatif_nutriment'] = $this->analyseQualitatif($data->getCharacteristic()->getProteine(), $data->getCharacteristic()->getLipide(), $this->ENA($data->getCharacteristic()->getProteine(), $data->getCharacteristic()->getLipide(), $data->getCharacteristic()->getFibre(), $data->getCharacteristic()->getCendres(), $data->getCharacteristic()->getEau()));
        // Quantite journaliere en g/jour
        $croquette['quantite_Journaliere'] = $this->quantiteJournaliere();


        $croquette['url'] = (string) $data->getUrl();
        $croquette['urlimage'] = (string) $data->getUrlimage();

        $croquette['element_nutritif']['ENA'] = $this->ENA($data->getCharacteristic()->getProteine(), $data->getCharacteristic()->getLipide(), $data->getCharacteristic()->getFibre(), $data->getCharacteristic()->getCendres(), $data->getCharacteristic()->getEau());
        $croquette['element_nutritif']['proteine'] = (float) $data->getCharacteristic()->getProteine();
        $croquette['element_nutritif']['lipide'] = (float) $data->getCharacteristic()->getLipide();
        $croquette['element_nutritif']['fibre'] = (float) $data->getCharacteristic()->getFibre();
        $croquette['element_nutritif']['cendres'] = (float) $data->getCharacteristic()->getCendres();
        $croquette['element_nutritif']['eau'] = (float) $data->getCharacteristic()->getEau();
        $croquette['score'] = $croquette['energie_metabolisable'] / $croquette['besoin_energetique'];
        $croquette['commentaire'] = $this->getCommentaire($croquette['score']);
        $croquette['facteur_ajustement'] = (float)  $this->K1 * $this->K2 * $this->K3 * $this->facteurActivite;

        return $croquette;
    }


    /**
     * La fonction revoie un commentaire lier au score de la croquette
     *
     * @param float $score_croquette
     * @return string
     */
    private function getCommentaire(float $score_croquette): string
    {
        $commentaire = '';

        if ($score_croquette <= 1) {
            # code...
            $commentaire = "Attention ! Ces croquettes ne sont pas assez caloriques pour votre chat. Il risque de manquer d’énergie et de perdre du poids. Il faut des croquettes plus nourrissantes ou l’inciter à manger plus.";
        } elseif ($score_croquette >= 1) {
            # code...
            $commentaire = "Attention ! Ces croquettes sont trop caloriques pour votre chat. Il risque de prendre du poids. Il faut des croquettes plus light ou une gamelle anti-glouton.";
        } else {
            # code...
            $commentaire = "Félicitations ! Ces croquettes sont parfaitement adaptées à votre chat !";
        }



        return $commentaire;
    }




    /**
     * La methode attribut un score au croquette
     * 
     * 
     * @param array $list_croquette
     * @return int
     */
    private function getSocre(array $list_croquette): int
    {
        if ($list_croquette['analyse_quantitatif_nutriment']['proteine'] == true && $list_croquette['analyse_quantitatif_nutriment']['lipide'] == true && $list_croquette['analyse_quantitatif_nutriment']['ENA'] == true) {
            return 1;
        }

        if ($list_croquette['analyse_quantitatif_nutriment']['proteine'] == true && $list_croquette['analyse_quantitatif_nutriment']['lipide'] == false && $list_croquette['analyse_quantitatif_nutriment']['ENA'] == false) {
            return 2;
        }

        if ($list_croquette['analyse_quantitatif_nutriment']['proteine'] == true && $list_croquette['analyse_quantitatif_nutriment']['lipide'] == true && $list_croquette['analyse_quantitatif_nutriment']['ENA'] == false) {
            return 3;
        }


        if ($list_croquette['analyse_quantitatif_nutriment']['proteine'] == true && $list_croquette['analyse_quantitatif_nutriment']['lipide'] == false && $list_croquette['analyse_quantitatif_nutriment']['ENA'] == true) {
            return 3;
        }

        if ($list_croquette['analyse_quantitatif_nutriment']['proteine'] == false && $list_croquette['analyse_quantitatif_nutriment']['lipide'] == true && $list_croquette['analyse_quantitatif_nutriment']['ENA'] == true) {
            return 4;
        }

        if ($list_croquette['analyse_quantitatif_nutriment']['proteine'] == false && $list_croquette['analyse_quantitatif_nutriment']['lipide'] == false && $list_croquette['analyse_quantitatif_nutriment']['ENA'] == true) {
            return 4;
        }

        if ($list_croquette['analyse_quantitatif_nutriment']['proteine'] == false && $list_croquette['analyse_quantitatif_nutriment']['lipide'] == true && $list_croquette['analyse_quantitatif_nutriment']['ENA'] == false) {
            return 4;
        }

        if ($list_croquette['analyse_quantitatif_nutriment']['proteine'] == false && $list_croquette['analyse_quantitatif_nutriment']['lipide'] == false && $list_croquette['analyse_quantitatif_nutriment']['ENA'] == false) {
            return 4;
        }


        $element_nutritif = $list_croquette['element_nutritif'];






        return 0;
    }
}
