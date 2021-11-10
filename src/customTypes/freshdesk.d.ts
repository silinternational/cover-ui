declare interface Window {
  fwSettings: {
    widget_id: number
    locale?: string
  }
}

type IdentifyOptions = { name: string; email: string }
enum Priority {
  Low = 1,
  Medium,
  High,
  Urgent,
}

enum Status {
  Open = 2,
  Pending,
  Resolved,
  Closed,
}

type PrefillOptions = {
  subject?: string
  description?: string
  priority?: Priority
  status?: Status
  group_id?: number
  product_id?: number
  type?: string
  custom_fields?: unknown
}

type FieldAttribute =
  | 'subject'
  | 'description'
  | 'priority'
  | 'status'
  | 'group_id'
  | 'product_id'
  | 'type'
  | string /* custom_fields.cf_name_of_the_field */

type HideChoicesOptions = {
  priority?: Priority[]
  status?: Status[]
  group_id?: number[]
  type?: string[]
}

type OpenArticleOptions = {
  id: number
}

declare function FreshworksWidget(command: 'hide', target?: 'launcher'): void
declare function FreshworksWidget(command: 'show', target?: 'launcher'): void
declare function FreshworksWidget(command: 'open', target?: 'ticketForm'): void
declare function FreshworksWidget(command: 'close' | 'destroy' | 'boot'): void
declare function FreshworksWidget(command: 'identify', target: 'ticketForm', options: IdentifyOptions): void
declare function FreshworksWidget(command: 'prefill', target: 'ticketForm', options: PrefillOptions): void
declare function FreshworksWidget(command: 'disable', target: 'ticketForm', options: FieldAttribute[]): void
declare function FreshworksWidget(command: 'hide', target: 'tickerForm', options: FieldAttribute[]): void
declare function FreshworksWidget(command: 'hideChoices', target: 'tickerForm', options: HideChoicesOptions): void
declare function FreshworksWidget(command: 'clear', target: 'ticketForm'): void
declare function FreshworksWidget(command: 'open', target: 'article', options: OpenArticleOptions): void
declare function FreshworksWidget(command: 'setLabels', options: unknown): void
declare function FreshworksWidget(command: 'authenticate', options: unknown): void
declare function FreshworksWidget(command: 'logout'): void
