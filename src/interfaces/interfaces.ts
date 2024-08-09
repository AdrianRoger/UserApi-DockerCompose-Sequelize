export interface IHttpResponse {
  status: number;
  data?: object;
  err?: { message: string };
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
}

export interface IUserResponseDTO {
  id?: number;
  name: string;
  email: string;
}


export interface ILoginRequestDTO {
  email: string;
  password: string;
}

