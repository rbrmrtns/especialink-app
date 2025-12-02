# Especialink

## Instalação e Execução do Projeto

Tanto para a execução em dispositivos físicos (recomendado) quanto para emuladores virtuais (Android Virtual Device - AVD), é mandatório realizar a instalação prévia deste arquivo. O procedimento consiste em: 

1. Acessar o repositório de builds do projeto através do endereço eletrônico: https://expo.dev/accounts/robrmartins/projects/especialink-front/builds/d319347b-272d-4e99-a289-7d2e3d280240.
2. Localizar e selecionar a opção "Install" (botão azul disposto na interface).
3. Realizar o *download* do arquivo e autorizar a instalação de aplicativos de fontes desconhecidas nas configurações de segurança do sistema operacional Android, permitindo que a APK seja instalada diretamente no dispositivo. 

Embora a execução via emuladores seja possível, recomenda-se prioritariamente o uso de um dispositivo móvel físico. A configuração de um emulador Android compatível com o ambiente React Native exige a instalação do software Android Studio e a definição complexa de variáveis de ambiente, entre outras complexidades, conforme documentado no guia oficial do framework (https://reactnative.dev/docs/set-up-your-environment). Devido à complexidade e ao consumo de recursos de hardware associados à virtualização, o teste em dispositivo físico apresenta-se como a alternativa mais eficiente.

Uma vez instalada a *Development Build* no dispositivo (físico ou virtual), deve-se proceder com a obtenção do código-fonte e a inicialização do servidor de desenvolvimento. 

1. **Clonagem do Repositório:** Utilizando um terminal de comando, realiza-se a cópia dos arquivos do projeto hospedados no GitHub através do comando:
    ```bash
    git clone [https://github.com/rbrmrtns/especialink-app.git](https://github.com/rbrmrtns/especialink-app.git)
    ```
2. **Instalação de Dependências:** Navegue até o diretório raiz do projeto recém-clonado (ex: `<caminho-local>/especialink-app`) e execute o gerenciador de pacotes para instalar as bibliotecas necessárias:
    ```bash
    npm i
    ```
3.  **Inicialização do Servidor:** Para iniciar a aplicação utilizando o cliente de desenvolvimento e estabelecer uma conexão via túnel (permitindo acesso externo à rede local), utiliza-se o comando:
    ```bash
    npx expo start --dev-client --tunnel 
    ```
4. **Sincronização com o Dispositivo:** Com o servidor em execução, a conexão final depende do tipo de dispositivo utilizado: 
    1. **Dispositivo Físico:** Utilizar a câmera do celular ou um leitor de *QR Code* para escanear o código gerado no terminal. Isso abrirá automaticamente a *Development Build* instalada anteriormente, carregando o pacote JavaScript do projeto. 
    2. **Emulador Android:** Com o emulador aberto e a *Development Build* instalada nele, pressionar a tecla `a` no terminal do computador para forçar a abertura da aplicação no ambiente virtual.

