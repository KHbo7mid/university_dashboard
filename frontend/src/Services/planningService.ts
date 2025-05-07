import axios from 'axios';
const API_URL='http://localhost:5000';
const planningService = {
    getSchedules: async () => {
        const response= await axios.get(`${API_URL}/generate-schedule`);
        // console.log(response.data);
        
        return response
    },
    initData:async (data:any) => {
        const response= await axios.post(`${API_URL}/init-data`, data);
        return response.data;
    },
};
export default  planningService