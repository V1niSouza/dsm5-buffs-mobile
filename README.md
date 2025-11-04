# Projeto Mobile - [Nome do Projeto]

Este repositório contém a aplicação mobile do projeto, desenvolvida em **React Native**, com estrutura básica das telas e navegação inicial.

## 📱 Dispositivos e Emuladores

- **Emulador principal:** Pixel 3a (Android Studio)  
- **Dispositivo para testes reais:** Poco X6  

## ⚡ Requisitos

Antes de começar, certifique-se de ter instalado:  

- Node.js (versão recomendada: >=18)  
- Yarn ou npm  
- React Native CLI  
- Android Studio (com SDK e AVD configurados)  
- Dispositivo Android ou emulador

## 🚀 Rodando o projeto

Para iniciar o servidor Metro e limpar o cache, execute:  

\`\`\`bash
npx react-native start --reset-cache
\`\`\`

> **Dica:** O projeto está configurado para testes principalmente no **Pixel 3** e no **Poco X6**, garantindo compatibilidade com diferentes tamanhos de tela.

## 📂 Estrutura do projeto

\`\`\`
/src
  /components   # Componentes reutilizáveis
  /screens      # Telas principais
  /services     # Serviços para consumir API
  /styles       # Arquivos de estilos
  /icons        # Ícones SVG usados na UI
\`\`\`

## 💡 Observações

- Sempre que alterar dependências ou limpar problemas de cache, use:

\`\`\`bash
npx react-native start --reset-cache
\`\`\`
