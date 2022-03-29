import axios, { AxiosResponse } from 'axios';

type CodeResponse = {
  code: number;
  date: Date;
};

export const fetchCode = async (): Promise<CodeResponse> => {
  let response: AxiosResponse;
  response = await axios.get('http://localhost:3000/hex', {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
  if (response.status === 200) {
    return response.data;
  } else {
    return {} as CodeResponse;
  }
};
