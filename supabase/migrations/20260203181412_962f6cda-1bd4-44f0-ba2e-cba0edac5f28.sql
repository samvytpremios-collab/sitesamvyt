-- Inserir 13.000 novas cotas com números únicos de 5 dígitos aleatórios
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

-- Atualizar total_quotas na configuração da rifa
UPDATE raffle_configs 
SET total_quotas = 30000, updated_at = now()
WHERE id = 'bb2215ce-76e1-4307-95e3-4395e32579ed';