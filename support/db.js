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

export async function obterCodigo2FA(cpf) {
  const query = `
    SELECT t.code FROM public."TwoFactorCode" t
      JOIN public."User" u 
      ON u."id" = t."userId"
      WHERE u."cpf" = '${cpf}'
      ORDER BY t.id 
      DESC LIMIT 1;
  `

  const result = await db.oneOrNone(query)
  return result.code
}