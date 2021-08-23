import { post } from './config'

export function getPopularLinePage (data) {
  data = {
    method: 'mdc.dock.popularLine.page',
    timestamp: '2020-08-22 14:23:11',
    ...data
  }
  return post('/', data)
}
