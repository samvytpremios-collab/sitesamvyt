import os
from supabase import create_client

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_KEY = os.environ.get('SUPABASE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("=" * 60)
print("ANÁLISE DETALHADA DAS COTAS")
print("=" * 60)

# Verificar configuração da rifa
response = supabase.table('raffle_configs').select('*').eq('status', 'active').execute()
raffle = response.data[0]

print(f"\n📊 CONFIGURAÇÃO DA RIFA:")
print(f"   Nome: {raffle['name']}")
print(f"   Prêmio: {raffle['prize']}")
print(f"   Total de cotas esperadas: {raffle['total_quotas']}")
print(f"   Preço por cota: R$ {raffle['price_per_quota']}")
print(f"   Data do sorteio: {raffle['draw_date']}")
print(f"   Método: {raffle['draw_method']}")

# Contar cotas reais no banco
response = supabase.table('quotas').select('*', count='exact').eq('raffle_id', raffle['id']).execute()
print(f"\n📈 COTAS NO BANCO:")
print(f"   Total de cotas criadas: {len(response.data)}")

# Verificar se precisa criar mais cotas
if len(response.data) < raffle['total_quotas']:
    print(f"\n⚠️  ATENÇÃO: Faltam {raffle['total_quotas'] - len(response.data)} cotas!")
    print(f"   Preciso criar as cotas faltantes de forma aleatória.")
else:
    print(f"\n✅ Todas as cotas estão criadas!")
    
# Mostrar alguns exemplos de números
if len(response.data) > 0:
    print(f"\n🎲 EXEMPLOS DE NÚMEROS (primeiros 20):")
    for i, quota in enumerate(response.data[:20]):
        print(f"   {i+1}. Número: {quota['number']} | Status: {quota['status']}")

print("\n" + "=" * 60)
