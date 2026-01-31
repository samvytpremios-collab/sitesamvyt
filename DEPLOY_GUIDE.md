# Guia de Deploy - Site de Rifas

## 📋 Pré-requisitos

1. Conta no Supabase (já configurada)
2. Conta no InfinitePay com InfiniteTag
3. Conta na Vercel

## 🔧 Configuração

### 1. Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Supabase
VITE_SUPABASE_URL=https://krlltvtdfwnaxrdmknhq.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon

# InfinitePay
VITE_INFINITEPAY_HANDLE=sua-infinitetag-sem-$

# Site URL (será o domínio da Vercel)
VITE_SITE_URL=https://seu-site.vercel.app
```

### 2. Deploy da Edge Function (Webhook)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login no Supabase
supabase login

# Link com o projeto
supabase link --project-ref krlltvtdfwnaxrdmknhq

# Deploy da função
supabase functions deploy infinitepay-webhook
```

A URL do webhook será:
```
https://krlltvtdfwnaxrdmknhq.supabase.co/functions/v1/infinitepay-webhook
```

### 3. Deploy na Vercel

#### Via CLI:

```bash
# Instalar Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

#### Via GitHub (Recomendado):

1. Conecte o repositório na Vercel
2. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_INFINITEPAY_HANDLE`
   - `VITE_SITE_URL`
3. Deploy automático a cada push

### 4. Configurar Webhook no InfinitePay

Após o deploy, atualize a URL do webhook no código para:
```
https://krlltvtdfwnaxrdmknhq.supabase.co/functions/v1/infinitepay-webhook
```

## 🎯 Fluxo Completo

1. **Cliente seleciona cotas** → Sistema busca números aleatórios disponíveis
2. **Cliente preenche dados** → Sistema cria usuário/busca existente
3. **Sistema reserva cotas** → Status muda para "reserved"
4. **Sistema cria transação** → Registra no banco
5. **Sistema gera PIX** → Chama API InfinitePay
6. **Cliente paga** → InfinitePay processa
7. **Webhook confirma** → Edge Function atualiza banco
8. **Cotas vendidas** → Status muda para "sold"

## 🔍 Testes

### Testar localmente:

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

### Testar webhook:

Use ferramentas como ngrok para expor localhost:
```bash
ngrok http 3000
```

## 📊 Monitoramento

- **Logs da Vercel**: https://vercel.com/dashboard
- **Logs do Supabase**: https://app.supabase.com/project/krlltvtdfwnaxrdmknhq/logs
- **Transações**: Verificar tabela `transactions` no Supabase

## 🚨 Troubleshooting

### Cotas não são reservadas
- Verificar se há cotas disponíveis
- Checar logs no console do navegador

### Pagamento não confirma
- Verificar logs da Edge Function
- Confirmar URL do webhook no InfinitePay
- Testar manualmente o endpoint do webhook

### Erro ao gerar PIX
- Verificar InfiniteTag (handle)
- Confirmar que conta InfinitePay está ativa
- Checar formato dos dados enviados

## 📝 Checklist de Deploy

- [ ] Banco de dados com 17.000 cotas criadas
- [ ] Variáveis de ambiente configuradas
- [ ] Edge Function deployada
- [ ] Site deployado na Vercel
- [ ] URL do webhook atualizada
- [ ] Teste de compra completo realizado
- [ ] Monitoramento configurado

## 🔐 Segurança

- ✅ RLS (Row Level Security) habilitado no Supabase
- ✅ Webhook valida transações antes de confirmar
- ✅ Cotas reservadas temporariamente
- ✅ Expiração automática de transações pendentes (30 min)
