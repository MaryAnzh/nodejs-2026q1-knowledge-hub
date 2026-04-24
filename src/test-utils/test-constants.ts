export const {
    TEST_ID,
    TEST_ID_2,
    TEST_LOGIN,
    TEST_PASS,
    TEST_DEF_ROLE,
    TEST_OLD_PASS,
    TEST_NEW_PASS,
    TEST_HASHED,
    TEST_NEW_HASH,
    TEST_SALT,
    TEST_WRONG_HASH,
    TEST_TOKEN,
} = {
    TEST_ID: '1',
    TEST_ID_2: '2',
    TEST_LOGIN: 'Alice',
    TEST_PASS: '12345',
    TEST_DEF_ROLE: 'viewer',
    TEST_OLD_PASS: 'old',
    TEST_NEW_PASS: 'new',
    TEST_SALT: 'salt',
    TEST_HASHED: 'hashed',
    TEST_NEW_HASH: 'new-hash',
    TEST_WRONG_HASH: 'wrong-hash',
    TEST_TOKEN: 'a.b.c',
} as const;

export const {
    TEST_DTO,
    TEST_USER_RESPONSE,
} =
{
    TEST_DTO: { login: TEST_LOGIN, password: TEST_PASS },
    TEST_USER_RESPONSE: {
        id: TEST_ID,
        login: TEST_LOGIN,
        role: TEST_DEF_ROLE,
    } as const
}