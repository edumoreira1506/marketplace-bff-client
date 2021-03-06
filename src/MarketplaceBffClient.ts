import axios, { AxiosInstance } from 'axios';
import { IAdvertisingQuestionAnswer, IAdvertisingQuestion, IDeal } from '@cig-platform/types';
import { RequestErrorHandler } from '@cig-platform/decorators';

interface RequestSuccess {
  ok: true;
}

export interface PostDealSuccess extends RequestSuccess {
  deal: IDeal;
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
