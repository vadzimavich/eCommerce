import fetch from 'node-fetch';
import { AuthMiddlewareOptions, ClientBuilder, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { getEnvironmentValue } from '../../utils/helpers';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { CustomerLoginData, CustomerRegistrationData } from '../types/api-types';

export class CustomerService {
  private readonly projectKey = getEnvironmentValue('CTP_PROJECT_KEY');
  private readonly authUrl = getEnvironmentValue('CTP_AUTH_URL');
  private readonly clientId = getEnvironmentValue('CTP_CLIENT_ID');
  private readonly clientSecret = getEnvironmentValue('CTP_CLIENT_SECRET');
  private readonly scopes = getEnvironmentValue('CTP_SCOPES').split(' ');
  private readonly apiUrl = getEnvironmentValue('CTP_API_URL');
  private readonly httpMiddlewareOptions: HttpMiddlewareOptions;
  private readonly anonymousClient;
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
  }

  public async registerCustomer(data: CustomerRegistrationData): Promise<void> {
    try {
      const response = await this.anonymousClient
        .me()
        .signup()
        .post({
          body: {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            dateOfBirth: data.dateOfBirth.toString(),
            addresses: [data.address],
          },
        })
        .execute();
      console.log('User registered:', response.body.customer);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }

  public async loginCustomer(customer: CustomerLoginData): Promise<void> {
    try {
      const response = await this.anonymousClient
        .me()
        .login()
        .post({
          body: customer,
        })
        .execute();

      console.log('Succes of login for', response.body.customer.email);
    } catch (error) {
      console.error('Fail of login', error);
      throw error;
    }
  }
}
