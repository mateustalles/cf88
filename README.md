Para rodar, clone o repositório e rode "npm run dev"

Você vai precisar de:

1 - MongoDB local chamada "cf88" com a coleção "users" e um usuário com username (email), senha(encriptada em CryptoJS, e role "admin" para acessar a rota "/admin/cp".

2- Um arquivo .env com as seguintes configurações:

GOOGLE_SERVICE_ACCOUNT_EMAIL={CONTA DE SERVIÇO GOOGLE API CRIADA ATRAVÉS DO GOOGLE CONSOLE}
GOOGLE_PRIVATE_KEY={CHAVE PRIVADA DA CONTA DE SERVIÇO}
OAUTH_CLIENT_ID={CLIENT ID DE UMA CONTA CRIADA PARA OAUTH2}
OAUTH_SECRET_KEY={SECRET KEY DE CONTA OAUTH2}
PROJECT_ID={ID DO PROJETO NO GOOGLE CONSOLE}
CLIENT_SECRET={CLIENT SECRET DA GOOGLE API}
GOOGLE_API_KEY={CHAVE DA API GOOGLE}
SHEET_ID={ID DE UM SHEET CRIADA NO GOOGLE SHEETS E COMPARTILHADA PARA A CONTA DE SERVIÇO}
MONGODB_URI=mongodb://localhost:27017 {OU OUTRA URI LOCAL COM AUTENTICAÇÂO DEFINIDA}
DB_NAME=nome-do-banco-de-dados
PORT=3000
SESSION_SECRET={SESSION SECRET DO MONGODB}


Color pallete
https://www.color-hex.com/color-palette/45297
Hex	RGB
#65f473	(101,244,115)
#5fe76c	(95,231,108)
#59da66	(89,218,102)
#53cd5f	(83,205,95)
#4dc058	(77,192,88)
