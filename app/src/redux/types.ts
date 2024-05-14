export interface IUser {
  _id: string;
  username: string;
  rolls: IRoll[];
  role: string;
}

export interface IRoll {
  _id: string;
  diceValues: number[];
  winCombination: string;
  pastryWon: IPastry[];
  createdAt: string;
  event: IEvent;
}

export interface IPastry {
  _id: string;
  name: string;
  image: string;
  stock: number;
  quantityWon: number;
}

export interface IEvent {
  _id: string;
  name: string;
  createdAt: string;
  open: boolean;
  closedAt?: string | null;
}

export interface IAuth {
  user: IUser;
  isAuthenticated: boolean;
  loading: boolean;
  error: string;
  jwt: string;
}

export interface ILoginReponse {
  user: IUser;
  token: string;
}

export interface IGame {
  event: IEvent;
  loading: boolean;
  error: string;
}
export interface ImageListe {
  [name: string]: string;
}
