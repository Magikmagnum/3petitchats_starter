import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Définir le type pour les données de croquettes
export interface CroquetteTypes {
  value: string;
  key: number;
}

// Créer le hook custom pour gérer la liste de croquettes en fonction de la marque sélectionnée
const useCroquetteList = (marque: string) => {
  const [croquetteList, setCroquetteList] = useState<CroquetteTypes[]>([]);

  // Fonction asynchrone pour obtenir la liste de croquettes par marque
  const getCroquetteList = async (brand: string) => {
    try {
      const response = await axios.get('http://localhost:8642/api/v1/croquette_by_brand/' + brand);

      const croquettesSelect: CroquetteTypes[] = response.data.data.map((Croquettes: any) => ({
        value: Croquettes.name,
        key: parseInt(Croquettes.id),
      }));

      setCroquetteList(croquettesSelect);
    } catch (error) {
      console.error(error);
    }
  };

  // Utiliser useEffect pour appeler getCroquetteList lorsque la marque change
  useEffect(() => {
    if (marque) {
      getCroquetteList(marque);
    }
  }, [marque]);

  // Retourner la liste de croquettes
  return croquetteList;
};

export default useCroquetteList;