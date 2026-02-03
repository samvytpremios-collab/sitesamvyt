

# Adicionar 13.000 Novas Cotas com Números Aleatórios

## Resumo

Vou adicionar 13.000 novas cotas com números de 5 dígitos aleatórios (como `93692`, `04817`, `58321`) que não se repetem com os 17.000 já existentes.

## Execução

### Passo 1: Inserir 13.000 Novas Cotas

Executar migração SQL que:
1. Gera números de 00000 a 99999
2. Remove os que já existem
3. Embaralha aleatoriamente
4. Seleciona 13.000 números únicos
5. Insere na tabela `quotas`

### Passo 2: Atualizar Configuração da Rifa

Mudar `total_quotas` de 17.000 para 30.000

## Resultado

| Antes | Depois |
|-------|--------|
| 17.000 cotas | 30.000 cotas |
| Números: 5 dígitos | Números: 5 dígitos |
| Formato: `93692` | Formato: `93692` |

## Detalhes Técnicos

A migração SQL usará:

```sql
-- Inserir 13.000 novas cotas com números únicos
INSERT INTO quotas (raffle_id, number, status)
SELECT 
  'bb2215ce-76e1-4307-95e3-4395e32579ed'::uuid,
  LPAD(n::text, 5, '0'),
  'available'
FROM (
  SELECT n FROM generate_series(0, 99999) AS n
  WHERE LPAD(n::text, 5, '0') NOT IN (
    SELECT number FROM quotas 
    WHERE raffle_id = 'bb2215ce-76e1-4307-95e3-4395e32579ed'
  )
  ORDER BY random()
  LIMIT 13000
) AS new_numbers;

-- Atualizar total_quotas na configuração
UPDATE raffle_configs 
SET total_quotas = 30000, updated_at = now()
WHERE id = 'bb2215ce-76e1-4307-95e3-4395e32579ed';
```

Após a execução, você terá 30.000 cotas disponíveis para venda.

