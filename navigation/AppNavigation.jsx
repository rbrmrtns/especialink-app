import { ActivityIndicator, View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, TransitionSpecs } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { AuthContext } from '../context/AuthContext';

//Views
import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import HomePaciente from '../screens/HomePaciente';
import HomeEspecialista from '../screens/HomeEspecialista';
import Perfil from '../screens/Perfil';
import Edicao from '../screens/Edicao';
import Busca from '../screens/Busca';
import AgendamentoConsulta from '../screens/AgendamentoConsulta';
import ListaConsultas from '../screens/ListaConsultas';

// Animation
// const config = {
//     animation: 'spring',
//     config: {
//       stiffness: 1000,
//       damping: 500,
//       mass: 3,
//       overshootClamping: true,
//       restDisplacementThreshold: 0.01,
//       restSpeedThreshold: 0.01,
//     },
// };

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator();

//Custom Tab Bar button 
const CustomTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
    style={{
        top: -15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
        shadowOpacity: 0.25,
        backgroundColor: '#ffbf00',
        width: 60,
            height: 60,
            borderRadius: 100,
        alignSelf: 'center'
    }}
    onPress={onPress}
    >
        <View>
            {children}
        </View>
    </TouchableOpacity>
);

const HomeWrapper = () => {
  const { userProfile } = useContext(AuthContext);
  
  if (userProfile?.tipo_usuario === 'paciente') {
    return <HomePaciente />;
  } else {
    return <HomeEspecialista />;
  }
};

// NAVBAR
const Tabs = () => {
    const { userProfile } = useContext(AuthContext);
    const tipoUsuario = userProfile?.tipo_usuario;

    return (
        <Tab.Navigator 
            initialRouteName="Home"
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 10,
                    },
                    shadowOpacity: 0.25,
                }
            }}>

            <Tab.Screen name="Perfil" component={Perfil} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
                        <Icon
                            name="user"
                            size={25}
                            color={focused ? '#ffbf00' : 'grey'}
                        />
                    </View>
                )
            }}/>

            <Tab.Screen name="Home" component={HomeWrapper} options={{
            tabBarIcon: ({ focused }) => (
                <Image
                    source={require('../assets/icons/home-heart.png')}
                    resizeMode="contain"
                    style={{
                        width: 25,
                        height: 25,
                        tintColor: 'white'
                    }}
                />
            ),
            tabBarButton: (props) => (
                <CustomTabBarButton {...props} />
            )
            }} />

            {tipoUsuario === 'paciente' && (
            <Tab.Screen name="Busca" component={Busca} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
                        <MagnifyingGlassIcon 
                            size={25} 
                            color={focused ? '#ffbf00' : 'grey'} 
                        />
                    </View>
                )
            }}/>
            )}

            {tipoUsuario === 'especialista' && (
            <Tab.Screen name="ListaConsultas" component={ListaConsultas} options={{
                tabBarIcon: ({focused}) => (
                    <View style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
                        <Icon
                            name="calendar-days"
                            size={25}
                            color={focused ? '#ffbf00' : 'grey'}
                        />
                    </View>
                )
            }}/>
            )}

        </Tab.Navigator>
    );
};

//Navigation between pages
const AppNavigation = () => {
    const { userAuth, userProfile, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="large" color="#ffbf00" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {userAuth && userProfile ? (
                    userProfile.tipo_usuario === 'paciente' ? (
                        <>
                            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                            <Stack.Screen name="Busca" component={Busca} options={{ headerShown: false }} />
                            <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
                            <Stack.Screen name="Edicao" component={Edicao} options={{ headerShown: false }} />
                        </>
                    ) : (
                        <>
                            <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
                            <Stack.Screen name="AgendamentoConsulta" component={AgendamentoConsulta} options={{ headerShown: false }} />
                            <Stack.Screen name="ListaConsultas" component={ListaConsultas} options={{ headerShown: false }} />
                            <Stack.Screen name="Perfil" component={Perfil} options={{ headerShown: false }} />
                            <Stack.Screen name="Edicao" component={Edicao} options={{ headerShown: false }} />
                        </>
                    )

                ) : (
                    <>
                        {/* <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }} /> */}
                        <Stack.Screen name="Login" component={Login} options={{ headerShown: false, animation: 'fade' }} />
                        <Stack.Screen name="Cadastro" component={Cadastro} options={{ headerShown: false, animation: 'fade' }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigation;