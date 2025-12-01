import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { obterCoordenadasMapbox } from './geocoding';

export const buscarEspecialistasPorEstado = async (ufPaciente) => {
  if (!ufPaciente) return { dadosEspecialistas: [], coordsEspecialistas: [] };

  try {
    const q = query(
      collection(db, "usuarios"),
      where("tipo_usuario", "==", "especialista"),
      where("consultorio.uf", "==", ufPaciente)
    );

    const querySnapshot = await getDocs(q);

    const promises = querySnapshot.docs.map(async (doc) => {
      const dados = { id: doc.id, ...doc.data() };
      
      const coords = await obterCoordenadasMapbox(dados.consultorio);

      return { dados, coords };
    });

    const resultadosMisturados = await Promise.all(promises);

    const objetoFinal = {
      dadosEspecialistas: resultadosMisturados.map(item => item.dados),
      coordsEspecialistas: resultadosMisturados.map(item => item.coords)
    };

    console.log(`Encontrados ${objetoFinal.dadosEspecialistas.length} especialistas em ${ufPaciente}`);
    
    return objetoFinal;

  } catch (error) {
    console.error("Erro ao buscar especialistas:", error);
    return { dadosEspecialistas: [], coordsEspecialistas: [] };
  }
};