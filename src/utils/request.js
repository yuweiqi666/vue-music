import axios from 'axios'

export const request = axios.create({
  baseURL: process.env.VUE_APP_SERVER_ADDRESS
})

export const localRequest = axios.create({
  baseURL: ''
})
