import request from "@/utils/request";


const URL = "http://localhost:9999"


export async function fetchJobList(params) {
  return request(`${URL}/job/list`, {
    method: 'GET',
    data: params,
  });
}

export async function executeJob(jobId) {
  return request(`${URL}/job/start/${jobId}`, {
    method: 'GET',
  });
}
