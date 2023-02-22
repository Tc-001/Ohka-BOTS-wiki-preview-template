import {readAuth} from "./rawRequest"


export default {
  pget: {
    token: async(use) => await readAuth("user/userAuth.php?a=c&k="+encodeURIComponent(use)).catch(x => ({"_": "OB_TEST_CSRF_TOKEN"})),
    mylist: async() => await readAuth("user/behindAuth.php?a=m_my")
  }
};