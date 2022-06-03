import { computed } from "#build/imports";
import { Ref } from "@vue/reactivity";

const {format} = Intl.DateTimeFormat('uk', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

export const useLocalDate = (date: Ref<string | number | Date>) => {
  const resolvedDate = computed(() => typeof date.value === 'string' ? new Date(date.value) : date.value)
  return computed(() => format(resolvedDate.value))
}
