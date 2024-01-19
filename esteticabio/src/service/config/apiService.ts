import axios from "axios";



export const apiService = axios.create({
    baseURL: 'https://esteticabio.w3erp.com.br/w3erp/'
})