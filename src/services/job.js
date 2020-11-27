import request from "@/utils/request";


const URL = "http://localhost:9999"


export async function fetchJobList(params) {
  return request(`${URL}/job/list`, {
    method: 'GET',
    data: params,
  });
}
