# 🚀 Configuração do Checkout InfinitePay

## ✅ O que já está pronto:

1. **Integração com InfinitePay** implementada
2. **InfiniteTag configurada:** `samvyt10`
3. **Sistema de checkout completo:**
   - Seleção aleatória de cotas
   - Criação de transação no banco
   - Geração de link de pagamento
   - Reserva de cotas

---

## 📋 O que falta fazer:

### 1. Configurar Variável de Ambiente na Vercel

Você precisa adicionar a variável de ambiente `VITE_INFINITEPAY_HANDLE` na Vercel:

**Passo a passo:**

1. Acesse: https://vercel.com/samvytpremios-7768s-projects/sitesamvyt/settings/environment-variables

2. Clique em **"Add New"** ou **"Add Environment Variable"**

3. Preencha:
   - **Key (Nome):** `VITE_INFINITEPAY_HANDLE`
   - **Value (Valor):** `samvyt10`
   - **Environments (Ambientes):** Selecione todos:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development

4. Clique em **"Save"**

5. **Importante:** Após salvar, você precisa fazer um novo deploy:
   - Vá em: https://vercel.com/samvytpremios-7768s-projects/sitesamvyt
   - Clique em "Deployments"
   - Clique nos 3 pontinhos do último deploy
   - Clique em "Redeploy"
   - Ou simplesmente aguarde o deploy automático do último commit

---

## 🔧 Como funciona o Checkout:

### Fluxo completo:

1. **Cliente seleciona cotas** no site
2. **Preenche dados** (nome, email, telefone)
3. **Sistema cria transação** no banco de dados
4. **Reserva cotas** temporariamente (status: reserved)
5. **Gera link de pagamento** do InfinitePay:
   ```
   https://pay.infinitepay.io/@samvyt10?amount=10.00&description=10x Cotas - iPhone 17 Pro
   ```
6. **Cliente é redirecionado** para página de pagamento do InfinitePay
7. **Cliente paga via PIX** na plataforma InfinitePay
8. **InfinitePay processa pagamento**
9. **Cliente é redirecionado** de volta para o site

---

## ⚠️ Limitações Atuais:

### Confirmação de Pagamento:

O InfinitePay Checkout **não possui webhook público** para notificar quando o pagamento é confirmado.

**Soluções:**

**Opção 1: Verificação Manual (Atual)**
- Você recebe notificação no app InfinitePay quando alguém paga
- Acessa o painel admin do site
- Confirma manualmente a transação
- Sistema libera as cotas

**Opção 2: Polling (Automático - Requer API)**
- Sistema verifica periodicamente se o pagamento foi confirmado
- Requer acesso à API privada do InfinitePay
- Você teria que solicitar acesso ao suporte deles

**Opção 3: Integração Completa (Ideal)**
- InfinitePay disponibiliza webhook
- Sistema recebe notificação automática
- Cotas são liberadas automaticamente

---

## 🎯 Próximos Passos:

### 1. Configurar variável de ambiente (URGENTE)
   - Adicionar `VITE_INFINITEPAY_HANDLE=samvyt10` na Vercel
   - Fazer redeploy

### 2. Testar checkout em produção
   - Acessar: https://sitesamvyt.vercel.app
   - Selecionar cotas
   - Preencher dados
   - Verificar se link do InfinitePay é gerado corretamente

### 3. Criar painel admin (OPCIONAL)
   - Para confirmar pagamentos manualmente
   - Visualizar transações pendentes
   - Gerenciar cotas

### 4. Solicitar API/Webhook ao InfinitePay (RECOMENDADO)
   - Entrar em contato com suporte do InfinitePay
   - Solicitar acesso à API de verificação de status
   - Ou solicitar webhook para notificações

---

## 📞 Contato InfinitePay:

Se você quiser automatizar 100% o processo, entre em contato com o suporte do InfinitePay e pergunte sobre:

1. **API de verificação de status de pagamento**
2. **Webhook para notificações de pagamento confirmado**
3. **Documentação completa da API**

---

## ✅ Checklist Final:

- [ ] Adicionar `VITE_INFINITEPAY_HANDLE=samvyt10` na Vercel
- [ ] Fazer redeploy do projeto
- [ ] Testar checkout completo
- [ ] Verificar se link do InfinitePay é gerado
- [ ] Testar pagamento real (com valor pequeno)
- [ ] Confirmar se transação aparece no banco
- [ ] (Opcional) Criar painel admin
- [ ] (Opcional) Solicitar API ao InfinitePay

---

**🎉 Depois de configurar a variável de ambiente, o checkout estará 100% funcional!**
