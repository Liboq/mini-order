type Nullable<T> = T | null | undefined

type PickTypes<T, E> = {
  [K in keyof T as T[K] extends E ? K : never]: T[K]
}

type PartialPick<T, K extends keyof T> = {
  [P in K]?: T[P]
} & Omit<T, K>

type PartialOmit<T, K extends keyof T> = {
  [P in K]: T[P]
} & Partial<Omit<T, K>>

type RequiredPick<T, K extends keyof T> = {
  [P in K]-?: T[P]
} & Omit<T, K>

type RequiredOmit<T, K extends keyof T> = {
  [P in K]: T[P]
} & Required<Omit<T, K>>

type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never
}

type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

type InternalSlots<T extends object> = {
  [P in keyof T]: Required<T>[P] extends (...args: any) => any
  ? (...args: Parameters<Required<T>[P]>) => import('vue').VNode[]
  : T[P]
}

type ToMaybeRefOrGetters<T> = {
  [P in keyof T]: import('vue').MaybeRefOrGetter<T[P]>
}

type ToMaybeRefs<T> = {
  [P in keyof T]: import('vue').MaybeRef<T[P]>
}
