import axios, { AxiosInstance } from 'axios';
import { IAdvertisingQuestionAnswer, IAdvertisingQuestion } from '@cig-platform/types';
import { RequestErrorHandler } from '@cig-platform/decorators';

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
    question: IAdvertisingQuestion
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
    answer: IAdvertisingQuestionAnswer
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
}
