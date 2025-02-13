// @ts-check
import { test, expect } from '@playwright/test';
import { obterCodigo2FA } from '../support/db';
import { LoginPage } from '../pages/LoginPage';
import { DashPage } from '../pages/DashPage';


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

  await page.waitForTimeout(5000)

  await expect(page.locator('span')).toContainText('Código inválido. Por favor, tente novamente.');
});

test('Deve acessar a conta do usuário', async ({ page }) => {

  const loginPage = new LoginPage(page)
  const dashPage = new DashPage(page)

  await loginPage.visitaPagina()

  const usuario = {
    cpf: '00000014141',
    senha: '147258'
  }
  
  await loginPage.informaCpf(usuario.cpf)
  await loginPage.informaSenha(usuario.senha)

  await page.waitForTimeout(10000)
  const codigo = await obterCodigo2FA()
  await loginPage.informa2FA(codigo)

  await page.waitForTimeout(5000)
  await expect(await dashPage.obterSaldo()).toHaveText('R$ 5.000,00')
});