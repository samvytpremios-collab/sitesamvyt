import os
from supabase import create_client
import random

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("=" * 60)
print("RECRIANDO COTAS COM NÚMEROS ALEATÓRIOS (SEM ZEROS)")
print("=" * 60)

# Buscar rifa ativa
response = supabase.table('raffle_configs').select('*').eq('status', 'active').execute()
raffle = response.data[0]
raffle_id = raffle['id']

print(f"\n📊 Rifa: {raffle['name']}")
print(f"   Total de cotas: {raffle['total_quotas']}")

# 1. DELETAR todas as cotas existentes
print(f"\n🗑️  Deletando cotas antigas...")
try:
    supabase.table('quotas').delete().eq('raffle_id', raffle_id).execute()
    print(f"   ✅ Cotas antigas deletadas")
except Exception as e:
    print(f"   ⚠️  Erro ao deletar: {e}")

# 2. Gerar números de 1 a 17000 e embaralhar
print(f"\n🎲 Gerando números aleatórios de 1 a {raffle['total_quotas']}...")
all_numbers = list(range(1, raffle['total_quotas'] + 1))
random.shuffle(all_numbers)

print(f"   ✅ {len(all_numbers)} números gerados e embaralhados")

# 3. Inserir em lotes
print(f"\n💾 Inserindo cotas no banco...")
batch_size = 1000

for i in range(0, len(all_numbers), batch_size):
    batch = all_numbers[i:i+batch_size]
    
    quotas_to_insert = [
        {
            'raffle_id': raffle_id,
            'number': str(number),  # Sem zeros à esquerda
            'status': 'available'
        }
        for number in batch
    ]
    
    try:
        supabase.table('quotas').insert(quotas_to_insert).execute()
        print(f"   ✅ Lote {i//batch_size + 1}: {len(batch)} cotas inseridas")
    except Exception as e:
        print(f"   ❌ Erro no lote {i//batch_size + 1}: {e}")

# 4. Verificar resultado
final_count = supabase.table('quotas').select('*', count='exact').eq('raffle_id', raffle_id).execute()
print(f"\n✅ Processo concluído!")
print(f"   Total de cotas no banco: {len(final_count.data)}")

# Mostrar exemplos
examples = supabase.table('quotas').select('number').eq('raffle_id', raffle_id).limit(20).execute()
print(f"\n🎲 Exemplos de números (primeiros 20):")
for i, quota in enumerate(examples.data, 1):
    print(f"   {i}. {quota['number']}")

print("\n" + "=" * 60)
