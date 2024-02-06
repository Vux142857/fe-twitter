import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const instance = Axios.create(); 
const axios = setupCache(instance);

class Fetcher {
    private accessToken: string
    constructor() {
        this.accessToken = ''
    }
    get(url: string) {
        return axios
            .get(url, {
                validateStatus: filterStatus,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.accessToken
                }
            })
            .then((res) => res.data)
            .catch(filterError);
    }
    post(url: string, data: any) {
        return axios
            .post(url, data, { validateStatus: filterStatus })
            .then((res) => res.data)
            .catch(filterError);
    }
    setAccessToken(accessToken: string) {
        this.accessToken = accessToken
    }
    getAccessToken() {
        return this.accessToken
    }
}

// Utils
const filterStatus = (status: number) => {
    return status < 500
}

const filterError = (error: any) => {
    if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
    } else if (error.request) {
        console.log(error.request);
    } else {
        console.log('Error', error.message);
    }
    console.log(error.config);
}

const fetcher = new Fetcher();

export default fetcher;