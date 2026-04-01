import { ADMIN, EDITOR, VIEWER } from '../constants';

export type UserRoleType = typeof ADMIN | typeof EDITOR | typeof VIEWER;

export type UserPayloadType = {
    login: string;
    password: string;
    role: UserRoleType;
}

export type UserType = UserPayloadType & {
    id: string; // uuid v4
    createdAt: number; // timestamp of creation
    updatedAt: number; // timestamp of last update
}

export type UserUpdatePayloadType =
    Partial<Pick<UserPayloadType, 'login' | 'role'>>
    &
    {
        oldPassword: string;
        newPassword: string;
    };