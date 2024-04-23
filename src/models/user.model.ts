
export interface User {
    id: BigInteger;
    userName: string;
    emailAddress: string;
    mobileNumber: string;
    password: string;
    confirmPassword: string;
}

export interface Sale {
    id: BigInteger;
    from: Date
    to: Date
}
