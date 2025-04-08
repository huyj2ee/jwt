export const ServerAddress: string = 'http://localhost:8080';
export const EndpointPrefix: string = 'jwt/v1';
export const SignInEndpoint: string = ServerAddress + '/' + EndpointPrefix + '/signin';
export const RefreshTokenEndpoint: string = ServerAddress + '/' + EndpointPrefix + '/refreshtoken';
export const SignOutEndpoint: string = ServerAddress + '/' + EndpointPrefix + '/signout';