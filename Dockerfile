# Usa a imagem oficial do Node.js
FROM node:20

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia apenas os arquivos de dependências para otimizar o cache do Docker
COPY package*.json ./

# Instala as dependências em modo de produção
RUN npm install --only=production

# Copia o restante dos arquivos do projeto
COPY . .

# Expondo a porta usada pelo serviço
EXPOSE 3000

# Comando para rodar o serviço
CMD ["npm", "run", "start"]
