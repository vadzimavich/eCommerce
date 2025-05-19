import fetch from 'node-fetch';
import {
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import { getEnvironmentValue } from '../../utils/helpers';
import { createApiBuilderFromCtpClient, CustomerSignInResult } from '@commercetools/platform-sdk';
import type { CustomerDraftBody, CustomerLoginData } from '../types/api-types';

export class CustomerService {
  private readonly projectKey = getEnvironmentValue('CTP_PROJECT_KEY');
  private readonly authUrl = getEnvironmentValue('CTP_AUTH_URL');
  private readonly clientId = getEnvironmentValue('CTP_CLIENT_ID');
  private readonly clientSecret = getEnvironmentValue('CTP_CLIENT_SECRET');
  private readonly scopes = getEnvironmentValue('CTP_SCOPES').split(' ');
  private readonly apiUrl = getEnvironmentValue('CTP_API_URL');
  private readonly httpMiddlewareOptions: HttpMiddlewareOptions;
  private readonly anonymousClient;
  private currentClient;
  constructor() {
    this.httpMiddlewareOptions = {
      host: this.apiUrl,
      fetch,
    };

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

    this.anonymousClient = createApiBuilderFromCtpClient(
      new ClientBuilder()
        .withAnonymousSessionFlow(authMiddlewareOptions)
        .withHttpMiddleware(this.httpMiddlewareOptions)
        .build()
    ).withProjectKey({ projectKey: this.projectKey });

    this.currentClient = this.anonymousClient;
  }

  public async registerCustomer(body: CustomerDraftBody): Promise<CustomerSignInResult | Error> {
    try {
      await this.anonymousClient.me().signup().post({ body }).execute();
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
        scopes: this.scopes,
        fetch,
      };

      const authorizedClient = createApiBuilderFromCtpClient(
        new ClientBuilder().withPasswordFlow(passwordAuthOptions).withHttpMiddleware(this.httpMiddlewareOptions).build()
      ).withProjectKey({ projectKey: this.projectKey });

      const loginResponse = await authorizedClient.me().login().post({ body: customer }).execute();

      this.currentClient = authorizedClient;

      console.log('Success of login for', loginResponse.body.customer.email);
      return loginResponse.body;
    } catch (error) {
      console.error('Fail of login', error);
      throw error;
    }
  }

  public logoutCustomer(): void {
    this.currentClient = this.anonymousClient;
    console.log('Switched to anonymous session');
  }
}
