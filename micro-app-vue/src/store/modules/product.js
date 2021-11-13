import { getProducts } from '@/api/product'

const state = {
  name: ''
}

const actions = {

  // get ProductList
  getProductList({ state }) {
    return new Promise((resolve, reject) => {
      getProducts(state.name).then(response => {
        const data = response.data
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  actions
}
