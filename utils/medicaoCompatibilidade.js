// Source - https://stackoverflow.com/a
// Posted by user1921, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-18, License - CC BY-SA 3.0

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Raio da Terra em km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const d = R * c; // Distância em km
  return d;
}

const deg2rad = (deg) => {
  return deg * (Math.PI/180)
}


export const medicaoCompatibilidade = (paciente, coordsPaciente, pacoteEspecialistas) => {

  const { dadosEspecialistas, coordsEspecialistas } = pacoteEspecialistas;
  
  // PESOS
  const PESO_TESTES = 0.4;
  const PESO_DISTANCIA = 0.3;
  const PESO_CONDICOES = 0.3;

  const especialistasComScore = dadosEspecialistas.map((especialista, index) => {
    const coordsEspecialista = coordsEspecialistas[index];

    let scoreTotal = 0;

    // --- CÁLCULO DA DISTÂNCIA ---
    const distanciaKm = getDistanceFromLatLonInKm(
      coordsPaciente.latitude, coordsPaciente.longitude,
      coordsEspecialista.latitude, coordsEspecialista.longitude
    );

    // Se distância for 0km, pontuação máxima. Se for longe, pontuação cai (+1 para evitar divisão por zero).
    const scoreDistancia = 100 / (distanciaKm + 1);

    // --- CÁLCULO DOS TESTES ---
    const diffA = Math.abs(paciente.pont_test_a - especialista.pont_test_a);
    const diffB = Math.abs(paciente.pont_test_b - especialista.pont_test_b);
    const diffC = Math.abs(paciente.pont_test_c - especialista.pont_test_c);
    const diffD = Math.abs(paciente.pont_test_d - especialista.pont_test_d);
    
    // O valor mínimo aqui é 0. O valor MÁXIMO possível é 108 (30 * 3 + 18).
    const diferencaTotal = diffA + diffB + diffC + diffD;

    // Se diferença for 0 -> 100 * (1 - 0) = 100
    // Se diferença for 108 -> 100 * (1 - 1) = 0
    // Se diferença for 54 -> 100 * (1 - 0.5) = 50
    const MAX_DIFERENCA_POSSIVEL = 108;
    const scoreTestes = Math.max(0, 100 * (1 - (diferencaTotal / MAX_DIFERENCA_POSSIVEL)));

    // --- CÁLCULO DAS CONDIÇÕES ---
    const especialidadesEspecialista = especialista.especialidades || [];
    const condicoesPaciente = paciente.condicoes_mentais || [];

    // Filtra quantas condições do paciente estão inclusas nas especialidades do médico
    const matches = condicoesPaciente.filter(condicao => 
      especialidadesEspecialista.includes(condicao)
    ).length;

    // Se o paciente tem 3 condições e o médico atende as 3, nota 100.
    // Se o paciente não tem condições listadas, damos uma nota neutra ou alta.
    let scoreCondicoes = 0;
    if (condicoesPaciente.length > 0) {
        scoreCondicoes = (matches / condicoesPaciente.length) * 100;
    } else {
        scoreCondicoes = 50; // Neutro
    }

    // --- PONTUAÇÃO FINAL PONDERADA ---
    scoreTotal = (scoreDistancia * PESO_DISTANCIA) + 
                 (scoreTestes * PESO_TESTES) + 
                 (scoreCondicoes * PESO_CONDICOES);

    return {
      ...especialista,
      coords: coordsEspecialista,
      distancia_km: distanciaKm // Útil para mostrar na UI ("a 5km de você")
    };
  });

  return especialistasComScore.sort((a, b) => b.score_final - a.score_final);
};