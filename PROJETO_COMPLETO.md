# 🎉 Site de Rifas SamVyt - Documentação Completa

## ✅ Status do Projeto

**Deploy em Produção:** https://sitesamvyt-pl5qtagi9-samvytpremios-7768s-projects.vercel.app

---

## 📋 Funcionalidades Implementadas

### 1. Sistema de Rifas
- ✅ 17.000 cotas com números de 5 dígitos aleatórios (00000 a 99999)
- ✅ Números únicos sem repetição
- ✅ Seleção aleatória de cotas para compra
- ✅ Preço: R$ 1,00 por cota

### 2. Sistema de Checkout
- ✅ Modal de checkout com validação de dados
- ✅ Integração com Supabase para salvar transações
- ✅ Preparado para integração com InfinitePay (aguardando InfiniteTag)
- ✅ Geração de link de pagamento
- ✅ Webhook para confirmação automática

### 3. Sistema de Login
- ✅ Página de login (`/login`)
- ✅ Autenticação com email + telefone (senha)
- ✅ Sessão persistente no localStorage
- ✅ Botão "Minhas Cotas" no header

### 4. Página Minhas Cotas
- ✅ Visualização de todas as cotas compradas
- ✅ Histórico de transações
- ✅ Status de pagamento
- ✅ Números da sorte em formato de ticket
- ✅ Estatísticas (total de cotas, cotas pagas, valor investido)
- ✅ Logout

### 5. Banco de Dados (Supabase)
- ✅ Tabela `raffle_configs` - Configurações das rifas
- ✅ Tabela `quotas` - 17.000 cotas com números aleatórios
- ✅ Tabela `users` - Dados dos compradores
- ✅ Tabela `transactions` - Histórico de compras

---

## 🔧 Tecnologias Utilizadas

- **Frontend:** React + TypeScript + Vite
- **UI:** TailwindCSS + Shadcn/ui + Framer Motion
- **Backend:** Supabase (PostgreSQL)
- **Deploy:** Vercel (CI/CD automático via GitHub)
- **Pagamento:** InfinitePay (aguardando configuração)

---

## 🚀 Como Usar

### Para Clientes:

1. **Comprar Cotas:**
   - Acesse o site
   - Escolha a quantidade de cotas
   - Preencha seus dados (nome, email, telefone)
   - Confirme o pedido
   - Pague via PIX (InfinitePay)

2. **Acessar Minhas Cotas:**
   - Clique em "Minhas Cotas" no header
   - Faça login com email e telefone
   - Veja seus números da sorte e histórico

### Para Administradores:

1. **Gerar Novos Números:**
   ```bash
   python3.11 generate_lottery_numbers.py
   ```

2. **Verificar Banco:**
   ```bash
   python3.11 check_database.py
   ```

---

## 🔐 Variáveis de Ambiente (Vercel)

Já configuradas na Vercel:

```
VITE_SUPABASE_URL=https://krlltvtdfwnaxrdmknhq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_INFINITEPAY_HANDLE=(aguardando)
```

---

## 📊 Estrutura do Banco de Dados

### Tabela: `quotas`
```sql
id: UUID
raffle_id: UUID (FK)
number: TEXT (5 dígitos: 00000-99999)
status: TEXT (available, reserved, sold)
user_id: UUID (FK, nullable)
transaction_id: UUID (FK, nullable)
created_at: TIMESTAMP
```

### Exemplos de Números Gerados:
```
81358, 02577, 05593, 93692, 40752, 68205, 64603, 92690, 07998, 87377
```

---

## 🎯 Próximos Passos

### Pendentes:
1. ⏳ Configurar InfiniteTag para pagamentos reais
2. ⏳ Implementar botões modernos do 21st.dev
3. ⏳ Adicionar notificações por email/WhatsApp
4. ⏳ Criar painel administrativo
5. ⏳ Implementar sorteio automático via Loteria Federal

### Opcional:
- Domínio customizado
- Certificado SSL customizado
- Analytics
- Sistema de afiliados

---

## 📞 Suporte

Em caso de dúvidas ou problemas:
- Email: samvyt.premios@gmail.com
- WhatsApp: (configurar)

---

## 📝 Changelog

### v2.0.0 (31/01/2026)
- ✅ Sistema de login implementado
- ✅ Página Minhas Cotas com autenticação
- ✅ 17.000 números de loteria aleatórios gerados
- ✅ Deploy automático na Vercel

### v1.0.0 (31/01/2026)
- ✅ Integração com Supabase
- ✅ Checkout com InfinitePay (preparado)
- ✅ Seleção aleatória de cotas
- ✅ Deploy inicial na Vercel

---

**Desenvolvido com ❤️ por Manus AI**
