import axios from 'axios';

export const obterCoordenadasMapbox = async (endereco) => {
  if (!endereco) return null;

  try {
    const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

    const response = await axios.get('https://api.mapbox.com/search/geocode/v6/forward', {
      params: {
        q: `${endereco.logradouro}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}, ${endereco.cep}`,
        country: 'br',
        access_token: accessToken,
        limit: 1
      }
    });

    if (response.data.features && response.data.features.length > 0) {
      const [longitude, latitude] = response.data.features[0].geometry.coordinates;
      
      console.log("Coordenadas encontradas:", latitude, longitude);
      
      return { latitude, longitude };
    } else {
      console.log("Endereço não encontrado no Mapbox");
      return null;
    }

  } catch (error) {
    console.error("Erro na Geocodificação:", error);
    return null;
  }
};