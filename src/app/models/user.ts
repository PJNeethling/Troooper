export class User {
    constructor(
        public id: string,
        public username: string,
        public email: string,
        public accessToken: string,
        public roles: string[]
    ) { }
}