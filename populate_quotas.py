import os
from supabase import create_client
import random

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("=" * 60)
print("POPULANDO BANCO COM COTAS FALTANTES")
print("=" * 60)

# Buscar rifa ativa
response = supabase.table('raffle_configs').select('*').eq('status', 'active').execute()
raffle = response.data[0]
raffle_id = raffle['id']

print(f"\n📊 Rifa: {raffle['name']}")
print(f"   Total esperado: {raffle['total_quotas']} cotas")

# Buscar cotas existentes
existing_quotas = supabase.table('quotas').select('number').eq('raffle_id', raffle_id).execute()
existing_numbers = set(q['number'] for q in existing_quotas.data)

print(f"   Cotas existentes: {len(existing_numbers)}")
print(f"   Cotas a criar: {raffle['total_quotas'] - len(existing_numbers)}")

# Gerar lista de todos os números possíveis (00001 a 17000)
all_numbers = [f"{i:05d}" for i in range(1, raffle['total_quotas'] + 1)]

# Remover números já existentes
available_numbers = [n for n in all_numbers if n not in existing_numbers]

# Embaralhar para inserção aleatória
random.shuffle(available_numbers)

print(f"\n🎲 Inserindo cotas em ordem aleatória...")

# Inserir em lotes de 1000 para não sobrecarregar
batch_size = 1000
total_to_insert = len(available_numbers)

for i in range(0, total_to_insert, batch_size):
    batch = available_numbers[i:i+batch_size]
    
    # Preparar dados para inserção
    quotas_to_insert = [
        {
            'raffle_id': raffle_id,
            'number': number,
            'status': 'available'
        }
        for number in batch
    ]
    
    # Inserir lote
    try:
        supabase.table('quotas').insert(quotas_to_insert).execute()
        print(f"   ✅ Inserido lote {i//batch_size + 1}: {len(batch)} cotas")
    except Exception as e:
        print(f"   ❌ Erro no lote {i//batch_size + 1}: {e}")

print(f"\n✅ Processo concluído!")

# Verificar total final
final_count = supabase.table('quotas').select('*', count='exact').eq('raffle_id', raffle_id).execute()
print(f"   Total de cotas no banco: {len(final_count.data)}")

print("\n" + "=" * 60)
