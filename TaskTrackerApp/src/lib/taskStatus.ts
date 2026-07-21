export const STATUS_ORDER = ['Todo', 'InProgress', 'Done', 'Cancelled'] as const

export const STATUS_LABEL: Record<string, string> = {
  Todo: 'To Do',
  InProgress: 'In Progress',
  Done: 'Done',
  Cancelled: 'Cancelled',
}

export const STATUS_DOT: Record<string, string> = {
  Todo: 'bg-gray-400',
  InProgress: 'bg-blue-500',
  Done: 'bg-green-500',
  Cancelled: 'bg-red-500',
}
