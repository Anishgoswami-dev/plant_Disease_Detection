"""
FASAL DRISTHI — STEP 4 AUTH INTEGRATION TESTS
Tests: /api/auth/login, /api/auth/register, /api/auth/me
"""
import requests, json, sys

BASE = 'http://localhost:4000'
PASS = 0; FAIL = 0

def check(name, cond, detail=''):
    global PASS, FAIL
    if cond:
        print(f'  PASS: {name}' + (f' [{detail}]' if detail else ''))
        PASS += 1
    else:
        print(f'  FAIL: {name}' + (f' [{detail}]' if detail else ''))
        FAIL += 1

print('=' * 60)
print('FASAL DRISTHI — STEP 4 AUTH INTEGRATION TEST SUITE')
print('=' * 60)

# TEST 1: /api/auth/me without token -> 401
print('\n[TEST 1] GET /api/auth/me without token...')
r = requests.get(f'{BASE}/api/auth/me')
check('Returns 401 when no token', r.status_code == 401)
check('Error code is AUTH_REQUIRED', r.json().get('code') == 'AUTH_REQUIRED')

# TEST 2: Register new user
print('\n[TEST 2] POST /api/auth/register...')
reg_email = 'testfarmer_step4@fd.in'
r = requests.post(f'{BASE}/api/auth/register', json={
    'name': 'Ravi Patel', 'email': reg_email, 'password': 'Farmer@Step4',
    'village': 'Sangli', 'state': 'Maharashtra', 'primaryCrop': 'Cotton'
})
data = r.json()
check('HTTP 200 on register', r.status_code == 200)
check('success=true', data.get('success') == True)
check('JWT token returned', bool(data.get('token')))
check('Token has 3 parts (valid JWT structure)', len((data.get('token') or '').split('.')) == 3)
check('User name correct', data.get('user', {}).get('name') == 'Ravi Patel')
reg_token = data.get('token', '')

# TEST 3: Duplicate registration -> 409
print('\n[TEST 3] POST /api/auth/register duplicate email -> 409...')
r = requests.post(f'{BASE}/api/auth/register', json={
    'name': 'Duplicate', 'email': reg_email, 'password': 'whatever'
})
check('Returns 409 on duplicate email', r.status_code == 409)

# TEST 4: Login with demo seed user
print('\n[TEST 4] POST /api/auth/login (demo user Farmer@123)...')
r = requests.post(f'{BASE}/api/auth/login', json={
    'email': 'farmer.anish@fasaldristhi.in', 'password': 'Farmer@123'
})
data = r.json()
check('HTTP 200 on login', r.status_code == 200)
check('success=true', data.get('success') == True)
check('JWT token returned', bool(data.get('token')))
check('Token has 3 JWT parts', len((data.get('token') or '').split('.')) == 3)
check('Correct user name', data.get('user', {}).get('name') == 'Anish Goswami')
demo_token = data.get('token', '')

# TEST 5: Login with wrong password -> 401
print('\n[TEST 5] POST /api/auth/login wrong password -> 401...')
r = requests.post(f'{BASE}/api/auth/login', json={
    'email': 'farmer.anish@fasaldristhi.in', 'password': 'WrongPassword'
})
check('Returns 401 on wrong password', r.status_code == 401)
check('INVALID_CREDENTIALS code', r.json().get('code') == 'INVALID_CREDENTIALS')

# TEST 6: Login with unknown email -> 401
print('\n[TEST 6] POST /api/auth/login unknown email -> 401...')
r = requests.post(f'{BASE}/api/auth/login', json={
    'email': 'nobody@unknown.com', 'password': 'anything'
})
check('Returns 401 on unknown email', r.status_code == 401)

# TEST 7: /api/auth/me with valid token
print('\n[TEST 7] GET /api/auth/me with valid Bearer token...')
if demo_token:
    r = requests.get(f'{BASE}/api/auth/me', headers={'Authorization': f'Bearer {demo_token}'})
    data = r.json()
    check('HTTP 200', r.status_code == 200)
    check('success=true', data.get('success') == True)
    check('User profile returned', bool(data.get('user')))
    check('No passwordHash in response', 'passwordHash' not in data.get('user', {}))
    print(f'    User: {data.get("user", {}).get("name")} | Email: {data.get("user", {}).get("email")}')

# TEST 8: /api/auth/me with tampered token -> 401
print('\n[TEST 8] GET /api/auth/me with tampered token -> 401...')
tampered = demo_token[:-5] + 'XXXXX' if demo_token else 'bad.token.here'
r = requests.get(f'{BASE}/api/auth/me', headers={'Authorization': f'Bearer {tampered}'})
check('Returns 401 on tampered token', r.status_code == 401)
check('INVALID_TOKEN code', r.json().get('code') == 'INVALID_TOKEN')

print('\n' + '=' * 60)
print(f'TEST RESULTS: {PASS}/{PASS+FAIL} Passed')
print('=' * 60)
sys.exit(0 if FAIL == 0 else 1)
