import axios from 'axios'

export const request = axios.create({
  baseURL: 'http://192.168.0.199:3000'
})

export const localRequest = axios.create({
  baseURL: ''
})
