import defaultSettings from '@/settings'

const title = defaultSettings.title || '全国地质灾害信息管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
