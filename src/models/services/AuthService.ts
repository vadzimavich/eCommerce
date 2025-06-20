import fetch from 'node-fetch';
import {
  AuthMiddlewareOptions,
  ClientBuilder,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  RefreshAuthMiddlewareOptions,
  TokenCache,
  TokenStore,
} from '@commercetools/sdk-client-v2';
import { getEnvironmentValue } from '../../utils/helpers';
import {
  Customer,
  MyCustomerUpdateAction,
  MyCustomerChangePassword,
  ByProjectKeyRequestBuilder,
  createApiBuilderFromCtpClient,
} from '@commercetools/platform-sdk';
import type { CustomerDraftBody, CustomerLoginData } from '../types/api-types';
import { REFRESH_TOKEN } from '../../controllers/AuthController';
import { Modal } from '../../components/modal';
import { isCtErrorWithBodyMessage, isStandardError } from '../types/api-types';

export const CUSTOMER_CART = 'customer_cart';

const tokenCache: TokenCache = {
  get: (): TokenStore => {
    const token = sessionStorage.getItem(REFRESH_TOKEN);
    return {
      refreshToken: token || '',
      token: '',
      expirationTime: 0,
    };
  },
  set: (tokenObject: TokenStore) => {
    if (tokenObject?.refreshToken) {
      sessionStorage.setItem(REFRESH_TOKEN, tokenObject.refreshToken);
    }
  },
};

export class CustomerService {
  private static instance: CustomerService;
  public readonly modal: Modal;
  private currentClient: ByProjectKeyRequestBuilder;
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
    this.modal = Modal.getInstance();
  }

  public static getInstance(): CustomerService {
    if (!CustomerService.instance) {
      CustomerService.instance = new CustomerService();
    }
    return CustomerService.instance;
  }

  public getCurrentClient(): ByProjectKeyRequestBuilder {
    return this.currentClient;
  }

  public async registerCustomer(body: CustomerDraftBody): Promise<Customer | Error> {
    try {
      await this.currentClient.me().signup().post({ body }).execute();
      return this.loginCustomer({ email: body.email, password: body.password });
    } catch (error) {
      if (isStandardError(error)) return error;
      return new Error('Unknown registration error');
    }
  }

  public async loginCustomer(customer: CustomerLoginData): Promise<Customer | Error> {
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

      const meResponse = await authorizedClient.me().login().post({ body: customer }).execute();
      this.currentClient = authorizedClient;
      return meResponse.body.customer;
    } catch (error) {
      const ctMessage = this.getSpecificErrorMessage(error);
      if (ctMessage) throw new Error(ctMessage);
      if (isStandardError(error)) throw error;
      throw new Error('Login failed due to an unknown error.');
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
      console.error('Fail of login with refresh token', error);
      const ctMessage = this.getSpecificErrorMessage(error);
      if (ctMessage) return new Error(ctMessage);
      if (isStandardError(error)) return error;
      return new Error('Login with refresh token failed.');
    }
  }

  public async changeCustomerPassword(
    currentVersion: number,
    currentPasswordValue: string,
    newPasswordValue: string
  ): Promise<Customer | Error> {
    if (!this.currentClient) {
      const errorMessage = 'Client not initialized for password change.';
      this.modal.errorMessage(errorMessage);
      return new Error(errorMessage);
    }

    const body: MyCustomerChangePassword = {
      version: currentVersion,
      currentPassword: currentPasswordValue,
      newPassword: newPasswordValue,
    };

    try {
      const response = await this.currentClient.me().password().post({ body }).execute();
      this.modal.infoMessage('Password changed successfully! Please log in with your new password.');
      this.logoutCustomer();
      return response.body;
    } catch (error) {
      console.error('Error changing password:', error);
      let errorMessage = 'Failed to change password.';
      const specificCtMessage = this.getSpecificErrorMessage(error);
      if (specificCtMessage) {
        errorMessage = specificCtMessage;
      } else if (isStandardError(error)) {
        errorMessage = error.message;
      }
      this.modal.errorMessage(errorMessage);
      return new Error(errorMessage);
    }
  }

  public loginAnonymousClient(): void {
    this.currentClient = this.createAnonymousClient();
    console.log('Init from anonymous session');
  }

  public logoutCustomer(): void {
    this.currentClient = this.createAnonymousClient();
    console.log('Switched to anonymous session');
    sessionStorage.removeItem(REFRESH_TOKEN);
  }

  public async updateCustomerPersonalInfo(
    currentVersion: number,
    actions: MyCustomerUpdateAction[]
  ): Promise<Customer | Error> {
    if (!this.currentClient) {
      const errorMessage = 'Client not initialized for update.';
      return new Error(errorMessage);
    }

    console.log(
      'CustomerService: Updating customer with actions:',
      JSON.stringify(
        {
          version: currentVersion,
          actions: actions,
        },
        null,
        2
      )
    );

    try {
      const response = await this.currentClient
        .me()
        .post({
          body: {
            version: currentVersion,
            actions: actions,
          },
        })
        .execute();
      return response.body;
    } catch (error) {
      return this.handleErrorUpdateCustomer(error);
    }
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

  private getSpecificErrorMessage(error: unknown): string | null {
    if (isCtErrorWithBodyMessage(error)) {
      if (
        error.body.errors &&
        Array.isArray(error.body.errors) &&
        error.body.errors.length > 0 &&
        error.body.errors[0].message
      ) {
        return error.body.errors[0].message;
      }
      return error.body.message;
    }
    return null;
  }

  private handleErrorUpdateCustomer(error: unknown): Error {
    console.error('Error updating customer:', error);
    const defaultMessage = 'Failed to update personal information.';

    const specificCtMessage = this.getSpecificErrorMessage(error);
    if (specificCtMessage) {
      return new Error(specificCtMessage);
    }

    if (isStandardError(error)) {
      return error;
    }

    return new Error(defaultMessage);
  }
}
