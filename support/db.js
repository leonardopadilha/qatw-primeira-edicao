import pgPromise from 'pg-promise'

const pgp = pgPromise()
/*
1º db -> usuário
2º db -> senha
3º paybank-db -> nome do container
4º 5432 -> porta
5º UserDB -> nome do banco de dados
*/
const db = pgp('postgresql://dba:dba@paybank-db:5432/UserDB')

export async function obterCodigo2FA() {
  const query = `SELECT code FROM public."TwoFactorCode" ORDER BY 1 DESC LIMIT 1;`

  const result = await db.oneOrNone(query)
  return result.code
}