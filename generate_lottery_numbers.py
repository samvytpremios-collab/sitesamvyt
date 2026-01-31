import os
from supabase import create_client
import random

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("=" * 70)
print("GERANDO 17.000 NÚMEROS DE LOTERIA (5 DÍGITOS ALEATÓRIOS)")
print("=" * 70)

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

# 2. Gerar 17.000 números únicos de 5 dígitos (00000 a 99999)
print(f"\n🎲 Gerando {raffle['total_quotas']} números de 5 dígitos aleatórios...")

# Criar pool de 100.000 números possíveis (00000 a 99999)
all_possible_numbers = list(range(0, 100000))

# Embaralhar e pegar os primeiros 17.000
random.shuffle(all_possible_numbers)
selected_numbers = all_possible_numbers[:raffle['total_quotas']]

# Formatar com 5 dígitos (com zeros à esquerda)
formatted_numbers = [f"{num:05d}" for num in selected_numbers]

print(f"   ✅ {len(formatted_numbers)} números únicos gerados")
print(f"   📝 Exemplos: {', '.join(formatted_numbers[:10])}")

# 3. Inserir em lotes no banco
print(f"\n💾 Inserindo cotas no banco de dados...")
batch_size = 1000

for i in range(0, len(formatted_numbers), batch_size):
    batch = formatted_numbers[i:i+batch_size]
    
    quotas_to_insert = [
        {
            'raffle_id': raffle_id,
            'number': number,
            'status': 'available'
        }
        for number in batch
    ]
    
    try:
        supabase.table('quotas').insert(quotas_to_insert).execute()
        print(f"   ✅ Lote {i//batch_size + 1}/{(len(formatted_numbers)-1)//batch_size + 1}: {len(batch)} cotas inseridas")
    except Exception as e:
        print(f"   ❌ Erro no lote {i//batch_size + 1}: {e}")

# 4. Verificar resultado final
print(f"\n🔍 Verificando resultado...")
final_count = supabase.table('quotas').select('*', count='exact').eq('raffle_id', raffle_id).execute()
print(f"   ✅ Total de cotas no banco: {len(final_count.data)}")

# Mostrar exemplos aleatórios
examples = supabase.table('quotas').select('number').eq('raffle_id', raffle_id).limit(30).execute()
print(f"\n🎲 Exemplos de números gerados (primeiros 30):")
numbers_display = [q['number'] for q in examples.data]
for i in range(0, len(numbers_display), 10):
    print(f"   {', '.join(numbers_display[i:i+10])}")

print("\n" + "=" * 70)
print("✅ PROCESSO CONCLUÍDO COM SUCESSO!")
print("=" * 70)
