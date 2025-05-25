import fetch from 'node-fetch';
import {
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
  TokenStore,
} from '@commercetools/sdk-client-v2';
import { getEnvironmentValue } from '../../utils/helpers';
import {
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
  Customer,
  CustomerSignInResult,
} from '@commercetools/platform-sdk';
import type { CustomerDraftBody, CustomerLoginData } from '../types/api-types';
import { REFRESH_TOKEN } from '../../controllers/AuthController';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tokenCache: any = {
  get: () => {
    const token = sessionStorage.getItem(REFRESH_TOKEN);
    return token ? { refreshToken: token } : null;
  },
  set: (tokenObject: TokenStore) => {
    if (tokenObject?.refreshToken) {
      sessionStorage.setItem(REFRESH_TOKEN, tokenObject.refreshToken);
    }
  },
};

export class CustomerService {
  private static instance: CustomerService;
  public currentClient: ByProjectKeyRequestBuilder;
  private readonly projectKey = getEnvironmentValue('CTP_PROJECT_KEY');
  private readonly authUrl = getEnvironmentValue('CTP_AUTH_URL');
  private readonly clientId = getEnvironmentValue('CTP_CLIENT_ID');
  private readonly clientSecret = getEnvironmentValue('CTP_CLIENT_SECRET');
  private readonly scopes = getEnvironmentValue('CTP_SCOPES').split(' ');
  private readonly apiUrl = getEnvironmentValue('CTP_API_URL');
  private readonly httpMiddlewareOptions: HttpMiddlewareOptions;

  constructor() {
    this.httpMiddlewareOptions = {
      host: this.apiUrl,
      fetch,
    };

    this.currentClient = this.createAnonymousClient();
  }

  public static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  public async registerCustomer(body: CustomerDraftBody): Promise<CustomerSignInResult | Error> {
    try {
      await this.currentClient.me().signup().post({ body }).execute();
      return this.loginCustomer({ email: body.email, password: body.password });
    } catch (error) {
      if (error instanceof Error) return error;
      return new Error('Unknown registration error');
    }
  }

  public async loginCustomer(customer: CustomerLoginData): Promise<CustomerSignInResult | Error> {
    try {
      const passwordAuthOptions: PasswordAuthMiddlewareOptions = {
        host: this.authUrl,
        projectKey: this.projectKey,
        credentials: {
          clientId: this.clientId,
          clientSecret: this.clientSecret,
          user: {
            username: customer.email,
            password: customer.password,
          },
        },
        tokenCache,
        scopes: this.scopes,
        fetch,
      };

      const authorizedClient = createApiBuilderFromCtpClient(
        new ClientBuilder().withPasswordFlow(passwordAuthOptions).withHttpMiddleware(this.httpMiddlewareOptions).build()
      ).withProjectKey({ projectKey: this.projectKey });

      const loginResponse = await authorizedClient.me().login().post({ body: customer }).execute();
      this.currentClient = authorizedClient;
      return loginResponse.body;
    } catch (error) {
      console.error('Fail of login', error);
      throw error;
    }
  }

  public async loginWithRefreshToken(refreshToken: string): Promise<Customer | Error> {
    try {
      const authMiddlewareOptions: RefreshAuthMiddlewareOptions = {
        host: this.authUrl,
        projectKey: this.projectKey,
        credentials: {
          clientId: this.clientId,
          clientSecret: this.clientSecret,
        },
        refreshToken,
        fetch,
      };

      const authorizedClient = createApiBuilderFromCtpClient(
        new ClientBuilder()
          .withRefreshTokenFlow(authMiddlewareOptions)
          .withHttpMiddleware(this.httpMiddlewareOptions)
          .build()
      ).withProjectKey({ projectKey: this.projectKey });
      const loginResponse = await authorizedClient.me().get().execute();
      this.currentClient = authorizedClient;
      return loginResponse.body;
    } catch (error) {
      console.error('Fail of login', error);
      throw error;
    }
  }

  public loginAnonymousClient(): void {
    this.currentClient = this.createAnonymousClient();
    console.log('Init from anonymous session');
  }

  public logoutCustomer(): void {
    this.currentClient = this.createAnonymousClient();
    console.log('Switched to anonymous session');
  }

  private createAnonymousClient(): ByProjectKeyRequestBuilder {
    const authMiddlewareOptions: AuthMiddlewareOptions = {
      host: this.authUrl,
      projectKey: this.projectKey,
      credentials: {
        clientId: this.clientId,
        clientSecret: this.clientSecret,
      },
      scopes: this.scopes,
      fetch,
    };

    return createApiBuilderFromCtpClient(
      new ClientBuilder()
        .withAnonymousSessionFlow(authMiddlewareOptions)
        .withHttpMiddleware(this.httpMiddlewareOptions)
        .build()
    ).withProjectKey({ projectKey: this.projectKey });
  }
}
