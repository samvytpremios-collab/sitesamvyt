import os
from supabase import create_client

# Usar as credenciais do ambiente
SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("=" * 60)
print("VERIFICAÇÃO DO BANCO DE DADOS SUPABASE")
print("=" * 60)

# Verificar raffle_configs
print("\n1. RAFFLE CONFIGS:")
try:
    response = supabase.table('raffle_configs').select('*').execute()
    print(f"   Total de rifas: {len(response.data)}")
    for raffle in response.data:
        print(f"   - {raffle['name']} | Status: {raffle['status']} | Preço: R$ {raffle['price_per_quota']}")
except Exception as e:
    print(f"   ❌ Erro: {e}")

# Verificar quotas
print("\n2. QUOTAS:")
try:
    response = supabase.table('quotas').select('status').execute()
    print(f"   Total de cotas: {len(response.data)}")
    
    available = len([q for q in response.data if q['status'] == 'available'])
    sold = len([q for q in response.data if q['status'] == 'sold'])
    reserved = len([q for q in response.data if q['status'] == 'reserved'])
    
    print(f"   - Disponíveis: {available}")
    print(f"   - Vendidas: {sold}")
    print(f"   - Reservadas: {reserved}")
except Exception as e:
    print(f"   ❌ Erro: {e}")

# Verificar users
print("\n3. USERS:")
try:
    response = supabase.table('users').select('*').execute()
    print(f"   Total de usuários: {len(response.data)}")
except Exception as e:
    print(f"   ❌ Erro: {e}")

# Verificar transactions
print("\n4. TRANSACTIONS:")
try:
    response = supabase.table('transactions').select('status').execute()
    print(f"   Total de transações: {len(response.data)}")
    
    pending = len([t for t in response.data if t['status'] == 'pending'])
    paid = len([t for t in response.data if t['status'] == 'paid'])
    expired = len([t for t in response.data if t['status'] == 'expired'])
    
    print(f"   - Pendentes: {pending}")
    print(f"   - Pagas: {paid}")
    print(f"   - Expiradas: {expired}")
except Exception as e:
    print(f"   ❌ Erro: {e}")

print("\n" + "=" * 60)
