# FilaZero MCP Bot

## Sobre o Projeoto
Bot inteligente desenvolvido em TypeScript, utilizando a plataforma de inferência de IA da Groq e o modelo Llama 3.3 70B Versatile para interpretação de linguagem natural, compreensão de contexto e tomada de decisão. A solução integra-se ao MCP da Filazero para execução de operações de negócio, permitindo que o usuário interaja por linguagem natural ou por fluxos guiados, enquanto a IA determina dinamicamente as ações e ferramentas necessárias para cada solicitação.

## Tecnologias Utilizadas
- TypeScript
- Node.js
- Telegram Bot API
- Groq API
- Llama 3.3 70B Versatile
- MCP (Model Context Protocol)

## Como Utiliza-lo
Clone o repositório do projeto utilizando o comando abaixo
```
git clone https://github.com/joaogadev/filazero-bot-telegram.git
```
Baixe as dependencias necessárias, colando-as no terminal do projeto
```
npm install
npm install groq-sdk
npm install node-telegram-bot-api dotenv
```
Para o funcionamento local do bot é necessário que o MCP esteja ligado e rodando na porta 3000
Para que isso ocorra, siga o passo a passo em
```
https://github.com/Abraao-works/Residencia3-Squad10-Mcp
```
Se já estiver rodando, é necessario que as variáveis no .env estejam com as suas variaveis cadatradas
Cole isso no seu .env
```
TELEGRAM_BOT_TOKEN=8800232974:AAGDBqBBCBFG9-T4zsgl2zdn4UjhjVnoH-4
GROQ_API_KEY= 
GROQ_MODEL = llama-3.3-70b-versatile
MCP_URL=http://localhost:3000/mcp
USER_TOKEN= LJBdeWc0asguZ07JT1VTbfarcu0r66QswVN9Lyq_raAMYfb2Lgu1iVRZDr4aJkDtgx-HJD1NfKvAs46KI_D3v1VT21ZFjXcu7iHcblm_dnfUh3V-2TB93-edlJFkgKnsyd9OkclPW472Xv0ii7p9uFnkdwm6rdwl36Nd2O3ztcs_93CNjqGrVu2grpJtn8ubwhduI6h9XIRSM8ZSIUCS6uRaFuWadu9mJeyq-euQruRr7RfHe0ybgHs6aOtFuhh6Fmjw9OX6Lf4W78BDZHYY3ty3-xzO6UDai3yq913sTrPc2pSXQoayAHRoXyBiogMFj6_dxSjaFRw9E9_NiwdyQIPlcNFKpN17nuuSAd5T3k0MQLjo_lCiwrGTDtZuLyc-5sy5oq604soFoskoU3JHogYjtIod0fyEXwO2YGyBYDnUD1bsC5AsxcQdI95PAJcJYjso17JdiLvYVYp3AacQZCqZQ5s7Homq6eaf8W3IzcGGGLkdVqecjlEMuE9VIAZy
```
Será necessário adquirir o token do groq Ai, para isso será necessário entrar no site
```
https://groq.com/
```
ir em 'Start Building' -> Cadastrar se com uma conta -> Ir na sessão 'API KEYS' -> Create API KEY -> Ecolher um nome e selecionar No Expiration -> Clique em Salvar -> Cole e salve o KEY que será gerada, após isso cole-a em
```
GROQ_API_KEY=
```

Após concluir todo esse processo, rode no terminal o seguinte comando:
```
npx tsx src/main.ts
```

## Limitações Conhecidas
O ambiente de staging da API pode retornar informações incompletas de sessões (sessionId e resourceId), o que pode impedir a conclusão de um agendamento real. Nesses casos, o fluxo do bot permanece funcional até a etapa de confirmação, mas o ticket não pode ser criado devido às restrições do ambiente de testes.

