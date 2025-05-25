// import { route } from '../app';
import { CustomerService } from '../models/services/AuthService';
import { AppModel } from '../models/state/AppState';

export const REFRESH_TOKEN = 'refresh_token';

export class AuthController {
  private readonly service: CustomerService;

  constructor(private readonly appModel: AppModel) {
    this.service = CustomerService.getInstance();
  }

  public async checkAuthorization(): Promise<void> {
    const refreshToken = sessionStorage.getItem(REFRESH_TOKEN);

    if (refreshToken) {
      try {
        const customer = await this.service.loginWithRefreshToken(refreshToken);

        if (!(customer instanceof Error)) {
          this.appModel.login(customer);
        } else {
          this.appModel.logout();
          this.service.loginAnonymousClient();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        this.appModel.logout();
        this.service.loginAnonymousClient();
      }
    } else {
      this.service.loginAnonymousClient();
    }
  }
}
