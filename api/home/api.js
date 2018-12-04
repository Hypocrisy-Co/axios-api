import Server from './api/server';
class API extends Server{
  async get(data){
    return await this.request('get', '/home/get', data);
  }
}

export default new API();