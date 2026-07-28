export async function shareResult(code: string): Promise<'shared' | 'copied' | 'failed'> {
  const text = `Я прошел игру BlancVPN «В поисках свободного интернета». Промокод: ${code}`
  const url = typeof window !== 'undefined' ? window.location.href : ''

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({
        title: 'В поисках свободного интернета',
        text,
        url,
      })
      return 'shared'
    } catch {
      // user cancelled or share failed — fall through to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`)
    return 'copied'
  } catch {
    return 'failed'
  }
}

export async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value)
    return true
  } catch {
    return false
  }
}
