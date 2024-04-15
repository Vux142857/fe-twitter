import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const instance = Axios.create();
const axios = setupCache(instance);

class Fetcher {
    getWithAuth(url: string, accessToken: string) {
        return axios
            .get(url, {
                validateStatus: filterStatus,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            .then((res) => res.data)
            .catch(filterError);
    }
    get(url: string) {
        return axios
            .get(url, {
                validateStatus: filterStatus
            })
            .then((res) => res.data)
            .catch(filterError);
    }
    postWithAuth(url: string, data: any, accessToken: string) {
        return axios
            .post(url, data, {
                validateStatus: filterStatus,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            .then((res) => res.data)
            .catch(filterError);
    }

    deleteWithAuth(url: string, accessToken: string) {
        return axios
            .delete(url, {
                validateStatus: filterStatus,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
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
    patch(url: string, data: any, accessToken: string) {
        return axios
            .patch(url, data, {
                validateStatus: filterStatus,
                headers: {
                    'Authorization': 'Bearer ' + accessToken
                }
            })
            .then((res) => res.data)
            .catch(filterError);
    }
}

// Utils
const filterStatus = (status: number) => {
    return status < 500
}

const filterError = (error: any) => {
    if (error.response) {
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
    } else if (error.request) {
        // console.log(error.request);
    } else {
        // console.log('Error', error.message);
    }
    console.log(error.config);
}

const fetcher = new Fetcher();

export default fetcher;