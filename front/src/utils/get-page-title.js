import defaultSettings from '@/settings'

const title = defaultSettings.title || '地图组件测试演示系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
