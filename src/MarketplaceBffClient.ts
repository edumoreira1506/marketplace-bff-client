import axios, { AxiosInstance } from 'axios';
import { IAdvertisingQuestionAnswer, IAdvertisingQuestion, IDeal, IPoultry, IAdvertising, IBreeder, IPoultryRegister } from '@cig-platform/types';
import { RequestErrorHandler } from '@cig-platform/decorators';

interface RequestSuccess {
  ok: true;
}

export interface PostDealSuccess extends RequestSuccess {
  deal: IDeal;
}

interface PoultryData {
  poultry: IPoultry & { mainImage: string; breederId: string };
  advertising: IAdvertising;
  breeder: IBreeder;
  measurementAndWeight: IPoultryRegister & {
    metadata: {
      weight?: string;
      measurement?: string;
    }
  };
}

export interface GetHomeSuccess extends RequestSuccess {
  femaleChickens: PoultryData[];
  maleChickens: PoultryData[];
  matrixes: PoultryData[];
  reproductives: PoultryData[];
}

export interface GetSearchSuccess extends RequestSuccess {
  advertisings: PoultryData[];
  pages: number;
}

export default class MarketplaceBffClient {
  private _axiosBackofficeBffInstance: AxiosInstance;

  constructor(marketplaceBffUrl: string) {
    this._axiosBackofficeBffInstance = axios.create({
      baseURL: marketplaceBffUrl,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH',
      }
    });
  }

  @RequestErrorHandler()
  async postAdvertisingQuestion(
    breederId: string,
    poultryId: string,
    advertisingId: string,
    token: string,
    question: Partial<IAdvertisingQuestion>
  ) {
    return this._axiosBackofficeBffInstance.post(
      `/v1/breeders/${breederId}/poultries/${poultryId}/advertisings/${advertisingId}/questions`,
      { question },
      {
        headers: {
          'X-Cig-Token': token,
        }
      },
    );
  }

  @RequestErrorHandler()
  async postAdvertisingQuestionAnswer(
    breederId: string,
    poultryId: string,
    advertisingId: string,
    questionId: string,
    token: string,
    answer: Partial<IAdvertisingQuestionAnswer>
  ) {
    return this._axiosBackofficeBffInstance.post(
      `/v1/breeders/${breederId}/poultries/${poultryId}/advertisings/${advertisingId}/questions/${questionId}/answers`,
      { answer },
      {
        headers: {
          'X-Cig-Token': token,
        }
      },
    );
  }

  @RequestErrorHandler()
  async postDeal(
    breederId: string,
    poultryId: string,
    advertisingId: string,
    token: string,
    { value, description }: { value: number; description: string; }
  ) {
    const { data } = await this._axiosBackofficeBffInstance.post<PostDealSuccess>(
      `/v1/breeders/${breederId}/poultries/${poultryId}/advertisings/${advertisingId}/deals`,
      { value, description },
      {
        headers: {
          'X-Cig-Token': token,
        }
      },
    );

    return data.deal;
  }

  @RequestErrorHandler()
  async getHome() {
    const { data } = await this._axiosBackofficeBffInstance.get<GetHomeSuccess>('/v1/home');

    return data;
  }

  @RequestErrorHandler()
  async getSearch({
    gender = [],
    type = [],
    tail = [],
    dewlap = [],
    crest = [],
    keyword,
    genderCategory = [],
    prices,
    sort,
    page = 0,
    favorites = []
  }: {
    gender?: string[];
    type?: string[];
    tail?: string[];
    dewlap?: string[];
    crest?: string[];
    keyword?: string;
    genderCategory?: string[];
    prices?: { min?: number; max?: number };
    sort?: string;
    favorites: string[];
    page?: number;
  }) {
    const { data } = await this._axiosBackofficeBffInstance.get<GetSearchSuccess>('/v1/search', {
      params: {
        gender: gender.filter(Boolean).length ? gender.filter(Boolean).join(',') : undefined,
        type: type.filter(Boolean).length ? type.filter(Boolean).join(',') : undefined,
        tail: tail.filter(Boolean).length ? tail.filter(Boolean).join(',') : undefined,
        dewlap: dewlap.filter(Boolean).length ? dewlap.filter(Boolean).join(',') : undefined,
        crest: crest.filter(Boolean).length ? crest.filter(Boolean).join(',') : undefined,
        keyword,
        genderCategory: genderCategory.filter(Boolean).length ? genderCategory.filter(Boolean).join(',') : undefined,
        prices: prices ? JSON.stringify(prices) : undefined,
        sort,
        favoriteIds: favorites.join(','),
        page
      }
    });

    return data;
  }

  @RequestErrorHandler()
  async postFavorite({
    breederId,
    poultryId,
    advertisingId,
    token
  }: {
    breederId: string;
    poultryId: string;
    advertisingId: string;
    token: string;
  }) {
    await this._axiosBackofficeBffInstance.post(
      `/v1/breeders/${breederId}/poultries/${poultryId}/advertisings/${advertisingId}/favorites`,
      {},
      {
        headers: {
          'X-Cig-Token': token,
        }
      },
    );
  }

  @RequestErrorHandler()
  async removeFavorite({
    breederId,
    poultryId,
    advertisingId,
    token,
    favoriteId
  }: {
    breederId: string;
    poultryId: string;
    advertisingId: string;
    token: string;
    favoriteId: string;
  }) {
    await this._axiosBackofficeBffInstance.delete(
      `/v1/breeders/${breederId}/poultries/${poultryId}/advertisings/${advertisingId}/favorites/${favoriteId}`,
      {
        headers: {
          'X-Cig-Token': token,
        }
      },
    );
  }
}
