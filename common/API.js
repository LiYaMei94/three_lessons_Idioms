const API = new function() {
  // const baseUrl = "http://172.16.255.34:9110/chengyu3"
  const baseUrl ="https://www.llczc.com/chengyu3"
  return {
    base: `${baseUrl}`,
    login: `${baseUrl}/login`,
    requestWord: `${baseUrl}/word`,
    changeCoin: `${baseUrl}/changeCoin`,
    myRecord: `${baseUrl}/myRecord`,
    memory: `${baseUrl}/memory`
  }
}

export default API
export const HEADER = {
  'Content-Type': 'application/json'
  // 'Content-Type': 'application/x-www-form-urlencoded'
}