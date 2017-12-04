import { UserAddress } from './user-address';

export class User {
    id: string;
    login: string;
    token: string;
    name: string;
    surname: string;
    lastUsedAddress: UserAddress;
}
