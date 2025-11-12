import { View, Text, SafeAreaView, TouchableOpacity, Image, ImageBackground, ScrollView, RefreshControl, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import UsuarioCard from '../components/UsuarioCard';
import { UsuarioCardCompleto } from '../components/UsuarioCardCompleto';
import Mapbox from '@rnmapbox/maps';
// import { useNavigation } from '@react-navigation/native';
// import { collection, getDocs, query, where } from 'firebase/firestore';
// import { db, auth } from './../config/firebase';
// import { useFocusEffect } from '@react-navigation/native';

const SAO_PAULO_COORDS = [-46.6333, -23.5505];

const MARKERS = [
  { id: '1', coords: [-46.6333, -23.5505], title: 'Consultório 1' },
  { id: '2', coords: [-46.638, -23.555], title: 'Consultório 2' },
];

export default function Home() {
  // const navigation = useNavigation();
  // const [posts, setPosts] = useState([]);
  // const [refreshing, setRefreshing] = useState(false);
  // const [userPreferences, setUserPreferences] = useState(null);
  // const [searchVisible, setSearchVisible] = useState(false); 

  // // Function to open the Search Modal
  // const openSearchModal = () => {
  //   setSearchVisible(true); 
  // };

  // // Function to close the Search Modal
  // const closeSearchModal = () => {
  //   setSearchVisible(false); 
  // };

  // // Function to fetch user preferences
  // const fetchUserPreferences = async () => {
  //   try {
  //     const user = auth.currentUser;
  //     if (user) {
  //       const userPreferencesCollectionRef = collection(db, 'userPreferences');
  //       const userPreferencesQuery = query(userPreferencesCollectionRef, where('userId', '==', user.uid));
  //       const querySnapshot = await getDocs(userPreferencesQuery);
  //       if (!querySnapshot.empty) {
  //         const userPreferencesData = querySnapshot.docs[0].data();
  //         setUserPreferences(userPreferencesData);
  //         // console.log('Fetched user preferences:', userPreferencesData);  // Log user preferences
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user preferences:', error);
  //   }
  // };

  // // Function to fetch posts and filter based on user preferences
  // const fetchPosts = async () => {
  //   try {
  //     const postsCollectionRef = collection(db, 'posts');
  //     const querySnapshot = await getDocs(postsCollectionRef);
  //     const fetchedPosts = [];
  //     querySnapshot.forEach((doc) => {
  //       const data = doc.data();
  //       fetchedPosts.push({ id: doc.id, ...data });
  //     });

  //     // Filter posts based on user preferences
  //     if (userPreferences) {
  //       const filteredPosts = fetchedPosts.filter(post => {
  //         const hasMatchingSkinType = post.skinTypeTags.includes(userPreferences.skinType);
  //         const hasMatchingSkinConcerns = userPreferences.skinConcerns.some(concern => post.skinConcernTags.includes(concern));
  //         return hasMatchingSkinType && hasMatchingSkinConcerns;
  //       });
  //       setPosts(filteredPosts);
  //       // console.log('Filtered posts based on user preferences:', filteredPosts);  // Log filtered posts
  //     } else {
  //       setPosts(fetchedPosts);
  //       console.log('Fetched posts without filtering:', fetchedPosts);  // Log fetched posts
  //     }
  //   } catch (error) {
  //     console.error('Error fetching posts:', error);
  //   }
  // };

  // useEffect(() => {
  //   fetchUserPreferences();
  // }, []);

  // useEffect(() => {
  //   if (userPreferences !== null) {
  //     fetchPosts();
  //   }
  // }, [userPreferences]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchUserPreferences();
  //   }, [])
  // );

  const profileData = {
    tipoUsuario: 'especialista',
    nome: 'Rosana'
  }

  const [isScrollEnabled, setScrollEnabled] = useState(true);

  const [modalVisivel, setModalVisivel] = useState(false);

  const abrirModal = () => setModalVisivel(true);
  const fecharModal = () => setModalVisivel(false);

return (
    <ScrollView scrollEnabled={isScrollEnabled}>
      <StatusBar/>
      <View className="flex-[1] white">
        <View className="h-96"> 
          
          <Mapbox.MapView
            style={{flex: 1}} // O mapa precisa de style={{flex: 1}} para preencher
            styleURL={Mapbox.StyleURL.Street} // Você pode mudar o estilo
            onTouchStart={() => setScrollEnabled(false)}
            onTouchEnd={() => setScrollEnabled(true)}
          >
            <Mapbox.Camera
              zoomLevel={14}
              centerCoordinate={SAO_PAULO_COORDS}
              animationMode={'flyTo'}
              animationDuration={0}
            />
            {MARKERS.map(marker => (
              <Mapbox.PointAnnotation
                key={marker.id}
                id={marker.id}
                coordinate={marker.coords}
              >

                <Mapbox.Callout title={marker.title} />
                {/* Você pode colocar um <Image/> customizado aqui */}
              </Mapbox.PointAnnotation>
            ))}
          </Mapbox.MapView>

          <View className="absolute top-0 left-0 right-0 p-4 pt-12"> 
            
            <View className="flex-row justify-between items-start">
              
              <View>
                <Image className="w-16 h-6" 
                       source={require('../assets/logo.png')} />
              </View>

              <View className="items-end bg-white/70 rounded-md p-2">
                <Text 
                  className="text-xl text-gray-800" 
                  style={{ fontFamily: 'Montserrat_600SemiBold'}}
                >
                  Olá {profileData.nome}
                </Text>
              </View>
            
            </View>
          </View>

        </View>

        {/* === CONTEÚDO BRANCO (Seu código original) === */}
        {/* 8. Esta View 'sobe' por cima do mapa por causa do '-mt-5' */}
        <View className="bg-white rounded-t-[35px] py-5 -mt-5">

          <Text 
            className="text-lg text-gray-800 text-center mx-5 mb-4" 
            style={{ fontFamily: 'Montserrat_400Regular'}}
          >
            {profileData.tipoUsuario == 'especialista' ? 'Agenda uma consulta com um possível paciente pressionando "Agendar"' : 'Entre em contato com o melhor especialista para você pressionando "Contato"'}
          </Text>

          {/* Users map (Seu UsuarioCard) */}
          <View className="mb-28">
            <UsuarioCard 
              onVerMaisPress={abrirModal}
            />
            <UsuarioCard 
              onVerMaisPress={abrirModal}
            />
          </View>
          
        </View>

      </View>

      <UsuarioCardCompleto 
        modalVisible={modalVisivel}
        onCloseModal={fecharModal}
      />
    </ScrollView>
  );
}
