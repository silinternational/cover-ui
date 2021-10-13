import t from '../i18n'

export const formatPageTitle = (title: string): string => {
  return `${title} - ${t('appname')}`
}
