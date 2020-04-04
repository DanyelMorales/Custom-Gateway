/**
 *
 */
export interface IMenuItem {
  name: string;
  route?: string;
  type?: string;
  icon?: string;
  data?: {
    security?: IMenuSecurity;
  };
}

export interface IMenuSecurity {
  enabled?: boolean;
  permission: string[];
}
