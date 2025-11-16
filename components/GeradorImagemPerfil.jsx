import React from 'react';
import UserAvatar from 'react-native-user-avatar';

export const GeradorImagemPerfil = ({ nomeUsuario, corFundo, tamanho=70, borderRadius=35 }) => {

    return (
        <UserAvatar size={tamanho} name={nomeUsuario} bgColor={corFundo} textStyle={{ fontFamily: 'Montserrat_500Medium'}} style={{ alignSelf: 'center', borderRadius: borderRadius }} />
    );

}