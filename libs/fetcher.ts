import axios from 'axios';

class Fetcher {
    get(url: string) {
        return axios
            .get(url, { validateStatus: filterStatus })
            .then((res) => res.data)
            .catch(filterError);
    }
    post(url: string, data: any) {
        return axios
            .post(url, data, { validateStatus: filterStatus })
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