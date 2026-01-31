import os
from supabase import create_client

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

response = supabase.table('raffle_configs').select('*').eq('status', 'active').execute()
raffle_id = response.data[0]['id']

# Buscar TODAS as cotas
all_quotas = []
page_size = 1000
offset = 0

while True:
    response = supabase.table('quotas').select('number').eq('raffle_id', raffle_id).range(offset, offset + page_size - 1).execute()
    if not response.data:
        break
    all_quotas.extend(response.data)
    offset += page_size
    print(f"Carregado {len(all_quotas)} cotas...")
    if len(response.data) < page_size:
        break

print(f"\n✅ Total real de cotas no banco: {len(all_quotas)}")
print(f"   Números únicos: {len(set(q['number'] for q in all_quotas))}")
