// @ts-check
import { test, expect } from '@playwright/test';
import { obterCodigo2FA } from '../support/db';
import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';
import { LoginActions } from '../actions/LoginActions';
import { cleanJobs, getJob } from '../support/redis'


test('Não deve logar quando o código de validação é inválido', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.visitaPagina()

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

  await loginPage.informa2FA('123456')

  // await page.waitForTimeout(5000)

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});

test('Deve acessar a conta do usuário e consultar o código na fila do redis', async ({ page }) => {

  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)

  await loginPage.visitaPagina()

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }

  await cleanJobs()
  
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

   // Checkpoint
   await page.getByRole('heading', { name: 'Verificação em duas etapas' }).waitFor({timeout: 8000})

   const codigo = await getJob()

  //const codigo = await obterCodigo2FA(usuario.cpf)
  await loginPage.informa2FA(codigo)

  await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
});

test('Deve acessar a conta do usuário utilizando actions e consultar o código via banco de dados', async ({ page }) => {

  const loginActions = new LoginActions(page)

  await loginActions.visitaPagina()

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  
  await loginActions.informaCpf(usuario.cpf)
  await loginActions.informaSenha(usuario.senha)

  // Checkpoint
  await page.getByRole('heading', { name: 'Verificação em duas etapas' }).waitFor({timeout: 8000})

  const codigo = await obterCodigo2FA(usuario.cpf)
  await loginActions.informa2FA(codigo)

  await expect(await loginActions.obterSaldo()).toHaveText('R$ 5.000,00')
});